require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3("http://65.108.151.70:8545");

const senderAddress = "0x9636470f2e7093f324a745e6971342c150b4b5a9";
const recipientAddress = "0xdbb9a7b465a515642050a5788d6d5575e7732c07";
const privateKey = process.env.copperkey;

// List of tokens and amounts to transfer individually
const tokens = [
    { address: "0xcDbBC3fC0466f35D102441E2216A5888A54Cb372", amount: web3.utils.toWei("147000000", "ether") },  // EsaCoin (ESC)
    { address: "0xaa9cFb915654772e971D540292152F20cd25B46b", amount: web3.utils.toWei("147000000", "ether") },  // Esculap (ESA)
    { address: "0x8CB4c1B4094e58Ff8a071421c7d1cf87daA1BCDe", amount: web3.utils.toWei("147000000", "ether") },  // Hether (HTR)
    { address: "0x7fCE524C610acE8b694a3Ef615581BcA831544cb", amount: web3.utils.toWei("147000000", "ether") },  // Hether MEX (HTM)
    { address: "0x7e6D75B1A8Bd04778387DFb7063D192F835D084e", amount: web3.utils.toWei("147000000", "ether") },  // Holon (HNS)
    { address: "0xA27e4e424a5eF14b03A7ECA81a6cFB496dbD3740", amount: web3.utils.toWei("147000000", "ether") },  // Holopedia (HPA)
    { address: "0x3f65642A1621466E0B467692839D87237435794C", amount: web3.utils.toWei("147000000", "ether") },  // Infare (IFE)
    { address: "0x664BEb8E762B19346d34C8A4c02705662371d5d1", amount: web3.utils.toWei("147000000", "ether") }   // Int (INT)
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
