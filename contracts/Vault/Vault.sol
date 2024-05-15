//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error VAULT__WITHDRAWAL_FAILED();

contract Vault {
    event FundsWithdrawn(address _recepient, uint _amount, bool _status);

    function withdraw() public {
        uint contractBalance = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: contractBalance}("");
        if (!success) {
            revert VAULT__WITHDRAWAL_FAILED();
        }
        emit FundsWithdrawn(msg.sender, contractBalance, success);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
