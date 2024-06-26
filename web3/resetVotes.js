const Web3 = require('web3');
const web3 = new Web3('http://65.108.151.70:8545');

const contractABI = require('./path_to_ABI.json'); 
const contractAddress = '0xdB1862Ed467c19b0206Df9C9393e045fd9D386B1';
const myContract = new web3.eth.Contract(contractABI, contractAddress);

const ownerAccount = '0xfcfa14212d112412e7252903db01945a9104334b';
const ownerKey = process.argv[2];

async function resetVotingSession() {
    const resetTx = myContract.methods.resetVoting();

    const gas = await resetTx.estimateGas({ from: ownerAccount });
    const gasPrice = await web3.eth.getGasPrice();
    const data = resetTx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(ownerAccount);

    const signedTx = await web3.eth.accounts.signTransaction({
        to: contractAddress,
        data,
        gas,
        gasPrice,
        nonce,
        chainId: 1 // Use appropriate chain ID (1 for Mainnet, 3 for Ropsten, etc.)
    }, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Transaction receipt:', receipt);
}

resetVotingSession().catch(console.error);

