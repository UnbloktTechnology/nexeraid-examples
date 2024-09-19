import Head from "next/head";
import AppCard, { type AppCardProps } from "../features/root/AppCard";
import AppLegendTag from "../features/root/AppLegendTag";

const VCV_TAG = {
  text: "VCV",
  color: "#298727",
};

const ZKP_TAG = {
  text: "ZKP",
  color: "#b260fa",
};

const OFF_TAG = {
  text: "OFF",
  color: "#3bb1c3",
};

const OCV_TAG = {
  text: "OCV",
  color: "#b055a1",
};

const EW_TAG = {
  text: "EW",
  color: "#f6841f",
};

const AS_TAG = {
  text: "AS",
  color: "#dc001d",
};

const LEGEND_TAG = [
  {
    text: "VC verification",
    tag: VCV_TAG,
  },
  {
    text: "ZKP verification",
    tag: ZKP_TAG,
  },
  {
    text: "Off-chain verification",
    tag: OFF_TAG,
  },
  {
    text: "On-chain verification",
    tag: OCV_TAG,
  },
  {
    text: "External wallet",
    tag: EW_TAG,
  },
  {
    text: "Abstracted signer",
    tag: AS_TAG,
  },
];
const PROJECTS: AppCardProps[] = [
  {
    url: "/defi-rule-engine",
    name: "Compliant Uniswap",
    image: "/images/defi.png",
    tags: [VCV_TAG, OFF_TAG, EW_TAG],
  },
  {
    url: "/defi-offchain-zkp",
    name: "Gated Uniswap",
    image: "/images/defi.png",
    tags: [ZKP_TAG, OFF_TAG, EW_TAG],
  },
  {
    url: "/bank",
    name: "Banking",
    image: "/images/bank.png",
    tags: [VCV_TAG, OFF_TAG, AS_TAG],
  },
  {
    url: "/bank-kyb",
    name: "Banking KYB",
    image: "/images/bank.png",
    tags: [VCV_TAG, OFF_TAG, AS_TAG],
  },
  {
    url: "/bank-web3",
    name: "Web3 Banking",
    image: "/images/bank-web3.png",
    tags: [VCV_TAG, OFF_TAG, EW_TAG],
  },
  {
    url: "/gated-nft",
    name: "Gating with Off-chain Signatures",
    image: "/images/kyc.webp",
  },
  {
    url: "/gated-nft-tezos",
    name: "Gating with Off-chain Signatures - Tezos",
    image: "/images/kyc.webp",
  },
  {
    url: "/multi-chain-support",
    name: "Multi Chain Support",
    image: "/images/kyc.webp",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>ComPilot Examples Root Portfolio</title>
        <meta
          name="description"
          content="ComPilot Examples Root Portfolio page"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-white">
        <div className="mb-12 mt-8 flex w-full flex-col items-center text-center">
          <h1 className="mb-4 text-5xl font-bold">
            ComPilot Example Applications
          </h1>
          <p className="w-[450px] text-[#6e6d7a]">
            These examples demonstrate the ComPilot identity verification
            process working in different circumstances.
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            {LEGEND_TAG.map((tag) => (
              <AppLegendTag
                text={tag.text}
                tag={tag.tag.text}
                color={tag.tag.color}
                key={tag.tag.text}
              />
            ))}
          </div>
        </div>
        <div className="container grid w-[75%] gap-16 lg:grid-cols-3 lg:gap-x-12">
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
