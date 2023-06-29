import React, { useContext, useEffect, useState } from "react";
import { SimpleAuthContext } from "@/features/SimpleAuthProvider";
import { ethers } from "ethers";
import { useKycAuthentication } from "@/features/kyc/useKycAuthenticate";
import { KYC_CLIENTS } from "@/features/kyc/KycClient";
import { getSigner, TestUser } from "@/appConfig";

interface ItemGroup {
  name: string;
  icon: string;
  onClick: () => void;
}

const UserOptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getUser, signOut } = useContext(SimpleAuthContext);
  const user = getUser();

  if (!user) return <></>;

  return (
    <div
      onMouseLeave={() => setIsOpen(false)}
      className="relative mt-5 flex w-full items-center"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-auto w-full items-center justify-between px-3 py-2 shadow-sm"
      >
        <div className="flex w-full cursor-pointer items-center space-x-4">
          {user?.avatar && <button className="mr-2">{user.avatar}</button>}
          <span className="font-semibold">{user.name}</span>
        </div>

        <button color="#000" className="ml-2 mt-2">
          {"expand"}
        </button>
      </button>
      {isOpen && (
        <div className="absolute bottom-[0px] z-10 w-full border bg-white shadow-xl">
          <ul className="max-h-52 overflow-y-auto scroll-auto py-1">
            <li
              className="flex h-14 cursor-pointer items-center px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => {
                signOut(user.id ?? "");
                setIsOpen(false);
              }}
            >
              Log Out
            </li>

            <li
              className="m-2 flex cursor-pointer items-center border-t px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex w-full cursor-pointer items-center space-x-4">
                {user?.avatar && (
                  <button className="mr-2">{user.avatar}</button>
                )}
                <span className="font-semibold">{user.name}</span>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const MenuItems = ({ itemGroup }: { itemGroup: ItemGroup[] }) => {
  return (
    <ul className="w-full text-black">
      {itemGroup.map((item, index) => (
        <li
          id={
            item.name === "Manage identity" ? "kyc-btn-management" : item.name
          }
          key={item.name + index.toString()}
          className={`flex h-14 w-full cursor-pointer items-center space-x-4 rounded-lg p-5 font-semibold hover:bg-[#DB0011] hover:text-white ${
            item.name === "Overview" ? "bg-[#DB0011] text-white" : ""
          }`}
          onClick={item.onClick}
        >
          <button color={item.name === "Overview" ? "white" : "#c1c1c1"}>
            {item.icon}
          </button>
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  );
};

export const Sidebar = () => {
  const { accessToken, signingMessage, signature } = useKycAuthentication();
  const { getUser } = useContext(SimpleAuthContext);
  const user = getUser();
  const kycClient = KYC_CLIENTS.management;

  const menuItems = {
    main: [
      {
        icon: "inbox",
        name: "Inbox",
        onClick: () => console.log("Inbox"),
      },
      {
        icon: "donut-graph",
        name: "Overview",
        onClick: () => console.log("Overview"),
      },
      {
        icon: "bolt",
        name: "Notifications",
        onClick: () => console.log("Notifications"),
      },
    ],
    services: [
      {
        icon: "home",
        name: "Mortgage",
        onClick: () => console.log("Mortgage"),
      },
      {
        icon: "car",
        name: "Car loans",
        onClick: () => console.log("Car loans"),
      },
      {
        icon: "helmet",
        name: "Insurance",
        onClick: () => console.log("Insurance"),
      },
    ],
    investments: [
      {
        icon: "trade",
        name: "Stocks trade",
        onClick: () => console.log("Stocks trade"),
      },
      {
        icon: "chat",
        name: "Finance advice",
        onClick: () => console.log("Finance advice"),
      },
      {
        icon: "savings",
        name: "Savings accounts",
        onClick: () => console.log("Savings accounts"),
      },
      {
        icon: "badge",
        name: "Manage identity",
        onClick: () => console.log("Manage identity"),
      },
    ],
  };

  useEffect(() => {
    console.log("USER", user, accessToken, signingMessage, signature);
    if (user && accessToken && signingMessage && signature && kycClient) {
      kycClient.onInitKycData((data) => {
        return data;
      });
      kycClient.onSignPersonalData(async (data: string) => {
        console.log("on sign personal data");
        const signer = getSigner(user);
        return await signer.signMessage(data);
      });
      kycClient.onKycCompletion(() => {
        console.log("onKycCompletion");
      });
      kycClient.init({
        auth: {
          accessToken,
          signingMessage,
          signature,
        },
        initOnFlow: "MANAGEMENT",
      });
    }
  }, [user, accessToken, signingMessage, signature, kycClient]);

  return (
    <div className="relative w-1/5">
      <div className="fixed flex flex-col gap-10">
        <button className="!h-auto">{"hsbc-uk"}</button>

        <div className="flex w-full flex-col gap-4 rounded-lg border bg-white p-5">
          <MenuItems itemGroup={menuItems.main} />

          <span className="opacity-70">Services</span>
          <MenuItems itemGroup={menuItems.services} />

          <span className="opacity-70">Investments</span>
          <MenuItems itemGroup={menuItems.investments} />

          <UserOptions />
        </div>
      </div>
    </div>
  );
};
