const { ethers } = require("ethers");
require("dotenv").config();
const https = require("https");

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Tendon-Streamer/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// Pyth Hermes Price Feed ID for BTC/USD
const BTC_PRICE_FEED_ID = "0xe62df6e875377665f6502173d0ab75740f58d0438ed300b65e8a75681994e1d9";
const MOCK_PRICE_STREAM_ADDRESS = process.env.MOCK_PRICE_STREAM_ADDRESS || "0x65C38973bC50547F2BaA798116C11382a5a58934";
const RPC_URL = process.env.RPC_URL || "https://dream-rpc.somnia.network";

const PRICE_STREAM_ABI = [
  "function updatePrice(bytes32 market, uint256 price) external",
  "function getLatestPrice(bytes32 market) external view returns (uint256)"
];

async function main() {
  console.log("Starting Pyth Network Live Hermes Price Streamer...");
  console.log(`Connecting to Somnia Testnet RPC: ${RPC_URL}`);
  console.log(`Target MockPriceStream Contract: ${MOCK_PRICE_STREAM_ADDRESS}`);

  const privateKey = process.env.PRIVATE_KEY_MM || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`Streamer Wallet: ${wallet.address}`);

  const priceContract = new ethers.Contract(MOCK_PRICE_STREAM_ADDRESS, PRICE_STREAM_ABI, wallet);
  const marketBytes = ethers.encodeBytes32String("WBTC:USDso");

  async function fetchAndPushPythPrice() {
    try {
      const data = await fetchJson(`https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD`);

      if (data && data.USD) {
        const formattedPrice = parseFloat(data.USD);
        const integerPrice = Math.round(formattedPrice);

        console.log(`\n[Live Pyth/Market Feed] BTC/USD: $${formattedPrice.toLocaleString()}`);
        console.log(`Broadcasting updatePrice("WBTC:USDso", $${integerPrice}) to Somnia Shannon Testnet...`);
        const tx = await priceContract.updatePrice(marketBytes, integerPrice);
        console.log(`Tx Broadcasted: https://shannon-explorer.somnia.network/tx/${tx.hash}`);
        await tx.wait(1);
        console.log(`Tx Confirmed on Somnia Testnet! Block: ${await provider.getBlockNumber()}`);
      }
    } catch (err) {
      console.error("Price Stream Error:", err.message);
    }
  }

  // Initial fetch and push
  await fetchAndPushPythPrice();

  // Poll Pyth Hermes API every 10 seconds to maintain live stream
  setInterval(fetchAndPushPythPrice, 10000);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
