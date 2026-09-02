// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title TendonLogger - Immutable Proof & Audit Layer for Tendon Reactive Order Pulls
/// @notice Records every intra-block reactive cancellation and Flash-Revoke event permanently onchain.
contract TendonLogger {
    struct PullRecord {
        uint256 pullId;
        address mm;
        address pool;
        uint128[] orderIds;
        bytes32 asset;
        uint256 triggerPrice;
        uint256 blockNumber;
        uint256 timestamp;
        uint256 ordersProtected;
        uint256 feePaid;
    }

    struct RevocationRecord {
        uint256 revocationId;
        address mm;
        address operatorRegistry;
        uint256 blockNumber;
        uint256 timestamp;
        uint256 triggerPrice;
    }

    address public owner;
    address public tendonProxy;
    address public tendonGuard;

    uint256 public nextPullId = 1;
    uint256 public nextRevocationId = 1;
    uint256 public totalProtectedOrdersCount;
    uint256 public totalFeeCollectedAmount;

    mapping(uint256 => PullRecord) private pulls;
    mapping(address => uint256[]) private mmPullIds;
    uint256[] private allPullIds;

    mapping(uint256 => RevocationRecord) private revocations;
    mapping(address => uint256[]) private mmRevocationIds;
    uint256[] private allRevocationIds;

    event TendonProxyUpdated(address indexed previousProxy, address indexed newProxy);
    event TendonGuardUpdated(address indexed previousGuard, address indexed newGuard);
    event PullLogged(
        uint256 indexed pullId,
        address indexed mm,
        address indexed pool,
        bytes32 asset,
        uint256 triggerPrice,
        uint256 blockNumber,
        uint256 ordersProtected,
        uint256 feePaid
    );
    event RevocationLogged(
        uint256 indexed revocationId,
        address indexed mm,
        address indexed operatorRegistry,
        uint256 triggerPrice,
        uint256 blockNumber
    );

    modifier onlyAuthorized() {
        require(
            msg.sender == tendonProxy || msg.sender == tendonGuard || msg.sender == owner,
            "TendonLogger: unauthorized caller"
        );
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "TendonLogger: caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setTendonProxy(address _tendonProxy) external onlyOwner {
        require(_tendonProxy != address(0), "TendonLogger: zero address");
        emit TendonProxyUpdated(tendonProxy, _tendonProxy);
        tendonProxy = _tendonProxy;
    }

    function setTendonGuard(address _tendonGuard) external onlyOwner {
        require(_tendonGuard != address(0), "TendonLogger: zero address");
        emit TendonGuardUpdated(tendonGuard, _tendonGuard);
        tendonGuard = _tendonGuard;
    }

    /// @notice Records an atomic pull event permanently onchain.
    function logPull(
        address mm,
        address pool,
        uint128[] calldata orderIds,
        bytes32 asset,
        uint256 triggerPrice,
        uint256 ordersProtected,
        uint256 feePaid
    ) external onlyAuthorized returns (uint256 pullId) {
        pullId = nextPullId++;

        PullRecord storage record = pulls[pullId];
        record.pullId = pullId;
        record.mm = mm;
        record.pool = pool;
        for (uint256 i = 0; i < orderIds.length; i++) {
            record.orderIds.push(orderIds[i]);
        }
        record.asset = asset;
        record.triggerPrice = triggerPrice;
        record.blockNumber = block.number;
        record.timestamp = block.timestamp;
        record.ordersProtected = ordersProtected;
        record.feePaid = feePaid;

        mmPullIds[mm].push(pullId);
        allPullIds.push(pullId);
        totalProtectedOrdersCount += ordersProtected;
        totalFeeCollectedAmount += feePaid;

        emit PullLogged(
            pullId,
            mm,
            pool,
            asset,
            triggerPrice,
            block.number,
            ordersProtected,
            feePaid
        );
    }

    /// @notice Records an emergency Flash-Revoke circuit breaker event.
    function logRevocation(
        address mm,
        address operatorRegistry,
        uint256 blockNumber,
        uint256 triggerPrice
    ) external onlyAuthorized returns (uint256 revocationId) {
        revocationId = nextRevocationId++;

        RevocationRecord storage record = revocations[revocationId];
        record.revocationId = revocationId;
        record.mm = mm;
        record.operatorRegistry = operatorRegistry;
        record.blockNumber = blockNumber;
        record.timestamp = block.timestamp;
        record.triggerPrice = triggerPrice;

        mmRevocationIds[mm].push(revocationId);
        allRevocationIds.push(revocationId);

        emit RevocationLogged(revocationId, mm, operatorRegistry, triggerPrice, blockNumber);
    }

    function getPull(uint256 pullId) external view returns (PullRecord memory) {
        require(pulls[pullId].pullId != 0, "TendonLogger: pullId does not exist");
        return pulls[pullId];
    }

    function getAllPulls(address mm) external view returns (PullRecord[] memory) {
        uint256[] memory ids = mmPullIds[mm];
        PullRecord[] memory records = new PullRecord[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            records[i] = pulls[ids[i]];
        }
        return records;
    }

    function getAllPullRecords() external view returns (PullRecord[] memory) {
        PullRecord[] memory records = new PullRecord[](allPullIds.length);
        for (uint256 i = 0; i < allPullIds.length; i++) {
            records[i] = pulls[allPullIds[i]];
        }
        return records;
    }

    function totalPulls() external view returns (uint256) {
        return allPullIds.length;
    }
}
