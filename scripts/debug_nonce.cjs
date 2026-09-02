const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  // Use NonceManager to properly serialize nonces
  const rawWallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
  const deployer = new ethers.NonceManager(rawWallet);
  
  const LoggerArt = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "artifacts", "contracts", "TendonLogger.sol", "TendonLogger.json"), "utf8"));
  const MockDEXArt = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "artifacts", "contracts", "MockDreamDEX.sol", "MockDreamDEX.json"), "utf8"));
  const ProxyArt = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "artifacts", "contracts", "TendonProxy.sol", "TendonProxy.json"), "utf8"));

  // Deploy 1: Logger
  const f1 = new ethers.ContractFactory(LoggerArt.abi, LoggerArt.bytecode, deployer);
  const c1 = await f1.deploy();
  await c1.waitForDeployment();
  console.log("Deploy 1 done. Logger:", await c1.getAddress());

  // Deploy 2: MockDEX
  const f2 = new ethers.ContractFactory(MockDEXArt.abi, MockDEXArt.bytecode, deployer);
  const c2 = await f2.deploy(ethers.ZeroAddress);
  await c2.waitForDeployment();
  console.log("Deploy 2 done. MockDEX:", await c2.getAddress());

  // Deploy 3: Proxy
  const f3 = new ethers.ContractFactory(ProxyArt.abi, ProxyArt.bytecode, deployer);
  const c3 = await f3.deploy(await c1.getAddress(), ethers.ZeroAddress, ethers.ZeroAddress);
  await c3.waitForDeployment();
  console.log("Deploy 3 done. Proxy:", await c3.getAddress());

  console.log("\nALL 3 DEPLOYS SUCCEEDED");
}

main().catch(e => { console.error("ERROR:", e.message); process.exit(1); });
