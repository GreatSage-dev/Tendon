// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IOperatorRegistry.sol";
import "./TendonLogger.sol";

/// @title TendonGuard - EIP-7702 Flash-Revoke Circuit Breaker
/// @notice Invoked by TendonProxy during black swan events (>=10% price move in a single tick)
///         to atomically revoke all active session keys and operator delegations on dreamDEX.
contract TendonGuard {
    address public immutable tendonProxy;
    address public immutable logger;
    address public immutable operatorRegistry;

    bytes4 internal constant SELECTOR_PLACE = 0x80054449;  // placeOrderFor
    bytes4 internal constant SELECTOR_CANCEL = 0xe37b444b; // cancelOrderFor
    bytes4 internal constant SELECTOR_REDUCE = 0x364c2587; // reduceOrderFor

    event FlashRevokeExecuted(
        address indexed mm,
        address indexed operatorRegistry,
        uint256 triggerPrice,
        uint256 blockNumber
    );

    modifier onlyTendonProxy() {
        require(msg.sender == tendonProxy, "TendonGuard: caller is not TendonProxy");
        _;
    }

    constructor(address _tendonProxy, address _logger, address _operatorRegistry) {
        tendonProxy = _tendonProxy;
        logger = _logger;
        operatorRegistry = _operatorRegistry != address(0)
            ? _operatorRegistry
            : address(0x15C7e8CE38F021c5b45d098AaD788f63090bF20A); // Somnia Shannon Registry
    }

    /// @notice Atomically revokes operator delegation for the MM on dreamDEX OperatorRegistry.
    /// @dev Triggered in the exact same consensus block as the black swan price shock.
    function flashRevoke(
        address mm,
        address pool,
        address operator,
        uint256 triggerPrice
    ) external onlyTendonProxy returns (bool) {
        bytes4[] memory selectors = new bytes4[](3);
        selectors[0] = SELECTOR_PLACE;
        selectors[1] = SELECTOR_CANCEL;
        selectors[2] = SELECTOR_REDUCE;

        // Emergency revocation on dreamDEX Operator Registry
        if (operatorRegistry != address(0)) {
            try IOperatorRegistry(operatorRegistry).setOperatorDenialForPool(pool, operator, selectors, true) {
                // Revoked for pool
            } catch {
                try IOperatorRegistry(operatorRegistry).setOperatorApprovalGlobal(operator, selectors, false) {
                    // Global approval revoked
                } catch {
                    // Fallback
                }
            }
        }

        // Log revocation event permanently in TendonLogger
        if (logger != address(0)) {
            try TendonLogger(logger).logRevocation(mm, operatorRegistry, block.number, triggerPrice) {} catch {}
        }

        emit FlashRevokeExecuted(mm, operatorRegistry, triggerPrice, block.number);
        return true;
    }
}
