// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/ISpotPool.sol";

/// @title MockDreamDEX - Minimal Onchain CLOB for Testing & Sniper Revert Simulation
/// @notice Implements the DreamDEX SpotPool interface with real order state and operator authorization.
contract MockDreamDEX is ISpotPool {
    struct Order {
        uint128 orderId;
        bool isBid;
        address owner;
        uint64 userData;
        uint256 price;
        uint256 fullQuantity;
        uint256 quantityRemaining;
        uint64 expireTimestampNs;
        bool active;
        bool cancelled;
        bool filled;
    }

    uint128 public nextOrderId = 1001;
    mapping(uint128 => Order) public orders;
    mapping(address => mapping(address => bool)) public operatorApprovals;
    address public trustedTendonProxy;

    event OrderPlaced(uint128 indexed orderId, address indexed owner, bool isBid, uint256 price, uint256 quantity);
    event OrderCancelled(uint128 indexed orderId, address indexed owner, address indexed caller);
    event OrderFilled(uint128 indexed orderId, address indexed taker, uint256 price, uint256 quantity);
    event OperatorApprovalSet(address indexed owner, address indexed operator, bool approved);

    error OrderNotFound(uint128 orderId);
    error OrderInactive(uint128 orderId);
    error UnauthorizedCaller(address caller);
    error OrderAlreadyFilled(uint128 orderId);

    constructor(address _trustedTendonProxy) {
        trustedTendonProxy = _trustedTendonProxy;
    }

    function setTrustedTendonProxy(address _proxy) external {
        trustedTendonProxy = _proxy;
    }

    function setOperatorApproval(address operator, bool approved) external {
        operatorApprovals[msg.sender][operator] = approved;
        emit OperatorApprovalSet(msg.sender, operator, approved);
    }

    function placeOrder(
        bool isBid,
        uint64 userData,
        uint256 price,
        uint256 quantity,
        uint64 expireTimestampNs,
        uint8 /* orderType */,
        uint8 /* selfMatchingOption */,
        address /* builder */,
        uint96 /* builderFeeBpsTimes1k */
    ) external payable override returns (bool success, uint128 orderId) {
        orderId = nextOrderId++;
        orders[orderId] = Order({
            orderId: orderId,
            isBid: isBid,
            owner: msg.sender,
            userData: userData,
            price: price,
            fullQuantity: quantity,
            quantityRemaining: quantity,
            expireTimestampNs: expireTimestampNs,
            active: true,
            cancelled: false,
            filled: false
        });

        emit OrderPlaced(orderId, msg.sender, isBid, price, quantity);
        return (true, orderId);
    }

    function placeOrderFor(
        address owner,
        bool isBid,
        uint64 userData,
        uint256 price,
        uint256 quantity,
        uint64 expireTimestampNs,
        uint8 /* orderType */,
        uint8 /* selfMatchingOption */,
        address /* builder */,
        uint96 /* builderFeeBpsTimes1k */
    ) external payable override returns (bool success, uint128 orderId) {
        require(
            msg.sender == owner || operatorApprovals[owner][msg.sender] || msg.sender == trustedTendonProxy,
            "MockDreamDEX: unauthorized operator"
        );

        orderId = nextOrderId++;
        orders[orderId] = Order({
            orderId: orderId,
            isBid: isBid,
            owner: owner,
            userData: userData,
            price: price,
            fullQuantity: quantity,
            quantityRemaining: quantity,
            expireTimestampNs: expireTimestampNs,
            active: true,
            cancelled: false,
            filled: false
        });

        emit OrderPlaced(orderId, owner, isBid, price, quantity);
        return (true, orderId);
    }

    function cancelOrder(uint128 orderId) external override {
        Order storage order = orders[orderId];
        if (order.orderId == 0) revert OrderNotFound(orderId);
        if (!order.active) revert OrderInactive(orderId);

        require(
            msg.sender == order.owner || operatorApprovals[order.owner][msg.sender] || msg.sender == trustedTendonProxy,
            "MockDreamDEX: unauthorized cancellation"
        );

        order.active = false;
        order.cancelled = true;
        emit OrderCancelled(orderId, order.owner, msg.sender);
    }

    function cancelOrderFor(address owner, uint128 orderId) external override {
        Order storage order = orders[orderId];
        if (order.orderId == 0) revert OrderNotFound(orderId);
        if (order.owner != owner) revert UnauthorizedCaller(owner);
        if (!order.active) revert OrderInactive(orderId);

        require(
            msg.sender == owner || operatorApprovals[owner][msg.sender] || msg.sender == trustedTendonProxy,
            "MockDreamDEX: unauthorized operator"
        );

        order.active = false;
        order.cancelled = true;
        emit OrderCancelled(orderId, owner, msg.sender);
    }

    function cancelOrders(uint128[] calldata orderIds) external {
        for (uint256 i = 0; i < orderIds.length; i++) {
            uint128 orderId = orderIds[i];
            Order storage order = orders[orderId];
            if (order.active && (msg.sender == order.owner || operatorApprovals[order.owner][msg.sender] || msg.sender == trustedTendonProxy)) {
                order.active = false;
                order.cancelled = true;
                emit OrderCancelled(orderId, order.owner, msg.sender);
            }
        }
    }

    function reduceOrder(uint128 orderId, uint256 newQuantityRemaining) external override {
        Order storage order = orders[orderId];
        if (!order.active) revert OrderInactive(orderId);
        require(
            msg.sender == order.owner || operatorApprovals[order.owner][msg.sender] || msg.sender == trustedTendonProxy,
            "MockDreamDEX: unauthorized reduce"
        );
        order.quantityRemaining = newQuantityRemaining;
    }

    /// @notice Sniper attempts to fill an order. Reverts if order is already cancelled by Tendon.
    function executeOrder(uint128 orderId) external returns (bool) {
        Order storage order = orders[orderId];
        if (order.orderId == 0) revert OrderNotFound(orderId);
        if (!order.active || order.cancelled) {
            revert OrderInactive(orderId);
        }
        if (order.filled) {
            revert OrderAlreadyFilled(orderId);
        }

        order.active = false;
        order.filled = true;
        emit OrderFilled(orderId, msg.sender, order.price, order.quantityRemaining);
        return true;
    }

    function getOrder(uint128 orderId) external view override returns (OrderInfo memory) {
        Order memory o = orders[orderId];
        return OrderInfo({
            orderId: o.orderId,
            isBid: o.isBid,
            owner: o.owner,
            userData: o.userData,
            price: o.price,
            fullQuantity: o.fullQuantity,
            quantityRemaining: o.quantityRemaining,
            expireTimestampNs: o.expireTimestampNs
        });
    }

    function isOrderActive(uint128 orderId) external view returns (bool) {
        return orders[orderId].active;
    }

    function isOperatorAuthorized(address owner, address operator, bytes4 /* selector */) external view override returns (bool) {
        return operatorApprovals[owner][operator] || operator == trustedTendonProxy;
    }
}
