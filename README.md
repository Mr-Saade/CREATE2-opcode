# CREATE2-opcode

This is a project to showcase the power of smart contract deployment using the CREATE2 opcode. With this opcode, you can precompute deterministically, the addresses where your contracts will be deployed prior to deployments.

In the VaultTest for instance, you precompute the address where the Vault contract will be deployed by the VaultFactory, and send some Ether to the precomputed vault contract address prior to deployment. Then, we deploy the Vault contract using the CREATE2 opcode to that precomputed address and call the withdraw method on the vault contract, retrieving back the funds that were sent to it prior to deployment.

Being able to interact with contracts that don’t yet exist thus 'counterfactual interactions', is an extremely powerful tool and is the key building block behind state channels.

## Getting Started

### Prerequisites

Be sure to have installed the following

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install)

### Installation

1. Clone the repo

```bash
git clone https://github.com/Mr-Saade/CREATE2-opcode.git
cd CREATE2-opcode
```

2. Install packages

```bash
yarn install
```

3. Compile contracts

```bash
yarn compile
```

4. Run tests

```bash
yarn test
```

## Usage

### EIP-1014

This opcode was introduced in [EIP-1014](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1014.md)

### CREATE

Contract's address is computed as a keccak256 of the sender’s own address and a nonce

`contractAddress = keccak256(sender, nonce)`

or in Solidity,

```solidity
pair = new UniswapV2Pair()
```

### CREATE2

Contract's address is computed as a keccak256 of: `0xFF`, a constant that prevents collisions with CREATE, the sender’s own address, a salt (an arbitrary value provided by the sender), the to-be-deployed contract’s bytecode

`contractAddress = keccak256(0xFF, sender, salt, bytecode)`

or in Solidity,

```solidity
    bytes memory bytecode = type(UniswapV2Pair).creationCode;
    bytes32 salt = keccak256(abi.encodePacked(token0, token1));
    assembly {
        pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }
```
