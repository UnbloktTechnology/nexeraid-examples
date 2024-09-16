
Compilot widget integration example : for Next.JS and Web3. 
===========================================================

This example demonstrates how to integrate the Compilot Widget for KYC (Know Your Customer) and KYB (Know Your Business) processes. In this implementation, the widget initialization requires a wallet signature. For this example, we’ve used RainbowKit for wallet management. However, note that RainbowKit is not a project dependency and the Compilot widget is compatible with any wallet adapter of your choice.

## pre-requisite :

To run this example dApp, you need:
	•	Access to the Compilot dashboard with an API key.
	•	A workflow set up in your workspace.


## running the sample :

1. Install dependencies:

~~~~

npm install

~~~~

2) Copy .env.example and rename it to .env :

~~~~

cp .env.example .env 

~~~~

3) Fill out all required variables in the .env file.

4) Start the server.

~~~~

npm dev

~~~~

## For more details, visit : 

SDKs documentation : https://docs.compilot.io/developing/sdk/
Compilot KYC/KYB documentation : https://docs.compilot.io/usescases/
Compilot technical documentation :   https://docs.compilot.io/developing

## Credits :

This is a [Compilot] (https://compilot.io)+ [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped using [`create-rainbowkit`](/packages/create-rainbowkit).