# NexeraID KYC-SDK

This repo shows how to use a NexeraID KYC-SDK

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. First, install with `npm`:

```bash
npm i
```

2. Set environments like `.env.example` in your `.env.local`

3. Be sure that you have `Metamask` or `Coinbase` on your Browser.

4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:3006](http://localhost:3006) with your browser to see the result.

6. You could go through "Get Started with KYC Flow" or visit directly [http://localhost:3006/client](http://localhost:3006/client)

## KYC FLOW

1. Let's start the KYC flow by connecting to a supported wallet.

2. Await until the connection process starts.

3. Sign the KYC Client initialization.

4. Let the signing end to press the button `Start KYC`

5. Upload your passport

6. Either upload a passport from your Local machine (find some dummy passports in the `resources` folder)

7. Scan your passport using a mobile phone

8. See the results VCs shared with your application

9. See the Rule invocation results

## Project Structure

1. Remember that in the `.env.example` you will find the `NEXT_PUBLIC_ENVIROMENT` to configure depending on `src/config/config.json` environment that you require

2. The Access Token call is provided by the endpoint in `pages/api/access_token`

3. The SDK of KYC Client is initialized in `pages/client/component`

4. The KYC Client binding button is placed on `pages/client/component`
