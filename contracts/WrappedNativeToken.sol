// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WrappedNativeToken is ERC20 {
    // Event for deposits (minting WESA)
    event Deposit(address indexed account, uint256 amount);
    
    // Event for withdrawals (burning WESA)
    event Withdrawal(address indexed account, uint256 amount);

    constructor() ERC20("Wrapped ESA", "WESA") {}

    // Fallback function to handle receiving native token and minting WESA
     receive() external payable {
        deposit();
    }

    // Deposit native tokens and mint WESA tokens
    function deposit() public payable {
        require(msg.value > 0, "Must deposit a non-zero amount");
        _mint(msg.sender, msg.value);  // Mint WESA equivalent to the native token deposited
        emit Transfer(address(0), msg.sender, msg.value);  // Emit the Transfer event from 0 address (minting)
        emit Deposit(msg.sender, msg.value);  // Emit custom event for deposit
    }

    // Withdraw native tokens and burn WESA tokens
    function withdraw(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient WESA balance");
        _burn(msg.sender, amount);  // Burn WESA tokens
        payable(msg.sender).transfer(amount);  // Send native tokens back to the user
        emit Transfer(msg.sender, address(0), amount);  // Emit the Transfer event to 0 address (burning)
        emit Withdrawal(msg.sender, amount);  // Emit custom event for withdrawal
    }

    // Check balance of WESA tokens
    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }

    // Transfer WESA tokens
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(balanceOf(msg.sender) >= amount, "Insufficient WESA balance");
        _transfer(msg.sender, to, amount);  // Transfer WESA tokens
        return true;
    }

    // Approve an address to spend WESA tokens on behalf of the owner
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    // Check the amount of WESA tokens an address is allowed to spend on behalf of the owner
    function allowance(address owner, address spender) public view override returns (uint256) {
        return super.allowance(owner, spender);
    }

    // Transfer WESA tokens on behalf of an address, using their allowance
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        require(balanceOf(from) >= amount, "Insufficient WESA balance");
        require(allowance(from, msg.sender) >= amount, "Allowance exceeded");
        _transfer(from, to, amount);  // Transfer WESA tokens
        _approve(from, msg.sender, allowance(from, msg.sender) - amount);
        return true;
    }
}
