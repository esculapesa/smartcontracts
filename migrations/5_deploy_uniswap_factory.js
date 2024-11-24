// migrations/3_deploy_uniswap_factory.js
const { abi: FACTORY_ABI, bytecode: FACTORY_BYTECODE } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json');
require('dotenv').config();

module.exports = async function (deployer, network, accounts) {
  const ethers = require('ethers');

  // Connect to local RPC using ethers.js
  const provider = new ethers.providers.JsonRpcProvider('http://65.108.151.70:8545');
  
  // Use a wallet with deployment funds
  const privateKey = process.env.COPPER_PRIVATE_KEY;  // Store private key in .env file for security
  const wallet = new ethers.Wallet(privateKey, provider);

  // Create a contract factory
  const FactoryContract = new ethers.ContractFactory(FACTORY_ABI, FACTORY_BYTECODE, wallet);

  // Deploy the contract
  const factory = await FactoryContract.deploy();

  // Wait until deployment is completed
  await factory.deployed();

  console.log('Uniswap V3 Factory deployed at:', factory.address);
};
