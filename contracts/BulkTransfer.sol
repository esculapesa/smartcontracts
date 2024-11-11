// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract BulkTransfer {
    function bulkTransfer(address[] calldata tokenContracts, address recipient, uint256[] calldata amounts) external {
        require(tokenContracts.length == amounts.length, "Input arrays must have the same length");

        for (uint256 i = 0; i < tokenContracts.length; i++) {
            IERC20 token = IERC20(tokenContracts[i]);
            require(token.transfer(recipient, amounts[i]), "Transfer failed");
        }
    }
}
