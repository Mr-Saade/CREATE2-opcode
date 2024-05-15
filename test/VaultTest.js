const { assert, expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256 } = require("@ethersproject/keccak256");

describe("VaultFactory", function () {
  let deployerContract, salt, deployer;
  beforeEach(async () => {
    salt = keccak256(ethers.toUtf8Bytes("10"));
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    const factory = await ethers.getContractFactory("VaultFactory");
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

  it("should send ether to precomputed address, deploy to the address and withdraw the received funds", async () => {
    console.log("Sending Ether to Valut prior deployment...");
    const sendAmount = ethers.parseEther("1");
    const preComputedAddress = await deployerContract.computeAddress(salt);
    const tx = await deployerContract.sendEther(salt, { value: sendAmount });
    const txReceipt = await tx.wait(1);
    const isSuccess = txReceipt.logs[0].args[3];
    console.log(`Transfer Status: ${isSuccess}`);

    console.log("-------------------");
    console.log("Deploying Vault Contract...");
    const txDeploy = await deployerContract.deployContract(salt);
    const txDeployReceipt = await txDeploy.wait(1);
    const deployedAddress = txDeployReceipt.logs[0].args[0];
    const VaultContract = await ethers.getContractAt(
      "Vault",
      deployedAddress,
      deployer
    );
    const intialVaultBalance = await VaultContract.getBalance();
    expect(sendAmount).to.equal(intialVaultBalance);
    console.log(`Precomputed Address: ${preComputedAddress}`);
    console.log(`Vault contract deployed at ${deployedAddress.toString()}`);
    console.log("-----------------");
    console.log(`Withdrawing ${ethers.formatEther(sendAmount)} ether...`);
    const txWithdraw = await VaultContract.withdraw();
    const txWithdrawReceipt = await txWithdraw.wait(1);
    const recipient = txWithdrawReceipt.logs[0].args[0];
    const amount = txWithdrawReceipt.logs[0].args[1];
    const status = txWithdrawReceipt.logs[0].args[2];
    if (status) {
      console.log("Withdrawal Successful!");
      console.log(`${ethers.formatEther(amount)} withdrawn by ${recipient}`);
      const endingVaultBalance = await VaultContract.getBalance();
      assert.equal(endingVaultBalance.toString(), "0");
    } else {
      console.log("Withdrawal Insuccessful!");
    }
  });
});
