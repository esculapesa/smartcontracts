const Web3 = require('web3');
const web3 = new Web3('http://65.108.151.70:8545'); // Adjust this to your Ethereum node URL

// Replace 'contractAddress' with your actual contract address
const contractAddress = '0xD8aa87822C24Eb70d2Bae37Ae6802cb9d16F5f24';
// Replace 'abi' with the actual ABI from your contract
const contractABI = require('../build/contracts/INTToken.json').abi;

// Initialize the contract
const tokenContract = new web3.eth.Contract(contractABI, contractAddress);

// Function to get the total supply of tokens
async function getTotalSupply() {
    const totalSupply = await tokenContract.methods.totalSupply().call();
    console.log(`Total Supply: ${totalSupply}`);
}

// Function to transfer tokens
async function transferTokens(fromAddress, toAddress, amount) {
    // Ensure the 'from' address has enough tokens and is unlocked
    const receipt = await tokenContract.methods.transfer(toAddress, amount).send({from: fromAddress});
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log('Tokens transferred.');
}

// Function to check the balance of an address
async function getBalance(address) {
    const balance = await tokenContract.methods.balanceOf(address).call();
    console.log(`Balance of ${address}: ${balance}`);
}

// Example usage
async function main() {
    const accounts = await web3.eth.getAccounts();
    await getTotalSupply();
    await getBalance(accounts[1]);
    await getBalance(accounts[2]);
    // Transfer 10 tokens from accounts[0] to accounts[1]
    await transferTokens(accounts[1], accounts[2], '10');
    await getBalance(accounts[1]);
    await getBalance(accounts[2]);
}

main().catch(console.error);
