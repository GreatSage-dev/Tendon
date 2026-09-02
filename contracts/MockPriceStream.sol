// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title MockPriceStream - Oracle Emulator for Somnia Data Streams
/// @notice Publishes real-time price updates that trigger Somnia Reactivity precompile handlers.
contract MockPriceStream {
    address public owner;
    mapping(bytes32 => uint256) public latestPrices;
    mapping(bytes32 => uint256) public lastUpdatedTimestamps;

    event PriceUpdate(bytes32 indexed asset, uint256 price, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "MockPriceStream: caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function updatePrice(bytes32 asset, uint256 price) external onlyOwner {
        require(price > 0, "MockPriceStream: price must be > 0");
        latestPrices[asset] = price;
        lastUpdatedTimestamps[asset] = block.timestamp;
        emit PriceUpdate(asset, price, block.timestamp);
    }

    function updatePriceString(string calldata assetStr, uint256 price) external onlyOwner {
        bytes32 asset = keccak256(abi.encodePacked(assetStr));
        require(price > 0, "MockPriceStream: price must be > 0");
        latestPrices[asset] = price;
        lastUpdatedTimestamps[asset] = block.timestamp;
        emit PriceUpdate(asset, price, block.timestamp);
    }

    function getPrice(bytes32 asset) external view returns (uint256) {
        return latestPrices[asset];
    }
}
