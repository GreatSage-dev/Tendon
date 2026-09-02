const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Deploying Tendon System to Somnia Shannon Testnet...");

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer Address: ${deployer.address}`);

  const PRECOMPILE_ADDRESS = process.env.SOMNIA_REACTIVITY_PRECOMPILE || "0x0000000000000000000000000000000000000100";

  // 1. Deploy TendonLogger
  const TendonLogger = await ethers.getContractFactory("TendonLogger");
  const logger = await TendonLogger.deploy();
  await logger.waitForDeployment();
  const loggerAddress = await logger.getAddress();
  console.log(`TendonLogger deployed to: ${loggerAddress}`);

  // 2. Deploy TendonProxy
  const TendonProxy = await ethers.getContractFactory("TendonProxy");
  const tendonProxy = await TendonProxy.deploy(loggerAddress, ethers.ZeroAddress, PRECOMPILE_ADDRESS);
  await tendonProxy.waitForDeployment();
  const proxyAddress = await tendonProxy.getAddress();
  console.log(`TendonProxy deployed to: ${proxyAddress}`);

  // 3. Set TendonProxy on Logger
  const setProxyTx = await logger.setTendonProxy(proxyAddress);
  await setProxyTx.wait();
  console.log(`TendonLogger configured with TendonProxy authorized.`);

  // 4. Deploy MockPriceStream (for testing oracle feeds)
  const MockPriceStream = await ethers.getContractFactory("MockPriceStream");
  const priceStream = await MockPriceStream.deploy();
  await priceStream.waitForDeployment();
  const priceStreamAddress = await priceStream.getAddress();
  console.log(`MockPriceStream deployed to: ${priceStreamAddress}`);

  // 5. Deploy MockDreamDEX (onchain CLOB orderbook)
  const MockDreamDEX = await ethers.getContractFactory("MockDreamDEX");
  const dreamDex = await MockDreamDEX.deploy(proxyAddress);
  await dreamDex.waitForDeployment();
  const dexAddress = await dreamDex.getAddress();
  console.log(`MockDreamDEX deployed to: ${dexAddress}`);

  console.log("\nDeployment Summary:");
  console.log(`TendonLogger:    https://shannon-explorer.somnia.network/address/${loggerAddress}`);
  console.log(`TendonProxy:     https://shannon-explorer.somnia.network/address/${proxyAddress}`);
  console.log(`MockPriceStream: https://shannon-explorer.somnia.network/address/${priceStreamAddress}`);
  console.log(`MockDreamDEX:    https://shannon-explorer.somnia.network/address/${dexAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
