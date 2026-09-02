require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY_MM = process.env.PRIVATE_KEY_MM || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const PRIVATE_KEY_SNIPER = process.env.PRIVATE_KEY_SNIPER || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    shannon: {
      url: process.env.RPC_URL || "https://dream-rpc.somnia.network",
      chainId: 50312,
      accounts: [PRIVATE_KEY_MM, PRIVATE_KEY_SNIPER],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
