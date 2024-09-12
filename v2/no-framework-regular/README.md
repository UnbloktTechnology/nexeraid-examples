This is an example of NexeraID (https://nexera.id) integration : it's a JS based project running in regular mode (users do not need a wallet to pass a kyc)

To run this example : 

1) install all dependencies using npm,yarn or pnpm
2) copy backend/.env.example and rename it to .env
3) give a value to :

API_KEY=
API_KEY is your Nexera API key. it can be found in you NexeraID Dashboard, in settings/api . 
REGULAR_WORKFLOW_ID=
REGULAR_WORKFLOW_ID is the workflow id you want to connect to. It can be found in you NexeraID Dashboard, in settings/workflows. 
CUSTOMER_ID=
Any unique identifier to represent a customer. when integrating the sdk in a live context, it is expected that this value is replaced by a dynamic customer ID value.
WEBHOOK_SECRET=
WEBHOOK_SECRET is found in settings/webhooks.

4) start the backend server using npm yarn or pnpm.
5) start the frontend server using npm yarn or pnpm.
