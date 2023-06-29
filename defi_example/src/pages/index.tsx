import { Swap } from "@/features/Components/Swap";
import { useIsUserCompliant } from "@/features/Hooks/useIsUserCompliant";
import { Header } from "@/features/Layout";
import { useMockCompliancePmVerifiedStatus } from "@/features/useMockCompliancePmVerifiedStatus";
import { Layout } from "@/features/Layout";
import { useGlobalModals } from "@/features/Modals/Hooks/useGlobalModals";
import { useAccount } from "wagmi";

const Compliant = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const { openModal } = useGlobalModals((state) => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    openModal: state.open,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    close: state.close,
  }));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const account = useAccount();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const isUserCompliant = useIsUserCompliant({ address: account?.address });
  const isUserMockPMCompliant = useMockCompliancePmVerifiedStatus({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    address: account?.address,
  });

  return (
    <Layout header={<Header />} bg={"defi"}>
      {isUserCompliant.isLoading ? (
        <div className="flex flex-col gap-4">Loading</div>
      ) : (
        <>
          <Swap />
          {!isUserCompliant.data && (
            <>
              <div className="absolute left-1/2 top-24 z-0 h-1/2 w-[480px] -translate-x-1/2 rounded-3xl bg-gradient-to-t from-[#ff57db95] to-[#a697ff00]" />
              <div className="absolute top-0 z-20 h-screen w-screen bg-gradient-to-t from-[#080A18] from-50% to-transparent to-95%">
                <div className="fixed bottom-32 w-full">
                  <div className="mx-auto flex w-[800px] flex-col gap-4 text-center">
                    <h1 className="bg-gradient-to-t from-[#FFF4CF] to-[#FF57DA] bg-clip-text text-[64px] font-bold leading-[72px] text-transparent">
                      Welcome to the new Institutional Uniswap app
                    </h1>

                    <div className="text-[#98A1C0]">
                      <h6>
                        1. Verify your identity off-chain to access the app
                      </h6>
                      <h6>
                        {isUserMockPMCompliant.data?.isVerified18 ? "✅" : "2."}{" "}
                        Verify your identity on-chain to swap assets
                      </h6>
                    </div>
                  </div>

                  <button
                    className="mx-auto mt-11 h-14 w-80 rounded-2xl border-none bg-gradient-to-r from-[#FF00C7] to-[#FF9FFB] text-xl"
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                      openModal(
                        "KycModal",
                        {
                          modalType: "center",
                          overlayType: "dark",
                          style: "rounded",
                          bg: "defi",
                        },
                        {
                          initOnFlow: "REQUEST",
                          basicData: {
                            text: "Authenticate and then Verify yourself",
                            icon: "kyc",
                            textButton: "Verify",
                          },
                        }
                      );
                    }}
                  >
                    Get started
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default Compliant;
