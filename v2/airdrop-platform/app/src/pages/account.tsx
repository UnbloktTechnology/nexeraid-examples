import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AirdropLayout } from "@/ui/AirdropLayout";
import { AddressSelect } from "@/ui/components/AddressSelect";
import { AddressSearchBar } from "@/ui/components/AddressSearchBar";
import { Button } from "@/ui/components/Button";
import { RedXIcon } from "@/ui/components/icon/RedXIcon";
import {
  useAuthenticate,
  useIdentityWallets,
  WalletAlreadyLinkedToAnotherIdentity,
} from "@compilot/react-sdk";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "@/ui/components/ConnectWalletButton";
import { Address } from "viem";
import { getUserAirdropAmount, isUserQualified } from "@/lib/airdropActions";
import { HourglassIcon } from "@/ui/components/icon/HourglassIcon";
import { formatAirdropTokenAmount } from "@/lib/formatDecimalNumber";
import { getAirdropTokenConfig } from "@/config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { Spinner } from "@/ui/components/Spinner";
import { formatAddress } from "@/lib/formatAddress";
import { compilotWalletAdapter } from "@/compilotConfig";

const AccountPageContext = createContext<{
  modalOpen: boolean;
  forAddress: Address;

  start: (address: Address) => void;
  close: () => void;
}>({
  modalOpen: false,
  forAddress: "0x00",

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  start: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close: () => {},
});

const AccountPageProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalOpen, setModalOpen] = useState(true);
  const [forAddress, setForAddress] = useState<Address>(
    "0xbEa25a41f9F6B5bD9a3Ad666cDabfE0A201033cf",
  );

  const start = useCallback(
    (address: Address) => {
      setForAddress(address);
      setModalOpen(true);
    },
    [setForAddress, setModalOpen],
  );

  const close = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const value = useMemo(
    () => ({ modalOpen, forAddress, start, close }),
    [modalOpen, forAddress, start, close],
  );

  return (
    <AccountPageContext.Provider value={value}>
      {children}
    </AccountPageContext.Provider>
  );
};

export default function AccountPage() {
  return (
    <AccountPageProvider>
      <AccountPageContent />
    </AccountPageProvider>
  );
}

const AccountPageContent = () => {
  const account = useAccount();
  const {
    data: isKycAuthenticated,
    authenticate,
    isPending: isAuthenticating,
  } = useAuthenticate();
  const [addressToCheck, setAddressToCheck] = useState<Address | null>(null);
  const { modalOpen } = useContext(AccountPageContext);

  if (!account?.address) {
    return (
      <AirdropLayout
        titleOverwrite="Please connect"
        subtitleOverwrite="You need to be authenticated to manage your account"
      >
        <div className="flex justify-center space-x-4">
          <ConnectWalletButton
            label="Connect your wallet"
            variant="secondary"
          />
        </div>
      </AirdropLayout>
    );
  }

  if (!isKycAuthenticated) {
    return (
      <AirdropLayout
        titleOverwrite="Please connect"
        subtitleOverwrite="You need to be authenticated to manage your account"
      >
        <div className="flex justify-center space-x-4">
          <Button
            variant="primary"
            onClick={() => void authenticate()}
            isLoading={isAuthenticating}
          >
            Connect
          </Button>
        </div>
      </AirdropLayout>
    );
  }

  return (
    <AirdropLayout showTitles={false}>
      <div className="inline-flex w-full max-w-[800px] flex-col items-start justify-start gap-4 rounded-2xl bg-slate-50 p-8">
        <div className="inline-flex items-center justify-start gap-4 self-stretch border-b border-slate-400 pb-6">
          <div className=" text-3xl font-normal leading-loose text-gray-900">
            Profile
          </div>
          <div className="grow">
            <AddressSelect />
          </div>
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-4 self-stretch pt-2">
          {addressToCheck && <AddressLinker address={addressToCheck} />}

          <AddressSearchBar
            variant="flat"
            onWalletAddressValid={(address, { clear }) => {
              console.log("Address set to", address);
              setAddressToCheck(address);
              clear();
            }}
            isLoading={false}
          />
        </div>
      </div>
      {modalOpen && <AttachWalletModal />}
    </AirdropLayout>
  );
};

export const AddressLinker = ({ address }: { address: Address }) => {
  const isQualified = isUserQualified(address);
  const amountEligible = getUserAirdropAmount(address);
  const { start: openModal } = useContext(AccountPageContext);

  return (
    <div className="flex h-16 flex-col items-start justify-start gap-1 self-stretch">
      <div className="flex h-16 flex-col items-start justify-start gap-0.5 self-stretch">
        <div className="flex h-12 flex-col items-start justify-start self-stretch rounded-xl">
          <div className="inline-flex items-start justify-start self-stretch rounded-xl bg-slate-100 p-px">
            <div className="flex h-11 shrink grow basis-0 items-start justify-start gap-2 py-2.5 pl-3.5">
              <div className="relative flex h-6 w-6 items-stretch justify-stretch">
                {isQualified ? <HourglassIcon /> : <RedXIcon />}
              </div>
              <div className=" mr-4 shrink grow basis-0 text-left text-base font-normal leading-normal text-slate-500">
                {address}
              </div>
            </div>
            <Button
              className="min-w-32"
              variant="primary"
              onClick={() => openModal(address)}
            >
              Link to profile
            </Button>
          </div>
        </div>
        <div className="inline-flex items-start justify-start gap-2 self-stretch">
          <div className="text-sm font-medium text-slate-600">
            {formatAirdropTokenAmount(amountEligible)} $
            {getAirdropTokenConfig().symbol} allocated
          </div>
        </div>
      </div>
    </div>
  );
};

const AttachWalletModal = () => {
  const { forAddress, close } = useContext(AccountPageContext);
  const account = useAccount();
  const { identityWallets, addWalletMutation } = useIdentityWallets();

  const isConnected = !account;
  const isCorrectAccount = account?.address === forAddress;
  const isLinking = addWalletMutation.isPending;
  const isLinked = identityWallets.data?.some(
    (w) => w.address.toLocaleLowerCase() === forAddress.toLocaleLowerCase(),
  );
  const hasNonRetriableError =
    addWalletMutation.error &&
    addWalletMutation.error instanceof WalletAlreadyLinkedToAnotherIdentity;

  let step:
    | "must_connect"
    | "must_change_account"
    | "can_link"
    | "linking"
    | "linked"
    | "must_cancel";
  if (isConnected) {
    step = "must_connect";
  } else if (!isCorrectAccount) {
    step = "must_change_account";
  } else if (isLinking) {
    step = "linking";
  } else if (isLinked) {
    step = "linked";
  } else if (hasNonRetriableError) {
    step = "must_cancel";
  } else {
    step = "can_link";
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={close}
      >
        <div
          className="w-full max-w-sm rounded-lg bg-black p-6 text-white shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            return false;
          }}
        >
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">
              {
                {
                  must_connect: "Connect your wallet",
                  must_change_account: "Please switch your wallet",
                  can_link: "Link this wallet",
                  linking: "Linking...",
                  linked: "Wallet is linked to your account",
                  must_cancel: "Cannot link this wallet to your account",
                }[step]
              }
            </h2>
          </div>
          <p className="mt-4 text-left text-sm text-gray-400">
            {
              {
                must_connect: "You need to connect your wallet to link it",
                must_change_account: `Please switch your wallet to address ${forAddress} to link it`,
                can_link: "You can link this wallet",
                linking: "Linking...",
                linked: "Wallet is linked to your account",
                must_cancel: "Cannot link this wallet to your account",
              }[step]
            }
            {addWalletMutation.error &&
              (addWalletMutation.error instanceof
              WalletAlreadyLinkedToAnotherIdentity ? (
                <p className="text-red-500">
                  This wallet is already linked to another account
                </p>
              ) : (
                <p>{addWalletMutation.error.message}</p>
              ))}
          </p>
          <div className="items-right mt-4 flex justify-between">
            <Button variant="transparent" onClick={close}>
              Back
            </Button>

            {step === "must_connect" && (
              <ConnectWalletButton label="Connect" variant="primary" />
            )}

            {step === "must_change_account" && (
              <Button variant="primary" disabled={true} onClick={() => {}}>
                Link {formatAddress(forAddress)}
              </Button>
            )}

            {step === "can_link" && (
              <Button
                variant="primary"
                onClick={() =>
                  addWalletMutation.attachWalletToIdentity(
                    compilotWalletAdapter,
                  )
                }
              >
                Link {formatAddress(forAddress)}
              </Button>
            )}

            {step === "linking" && (
              <div className="flex items-center space-x-2">
                <Spinner />
                <span>Linking...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
