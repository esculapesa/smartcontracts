// This script will deploy the Nonfungible Position Manager contract using Truffle

const path = require('path');
const NonfungiblePositionManagerArtifact = require('@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json');

const NonfungiblePositionManager = artifacts.require(path.resolve(__dirname, '../node_modules/@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'));

module.exports = function (deployer) {
  deployer.deploy(NonfungiblePositionManager, 
    '0xF0f274EA0ad60FA7d75490f0Da58fF710ADea475',   // Uniswap V3 Factory Address on your private network
    '0xe2C8bE486A82740406986Fc5Bd696e0A02cb852C'    // WESA Token Address on your private network
  )
    .then(() => {
      console.log("Nonfungible Position Manager deployed to:", NonfungiblePositionManager.address);
    })
    .catch((error) => {
      console.error("Error deploying Nonfungible Position Manager:", error);
    });
};
