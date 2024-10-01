import { useWalletAddress } from "@/kyc-airdrop/lib/useWalletAddress";
import { AddressSelectIcon } from "./icon/AddressSelectIcon";
import { ArrowDownIcon } from "./icon/ArrowDownIcon";
import { useCallback, useState } from "react";
import { AddressCheckedIcon } from "./icon/AddressCheckedIcon";
import { useUsername } from "@/kyc-airdrop/lib/useUsername";

export const AddressSelect = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = useCallback(() => {
    setIsOpen((open) => !open);
  }, [setIsOpen]);

  const { address } = useWalletAddress();
  const username = useUsername();
  if (!username) return null;
  if (!address) return null;

  return (
    <div className="relative">
      <div className="h-12 rounded-xl bg-violet-950">
        <SelectedContent value={username} onClick={handleClick} />
      </div>

      {isOpen && (
        <div className="absolute top-0 z-50 min-w-full rounded-xl bg-violet-950 shadow">
          <div className=" flex-col items-stretch justify-start rounded-xl">
            <SelectedContent value={username} onClick={handleClick} />
            <div className="gap-2 pl-4 pt-4 text-left">
              <div className="text-sm font-normal leading-none text-white">
                Other linked wallets:
              </div>
            </div>
            <div className=" rounded-xl bg-violet-950 p-px opacity-40">
              <div className="flex h-11 basis-0 items-start justify-start gap-2 px-3.5 py-2.5">
                <div className="relative h-6 w-6">
                  <AddressCheckedIcon />
                </div>
                <div className="  basis-0 text-base font-normal leading-normal text-white">
                  {address}
                </div>
              </div>
            </div>
            <div className=" rounded-xl bg-violet-950 p-px opacity-40">
              <div className="flex h-11 basis-0 items-start justify-start gap-2 px-3.5 py-2.5">
                <div className="relative h-6 w-6">
                  <AddressCheckedIcon />
                </div>
                <div className=" basis-0 text-base font-normal leading-normal text-white">
                  {address}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SelectedContent = ({
  value,
  onClick,
}: {
  value: string;
  onClick: () => void;
}) => {
  return (
    <button
      className="inline-flex w-full cursor-pointer items-stretch rounded-xl bg-violet-950 p-px"
      onClick={onClick}
    >
      <div className="flex h-11 basis-0 items-start justify-center gap-2 px-3.5 py-2.5">
        <div className="relative h-6 w-6">
          <AddressSelectIcon />
        </div>
        <div className=" basis-0 hyphens-none whitespace-nowrap text-base font-normal leading-normal text-white">
          {value}
        </div>
      </div>
      <div className="flex grow items-center justify-end gap-2 py-2.5 pl-2 pr-4 ">
        <ArrowDownIcon />
      </div>
    </button>
  );
};
