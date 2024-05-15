/*const { assert, expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256 } = require("@ethersproject/keccak256");
const { bytecode } = require("../artifacts/contracts/Storage.sol/Storage.json");

describe("DeployerFactory", function () {
  let deployerContract, salt, greeting;
  beforeEach(async () => {
    salt = keccak256(ethers.toUtf8Bytes("12"));

    const factory = await ethers.getContractFactory("DeployerFactory");
    deployerContract = await factory.deploy();
    await deployerContract.waitForDeployment();
  });

  it("pre-computed storage contract address prior to deploy should match  address post deployment", async () => {
    const preComputedAddress = await deployerContract.computeAddress(salt);
    const txResponse = await deployerContract.deployContract(salt);
    const txReceipt = await txResponse.wait(1);
    const deployedAddress = txReceipt.logs[0].args[0];
    console.log(`Deployed Address: ${deployedAddress}`);
    console.log(`Precomputed Address: ${preComputedAddress}`);
    assert(preComputedAddress.toString(), deployedAddress.toString());
  });

  it("using ethers to pre-compute storage contract address prior to deploy should match address post deployment", async () => {
    const initCodeHash = keccak256(bytecode);
    const preComputedAddress = ethers.getCreate2Address(
      (await deployerContract.getAddress()).toString(),
      salt,
      initCodeHash
    );
    const txResponse = await deployerContract.deployContract(salt);
    const txReceipt = await txResponse.wait(1);
    const deployedAddress = txReceipt.logs[0].args[0];
    expect(deployedAddress).to.equal(preComputedAddress);
  });
}); */
