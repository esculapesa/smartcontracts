// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 
contract WrappedNativeToken {
    string public name = "Wrapped ESA";
    string public symbol = "WESA";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;
    
 
    receive() external payable {
        deposit();
    }
 
    function deposit() public payable {
        balances[msg.sender] += msg.value;
        totalSupply += msg.value;
    }
 
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        totalSupply -= amount;
        payable(msg.sender).transfer(amount);
    }
 
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
 
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }
 
    function approve(address spender, uint256 amount) public returns (bool) {
        allowances[msg.sender][spender] = amount;
        return true;
    }
 
    function allowance(address owner, address spender) public view returns (uint256) {
        return allowances[owner][spender];
    }
 
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balances[from] >= amount, "Insufficient balance");
        require(allowances[from][msg.sender] >= amount, "Allowance exceeded");
        balances[from] -= amount;
        allowances[from][msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }
}
 