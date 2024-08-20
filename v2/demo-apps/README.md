# Example apps

This repo contains several example apps that illustrate how to use the NexeraID Identity SDK. You can safely interact with them to get to know NexeraID. There are live versions of the apps on <https://examples.nexera.id>.

* Compliant Uniswap: An example DeFi app that requires signer interaction with the NexeraID Identity SDK, and has an example swapping process.
* Gated Uniswap: An example DeFi app that requires signer interaction with the NexeraID Identity SDK, and has an example swapping process. Off-chain verification.
* Banking:  An example bank app that does not require signer interaction with the NexeraID Identity SDK.
* Web3 Banking: An example Web3 bank app that requires signer interaction with the NexeraID Identity SDK.
* KYC: A simple KYC example flow, using the NexeraID Identity SDK.
* Gated Aave: Aave-cloned interface to demonstrate the KYC Identity Flow in a Web3 interface and interaction, and a whitelisted custom verification.

Follow these steps to run the example apps locally.

1. Copy `example-apps/.env.local` to `example-apps/.env`.

2. Edit `example-apps/.env` as described in the following table.

   | Variable                              | Description                                    |
   |---------------------------------------|------------------------------------------------|
   | `NODE_ENV`                            | Set to `production`                            |
   | `NEXT_PUBLIC_ENVIRONMENT`             | Set to `prod`                                  |
   | `UPSTASH_REDIS_REST_TOKEN`            | The token for the Upstash Redis REST API       |
   | `UPSTASH_REDIS_REST_URL`              | The URL of the Upstash Redis REST API          |
   | `NEXERA_ID_API_KEY_BANK`              | NexeraID API key for the banking app           |
   | `NEXERA_ID_WORKFLOW_ID_BANK`          | NexeraID workflow ID for the banking app       |
   | `NEXERA_ID_API_KEY_BANK_WEB3`         | NexeraID API key for the Web3 banking app      |
   | `NEXERA_ID_WORKFLOW_ID_BANK_WEB3`     | NexeraID workflow ID for the Web3 banking app  |
   
   | `NEXERA_ID_API_KEY_DEFI_RULE_ENGINE`  | NexeraID API key for the compliant Uniswap app |
   | `NEXERA_ID_API_KEY_AIRDROP`           | NexeraID API key for kyc airdrop app           |
   | `NEXERA_ID_API_KEY_DEFI_OFFCHAIN_ZKP` | NexeraID API key for the gated Uniswap app     |
   | `NEXERA_ID_API_KEY_BANK_WEB3`         | NexeraID key for the Web3 banking app          |
   | `NEXERA_ID_API_KEY_KYC`               | NexeraID API key for the KYC app               |
   | `NEXERA_ID_API_KEY_BANK_SYGNUM_WEB3`  | NexeraID API key for the Sygnum Web3 app       |

   You can get the NexeraID API keys for your apps by following the instructions on [Deploying the NexeraID Identity Widget](../using/setup/application.md#deploying-the-nexeraid-identity-widget). You need to set each of the `API_KEY` variables, even if you only want to use one of the example apps. If necessary, you can set them all to the same value.

   You can get the values for `UPSTASH_REDIS_REST_TOKEN` and `UPSTASH_REDIS_REST_URL` from <https://console.upstash.com/redis/>.

   :::note
   For more information about these variables, see `example-apps/src/env.mjs`.
   :::

3. Run `npm install` in `example-apps`.

4. Run `npm run dev` in `example-apps`.

The example apps can now be accessed at <http://localhost:3020>.

For instructions on running the gated Aave app, see [its dedicated README](../example-aave/README.md)
