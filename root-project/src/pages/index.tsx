import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const PROJECTS = [
  {
    url: "/defi-rule-engine",
    name: "Defi Rule Engine",
    image: "/images/defi.png",
  },
  {
    url: "/defi-offchain-zkp",
    name: "Defi Off Chain ZKP",
    image: "/images/defi.png",
  },
  {
    url: "/bank",
    name: "Bank",
    image: "/images/bank.png",
  },
  {
    url: "/bank-web3",
    name: "Bank Web3",
    image: "/images/bank-web3.png",
  },
  {
    url: "/kyc",
    name: "KYC",
    image: "/images/kyc.webp",
  },
  {
    url: "/sygnum-web3",
    name: "SYGNUM",
    image: "/images/sygnum.png",
  },
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container grid gap-6 lg:grid-cols-3 lg:gap-x-12">
          {PROJECTS.map((project) => (
            <Link key={project.url} href={project.url}>
              <div className="mb-6 h-full lg:mb-0">
                <div className="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                  <div className="flex h-full flex-col items-center justify-between gap-4 p-6 text-center dark:border-opacity-10">
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={250}
                      height={400}
                    />

                    <h3 className="mb-6 text-3xl">
                      <strong className="text-white">{project.name}</strong>
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
