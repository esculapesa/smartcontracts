const Web3 = require('web3');
const fs = require('fs');

// Setup connection to the Ethereum node
const web3 = new Web3('http://65.108.151.70:8545'); // Replace with your node's URL

// Read the contract ABI and deployed address
const contractABI = require('./build/contracts/VotingSystem.json').abi;
const contractAddress = '0xdB1862Ed467c19b0206Df9C9393e045fd9D386B1';
const ownerAddress = '0xfcfa14212d112412e7252903db01945a9104334b';
const voterAddress = process.argv[2];
const proposalName = process.argv[3];

// Create the contract instance
const smartVotes = new web3.eth.Contract(contractABI, contractAddress);

// Example functions to interact with the contract
async function addProposal(proposalName, fromAddress) {
    return await smartVotes.methods.addProposal(proposalName).send({ from: fromAddress });
}

async function vote(proposalIndex, fromAddress) {
    return await smartVotes.methods.vote(proposalIndex).send({ from: fromAddress });
}

async function endVoting(fromAddress) {
    return await smartVotes.methods.endVoting().send({ from: fromAddress });
}

async function getWinner() {
    const result = await smartVotes.methods.getWinner().call();
    console.log(`Winner is: ${result.winnerName} with ${result.winnerVoteCount} votes`);
}

// Usage example (make sure to replace 'fromAddress' with a valid Ethereum address from your node or wallet)
async function execute() {
    try {
	await addProposal(proposalName, ownerAddress);
	await vote(0, voterAddress);
	await endVoting(voterAddress);
        await getWinner();
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

execute();

