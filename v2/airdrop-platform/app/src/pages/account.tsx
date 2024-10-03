import React from "react";
import { AirdropLayout } from "@/ui/AirdropLayout";
import { AddressSelect } from "@/ui/components/AddressSelect";
import { AddressSearchBar } from "@/ui/components/AddressSearchBar";
import { Button } from "@/ui/components/Button";
import { RedXIcon } from "@/ui/components/icon/RedXIcon";
import { useAuthenticate } from "@compilot/react-sdk";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "@/ui/components/ConnectWalletButton";

export default function AccountPage() {
  const account = useAccount();
  const { data: isKycAuthenticated, authenticate } = useAuthenticate();

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
          <Button variant="primary" onClick={() => void authenticate()}>
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
          <AddressSearchBar variant="flat" onWalletAddressValid={console.log} />
        </div>
      </div>
    </AirdropLayout>
  );
}

export const AddressLinker = () => {
  return (
    <div className="flex h-16 flex-col items-start justify-start gap-1 self-stretch">
      <div className="flex h-16 flex-col items-start justify-start gap-0.5 self-stretch">
        <div className="flex h-12 flex-col items-start justify-start self-stretch rounded-xl">
          <div className="inline-flex items-start justify-start self-stretch rounded-xl bg-slate-100 p-px">
            <div className="flex h-11 shrink grow basis-0 items-start justify-start gap-2 py-2.5 pl-3.5">
              <div className="relative flex h-6 w-6 items-stretch justify-stretch">
                <RedXIcon />
              </div>
              <div className=" mr-4 shrink grow basis-0 text-base font-normal leading-normal text-slate-500">
                5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
              </div>
            </div>
            <div className="flex items-center justify-end self-stretch pr-0.5">
              <Button
                variant="primary"
                onClick={() => console.log("Link to profile")}
              >
                Link to profile
              </Button>
            </div>
          </div>
        </div>
        <div className="inline-flex items-start justify-start gap-2 self-stretch">
          <div className="text-sm font-medium text-slate-600">
            14.024203942398420948 $PEAQ allocated
          </div>
        </div>
      </div>
    </div>
  );
};
