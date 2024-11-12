require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3("http://65.108.151.70:8545");

const senderAddress = "0x9636470f2e7093f324a745e6971342c150b4b5a9";
const recipientAddress = "0xdbb9a7b465a515642050a5788d6d5575e7732c07";
const privateKey = process.env.copperkey;

// List of tokens and amounts to transfer individually
const tokens = [
    { address: "0x5964c3B17dA46f239B305d559B2A4Ff2505F6928", amount: web3.utils.toWei("147000000", "ether") },  // testSecondToken (TT2)
    { address: "0x6353d130520CC2b803F224Ad515A40Fa59e968F3", amount: web3.utils.toWei("147000000", "ether") }   // TestToken (TTN)
];

const tokenAbi = [
    {
        "constant": false,
        "inputs": [
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "", "type": "bool" }],
        "type": "function"
    }
];

async function transferTokensIndividually() {
    for (const token of tokens) {
        const tokenContract = new web3.eth.Contract(tokenAbi, token.address);

        try {
            console.log(`Transferring ${token.amount} of token ${token.address} to ${recipientAddress}`);
            
            // Encode the transfer data
            const transferTx = tokenContract.methods.transfer(recipientAddress, token.amount);
            const data = transferTx.encodeABI();
            
            // Estimate gas
            const gasEstimate = await transferTx.estimateGas({ from: senderAddress });
            console.log(`Estimated Gas for token ${token.address}:`, gasEstimate);

            // Create and sign the transaction
            const tx = {
                from: senderAddress,
                to: token.address,
                data: data,
                gas: gasEstimate + 10000,  // Adding a buffer to gas limit
                gasPrice: web3.utils.toWei('5', 'gwei')
            };

            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

            console.log(`Transfer complete for token ${token.address}. Transaction hash:`, receipt.transactionHash);
        } catch (error) {
            console.error(`Error transferring token ${token.address}:`, error);
        }
    }
}

transferTokensIndividually();
