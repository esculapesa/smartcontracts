	// SPDX-License-Identifier: MIT
	pragma solidity ^0.8.0;

	import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

	contract HolonToken is IERC20 {
		string public constant name = "Holon";
		string public constant symbol = "HNS";
		uint8 public constant decimals = 18;

		mapping(address => uint256) balances;
		mapping(address => mapping(address => uint256)) allowed;
		uint256 totalSupply_ = 210000000 * 10**uint256(decimals);

		constructor() {
			balances[msg.sender] = totalSupply_;
			emit Transfer(address(0), msg.sender, totalSupply_);
		}

		function totalSupply() public view override returns (uint256) {
			return totalSupply_;
		}

		function balanceOf(address tokenOwner) public view override returns (uint256) {
			return balances[tokenOwner];
		}

		function transfer(address receiver, uint256 numTokens) public override returns (bool) {
			require(numTokens <= balances[msg.sender], "Insufficient balance");
			balances[msg.sender] = balances[msg.sender] - numTokens;
			balances[receiver] = balances[receiver] + numTokens;
			emit Transfer(msg.sender, receiver, numTokens);
			return true;
		}

		function approve(address delegate, uint256 numTokens) public override returns (bool) {
			allowed[msg.sender][delegate] = numTokens;
			emit Approval(msg.sender, delegate, numTokens);
			return true;
		}

		function allowance(address owner, address delegate) public view override returns (uint256) {
			return allowed[owner][delegate];
		}

		function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
			require(numTokens <= balances[owner], "Insufficient balance");
			require(numTokens <= allowed[owner][msg.sender], "Insufficient allowance");

			balances[owner] = balances[owner] - numTokens;
			allowed[owner][msg.sender] = allowed[owner][msg.sender] - numTokens;
			balances[buyer] = balances[buyer] + numTokens;
			emit Transfer(owner, buyer, numTokens);
			return true;
		}
	}

