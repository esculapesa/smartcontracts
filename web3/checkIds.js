require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3("http://65.108.151.70:8545");  // Replace with your network's URL

async function getNetworkInfo() {
    try {
        const chainId = await web3.eth.getChainId();
        const networkId = await web3.eth.net.getId();
        
        console.log("Chain ID:", chainId);
        console.log("Network ID:", networkId);
    } catch (error) {
        console.error("Error retrieving network information:", error);
    }
}

getNetworkInfo();
