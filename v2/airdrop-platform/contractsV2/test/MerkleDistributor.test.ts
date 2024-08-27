import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import hre from "hardhat";
import { expect } from "chai";
import { time } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { createBalanceTree } from '../src/balance-tree'
import { parseBalanceMap } from '../src/parse-balance-map'
import { Address, encodeFunctionData, Hex, zeroAddress, type WalletClient } from 'viem'
import { signTxAuthDataLibEthers, signTxAuthDataViem, type TxAuthData, signTxAuthDataLib, type TxAuthInput, type WalletClientExtended } from '@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/lib'
import { parseEther, hexToNumber, numberToHex, padHex } from 'viem'
import type { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";
import merkleDistributorArtifact from '../artifacts/contracts/MerkleDistributor.sol/MerkleDistributor.json'
import merkleDistributorWithDeadlineArtifact from '../artifacts/contracts/MerkleDistributorWithDeadline.sol/MerkleDistributorWithDeadline.json'

type ClaimArgs = {
  index: number
  account: string
  amount: number
  merkleProof: string[]
}

describe("MerkleDistributor", function () {
  async function deployMerkleDistributorFixture() {
    const [owner, wallet0, wallet1, txSigner, ...otherAccounts] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();

    const token = await hre.viem.deployContract("TestERC20", ["Token", "TKN", 0n]);
    const merkleDistributor = await hre.viem.deployContract("MerkleDistributor", [token.address, ZERO_BYTES32, txSigner.account.address]);
    const merkleDistributorWithDeadline = await hre.viem.deployContract("MerkleDistributorWithDeadline", [token.address, ZERO_BYTES32, 0n, txSigner.account.address]);

    return { merkleDistributor, merkleDistributorWithDeadline, token, owner, wallet0, wallet1, txSigner, otherAccounts, publicClient };
  }

  const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

  const claimWithSignature = async (
    props: {
      distributorContract: Address,
      contractName: 'MerkleDistributorWithDeadline' | 'MerkleDistributor',
      sender: WalletClient,
      txAuthSigner: WalletClientExtended,
      claimArgs: ClaimArgs
    }
  ) => {
    const { distributorContract, contractName, sender, txAuthSigner, claimArgs } = props
    if (!sender.account) throw new Error("Sender account not found");
    const txAuthInput: TxAuthInput = {
      contractAbi: Array.from(
        contractName == 'MerkleDistributorWithDeadline'
          ? merkleDistributorWithDeadlineArtifact.abi
          : merkleDistributorArtifact.abi
      ),
      contractAddress: distributorContract,
      functionName: 'claim',
      args: [claimArgs.index, claimArgs.account, claimArgs.amount, claimArgs.merkleProof],
      userAddress: sender.account.address,
    }

    if (!txAuthSigner.account) throw new Error("TxAuthSigner account not found");
    const signatureResponse = await signTxAuthDataLib(txAuthSigner, txAuthInput)

    // Encoding the blockExpiration (uint256) and signature (bytes)
    const abiEncodedBlockExpiration = padHex(numberToHex(signatureResponse.blockExpiration), { size: 32 })

    const publicClient = await hre.viem.getPublicClient()
    const chain = publicClient.chain

    const unsignedTx = encodeFunctionData({
      abi: contractName === 'MerkleDistributorWithDeadline'
        ? merkleDistributorWithDeadlineArtifact.abi
        : merkleDistributorArtifact.abi,
      functionName: 'claim',
      args: [claimArgs.index, claimArgs.account, claimArgs.amount, claimArgs.merkleProof]
    })

    // Complete data
    const txData = unsignedTx + abiEncodedBlockExpiration.slice(2) + signatureResponse.signature.slice(2)

    // Send tx
    return await sender.sendTransaction({
      to: distributorContract,
      data: txData as `0x${string}`,
      gas: 9999999n,
      account: sender.account,
      chain: chain,
    })
  }

  describe("Deployment", function () {
    it("Should deploy the contracts", async function () {
      const { merkleDistributor, merkleDistributorWithDeadline, token } = await loadFixture(deployMerkleDistributorFixture);
      expect(await merkleDistributor.read.token()).to.not.equal(zeroAddress);
      expect(await merkleDistributorWithDeadline.read.token()).to.not.equal(zeroAddress);
      expect(await token.read.name()).to.equal("Token");
    });
  });

  describe("MerkleRoot", function () {
    it("returns the zero merkle root", async function () {
      const { merkleDistributor } = await loadFixture(deployMerkleDistributorFixture);
      expect(await merkleDistributor.read.merkleRoot()).to.equal(ZERO_BYTES32);
    });
  });

  describe("Claim", function () {
    it("fails for empty proof", async function () {
      const { merkleDistributor, wallet0, txSigner } = await loadFixture(deployMerkleDistributorFixture);

      await expect(claimWithSignature({
        distributorContract: merkleDistributor.address,
        contractName: 'MerkleDistributor',
        sender: wallet0,
        txAuthSigner: txSigner as WalletClientExtended,
        claimArgs: {
          index: 0,
          account: wallet0.account.address,
          amount: 10,
          merkleProof: [],
        }
      })).to.be.rejectedWith("InvalidProof");
    });

    // ... (add more test cases)
  });

  describe("MerkleDistributorWithDeadline", function () {
    it("cannot claim after end time", async function () {
      const { merkleDistributorWithDeadline, token, wallet0, txSigner, publicClient } = await loadFixture(deployMerkleDistributorFixture);
      
      // Get the current block timestamp
      const currentTimestamp = await publicClient.getBlock({ blockTag: 'latest' }).then(block => BigInt(block.timestamp));
      
      // Set the end time to 1 hour from now
      const endTime = currentTimestamp + 3600n;
      
      // Update the merkle root and end time
      await merkleDistributorWithDeadline.write.setMerkleRootAndEndTime([ZERO_BYTES32, endTime]);

      const tree = createBalanceTree({
        balances: [
          { account: wallet0.account.address as Address, amount: 100n },
        ]
      });

      await token.write.setBalance([merkleDistributorWithDeadline.address, 100n]);

      // Increase time to just after the end time
      await time.increaseTo(endTime + 1n);

      const proof = tree.getProof({ index: 0n, account: wallet0.account.address as Address, amount: 100n });

      await expect(claimWithSignature({
        distributorContract: merkleDistributorWithDeadline.address,
        contractName: 'MerkleDistributorWithDeadline',
        sender: wallet0,
        txAuthSigner: txSigner as WalletClientExtended,
        claimArgs: {
          index: 0,
          account: wallet0.account.address,
          amount: 100,
          merkleProof: proof,
        }
      })).to.be.rejectedWith("ClaimWindowFinished()");
    });

    // ... (add more test cases)
  });
});
