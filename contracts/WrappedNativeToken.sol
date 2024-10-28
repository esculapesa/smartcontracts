// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WrappedNativeToken is ERC20 {
    // Event when tokens are wrapped (deposited)
    event Deposit(address indexed account, uint256 amount);

    // Event when tokens are unwrapped (withdrawn)
    event Withdrawal(address indexed account, uint256 amount);

    // Constructor: Defines the wrapped token's name and symbol
    constructor() ERC20("Wrapped ESA", "WESA") {}

    // Fallback function to handle native token deposits directly (auto-wrap)
    receive() external payable {
        deposit();  // Automatically calls the deposit function
    }

    // Function to wrap native tokens (deposit native tokens and mint WESA)
    function deposit() public payable {
        require(msg.value > 0, "Must deposit some amount");  // Ensure a valid deposit amount
        _mint(msg.sender, msg.value);  // Mints WESA equivalent to the native token deposited
        emit Deposit(msg.sender, msg.value);  // Emit event for tracking
    }

    // Function to unwrap wrapped tokens (burn WESA and send back native tokens)
    function withdraw(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance to withdraw");
        _burn(msg.sender, amount);  // Burns WESA equivalent to the amount to be unwrapped
        payable(msg.sender).transfer(amount);  // Transfers native token back to the user
        emit Withdrawal(msg.sender, amount);  // Emit event for tracking
    }
}
