import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { signTxAuthDataLibEthers } from '@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/lib'
import chai, { expect } from 'chai'
import { createBalanceTree, BalanceTree, parseBalanceMap, verifyProof } from '@compilot/merkle-tree-js'
import { solidity } from 'ethereum-waffle'
import { BigNumber, constants, Contract, ContractFactory } from 'ethers'
import type { Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { type Address } from 'viem'

import merkleDistributorArtifact from '../artifacts/contracts/MerkleDistributor.sol/MerkleDistributor.json'
import merkleDistributorWithDeadlineArtifact from '../artifacts/contracts/MerkleDistributorWithDeadline.sol/MerkleDistributorWithDeadline.json'

chai.use(solidity)

const overrides = {
  gasLimit: 9999999,
}
const gasUsed = {
  MerkleDistributor: {
    twoAccountTree: 118751,
    largerTreeFirstClaim: 123473,
    largerTreeSecondClaim: 106391,
    realisticTreeGas: 137505,
    realisticTreeGasDeeperNode: 137429,
    realisticTreeGasAverageRandom: 104369,
    realisticTreeGasAverageFirst25: 88171,
  },
  MerkleDistributorWithDeadline: {
    twoAccountTree: 118833,
    largerTreeFirstClaim: 123567,
    largerTreeSecondClaim: 106391,
    realisticTreeGas: 137631,
    realisticTreeGasDeeperNode: 137571,
    realisticTreeGasAverageRandom: 104493,
    realisticTreeGasAverageFirst25: 88299,
  },
}

const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'

const deployContract = async (
  factory: ContractFactory,
  tokenAddress: string,
  merkleRoot: string,
  contractName: string,
  signerAddress: string
) => {
  let distributor
  const currentTimestamp = Math.floor(Date.now() / 1000)
  if (contractName === 'MerkleDistributorWithDeadline') {
    distributor = await factory.deploy(tokenAddress, merkleRoot, currentTimestamp + 31536000, signerAddress, overrides)
  } else {
    distributor = await factory.deploy(tokenAddress, merkleRoot, signerAddress, overrides)
  }
  return distributor
}

type ClaimArgs = {
  index: number
  account: string
  amount: number
  merkleProof: string[]
}

const buildClaimTxData = async (
  distributorContract: Contract,
  contractName: string,
  senderSigner: SignerWithAddress,
  txAuthSigner: SignerWithAddress,
  claimArgs: ClaimArgs
) => {
  const txAuthInput = {
    contractAbi: Array.from(
      contractName == 'MerkleDistributorWithDeadline'
        ? merkleDistributorWithDeadlineArtifact.abi
        : merkleDistributorArtifact.abi
    ),
    contractAddress: distributorContract.address as Address,
    functionName: 'claim',
    args: [claimArgs.index, claimArgs.account, claimArgs.amount, claimArgs.merkleProof],
    userAddress: senderSigner.address as Address,
  }

  const signatureResponse = await signTxAuthDataLibEthers(txAuthSigner as unknown as Wallet, txAuthInput)

  // Encoding the blockExpiration (uint256) and signature (bytes)
  const abiEncodedBlockExpiration = ethers.utils.hexZeroPad(
    ethers.BigNumber.from(signatureResponse.blockExpiration).toHexString(),
    32
  )

  const unsignedTx = await distributorContract.populateTransaction.claim(
    claimArgs.index,
    claimArgs.account,
    claimArgs.amount,
    claimArgs.merkleProof
  )

  // Complete data
  const txData = unsignedTx.data + abiEncodedBlockExpiration.slice(2) + signatureResponse.signature.slice(2)

  return txData
}

const claimWithSignature = async (
  distributorContract: Contract,
  contractName: string,
  senderSigner: SignerWithAddress,
  txAuthSigner: SignerWithAddress,
  claimArgs: ClaimArgs
) => {
  const txData = await buildClaimTxData(distributorContract, contractName, senderSigner, txAuthSigner, claimArgs)
  // Send tx
  return await senderSigner.sendTransaction({
    to: distributorContract.address,
    data: txData,
    gasLimit: 9999999,
  })
}

for (const contract of ['MerkleDistributor', 'MerkleDistributorWithDeadline'] as const) {
  describe(`${contract} tests`, () => {
    let mockToken: Contract
    let distributorFactory: ContractFactory
    let wallet0: SignerWithAddress
    let wallet1: SignerWithAddress
    let txSigner: SignerWithAddress
    let wallets: SignerWithAddress[]

    beforeEach(async () => {
      wallets = await ethers.getSigners()
      wallet0 = wallets[0]
      wallet1 = wallets[1]
      txSigner = wallets[2]
      const tokenFactory = await ethers.getContractFactory('TestERC20', wallet0)
      mockToken = await tokenFactory.deploy('Token', 'TKN', 0, overrides)

      distributorFactory = await ethers.getContractFactory(contract, wallet0)
    })

    describe('#token', () => {
      it('returns the token address', async () => {
        const distributor = await deployContract(
          distributorFactory,
          mockToken.address,
          ZERO_BYTES32,
          contract,
          txSigner.address
        )
        expect(await distributor.token()).to.eq(mockToken.address)
      })
    })

    describe('#merkleRoot', () => {
      it('returns the zero merkle root', async () => {
        const distributor = await deployContract(
          distributorFactory,
          mockToken.address,
          ZERO_BYTES32,
          contract,
          txSigner.address
        )
        expect(await distributor.merkleRoot()).to.eq(ZERO_BYTES32)
      })
    })

    describe('#claim', () => {
      it('fails for empty proof', async () => {
        const distributor = await deployContract(
          distributorFactory,
          mockToken.address,
          ZERO_BYTES32,
          contract,
          txSigner.address
        )
        await expect(
          claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 0,
            account: wallet0.address,
            amount: 10,
            merkleProof: [],
          })
        ).to.be.revertedWith('InvalidProof')
      })

      it('fails for invalid index', async () => {
        const distributor = await deployContract(
          distributorFactory,
          mockToken.address,
          ZERO_BYTES32,
          contract,
          txSigner.address
        )
        await expect(
          claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 0,
            account: wallet0.address,
            amount: 10,
            merkleProof: [],
          })
        ).to.be.revertedWith('InvalidProof')
      })
      /*
      describe.only('eligible contract (multisig or account abstraction support)', async () => {
        let distributor: Contract
        let tree: BalanceTree
        let mockClaimerContract: Contract
        let senderSigner: SignerWithAddress
        beforeEach('deploy', async () => {
          senderSigner = wallets[3]

          const claimerContractFactory = await ethers.getContractFactory('TestClaimerContract', wallet0)
          mockClaimerContract = await claimerContractFactory.deploy()

          tree = createBalanceTree({
            balances: [{ account: mockClaimerContract.address as Address, amount: BigInt(100) }],
          })
          distributor = await deployContract(
            distributorFactory,
            mockToken.address,
            tree.getHexRoot(),
            contract,
            txSigner.address
          )
          await mockToken.setBalance(distributor.address, 100)
        })

        it('successful contract claim', async () => {
          const proof = tree.getProof({
            index: BigInt(0),
            account: mockClaimerContract.address as Address,
            amount: BigInt(100),
          })
          const claimerTxCallData = await buildClaimTxData(distributor, contract, wallet0, txSigner, {
            index: 0,
            account: mockClaimerContract.address,
            amount: 100,
            merkleProof: proof,
          })
          const trx = mockClaimerContract.claim(distributor.address, claimerTxCallData)
          console.log('trx', await (await trx).wait())
          expect(trx).not.to.be.reverted
          //expect(await mockToken.balanceOf(mockClaimerContract.address)).to.eq(101)
        })
      })
*/
      describe('two account tree', () => {
        let distributor: Contract
        let tree: BalanceTree
        beforeEach('deploy', async () => {
          tree = createBalanceTree({
            balances: [
              { account: wallet0.address as Address, amount: BigInt(100) },
              { account: wallet1.address as Address, amount: BigInt(101) },
            ],
          })
          distributor = await deployContract(
            distributorFactory,
            mockToken.address,
            tree.getHexRoot(),
            contract,
            txSigner.address
          )
          await mockToken.setBalance(distributor.address, 201)
        })

        it('successful claim', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              account: wallet0.address,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          )
            .to.emit(distributor, 'Claimed')
            .withArgs(0, wallet0.address, 100)

          await expect(
            claimWithSignature(distributor, contract, wallet1, txSigner, {
              index: 1,
              account: wallet1.address,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(1),
                account: wallet1.address as Address,
                amount: BigInt(101),
              }),
            })
          )
            .to.emit(distributor, 'Claimed')
            .withArgs(1, wallet1.address, 101)
        })

        it('transfers the token', async () => {
          expect(await mockToken.balanceOf(wallet0.address)).to.eq(0)
          await claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 0,
            account: wallet0.address,
            amount: 100,
            merkleProof: tree.getProof({ index: BigInt(0), account: wallet0.address as Address, amount: BigInt(100) }),
          })
          expect(await mockToken.balanceOf(wallet0.address)).to.eq(100)
        })

        it('must have enough to transfer', async () => {
          await mockToken.setBalance(distributor.address, 99)
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              account: wallet0.address,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).to.be.revertedWith('ERC20: transfer amount exceeds balance')
        })

        it('sets #isClaimed', async () => {
          expect(await distributor.isClaimed(0)).to.eq(false)
          expect(await distributor.isClaimed(1)).to.eq(false)
          await claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 0,
            account: wallet0.address,
            amount: 100,
            merkleProof: tree.getProof({ index: BigInt(0), account: wallet0.address as Address, amount: BigInt(100) }),
          })
          expect(await distributor.isClaimed(0)).to.eq(true)
          expect(await distributor.isClaimed(1)).to.eq(false)
        })

        it('cannot allow two claims', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              account: wallet0.address,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).not.to.be.reverted
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              account: wallet0.address,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).to.be.revertedWith('AlreadyClaimed()')
        })

        it('cannot claim more than once: 0 and then 1', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              account: wallet0.address,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).not.to.be.reverted

          await expect(
            claimWithSignature(distributor, contract, wallet1, txSigner, {
              index: 1,
              account: wallet1.address,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(1),
                account: wallet1.address as Address,
                amount: BigInt(101),
              }),
            })
          ).not.to.be.reverted

          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              account: wallet0.address,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).to.be.revertedWith('AlreadyClaimed()')
        })

        it('cannot claim more than once: 1 and then 0', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet1, txSigner, {
              index: 1,
              account: wallet1.address,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(1),
                account: wallet1.address as Address,
                amount: BigInt(101),
              }),
            })
          ).not.to.be.reverted
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              account: wallet0.address,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).not.to.be.reverted

          await expect(
            claimWithSignature(distributor, contract, wallet1, txSigner, {
              index: 1,
              account: wallet1.address,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(1),
                account: wallet1.address as Address,
                amount: BigInt(101),
              }),
            })
          ).to.be.revertedWith('AlreadyClaimed()')
        })

        it('cannot claim for address other than proof', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet1, txSigner, {
              index: 1,
              account: wallet1.address,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).to.be.revertedWith('InvalidProof')
        })

        it('cannot claim more than proof', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              account: wallet0.address,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).to.be.revertedWith('InvalidProof')
        })

        it('cannot claim on behalf of another address', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 1,
              account: wallet1.address,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(1),
                account: wallet1.address as Address,
                amount: BigInt(101),
              }),
            })
          ).to.be.revertedWith('Unauthorized')
        })

        it('gas', async () => {
          const proof = tree.getProof({ index: BigInt(0), account: wallet0.address as Address, amount: BigInt(100) })
          const tx = await claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 0,
            account: wallet0.address,
            amount: 100,
            merkleProof: proof,
          })
          const receipt = await tx.wait()
          expect(receipt.gasUsed).to.be.lte(gasUsed[contract].twoAccountTree)
        })
      })

      describe('larger tree', () => {
        let distributor: Contract
        let tree: ReturnType<typeof createBalanceTree>
        beforeEach('deploy', async () => {
          tree = createBalanceTree({
            balances: wallets.map((wallet, ix) => {
              return { account: wallet.address as Address, amount: BigInt(ix + 1) }
            }),
          })
          distributor = await deployContract(
            distributorFactory,
            mockToken.address,
            tree.getHexRoot(),
            contract,
            txSigner.address
          )
          await mockToken.setBalance(distributor.address, 201)
        })

        it('claim index 4', async () => {
          const proof = tree.getProof({ index: BigInt(4), account: wallets[4].address as Address, amount: BigInt(5) })
          await expect(
            claimWithSignature(distributor, contract, wallets[4], txSigner, {
              index: 4,
              account: wallets[4].address,
              amount: 5,
              merkleProof: proof,
            })
          )
            .to.emit(distributor, 'Claimed')
            .withArgs(4, wallets[4].address, 5)
        })

        it('claim index 9', async () => {
          const proof = tree.getProof({ index: BigInt(9), account: wallets[9].address as Address, amount: BigInt(10) })
          await expect(
            claimWithSignature(distributor, contract, wallets[9], txSigner, {
              index: 9,
              account: wallets[9].address,
              amount: 10,
              merkleProof: proof,
            })
          )
            .to.emit(distributor, 'Claimed')
            .withArgs(9, wallets[9].address, 10)
        })

        it('gas', async () => {
          const proof = tree.getProof({ index: BigInt(9), account: wallets[9].address as Address, amount: BigInt(10) })
          const tx = await claimWithSignature(distributor, contract, wallets[9], txSigner, {
            index: 9,
            account: wallets[9].address,
            amount: 10,
            merkleProof: proof,
          })
          const receipt = await tx.wait()
          expect(receipt.gasUsed).to.be.lte(gasUsed[contract].largerTreeFirstClaim)
        })

        it('gas second down about 15k', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallets[0], txSigner, {
              index: 0,
              account: wallets[0].address,
              amount: 1,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallets[0].address as Address,
                amount: BigInt(1),
              }),
            })
          ).not.to.be.reverted
          const tx = await claimWithSignature(distributor, contract, wallets[1], txSigner, {
            index: 1,
            account: wallets[1].address,
            amount: 2,
            merkleProof: tree.getProof({ index: BigInt(1), account: wallets[1].address as Address, amount: BigInt(2) }),
          })
          const receipt = await tx.wait()
          expect(receipt.gasUsed).to.be.lte(gasUsed[contract].largerTreeSecondClaim)
        })
      })

      describe('realistic size tree', () => {
        let distributor: Contract
        let tree: ReturnType<typeof createBalanceTree>
        const NUM_LEAVES = 100_000
        const NUM_SAMPLES = 25

        beforeEach('deploy', async () => {
          const elements: { account: Address; amount: bigint }[] = []
          for (let i = 0; i < NUM_LEAVES; i++) {
            const node = { account: wallet0.address as Address, amount: BigInt(100) }
            elements.push(node)
          }
          tree = createBalanceTree({ balances: elements })
          distributor = await deployContract(
            distributorFactory,
            mockToken.address,
            tree.getHexRoot(),
            contract,
            txSigner.address
          )
          await mockToken.setBalance(distributor.address, constants.MaxUint256)
        })

        it('proof verification works', () => {
          const root = Buffer.from(tree.getHexRoot().slice(2), 'hex')
          for (let i = 0; i < NUM_LEAVES; i += NUM_LEAVES / NUM_SAMPLES) {
            const proof = tree
              .getProof({ index: BigInt(i), account: wallet0.address as Address, amount: BigInt(100) })
              .map((el) => Buffer.from(el.slice(2), 'hex'))
            const validProof = verifyProof({
              index: BigInt(i),
              account: wallet0.address as Address,
              amount: BigInt(100),
              proof,
              root,
            })
            expect(validProof).to.be.true
          }
        })

        it('gas', async () => {
          const proof = tree.getProof({
            index: BigInt(50000),
            account: wallet0.address as Address,
            amount: BigInt(100),
          })
          const tx = await claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 50000,
            account: wallet0.address,
            amount: 100,
            merkleProof: proof,
          })
          const receipt = await tx.wait()
          expect(receipt.gasUsed).to.be.lte(gasUsed[contract].realisticTreeGas)
        })
        it('gas deeper node', async () => {
          const tx = await claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 90000,
            account: wallet0.address,
            amount: 100,
            merkleProof: tree.getProof({
              index: BigInt(90000),
              account: wallet0.address as Address,
              amount: BigInt(100),
            }),
          })
          const receipt = await tx.wait()
          expect(receipt.gasUsed).to.be.lte(gasUsed[contract].realisticTreeGasDeeperNode)
        })
        it('gas average random distribution', async () => {
          let total: BigNumber = BigNumber.from(0)
          let count: number = 0
          for (let i = 0; i < NUM_LEAVES; i += NUM_LEAVES / NUM_SAMPLES) {
            const proof = tree.getProof({ index: BigInt(i), account: wallet0.address as Address, amount: BigInt(100) })
            const tx = await claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: i,
              account: wallet0.address,
              amount: 100,
              merkleProof: proof,
            })
            const receipt = await tx.wait()
            total = total.add(receipt.gasUsed)
            count++
          }
          const average = total.div(count)
          expect(average).to.be.lte(gasUsed[contract].realisticTreeGasAverageRandom)
        })
        // this is what we gas golfed by packing the bitmap
        it('gas average first 25', async () => {
          let total: BigNumber = BigNumber.from(0)
          let count: number = 0
          for (let i = 0; i < 25; i++) {
            const proof = tree.getProof({ index: BigInt(i), account: wallet0.address as Address, amount: BigInt(100) })
            const tx = await claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: i,
              account: wallet0.address,
              amount: 100,
              merkleProof: proof,
            })
            const receipt = await tx.wait()
            total = total.add(receipt.gasUsed)
            count++
          }
          const average = total.div(count)
          expect(average).to.be.lte(gasUsed[contract].realisticTreeGasAverageFirst25)
        })

        it('no double claims in random distribution', async () => {
          for (let i = 0; i < 25; i += Math.floor(Math.random() * (NUM_LEAVES / NUM_SAMPLES))) {
            const proof = tree.getProof({ index: BigInt(i), account: wallet0.address as Address, amount: BigInt(100) })
            await claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: i,
              account: wallet0.address,
              amount: 100,
              merkleProof: proof,
            })
            await expect(
              claimWithSignature(distributor, contract, wallet0, txSigner, {
                index: i,
                account: wallet0.address,
                amount: 100,
                merkleProof: proof,
              })
            ).to.be.revertedWith('AlreadyClaimed()')
          }
        })
      })

      describe('parseBalanceMap', () => {
        let distributor: Contract
        let claims: {
          [account: string]: {
            index: number
            amount: string
            proof: string[]
          }
        }
        beforeEach('deploy', async () => {
          const {
            claims: innerClaims,
            merkleRoot,
            tokenTotal,
          } = parseBalanceMap({
            balances: [
              { address: wallet0.address as Address, earnings: '200', reasons: '' },
              { address: wallet1.address as Address, earnings: '300', reasons: '' },
              { address: wallets[2].address as Address, earnings: '250', reasons: '' },
            ],
          })
          expect(tokenTotal).to.eq('0x02ee') // 750
          claims = innerClaims
          distributor = await deployContract(
            distributorFactory,
            mockToken.address,
            merkleRoot,
            contract,
            txSigner.address
          )
          await mockToken.setBalance(distributor.address, tokenTotal)
        })

        it('check the proofs is as expected', () => {
          expect(claims).to.deep.eq({
            [wallet0.address]: {
              index: 2,
              amount: '0xc8',
              proof: [
                '0x0782528e118c4350a2465fbeabec5e72fff06991a29f21c08d37a0d275e38ddd',
                '0xf3c5acb53398e1d11dcaa74e37acc33d228f5da944fbdea9a918684074a21cdb',
              ],
            },
            [wallet1.address]: {
              index: 1,
              amount: '0x12c',
              proof: [
                '0xc86fd316fa3e7b83c2665b5ccb63771e78abcc0429e0105c91dde37cb9b857a4',
                '0xf3c5acb53398e1d11dcaa74e37acc33d228f5da944fbdea9a918684074a21cdb',
              ],
            },
            [wallets[2].address]: {
              index: 0,
              amount: '0xfa',
              proof: ['0x0c9bcaca2a1013557ef7f348b514ab8a8cd6c7051b69e46b1681a2aff22f4a88'],
            },
          })
        })

        it('all claims work exactly once', async () => {
          for (let account in claims) {
            const claim = claims[account]
            const accountWallet = wallets.find((w) => w.address === account)
            if (!accountWallet) {
              throw new Error('Account not found')
            }
            await expect(
              claimWithSignature(distributor, contract, accountWallet, txSigner, {
                index: claim.index,
                account,
                amount: parseInt(claim.amount, 16),
                merkleProof: claim.proof,
              })
            )
              .to.emit(distributor, 'Claimed')
              .withArgs(claim.index, account, claim.amount)
            await expect(
              claimWithSignature(distributor, contract, accountWallet, txSigner, {
                index: claim.index,
                account,
                amount: parseInt(claim.amount, 16),
                merkleProof: claim.proof,
              })
            ).to.be.revertedWith('AlreadyClaimed()')
          }
          expect(await mockToken.balanceOf(distributor.address)).to.eq(0)
        })
      })
    })
  })
}

describe('#MerkleDistributorWithDeadline', () => {
  let token: Contract
  let wallet0: SignerWithAddress
  let wallet1: SignerWithAddress
  let txSigner: SignerWithAddress
  let wallets: SignerWithAddress[]
  let distributor: Contract
  let tree: ReturnType<typeof createBalanceTree>
  let currentTimestamp = Math.floor(Date.now() / 1000)

  beforeEach('deploy', async () => {
    wallets = await ethers.getSigners()
    wallet0 = wallets[0]
    wallet1 = wallets[1]
    txSigner = wallets[2]
    const tokenFactory = await ethers.getContractFactory('TestERC20', wallet0)
    token = await tokenFactory.deploy('Token', 'TKN', 0, overrides)
    tree = createBalanceTree({
      balances: [
        { account: wallet0.address as Address, amount: BigInt(100) },
        { account: wallet1.address as Address, amount: BigInt(101) },
      ],
    })
    const merkleDistributorWithDeadlineFactory = await ethers.getContractFactory(
      'MerkleDistributorWithDeadline',
      wallet0
    )
    // Set the endTime to be 1 year after currentTimestamp
    distributor = await merkleDistributorWithDeadlineFactory.deploy(
      token.address,
      tree.getHexRoot(),
      currentTimestamp + 31536000,
      txSigner.address,
      overrides
    )
    await token.setBalance(distributor.address, 201)
  })

  it('successful claim', async () => {
    await expect(
      claimWithSignature(distributor, 'MerkleDistributorWithDeadline', wallet0, txSigner, {
        index: 0,
        account: wallet0.address,
        amount: 100,
        merkleProof: tree.getProof({ index: BigInt(0), account: wallet0.address as Address, amount: BigInt(100) }),
      })
    )
      .to.emit(distributor, 'Claimed')
      .withArgs(0, wallet0.address, 100)
  })

  it('only owner can withdraw', async () => {
    distributor = distributor.connect(wallet1)
    await expect(distributor.withdraw(overrides)).to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('cannot withdraw during claim window', async () => {
    await expect(distributor.withdraw(overrides)).to.be.revertedWith('NoWithdrawDuringClaim()')
  })

  it('cannot claim after end time', async () => {
    const oneSecondAfterEndTime = currentTimestamp + 31536001
    await ethers.provider.send('evm_mine', [oneSecondAfterEndTime])
    currentTimestamp = oneSecondAfterEndTime
    await expect(
      claimWithSignature(distributor, 'MerkleDistributorWithDeadline', wallet0, txSigner, {
        index: 0,
        account: wallet0.address,
        amount: 100,
        merkleProof: tree.getProof({ index: BigInt(0), account: wallet0.address as Address, amount: BigInt(100) }),
      })
    ).to.be.revertedWith('ClaimWindowFinished()')
  })

  it('can withdraw after end time', async () => {
    const oneSecondAfterEndTime = currentTimestamp + 31536001
    await ethers.provider.send('evm_mine', [oneSecondAfterEndTime])
    currentTimestamp = oneSecondAfterEndTime
    expect(await token.balanceOf(wallet0.address)).to.eq(0)
    await distributor.withdraw(overrides)
    expect(await token.balanceOf(wallet0.address)).to.eq(201)
  })

  it('only owner can withdraw even after end time', async () => {
    const oneSecondAfterEndTime = currentTimestamp + 31536001
    await ethers.provider.send('evm_mine', [oneSecondAfterEndTime])
    distributor = distributor.connect(wallet1)
    await expect(distributor.withdraw(overrides)).to.be.revertedWith('Ownable: caller is not the owner')
  })
})
