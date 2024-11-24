const NonfungiblePositionManager = artifacts.require("NonfungiblePositionManager");

module.exports = async function (deployer, network, accounts) {
  console.log('Deploying Nonfungible Position Manager with the account:', accounts[0]);

  // Addresses needed for deployment
  const factoryAddress = '0xF0f274EA0ad60FA7d75490f0Da58fF710ADea475'; // Uniswap V3 Factory address on your private network
  const wesaTokenAddress = '0xe2C8bE486A82740406986Fc5Bd696e0A02cb852C'; // WESA Token address on your network

  // Deploy the Nonfungible Position Manager contract
  await deployer.deploy(NonfungiblePositionManager, factoryAddress, wesaTokenAddress);
  const npm = await NonfungiblePositionManager.deployed();

  console.log('Nonfungible Position Manager deployed to:', npm.address);
};
