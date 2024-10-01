import { WalletMenuIcon } from "./icon/WalletMenuIcon";

import { DisconnectIcon } from "./icon/DisconnectIcon";
import { ArrowDownIcon } from "./icon/ArrowDownIcon";
import { DropDownMenu } from "./DropDownMenu";
import { useWalletAddress } from "@/kyc-airdrop/lib/useWalletAddress";
import { formatAddress } from "@/kyc-airdrop/lib/formatAddress";
import { useLogout } from "@/kyc-airdrop/lib/useLogout";

export const WalletMenu = () => {
  const { address } = useWalletAddress();
  const logout = useLogout();
  if (!address) {
    return null;
  }
  return (
    <DropDownMenu>
      <DropDownMenu.Button>
        <div className="inline-flex h-9 items-center justify-start gap-1 rounded-3xl bg-black px-4 py-1">
          <div className="relative h-4 w-4">
            <WalletMenuIcon />
          </div>
          <div className="font-['Aeonik Pro'] text-center text-sm font-normal leading-none text-white">
            {formatAddress(address)}
          </div>
          <div className="relative h-4 w-4">
            <ArrowDownIcon />
          </div>
        </div>
      </DropDownMenu.Button>

      <DropDownMenu.DropDown>
        <DropDownMenu.Item>
          <div className="flex items-center justify-start gap-1">
            <div className="text-gray-95 text-base font-normal leading-normal">
              Connected With
            </div>
          </div>
        </DropDownMenu.Item>

        <DropDownMenu.Item>
          <div className="flex items-center justify-start gap-1">
            <div className=" text-gray-950">{formatAddress(address, 10)}</div>
          </div>
        </DropDownMenu.Item>
        {/*<DropDownMenu.Item selectable>
          <div className="flex items-center justify-start gap-1 ">
            <div className="relative h-5 w-5">
              <AddAddressIcon />
            </div>
            <div className="text-base font-normal leading-normal text-gray-950">
              Add another wallet
            </div>
          </div>
        </DropDownMenu.Item>*/}
        <DropDownMenu.Item selectable onClick={logout}>
          <div className="flex items-center justify-start gap-1">
            <div className="relative h-5 w-5">
              <DisconnectIcon />
            </div>
            <div className="text-base font-normal leading-normal text-gray-950">
              Disconnect
            </div>
          </div>
        </DropDownMenu.Item>
      </DropDownMenu.DropDown>
    </DropDownMenu>
  );
};
