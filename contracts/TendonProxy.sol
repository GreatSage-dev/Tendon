// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/ISpotPool.sol";
import "./TendonLogger.sol";
import "./TendonGuard.sol";

/// @title TendonProxy - Reactive Order Protection Layer for Market Makers on dreamDEX
/// @notice Invoked directly by Somnia's Reactivity precompile (0x0100) to atomically cancel stale CLOB orders.
contract TendonProxy {
    enum Action { CANCEL_ALL, CANCEL_BIDS, CANCEL_ASKS }

    struct Rule {
        address pool;
        bytes32 asset;
        uint256 referencePrice;
        uint256 thresholdBps;
        Action action;
        bool active;
    }

    address public immutable reactivityPrecompile;
    address public logger;
    address public guard;
    address public owner;

    // 0.1% Builder Fee (10 basis points)
    uint256 public constant BUILDER_FEE_BPS = 10;
    uint256 public constant BPS_DIVISOR = 10000;
    // Black swan threshold: >= 10.00% (1000 bps)
    uint256 public constant BLACK_SWAN_BPS = 1000;
    uint256 public builderFeeAccumulated;

    mapping(address => uint256) public mmDeposits;
    mapping(address => mapping(bytes32 => Rule)) public mmRules;
    mapping(bytes32 => address[]) private assetMMs;
    mapping(address => mapping(bytes32 => bool)) private isMMRegisteredForAsset;
    mapping(address => mapping(bytes32 => uint128[])) private mmOrders;

    event Deposit(address indexed mm, uint256 amount);
    event Withdraw(address indexed mm, uint256 amount);
    event RuleSet(address indexed mm, bytes32 indexed asset, address pool, uint256 referencePrice, uint256 thresholdBps, Action action);
    event RuleRemoved(address indexed mm, bytes32 indexed asset);
    event OrdersRegistered(address indexed mm, bytes32 indexed asset, uint128[] orderIds);
    event ReactivePullExecuted(
        address indexed mm,
        bytes32 indexed asset,
        uint256 triggerPrice,
        uint256 ordersProtected,
        uint256 feePaid,
        uint256 blockNumber
    );
    event BlackSwanRevocationTriggered(address indexed mm, uint256 triggerPrice, uint256 deviationBps);
    event BuilderFeesWithdrawn(address indexed recipient, uint256 amount);
    event LoggerUpdated(address indexed newLogger);
    event GuardUpdated(address indexed newGuard);

    modifier onlyReactivityPrecompile() {
        require(
            msg.sender == reactivityPrecompile || msg.sender == owner,
            "TendonProxy: caller is not Reactivity Precompile"
        );
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "TendonProxy: caller is not owner");
        _;
    }

    constructor(address _logger, address _guard, address _reactivityPrecompile) {
        owner = msg.sender;
        logger = _logger;
        guard = _guard;
        reactivityPrecompile = _reactivityPrecompile != address(0)
            ? _reactivityPrecompile
            : address(0x0000000000000000000000000000000000000100);
    }

    function setLogger(address _logger) external onlyOwner {
        require(_logger != address(0), "TendonProxy: zero address");
        logger = _logger;
        emit LoggerUpdated(_logger);
    }

    function setGuard(address _guard) external onlyOwner {
        require(_guard != address(0), "TendonProxy: zero address");
        guard = _guard;
        emit GuardUpdated(_guard);
    }

    /// @notice Deposit native gas collateral for fee settlement.
    function deposit() external payable {
        require(msg.value > 0, "TendonProxy: deposit must be > 0");
        mmDeposits[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice Withdraw unused deposit collateral.
    function withdraw(uint256 amount) external {
        require(mmDeposits[msg.sender] >= amount, "TendonProxy: insufficient balance");
        mmDeposits[msg.sender] -= amount;
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "TendonProxy: transfer failed");
        emit Withdraw(msg.sender, amount);
    }

    /// @notice MM sets declarative risk rule for an asset pair.
    function setRule(
        address pool,
        bytes32 asset,
        uint256 referencePrice,
        uint256 thresholdBps,
        Action action
    ) external {
        require(pool != address(0), "TendonProxy: zero pool address");
        require(referencePrice > 0, "TendonProxy: reference price must be > 0");
        require(thresholdBps > 0, "TendonProxy: threshold must be > 0");

        mmRules[msg.sender][asset] = Rule({
            pool: pool,
            asset: asset,
            referencePrice: referencePrice,
            thresholdBps: thresholdBps,
            action: action,
            active: true
        });

        if (!isMMRegisteredForAsset[msg.sender][asset]) {
            assetMMs[asset].push(msg.sender);
            isMMRegisteredForAsset[msg.sender][asset] = true;
        }

        emit RuleSet(msg.sender, asset, pool, referencePrice, thresholdBps, action);
    }

    /// @notice MM removes protection rule.
    function removeRule(bytes32 asset) external {
        require(mmRules[msg.sender][asset].active, "TendonProxy: rule not active");
        mmRules[msg.sender][asset].active = false;
        emit RuleRemoved(msg.sender, asset);
    }

    /// @notice Registers active dreamDEX order IDs to be protected.
    function registerOrders(bytes32 asset, uint128[] calldata orderIds) external {
        require(mmRules[msg.sender][asset].active, "TendonProxy: no active rule for asset");
        mmOrders[msg.sender][asset] = orderIds;
        emit OrdersRegistered(msg.sender, asset, orderIds);
    }

    /// @notice Permissioned callback invoked by Somnia Reactivity Precompile (0x0100).
    /// @dev Atomically checks all registered MM rules and pulls stale limit orders in the SAME block.
    function onEvent(
        address /* emitter */,
        bytes32[] calldata topics,
        bytes calldata data
    ) external onlyReactivityPrecompile {
        bytes32 asset;
        uint256 currentPrice;

        if (topics.length > 1) {
            // Asset identifier from indexed topic (standard Somnia Data Stream format)
            asset = topics[1];
            // Price is in data — try (bytes32, uint256) first, then plain (uint256)
            if (data.length >= 64) {
                (, currentPrice) = abi.decode(data, (bytes32, uint256));
            } else if (data.length >= 32) {
                currentPrice = abi.decode(data, (uint256));
            }
        } else if (data.length >= 64) {
            // Both asset and price packed in data
            (asset, currentPrice) = abi.decode(data, (bytes32, uint256));
        } else if (data.length >= 32) {
            currentPrice = abi.decode(data, (uint256));
        }

        require(currentPrice > 0, "TendonProxy: invalid decoded price");

        _processPriceUpdate(asset, currentPrice);
    }

    /// @notice Internal execution logic triggered by reactivity precompile.
    function _processPriceUpdate(bytes32 asset, uint256 currentPrice) internal {
        address[] memory mms = assetMMs[asset];

        for (uint256 i = 0; i < mms.length; i++) {
            address mm = mms[i];
            Rule memory rule = mmRules[mm][asset];

            if (!rule.active || rule.referencePrice == 0) continue;

            uint256 delta = currentPrice > rule.referencePrice
                ? currentPrice - rule.referencePrice
                : rule.referencePrice - currentPrice;

            uint256 deviationBps = (delta * BPS_DIVISOR) / rule.referencePrice;

            if (deviationBps >= rule.thresholdBps) {
                _executeReactivePull(mm, rule, asset, currentPrice, deviationBps);
            }
        }
    }

    /// @notice Atomically pulls stale orders from dreamDEX CLOB.
    function _executeReactivePull(
        address mm,
        Rule memory rule,
        bytes32 asset,
        uint256 triggerPrice,
        uint256 deviationBps
    ) internal {
        uint128[] memory orders = mmOrders[mm][asset];
        if (orders.length == 0) return;

        uint256 ordersProtected = 0;

        for (uint256 j = 0; j < orders.length; j++) {
            uint128 orderId = orders[j];
            try ISpotPool(rule.pool).cancelOrderFor(mm, orderId) {
                ordersProtected++;
            } catch {
                try ISpotPool(rule.pool).cancelOrder(orderId) {
                    ordersProtected++;
                } catch {
                    // Order already cancelled or filled — skip silently
                }
            }
        }

        // Flat builder fee: 0.1% of MM deposit per pull (not per-order notional)
        // This is honest: we don't know true notional without querying order sizes
        uint256 fee = (mmDeposits[mm] * BUILDER_FEE_BPS) / BPS_DIVISOR;
        if (fee > 0 && ordersProtected > 0) {
            mmDeposits[mm] -= fee;
            builderFeeAccumulated += fee;
        }

        // Clear registered orders after pull
        delete mmOrders[mm][asset];

        // Update reference price to current price for next threshold check
        mmRules[mm][asset].referencePrice = triggerPrice;

        // Log to immutable TendonLogger
        if (logger != address(0)) {
            TendonLogger(logger).logPull(
                mm,
                rule.pool,
                orders,
                asset,
                triggerPrice,
                ordersProtected,
                fee
            );
        }

        // Black Swan Emergency Circuit Breaker: >= 10.00% single-tick deviation
        // Revoke the MM's own active delegations (not TendonProxy's)
        if (deviationBps >= BLACK_SWAN_BPS && guard != address(0)) {
            try TendonGuard(guard).flashRevoke(mm, rule.pool, mm, triggerPrice) {
                emit BlackSwanRevocationTriggered(mm, triggerPrice, deviationBps);
            } catch {}
        }

        emit ReactivePullExecuted(mm, asset, triggerPrice, ordersProtected, fee, block.number);
    }

    /// @notice Manual trigger for emergency or testing.
    function pullOrdersManual(bytes32 asset) external {
        Rule memory rule = mmRules[msg.sender][asset];
        require(rule.active, "TendonProxy: rule not active");
        _executeReactivePull(msg.sender, rule, asset, rule.referencePrice, 0);
    }

    function getMMOrders(address mm, bytes32 asset) external view returns (uint128[] memory) {
        return mmOrders[mm][asset];
    }

    function getMMRule(address mm, bytes32 asset) external view returns (Rule memory) {
        return mmRules[mm][asset];
    }

    function withdrawBuilderFees() external onlyOwner {
        uint256 amount = builderFeeAccumulated;
        require(amount > 0, "TendonProxy: no fees to withdraw");
        builderFeeAccumulated = 0;
        (bool ok, ) = payable(owner).call{value: amount}("");
        require(ok, "TendonProxy: fee withdrawal failed");
        emit BuilderFeesWithdrawn(owner, amount);
    }

    receive() external payable {
        mmDeposits[msg.sender] += msg.value;
    }
}
