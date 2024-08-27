import * as fs from 'fs'

require('dotenv').config()
import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'

interface MerkleData {
  merkleRoot: string
}

export const getLocalMerkleRoot = () => {
  // Read the JSON file
  const data = fs.readFileSync('./outputFiles/merkle.json', 'utf-8')

  // Parse the JSON data
  const jsonData: MerkleData = JSON.parse(data)

  // Extract the merkleRoot and assign it to the constant root
  const root = jsonData.merkleRoot

  // Log the result (or use it in your application)
  console.log('Merkle Root:', root)
  return root
}

export const getTotalDistributionAmount = () => {
  // Read the JSON file
  const data = fs.readFileSync('./outputFiles/allowListObj.json', 'utf-8')

  // Parse the JSON data
  const jsonData: { [key: string]: number } = JSON.parse(data)

  // Sum all amounts
  let sum = 0
  Object.values(jsonData).forEach((amount) => {
    sum += amount
  })
  return sum
}

async function main() {
  // Deploy example token
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const token = await tokenFactory.deploy('AidropToken', 'ATKN', 0)
  console.log(`Example token deployed at ${token.address}`)

  // Deploy Merkle Distributor
  console.log('inputs for merkleDistributor: ', token.address, process.env.DEPLOY_ROOT, process.env.TX_SIGNER_ADDRESS)
  const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor')
  const merkleDistributor = await MerkleDistributor.deploy(
    token.address,
    process.env.DEPLOY_ROOT === 'local' || process.env.DEPLOY_ROOT === undefined
      ? getLocalMerkleRoot()
      : process.env.DEPLOY_ROOT,
    process.env.TX_SIGNER_ADDRESS
  )
  await merkleDistributor.deployed()
  console.log(`merkleDistributor deployed at ${merkleDistributor.address}`)

  // set Balance for distributor to a million
  const distributorInitBalance = process.env.DISTRIBUTOR_INIT_BALANCE ?? getTotalDistributionAmount()
  await token.setBalance(merkleDistributor.address, distributorInitBalance)
  console.log(`Set Distributor balance to ${distributorInitBalance}`)

  // Save deployed addresses in the outputFiles
  fs.writeFileSync(
    `outputFiles/deployment-${new Date().toISOString()}.json`,
    JSON.stringify({ tokenAddress: token.address, merkleDistributorAddress: merkleDistributor.address })
  )
}

main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  })
