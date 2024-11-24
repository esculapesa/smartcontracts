require('dotenv').config();
const { ethers } = require('ethers');
const { abi: FACTORY_ABI } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json');

async function createPool() {
  // Connect to your Geth node (local or remote RPC endpoint)
  const provider = new ethers.providers.JsonRpcProvider('http://65.108.151.70:8545');
  
  // Use a wallet with deployment funds
  const privateKey = process.env.COPPER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Please set COPPER_PRIVATE_KEY in your .env file.');
  }
  const wallet = new ethers.Wallet(privateKey, provider);

  // Connect to the deployed Factory contract
  const factory = new ethers.Contract('0xF0f274EA0ad60FA7d75490f0Da58fF710ADea475', FACTORY_ABI, wallet);

  // Addresses for token A and token B
  const tokenA = '0x7e6D75B1A8Bd04778387DFb7063D192F835D084e'; // Holon
  const tokenB = '0x8CB4c1B4094e58Ff8a071421c7d1cf87daA1BCDe'; // Hether

  // Fee tier for the pool (use 500, which represents 0.05%)
  const feeTier = 500;

  try {
    // Create a pool with tokenA, tokenB, and the feeTier
    const tx = await factory.createPool(tokenA, tokenB, feeTier);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log('Pool created successfully. Transaction Hash:', receipt.transactionHash);
  } catch (error) {
    console.error('Error creating pool:', error);
  }
}

createPool()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
