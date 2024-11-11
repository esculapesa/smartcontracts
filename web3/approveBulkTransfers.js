require('dotenv').config();  // Load environment variables from .env file
const Web3 = require('web3');
const web3 = new Web3("http://65.108.151.70:8545");  // Provided node URL

// ERC-20 ABI with the 'approve' function
const tokenAbi = [
    {
        "constant": false,
        "inputs": [
            { "name": "_spender", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [
            { "name": "", "type": "bool" }
        ],
        "type": "function"
    }
];

const bulkTransferAddress = "0x9aE2a4e34634dD4cab33574279cC27D301aE0794";  // Address of the BulkTransfer contract
const senderAddress = "0x9636470f2e7093f324a745e6971342c150b4b5a9";  // Sender's address
const privateKey = process.env.PRIVATE_KEY;  // Private key from environment variable

// List of token contract addresses and the approval amount (148 million in wei)
const tokens = [
    { address: "0xcDbBC3fC0466f35D102441E2216A5888A54Cb372", amount: web3.utils.toWei("148000000", "ether") },  // EsaCoin (ESC)
    { address: "0xaa9cFb915654772e971D540292152F20cd25B46b", amount: web3.utils.toWei("148000000", "ether") },  // Esculap (ESA)
    { address: "0x8CB4c1B4094e58Ff8a071421c7d1cf87daA1BCDe", amount: web3.utils.toWei("148000000", "ether") },   // Hether (HTR)
    { address: "0x7fCE524C610acE8b694a3Ef615581BcA831544cb", amount: web3.utils.toWei("148000000", "ether") },  // Hether MEX (HTM)
    { address: "0x7e6D75B1A8Bd04778387DFb7063D192F835D084e", amount: web3.utils.toWei("148000000", "ether") },  // Holon (HNS)
    { address: "0xA27e4e424a5eF14b03A7ECA81a6cFB496dbD3740", amount: web3.utils.toWei("148000000", "ether") },  // Holopedia (HPA)
    { address: "0x3f65642A1621466E0B467692839D87237435794C", amount: web3.utils.toWei("148000000", "ether") },  // Infare (IFE)
    { address: "0x664BEb8E762B19346d34C8A4c02705662371d5d1", amount: web3.utils.toWei("148000000", "ether") }   // Int (INT)
];

async function approveTokens() {
    for (const token of tokens) {
        try {
            const tokenContract = new web3.eth.Contract(tokenAbi, token.address);

            // Create the approve transaction
            const approveTx = tokenContract.methods.approve(bulkTransferAddress, token.amount);
            const gas = await approveTx.estimateGas({ from: senderAddress });
            const data = approveTx.encodeABI();

            const tx = {
                from: senderAddress,
                to: token.address,
                data,
                gas,
                gasPrice: web3.utils.toWei('5', 'gwei')
            };

            // Sign and send the transaction
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

            console.log(`Approved ${token.amount} for bulk transfer on token ${token.address}. Tx hash: ${receipt.transactionHash}`);
        } catch (error) {
            console.error(`Error approving token ${token.address}:`, error);
        }
    }
}

approveTokens();
