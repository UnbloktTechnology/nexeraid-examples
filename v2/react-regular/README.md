
NexeraID widget integration example : for React in regular mode. 
===========================================================

This example demonstrates how to integrate the NexeraID Widget for KYC (Know Your Customer) and KYB (Know Your Business) processes. In this implementation, we uses react and a customer ID. 

## pre-requisite :

To run this example dApp, you need:
	•	Access to the NexeraID dashboard with an API key.
	•	A workflow set up in your workspace.
	•	To authenticate a user before opening a NexeraID session and be able to provide a unique ID for this user (such as an email address or any other ID).


## running the sample :

1. Install dependencies for frontend and backend :

~~~~

cd nexeraid-examples/v2/react-regular/frontend 
npm install
cd ../backend
npm install

~~~~

2) Copy .env.example and rename it to .env :

~~~~

cp .env.example .env 

~~~~

3) Fill out all required variables in the .env file.

4) Start the servers.

~~~~

npm start
cd ../frontend
npm dev

~~~~

## For more details, visit : 

SDKs documentation : https://docs.Nexera.id/developing/sdk/
NexeraID KYC/KYB documentation : https://docs.Nexera.id/usescases/
NexeraID technical documentation :   https://docs.Nexera.id/developing

## Credits :

This is a [NexeraID] (https://Nexera.id)+ [React](https://react.dev/) project