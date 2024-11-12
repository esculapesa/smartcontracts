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

// Full list of production tokens with the 147 million transfer amount
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

// Test tokens with the 148 million transfer amount
const testTokens = [
    { address: "0x5964c3B17dA46f239B305d559B2A4Ff2505F6928", amount: web3.utils.toWei("148000000", "ether") },  // testSecondToken (TT2)
    { address: "0x6353d130520CC2b803F224Ad515A40Fa59e968F3", amount: web3.utils.toWei("148000000", "ether") }   // TestToken (TTN)
];

// Select tokens based on test mode
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

        try {
            console.log("trying bulk transfer");
            const transferTx = bulkTransferContract.methods.bulkTransfer(tokenAddresses, recipientAddress, amounts);
            console.log("transferTx received: ", transferTx);
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
