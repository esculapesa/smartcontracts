// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract WrappedNativeToken is ERC20, ReentrancyGuard {
    constructor() ERC20("Wrapped ESA", "WESA") {}

    // Event when tokens are wrapped
    event Deposit(address indexed account, uint256 amount);
    
    // Event when tokens are unwrapped
    event Withdrawal(address indexed account, uint256 amount);

    // Allow users to deposit native ESA and mint wrapped tokens
    receive() external payable {
        deposit();
    }

    // Deposit function to wrap native ESA tokens into WESA
    function deposit() public payable {
        require(msg.value > 0, "Cannot deposit 0");
        _mint(msg.sender, msg.value);  // 1 ESA = 1 WESA
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw function to convert WESA back to ESA
    function withdraw(uint256 amount) public nonReentrant {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);  // Burn WESA tokens

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");  // Transfer back ESA

        emit Withdrawal(msg.sender, amount);
    }
}
