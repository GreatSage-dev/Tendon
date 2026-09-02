// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IOperatorRegistry - DreamDEX Operator Permissions Registry
interface IOperatorRegistry {
    function setOperatorApprovalForPool(
        address pool,
        address operator,
        bytes4[] calldata selectors,
        bool approved
    ) external;

    function setOperatorApprovalGlobal(
        address operator,
        bytes4[] calldata selectors,
        bool approved
    ) external;

    function setOperatorDenialForPool(
        address pool,
        address operator,
        bytes4[] calldata selectors,
        bool denied
    ) external;
}
