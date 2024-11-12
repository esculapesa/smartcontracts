require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3("http://65.108.151.70:8545");

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
const bulkTransferAddress = "0x9aE2a4e34634dD4cab33574279cC27D301aE0794";
const bulkTransferContract = new web3.eth.Contract(bulkTransferAbi, bulkTransferAddress);

const senderAddress = "0x9636470f2e7093f324a745e6971342c150b4b5a9";
const recipientAddress = "0xdbb9a7b465a515642050a5788d6d5575e7732c07";
const privateKey = process.env.copperkey;

const testMode = true;
const tokens = [
    { address: "0xcDbBC3fC0466f35D102441E2216A5888A54Cb372", amount: web3.utils.toWei("147000000", "ether") },
    { address: "0xaa9cFb915654772e971D540292152F20cd25B46b", amount: web3.utils.toWei("147000000", "ether") },
];
const testTokens = [
    { address: "0x5964c3B17dA46f239B305d559B2A4Ff2505F6928", amount: web3.utils.toWei("148000000", "ether") },
    { address: "0x6353d130520CC2b803F224Ad515A40Fa59e968F3", amount: web3.utils.toWei("148000000", "ether") }
];

const activeTokens = testMode ? testTokens : tokens;
const tokenAddresses = activeTokens.map(token => token.address);
const amounts = activeTokens.map(token => token.amount);

async function checkRequirements() {
    try {
        for (const token of activeTokens) {
            const tokenContract = new web3.eth.Contract([
                { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" },
                { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" }
            ], token.address);

            // Check balance
            try {
                const balance = await tokenContract.methods.balanceOf(senderAddress).call();
                console.log(`Balance for token ${token.address}:`, balance);
                if (web3.utils.toBN(balance).lt(web3.utils.toBN(token.amount))) {
                    console.error(`Insufficient balance for token ${token.address}`);
                    return false;
                }
            } catch (balanceError) {
                console.error(`Error fetching balance for token ${token.address}:`, balanceError);
                return false;
            }

            // Check allowance
            try {
                const allowance = await tokenContract.methods.allowance(senderAddress, bulkTransferAddress).call();
                console.log(`Allowance for token ${token.address}:`, allowance);
                if (web3.utils.toBN(allowance).lt(web3.utils.toBN(token.amount))) {
                    console.error(`Insufficient allowance for token ${token.address}`);
                    return false;
                }
            } catch (allowanceError) {
                console.error(`Error fetching allowance for token ${token.address}:`, allowanceError);
                return false;
            }
        }

        // Estimate gas
        try {
            const transferTx = bulkTransferContract.methods.bulkTransfer(tokenAddresses, recipientAddress, amounts);
            const gasEstimate = await transferTx.estimateGas({ from: senderAddress });
            console.log("Estimated Gas:", gasEstimate);
        } catch (gasError) {
            console.error("Error estimating gas for bulk transfer:", gasError);
            return false;
        }

        return true;
    } catch (error) {
        console.error("General error in checkRequirements:", error);
        return false;
    }
}

async function callBulkTransfer() {
    const requirementsMet = await checkRequirements();
    if (!requirementsMet) {
        console.error("Pre-checks failed, aborting bulk transfer.");
        return;
    }

    try {
        const transferTx = bulkTransferContract.methods.bulkTransfer(tokenAddresses, recipientAddress, amounts);
        const gas = await transferTx.estimateGas({ from: senderAddress });
        const data = transferTx.encodeABI();

        const tx = {
            from: senderAddress,
            to: bulkTransferAddress,
            data,
            gas: gas + 100000,
            gasPrice: web3.utils.toWei('5', 'gwei')
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log("Bulk transfer complete. Transaction hash:", receipt.transactionHash);
    } catch (error) {
        console.error("Error during bulk transfer:", error);
    }
}

callBulkTransfer();
