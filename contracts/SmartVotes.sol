// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Proposal {
        string name;
        uint voteCount;
    }

    address public owner;
    mapping(address => uint) public lastVotedOn;
    uint public currentVoteSession = 0;
    Proposal[] public proposals;
    bool public votingActive;

    constructor() {
        owner = msg.sender;
        votingActive = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier voteActive() {
        require(votingActive, "Voting is not active.");
        _;
    }

    function addProposal(string memory proposalName) public onlyOwner {
        proposals.push(Proposal({
            name: proposalName,
            voteCount: 0
        }));
    }

    function vote(uint proposalIndex) public voteActive {
        require(lastVotedOn[msg.sender] != currentVoteSession, "You have already voted in this session.");
        lastVotedOn[msg.sender] = currentVoteSession;
        proposals[proposalIndex].voteCount += 1;
    }

    function endVoting() public onlyOwner {
        votingActive = false;
    }

    function getWinner() public view returns (string memory winnerName, uint winnerVoteCount) {
        require(!votingActive, "Voting is still active.");
        uint winningVoteCount = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winnerName = proposals[i].name;
                winnerVoteCount = proposals[i].voteCount;
            }
        }
    }

    // Reset the contract to start a new vote
    function resetVoting() public onlyOwner {
        for (uint i = 0; i < proposals.length; i++) {
            proposals[i].voteCount = 0;
        }
        currentVoteSession++;
        votingActive = true;
    }
}

