import { createBalanceTree } from './balance-tree'
import { getAddress, isAddress, toHex } from 'viem'

// This is the blob that gets distributed and pinned to IPFS.
// It is completely sufficient for recreating the entire merkle tree.
// Anyone can verify that all air drops are included in the tree,
// and the tree has no additional distributions.
interface MerkleDistributorInfo {
  merkleRoot: string
  tokenTotal: string
  claims: Record<string, {
    index: number
    amount: string
    proof: (string | undefined)[]
    flags?: Record<string, boolean>
  }>
}

type OldFormat = Record<string, number | string>
type NewFormat = { address: string; earnings: string; reasons: string }

export function parseBalanceMap(balances: OldFormat | NewFormat[]): MerkleDistributorInfo {
  // if balances are in an old format, process them
  const balancesInNewFormat: NewFormat[] = Array.isArray(balances)
    ? balances
    : Object.keys(balances).map(
      (account): NewFormat => ({
        address: account,
        earnings: toHex(BigInt(balances[account] ?? 0)),
        reasons: '',
      })
    )

  const dataByAddress = balancesInNewFormat.reduce<Record<string, { amount: bigint; flags?: Record<string, boolean> }>>((memo, { address: account, earnings, reasons }) => {
    if (!isAddress(account)) {
      throw new Error(`Found invalid address: ${account}`)
    }
    const parsed = getAddress(account)
    if (memo[parsed]) throw new Error(`Duplicate address: ${parsed}`)
    const parsedNum = BigInt(earnings)
    if (parsedNum <= 0) throw new Error(`Invalid amount for account: ${account}`)

    const flags = {
      isSOCKS: reasons.includes('socks'),
      isLP: reasons.includes('lp'),
      isUser: reasons.includes('user'),
    }

    memo[parsed] = { amount: parsedNum, ...(reasons === '' ? {} : { flags }) }
    return memo
  }, {})

  const sortedAddresses = Object.keys(dataByAddress).sort()

  const treeInput = sortedAddresses.map((address) => ({ account: getAddress(address), amount: dataByAddress[address]?.amount ?? BigInt(0) }))

  // construct a tree
  const tree = createBalanceTree({ balances: treeInput })

  // generate claims
  const claims = sortedAddresses.reduce<Record<string, { amount: string; index: number; proof: (string | undefined)[]; flags?: Record<string, boolean> }>>((memo, address, index) => {
    const data = dataByAddress[address]
    if (!data) return memo
    const { amount, flags } = data
    memo[address] = {
      index,
      amount: toHex(amount),
      proof: tree.getProof({ index: BigInt(index), account: getAddress(address), amount }),
      ...(flags ? { flags } : {}),
    }
    return memo
  }, {})

  const tokenTotal: bigint = sortedAddresses.reduce<bigint>(
    (memo, key) => memo + (dataByAddress[key]?.amount ?? BigInt(0)),
    BigInt(0)
  )

  return {
    merkleRoot: tree.getHexRoot(),
    tokenTotal: `0x${tokenTotal.toString(16).padStart(4, '0')}`, // Ensure at least 4 characters (2 bytes) with leading zeros
    claims,
  }
}
