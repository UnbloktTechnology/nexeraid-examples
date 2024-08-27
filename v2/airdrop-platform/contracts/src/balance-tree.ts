import MerkleTree from './merkle-tree'
import { encodePacked, keccak256, type Address } from 'viem'
export default class BalanceTree {
  private readonly tree: MerkleTree
  constructor(balances: { account: Address; amount: bigint }[]) {
    this.tree = new MerkleTree(
      balances.map(({ account, amount }, index) => {
        return BalanceTree.toNode(BigInt(index), account, amount)
      })
    )
  }

  public static verifyProof(
    index: bigint,
    account: Address,
    amount: bigint,
    proof: Buffer[],
    root: Buffer
  ): boolean {
    let pair = BalanceTree.toNode(index, account, amount)
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item)
    }

    return pair.equals(root)
  }

  // keccak256(abi.encode(index, account, amount))
  public static toNode(index: bigint, account: Address, amount: bigint): Buffer {
    return Buffer.from(
      keccak256(encodePacked(['uint256', 'address', 'uint256'], [index, account, amount])).slice(2),
      'hex'
    )
  }

  public getHexRoot(): string {
    return this.tree.getHexRoot()
  }

  // returns the hex bytes32 values of the proof
  public getProof(index: bigint, account: Address, amount: bigint): string[] {
    return this.tree.getHexProof(BalanceTree.toNode(index, account, amount))
  }
}
