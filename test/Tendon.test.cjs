const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tendon — Reactive Order Protection for dreamDEX", function () {
  let owner, mm, sniper, precompile;
  let priceStream, logger, tendonProxy, mockDex;
  const BTC_ASSET = ethers.keccak256(ethers.toUtf8Bytes("BTC"));

  beforeEach(async function () {
    [owner, mm, sniper, precompile] = await ethers.getSigners();

    // 1. Deploy MockPriceStream
    const MockPriceStream = await ethers.getContractFactory("MockPriceStream");
    priceStream = await MockPriceStream.deploy();
    await priceStream.waitForDeployment();

    // 2. Deploy TendonLogger
    const TendonLogger = await ethers.getContractFactory("TendonLogger");
    logger = await TendonLogger.deploy();
    await logger.waitForDeployment();

    // 3. Deploy TendonProxy (use precompile.address as the authorized precompile caller for testing)
    const TendonProxy = await ethers.getContractFactory("TendonProxy");
    tendonProxy = await TendonProxy.deploy(await logger.getAddress(), ethers.ZeroAddress, precompile.address);
    await tendonProxy.waitForDeployment();

    // 4. Deploy MockDreamDEX
    const MockDreamDEX = await ethers.getContractFactory("MockDreamDEX");
    mockDex = await MockDreamDEX.deploy(await tendonProxy.getAddress());
    await mockDex.waitForDeployment();

    // 5. Authorize TendonProxy on Logger
    await logger.setTendonProxy(await tendonProxy.getAddress());
  });

  it("1. Should allow Market Maker to deposit collateral and set protection rules", async function () {
    const depositAmount = ethers.parseEther("1.0");
    await tendonProxy.connect(mm).deposit({ value: depositAmount });
    expect(await tendonProxy.mmDeposits(mm.address)).to.equal(depositAmount);

    const refPrice = ethers.parseUnits("60000", 18);
    const thresholdBps = 100; // 1.00%
    await tendonProxy.connect(mm).setRule(
      await mockDex.getAddress(),
      BTC_ASSET,
      refPrice,
      thresholdBps,
      0 // CANCEL_ALL
    );

    const rule = await tendonProxy.getMMRule(mm.address, BTC_ASSET);
    expect(rule.active).to.be.true;
    expect(rule.thresholdBps).to.equal(thresholdBps);
    expect(rule.referencePrice).to.equal(refPrice);
  });

  it("2. Should place orders on DreamDEX CLOB and register them with TendonProxy", async function () {
    // MM approves TendonProxy as operator on MockDreamDEX
    await mockDex.connect(mm).setOperatorApproval(await tendonProxy.getAddress(), true);

    // MM places 3 orders
    const p1 = ethers.parseUnits("59800", 18);
    const p2 = ethers.parseUnits("59700", 18);
    const p3 = ethers.parseUnits("59600", 18);
    const qty = ethers.parseUnits("1.5", 18);

    const tx1 = await mockDex.connect(mm).placeOrder(true, 1, p1, qty, 0, 0, 0, ethers.ZeroAddress, 0);
    const tx2 = await mockDex.connect(mm).placeOrder(true, 2, p2, qty, 0, 0, 0, ethers.ZeroAddress, 0);
    const tx3 = await mockDex.connect(mm).placeOrder(true, 3, p3, qty, 0, 0, 0, ethers.ZeroAddress, 0);

    const r1 = await tx1.wait();
    const r2 = await tx2.wait();
    const r3 = await tx3.wait();

    const orderIds = [1001n, 1002n, 1003n];
    for (const id of orderIds) {
      expect(await mockDex.isOrderActive(id)).to.be.true;
    }

    // Set rule & register orders
    const refPrice = ethers.parseUnits("60000", 18);
    await tendonProxy.connect(mm).setRule(await mockDex.getAddress(), BTC_ASSET, refPrice, 100, 0);
    await tendonProxy.connect(mm).registerOrders(BTC_ASSET, orderIds);

    const registered = await tendonProxy.getMMOrders(mm.address, BTC_ASSET);
    expect(registered.length).to.equal(3);
  });

  it("3. Should reactively cancel orders in the same block when price crosses threshold", async function () {
    await tendonProxy.connect(mm).deposit({ value: ethers.parseEther("0.5") });
    await mockDex.connect(mm).setOperatorApproval(await tendonProxy.getAddress(), true);

    // Place 3 orders
    await mockDex.connect(mm).placeOrder(true, 1, ethers.parseUnits("59800", 18), ethers.parseUnits("1.0", 18), 0, 0, 0, ethers.ZeroAddress, 0);
    await mockDex.connect(mm).placeOrder(true, 2, ethers.parseUnits("59700", 18), ethers.parseUnits("1.0", 18), 0, 0, 0, ethers.ZeroAddress, 0);
    await mockDex.connect(mm).placeOrder(true, 3, ethers.parseUnits("59600", 18), ethers.parseUnits("1.0", 18), 0, 0, 0, ethers.ZeroAddress, 0);

    const refPrice = ethers.parseUnits("60000", 18);
    await tendonProxy.connect(mm).setRule(await mockDex.getAddress(), BTC_ASSET, refPrice, 100, 0); // 1% threshold
    await tendonProxy.connect(mm).registerOrders(BTC_ASSET, [1001n, 1002n, 1003n]);

    // Price updates to 59100 (1.5% drop > 1.0% threshold)
    const newPrice = ethers.parseUnits("59100", 18);
    const priceData = ethers.AbiCoder.defaultAbiCoder().encode(["bytes32", "uint256"], [BTC_ASSET, newPrice]);

    // Precompile triggers TendonProxy.onEvent
    const topics = [ethers.id("PriceUpdate(bytes32,uint256,uint256)"), BTC_ASSET];
    await tendonProxy.connect(precompile).onEvent(await priceStream.getAddress(), topics, priceData);

    // Orders MUST now be inactive on DreamDEX CLOB
    expect(await mockDex.isOrderActive(1001n)).to.be.false;
    expect(await mockDex.isOrderActive(1002n)).to.be.false;
    expect(await mockDex.isOrderActive(1003n)).to.be.false;
  });

  it("4. Should cause sniper executeOrder transaction to REVERT after reactive pull", async function () {
    await tendonProxy.connect(mm).deposit({ value: ethers.parseEther("0.5") });
    await mockDex.connect(mm).setOperatorApproval(await tendonProxy.getAddress(), true);

    await mockDex.connect(mm).placeOrder(true, 1, ethers.parseUnits("59800", 18), ethers.parseUnits("1.0", 18), 0, 0, 0, ethers.ZeroAddress, 0);

    const refPrice = ethers.parseUnits("60000", 18);
    await tendonProxy.connect(mm).setRule(await mockDex.getAddress(), BTC_ASSET, refPrice, 100, 0);
    await tendonProxy.connect(mm).registerOrders(BTC_ASSET, [1001n]);

    // Reactivity precompile pulls the order
    const newPrice = ethers.parseUnits("59000", 18);
    const priceData = ethers.AbiCoder.defaultAbiCoder().encode(["bytes32", "uint256"], [BTC_ASSET, newPrice]);
    const topics = [ethers.id("PriceUpdate(bytes32,uint256,uint256)"), BTC_ASSET];
    await tendonProxy.connect(precompile).onEvent(await priceStream.getAddress(), topics, priceData);

    // Sniper bot attempts to execute the stale order -> MUST REVERT
    await expect(mockDex.connect(sniper).executeOrder(1001n)).to.be.revertedWithCustomError(
      mockDex,
      "OrderInactive"
    );
  });

  it("5. Should record pull details in immutable TendonLogger for judge verification", async function () {
    await tendonProxy.connect(mm).deposit({ value: ethers.parseEther("0.5") });
    await mockDex.connect(mm).setOperatorApproval(await tendonProxy.getAddress(), true);

    await mockDex.connect(mm).placeOrder(true, 1, ethers.parseUnits("59800", 18), ethers.parseUnits("1.0", 18), 0, 0, 0, ethers.ZeroAddress, 0);
    await mockDex.connect(mm).placeOrder(true, 2, ethers.parseUnits("59700", 18), ethers.parseUnits("1.0", 18), 0, 0, 0, ethers.ZeroAddress, 0);

    const refPrice = ethers.parseUnits("60000", 18);
    await tendonProxy.connect(mm).setRule(await mockDex.getAddress(), BTC_ASSET, refPrice, 100, 0);
    await tendonProxy.connect(mm).registerOrders(BTC_ASSET, [1001n, 1002n]);

    const triggerPrice = ethers.parseUnits("58800", 18);
    const priceData = ethers.AbiCoder.defaultAbiCoder().encode(["bytes32", "uint256"], [BTC_ASSET, triggerPrice]);
    const topics = [ethers.id("PriceUpdate(bytes32,uint256,uint256)"), BTC_ASSET];
    await tendonProxy.connect(precompile).onEvent(await priceStream.getAddress(), topics, priceData);

    const pulls = await logger.getAllPulls(mm.address);
    expect(pulls.length).to.equal(1);
    expect(pulls[0].ordersProtected).to.equal(2n);
    expect(pulls[0].triggerPrice).to.equal(triggerPrice);
    expect(pulls[0].mm).to.equal(mm.address);

    const totalProtected = await logger.totalProtectedOrdersCount();
    expect(totalProtected).to.equal(2n);
  });

  it("6. Should reject onEvent callbacks from unauthorized callers", async function () {
    const triggerPrice = ethers.parseUnits("58800", 18);
    const priceData = ethers.AbiCoder.defaultAbiCoder().encode(["bytes32", "uint256"], [BTC_ASSET, triggerPrice]);
    const topics = [ethers.id("PriceUpdate(bytes32,uint256,uint256)"), BTC_ASSET];

    // Sniper attempts to fake a precompile callback
    await expect(
      tendonProxy.connect(sniper).onEvent(await priceStream.getAddress(), topics, priceData)
    ).to.be.revertedWith("TendonProxy: caller is not Reactivity Precompile");
  });
});
