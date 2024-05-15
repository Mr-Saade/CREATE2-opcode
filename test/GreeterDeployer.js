const { assert } = require("chai");
const { ethers } = require("hardhat");
const { keccak256 } = require("@ethersproject/keccak256");

describe("GreeterFacotry", function () {
  let deployerContract, salt, greeting;
  beforeEach(async () => {
    salt = keccak256(ethers.toUtf8Bytes("12"));
    greeting = "Hello World!";
    const factory = await ethers.getContractFactory("GreeterDeployer");
    deployerContract = await factory.deploy();
    await deployerContract.waitForDeployment();
  });

  it("pre-computed greeter contract address prior to deploy should match  address post deployment", async () => {
    const preComputedAddress = await deployerContract.computeAddress(
      salt,
      greeting
    );
    const txResponse = await deployerContract.deployContract(salt, greeting);
    const txReceipt = await txResponse.wait(1);
    const deployedAddress = txReceipt.logs[0].args[0];
    console.log(`Deployed Address: ${deployedAddress}`);
    console.log(`Precomputed Address: ${preComputedAddress}`);
    assert(preComputedAddress.toString(), deployedAddress.toString());
  });
});
