//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    string private s_greeting;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        s_greeting = _greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("New greeting: ", _greeting);
        s_greeting = _greeting;
    }

    function getGreeting() external view returns (string memory) {
        return s_greeting;
    }
}
