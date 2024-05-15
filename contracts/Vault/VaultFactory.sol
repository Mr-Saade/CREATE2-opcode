// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/utils/Create2.sol";
import {Vault} from "./Vault.sol";
pragma solidity ^0.8.0;
error VAULTFACTORY__TRANSFER_FAILED();

contract VaultFactory {
    event VaultDeployed(address _contractAddress, bytes32 _salt);
    event EtherSent(
        address _sender,
        address _recepient,
        uint _amount,
        bool _status
    );

    //function to compute address of storage contract prior to deployment

    function computeAddress(
        bytes32 _salt
    ) public view returns (address computedAddress) {
        bytes32 bytecodeHash = keccak256(type(Vault).creationCode);
        computedAddress = Create2.computeAddress(_salt, bytecodeHash);
    }

    function sendEther(bytes32 _salt) public payable {
        address vaultContract = computeAddress(_salt);
        (bool success, ) = payable(vaultContract).call{value: msg.value}("");
        if (!success) {
            revert VAULTFACTORY__TRANSFER_FAILED();
        }
        emit EtherSent(msg.sender, vaultContract, msg.value, success);
    }

    //deploy storage contract using the deployerFactory contract
    function deployContract(
        bytes32 _salt
    ) public returns (address deployAddress) {
        bytes memory bytecode = type(Vault).creationCode;
        deployAddress = Create2.deploy(0, _salt, bytecode);
        emit VaultDeployed(deployAddress, _salt);
    }
}
