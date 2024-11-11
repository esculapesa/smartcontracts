require('dotenv').config();  // To load environment variables from a .env file
const Web3 = require('web3');
const web3 = new Web3("http://65.108.151.70:8545");  // Updated node URL

// ABI of the BulkTransfer contract
const bulkTransferAbi = [
    {
        "inputs": [
            { "internalType": "address[]", "name": "tokenContracts", "type": "address[]" },
            { "internalType": "address", "name": "recipient", "type": "address" },
            { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
        ],
        "name": "bulkTransfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const bulkTransferAddress = "0x9aE2a4e34634dD4cab33574279cC27D301aE0794";  // Provided BulkTransfer contract address
const bulkTransferContract = new web3.eth.Contract(bulkTransferAbi, bulkTransferAddress);

const senderAddress = "0x9636470f2e7093f324a745e6971342c150b4b5a9";  // Provided sender address
const recipientAddress = "0xdbb9a7b465a515642050a5788d6d5575e7732c07";  // Provided recipient address
const privateKey = process.env.PRIVATE_KEY;  // Sender's private key from environment variable

// List of token contract addresses and the amount to transfer for each (70% of 210 million)
const tokens = [
    { address: "0xcDbBC3fC0466f35D102441E2216A5888A54Cb372", amount: web3.utils.toWei("147000000", "ether") },  // EsaCoin (ESC)
    { address: "0xaa9cFb915654772e971D540292152F20cd25B46b", amount: web3.utils.toWei("147000000", "ether") },  // Esculap (ESA)
    { address: "0x8CB4c1B4094e58Ff8a071421c7d1cf87daA1BCDe", amount: web3.utils.toWei("147000000", "ether") },   // Hether (HTR)
    { address: "0x7fCE524C610acE8b694a3Ef615581BcA831544cb", amount: web3.utils.toWei("147000000", "ether") },  // Hether MEX (HTM)
    { address: "0x7e6D75B1A8Bd04778387DFb7063D192F835D084e", amount: web3.utils.toWei("147000000", "ether") },  // Holon (HNS)
    { address: "0xA27e4e424a5eF14b03A7ECA81a6cFB496dbD3740", amount: web3.utils.toWei("147000000", "ether") },  // Holopedia (HPA)
    { address: "0x3f65642A1621466E0B467692839D87237435794C", amount: web3.utils.toWei("147000000", "ether") },  // Infare (IFE)
    { address: "0x664BEb8E762B19346d34C8A4c02705662371d5d1", amount: web3.utils.toWei("147000000", "ether") }   // Int (INT)
];

// Prepare data for the bulkTransfer function
const tokenAddresses = tokens.map(token => token.address);
const amounts = tokens.map(token => token.amount);

async function callBulkTransfer() {
    try {
        // Create the bulkTransfer transaction
        const transferTx = bulkTransferContract.methods.bulkTransfer(tokenAddresses, recipientAddress, amounts);
        const gas = await transferTx.estimateGas({ from: senderAddress });
        const data = transferTx.encodeABI();

        const tx = {
            from: senderAddress,
            to: bulkTransferAddress,
            data,
            gas,
            gasPrice: web3.utils.toWei('5', 'gwei')
        };

        // Sign and send the transaction
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        
        console.log("Bulk transfer complete. Transaction hash:", receipt.transactionHash);
    } catch (error) {
        console.error("Error during bulk transfer:", error);
    }
}

callBulkTransfer();