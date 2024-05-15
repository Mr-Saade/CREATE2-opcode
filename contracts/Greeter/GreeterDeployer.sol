//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/utils/Create2.sol";
import {Greeter} from "./Greeter.sol";

contract GreeterDeployer {
    event ContractDeployed(address _contractAddress, bytes32 _salt);

    //getByteCode function

    function getBtyeCode(
        string memory _greeting
    ) public pure returns (bytes memory) {
        bytes memory bytecode = type(Greeter).creationCode;
        return abi.encode(bytecode, bytes(_greeting));
    }

    //function to compute address of storage contract prior to deployment

    function computeAddress(
        bytes32 _salt,
        string memory _greeting
    ) public view returns (address computedAddress) {
        bytes memory bytecode = getBtyeCode(_greeting);
        bytes32 bytecodeHash = keccak256(bytecode);
        computedAddress = Create2.computeAddress(_salt, bytecodeHash);
    }

    //deploy storage contract using the deployerFactory contract
    function deployContract(
        bytes32 _salt,
        string memory _greeting
    ) public returns (address deployAddress) {
        bytes memory bytecode = getBtyeCode(_greeting);
        deployAddress = Create2.deploy(0, _salt, bytecode);
        emit ContractDeployed(deployAddress, _salt);
    }
}
