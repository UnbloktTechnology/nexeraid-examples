import BalanceTree from './balance-tree'
import { getAddress, isAddress, toHex } from 'viem'

// This is the blob that gets distributed and pinned to IPFS.
// It is completely sufficient for recreating the entire merkle tree.
// Anyone can verify that all air drops are included in the tree,
// and the tree has no additional distributions.
interface MerkleDistributorInfo {
  merkleRoot: string
  tokenTotal: string
  claims: {
    [account: string]: {
      index: number
      amount: string
      proof: string[]
      flags?: {
        [flag: string]: boolean
      }
    }
  }
}

type OldFormat = { [account: string]: number | string }
type NewFormat = { address: string; earnings: string; reasons: string }

export function parseBalanceMap(balances: OldFormat | NewFormat[]): MerkleDistributorInfo {
  // if balances are in an old format, process them
  const balancesInNewFormat: NewFormat[] = Array.isArray(balances)
    ? balances
    : Object.keys(balances).map(
      (account): NewFormat => ({
        address: account,
        earnings: toHex(BigInt(balances[account])),
        reasons: '',
      })
    )

  const dataByAddress = balancesInNewFormat.reduce<{
    [address: string]: { amount: bigint; flags?: { [flag: string]: boolean } }
  }>((memo, { address: account, earnings, reasons }) => {
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

  const treeInput = sortedAddresses.map((address) => ({ account: getAddress(address), amount: dataByAddress[address].amount }))

  // construct a tree
  const tree = new BalanceTree(treeInput)

  // generate claims
  const claims = sortedAddresses.reduce<{
    [address: string]: { amount: string; index: number; proof: string[]; flags?: { [flag: string]: boolean } }
  }>((memo, address, index) => {
    const { amount, flags } = dataByAddress[address]
    memo[address] = {
      index,
      amount: toHex(amount),
      proof: tree.getProof(BigInt(index), getAddress(address), amount),
      ...(flags ? { flags } : {}),
    }
    return memo
  }, {})

  const tokenTotal: bigint = sortedAddresses.reduce<bigint>(
    (memo, key) => memo + dataByAddress[key].amount,
    BigInt(0)
  )

  return {
    merkleRoot: tree.getHexRoot(),
    tokenTotal: `0x${tokenTotal.toString(16).padStart(4, '0')}`, // Ensure at least 4 characters (2 bytes) with leading zeros
    claims,
  }
}
