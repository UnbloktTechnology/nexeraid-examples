# NexeraID KYC-SDK

This repo shows how to use a NexeraID KYC-SDK to integrate a KYC flow in your application. 
This example uses Nextjs and React.

## Getting Started

1. First, install with `npm`:

```bash
npm i
```

2. Set environments like `.env.example` in your `.env.local`

3. Be sure that you have `Metamask` on your Browser.

4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:3006](http://localhost:3006) with your browser to see the result.

6. You could go through "Get Started with KYC Flow" or visit directly [http://localhost:3006/client](http://localhost:3006/client)

## KYC FLOW

1. Let's start the KYC flow by connecting to a supported wallet.

2. Be sure that you're connected to `Mumbai` testnet on your wallet, if not, add the network to your wallet with: [ChainList Mumbai](https://chainlist.org/chain/80001)

3. Await until the connection process starts.

4. Sign the KYC Client initialization.

5. Let the signing end to press the button `Start KYC`

6. Upload your passport

7. Either upload a passport from your Local machine (find some dummy passports in the `resources` folder)

8. Scan your passport using a mobile phone

9. See the results VCs shared with your application

10. See the Rule invocation results

## Project Structure

1. Remember that in the `.env.example` you will find the `NEXT_PUBLIC_ENVIRONMENT` to configure depending on [appConfig.ts](src/appConfig.ts) environment that you require

2. The Access Token call is provided by the endpoint in [src/pages/api/access_token](src/pages/api/access_token.tsx)

3. The SDK of KYC Client is initialized in [src/features/client/KYCFlow.tsx](src/features/kyc/KYCFlow.tsx)

4. The KYC Client binding button is placed on [src/features/kyc/Client.tsx](src/features/kyc/Client.tsx)
