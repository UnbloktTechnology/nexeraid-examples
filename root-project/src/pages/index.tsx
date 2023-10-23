import Head from "next/head";
import AppCard, { type AppCardProps } from "../features/root/AppCard";
import { appConfig } from "../appConfig";
import { env } from "@/env.mjs";

const PROJECTS: AppCardProps[] = [
  {
    url: "/defi-rule-engine",
    name: "Compliant Uniswap",
    image: "/images/defi.png",
    tags: ["VC verification", "Off-chain verification", "External wallet"],
  },
  {
    url: "/defi-offchain-zkp",
    name: "Gated Uniswap",
    image: "/images/defi.png",
    tags: ["ZKP verification", "Off-chain verification", "External wallet"],
  },
  {
    url: "/bank",
    name: "Banking",
    image: "/images/bank.png",
    tags: ["VC verification", "Off-chain verification", "Abstracted signer"],
  },
  {
    url: "/bank-web3",
    name: "Banking Web3",
    image: "/images/bank-web3.png",
    tags: ["VC verification", "Off-chain verification", "External wallet"],
  },
  {
    url: "/kyc",
    name: "KYC",
    image: "/images/kyc.webp",
  },
  {
    url: appConfig[env.NEXT_PUBLIC_ENVIRONMENT].aaveDemo,
    name: "Gated Aave",
    image: "/images/aave.svg",
    tags: ["ZKP verification", "On-chain verification", "External wallet"],
  },
  // TODO - Not activated for now
  // {
  //   url: "/sygnum-web3",
  //   name: "SYGNUM",
  //   image: "/images/sygnum.png",
  // },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>NEXERA ID Examples Root Portfolio</title>
        <meta
          name="description"
          content="NEXERA ID Examples Root Portfolio page"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-white">
        <div className="mb-12 mt-24 flex w-full flex-col items-center text-center">
          <h1 className="mb-4 text-5xl font-bold">
            NexeraID Example Applications
          </h1>
          <p className="w-[450px] text-[#6e6d7a]">
            The following examples demonstrate the usage of NexeraID Identity
            verification process working in different circunstances
          </p>
        </div>
        <div className="container grid gap-24 lg:grid-cols-4 lg:gap-x-12">
          {PROJECTS.map((project) => (
            <AppCard
              url={project.url}
              image={project.image}
              name={project.name}
              key={project.name}
              tags={project.tags}
            />
          ))}
        </div>
      </main>
    </>
  );
}
