import { createMerkleTree } from './merkle-tree'
import { encodePacked, keccak256, type Address } from 'viem'

export function createBalanceTree(props: { balances: { account: Address; amount: bigint }[] }) {
  const tree = createMerkleTree({
    elements: props.balances.map(({ account, amount }, index) => {
      return toNode({ index: BigInt(index), account, amount })
    }),
  })

  function getHexRoot() {
    return tree.getHexRoot()
  }

  function getProof(props: { index: bigint; account: Address; amount: bigint }) {
    return tree.getHexProof({ el: toNode(props) })
  }

  return {
    getHexRoot,
    getProof,
  }
}

export function verifyProof(props: {
  index: bigint
  account: Address
  amount: bigint
  proof: Buffer[]
  root: Buffer
}): boolean {
  let pair = toNode(props)
  for (const item of props.proof) {
    pair = combinedHash({ first: pair, second: item })
  }

  return pair.equals(props.root)
}

// keccak256(abi.encode(index, account, amount))
function toNode(props: { index: bigint; account: Address; amount: bigint }): Buffer {
  return Buffer.from(
    keccak256(
      encodePacked(['uint256', 'address', 'uint256'], [props.index, props.account, props.amount])
    ).slice(2),
    'hex'
  )
}

function combinedHash(props: { first: Buffer; second: Buffer }): Buffer {
  if (!props.first) {
    return props.second
  }
  if (!props.second) {
    return props.first
  }

  return Buffer.from(
    keccak256(sortAndConcat(props.first, props.second)).slice(2),
    'hex'
  )
}

function sortAndConcat(...args: Buffer[]): Buffer {
  return Buffer.concat([...args].sort(Buffer.compare))
}
