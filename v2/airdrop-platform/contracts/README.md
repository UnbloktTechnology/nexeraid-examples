# nexera-id-kyc-airdrop

## How to use this

1. Clone <https://github.com/NexeraProtocol/nexera-id-kyc-airdrop>
2. Replace `inputFiles/listInput.csv` with your CSV file of addresses with corresponding amounts
3. Add your networks to hardhat.config.ts and package.json like we did for Sepolia and Amoy
4. Set up env
  a. DEPLOYMENT_MNEMONIC with your deployment mnemonic
  b. TX_SIGNER_ADDRESS with our prod signing address: "0x03DF23c4dEA7B52Daf9B7920Ec6CFeDFFA691689"
  c. set DEPLOY_ROOT to "local" to use your input allowList
  d. add rpc providers url such as AMOY_PROVIDER_URL or SEPOLIA_PROVIDER_URL
5. Run deployment command `yarn deploy-{nameOfNetwork}` as shown in package.json
6. Use the generated file `./outputFiles/allowListObj.json` in your front end to generate merkle proofs to claim tokens, as per shown in our example (the order of the keys matter in this case).

## Local Development

The following assumes the use of `node@>=10`.

### Install Dependencies

`yarn`

### Compile Contracts

`yarn compile`

### Run Tests

`yarn test`

## Deployments

Run `yarn deploy-polygonAmoy`or `yarn deploy-sepolia`

### Amoy

**Live**

Example token deployed at 0x4Ae0B2Ed56b681ABcfb19A6aAAb921b35b531276

merkleDistributor deployed at 0x3d95361Fa0d4E83Ac553b359197748baA1226307

**Local Testing**

Example token deployed at 0x20487A4F07B733f6Ed4DCF61AceEC0D647c521eC

merkleDistributor deployed at 0x3703eF2fF956E80a4392Cd53dB1880891075B364

### Sepolia

**Live**

Example token deployed at 0x48182d21869b874BabdeCC0851dDA4F89B18a687

merkleDistributor deployed at 0x96caF7D5DD0304976A070804074E453887BE509c

**Local Testing**

Example token deployed at 0x77DEBBF6Bb3A1F899333ef096217505DDC80433c

merkleDistributor deployed at 0x130089FD95cD9Ff9119d0Df3afdbC6dA1bB87045
