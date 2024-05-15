// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/utils/Create2.sol";
import {Storage} from "./Storage.sol";
pragma solidity ^0.8.0;

contract DeployerFactory {
    event ContractDeployed(address _contractAddress, bytes32 _salt);

    //function to compute address of storage contract prior to deployment

    function computeAddress(
        bytes32 _salt
    ) public view returns (address computedAddress) {
        bytes32 bytecodeHash = keccak256(type(Storage).creationCode);
        computedAddress = Create2.computeAddress(_salt, bytecodeHash);
    }

    //deploy storage contract using the deployerFactory contract
    function deployContract(
        bytes32 _salt
    ) public returns (address deployAddress) {
        bytes memory bytecode = type(Storage).creationCode;
        deployAddress = Create2.deploy(0, _salt, bytecode);
        emit ContractDeployed(deployAddress, _salt);
    }
}
