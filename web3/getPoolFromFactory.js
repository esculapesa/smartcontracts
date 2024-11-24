const { abi: FACTORY_ABI } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json');

async function getPoolFromFactory() {
  const provider = new ethers.providers.JsonRpcProvider('http://65.108.151.70:8545');
  const privateKey = process.env.COPPER_PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);

  const factoryAddress = '0xF0f274EA0ad60FA7d75490f0Da58fF710ADea475'; // Replace with your deployed factory address
  const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, wallet);

  const tokenA = '0x7e6D75B1A8Bd04778387DFb7063D192F835D084e'; // Holon
  const tokenB = '0x8CB4c1B4094e58Ff8a071421c7d1cf87daA1BCDe'; // Hether
  const feeTier = 500; // Assuming you used 500 for the fee tier

  try {
    const poolAddress = await factory.getPool(tokenA, tokenB, feeTier);
    if (poolAddress === ethers.constants.AddressZero) {
      console.log('Pool does not exist for given token pair and fee tier.');
    } else {
      console.log('Pool Address:', poolAddress);
    }
  } catch (error) {
    console.error('Error fetching pool address from factory:', error);
  }
}

getPoolFromFactory();
