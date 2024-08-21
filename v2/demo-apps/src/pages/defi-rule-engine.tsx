import { Swap } from "@/features/defi-rule-engine/Components/Swap";
import { Header } from "@/features/defi-rule-engine/Layout/Header";
import { Layout } from "@/features/defi-rule-engine/Layout/Layout";
import { useGlobalModals } from "@/features/defi-rule-engine/Modals/Hooks/useGlobalModals";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/features/root/identity/wagmiConfig";
import { nexeraIdConfig } from "@/features/defi-rule-engine/identity/nexeraIdConfig";
import { useCheckDefiRuleEngineCompliance } from "@/features/defi-rule-engine/identity/useCheckDefiRuleEngineCompliance";

const queryClient = new QueryClient();

const Home = () => {
	return (
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<NexeraIdProvider config={nexeraIdConfig}>
						<HomeContent />
						<ReactQueryDevtools initialIsOpen={false} />
						<ToastContainer />
					</NexeraIdProvider>
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};

const HomeContent = () => {
	const close = useGlobalModals((state) => state.close);

	const [kycCompletion, setKycCompletion] = useState(false);
	const { data } = useCheckDefiRuleEngineCompliance(kycCompletion);
	const [isCompliance, setIsCompliance] = useState(false);
	const [started, setStarted] = useState(false);

	useEffect(() => {
		console.log("EXECUTING isVerified check compliance: ", data);
		if (data === undefined) {
			return;
		}
		if (data.isValid) {
			toast("Compliance Verification: Your identity has been verified");
			setKycCompletion(false);
			setIsCompliance(true);
		} else if (data.data === "unknown") {
			setKycCompletion(true);
		} else {
			toast("Compliance Verification: Your identity has not been verified");
			setKycCompletion(false);
			setIsCompliance(false);
		}
	}, [data]);

	useEffect(() => {
		if (isCompliance) {
			close();
		}
	}, [isCompliance, close]);

	return (
		<Layout header={<Header />} bg={"defi"}>
			<>
				<Swap isCompliant={isCompliance} />
				{!isCompliance && !started && (
					<>
						<div className="absolute left-1/2 top-24 z-0 h-1/2 w-[480px] -translate-x-1/2 rounded-3xl bg-gradient-to-t from-[#ff57db95] to-[#a697ff00]" />
						<div className="absolute top-0 z-20 h-screen w-screen bg-gradient-to-t from-[#080A18] from-50% to-transparent to-95%">
							<div className="fixed bottom-32 w-full text-center">
								<div className="mx-auto flex w-[800px] flex-col gap-4 text-center">
									<h1 className="bg-gradient-to-t from-[#FFF4CF] to-[#FF57DA] bg-clip-text text-[64px] font-bold leading-[72px] text-transparent">
										Welcome to the new Institutional Uniswap dApp
									</h1>

									<div className="text-[#98A1C0]">
										<h6>1. Verify your identity off-chain to access the app</h6>
									</div>
								</div>

								<button
									type="button"
									className="mx-auto mt-11 h-14 w-80 rounded-2xl border-none bg-gradient-to-r from-[#FF00C7] to-[#FF9FFB] text-center text-xl"
									onClick={() => setStarted(true)}
								>
									Get started
								</button>
							</div>
						</div>
					</>
				)}
			</>
		</Layout>
	);
};

export default Home;
