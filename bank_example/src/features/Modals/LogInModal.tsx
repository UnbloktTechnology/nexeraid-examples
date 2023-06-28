import React, { useState } from "react";
import { useGlobalModals } from "./useGlobalModals";

import { type IUser } from "@/features/Interfaces";
import { UsersDropDown } from "@/features/Components/UsersDropDown";

export const LogInModal = () => {
  const { data } = useGlobalModals((state) => ({
    data: state.data,
  }));
  const [showMsg, setShowMsg] = useState(true);
  const [helpMsg, setHelpMsg] = useState(
    "To open an ABN AMRO account you will need to verify your identity first"
  );
  const [userSelected, setUserSelected] = useState<IUser>();

  const handleUserSelected = (user: IUser) => {
    setUserSelected(user);
  };

  const changeHelperText = () => {
    if (helpMsg.includes("verify your identity")) {
      setHelpMsg(
        "We've made some exciting changes to your log on screen. If you can't remember your username, select 'Forgotten username' for more help."
      );
    } else {
      setHelpMsg(
        "To open an ABN AMRO account you will need to verify your identity first"
      );
    }
  };

  if (typeof data?.userData === "undefined") return <></>;

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex w-full flex-col gap-4">
        <h3 className="text-2xl">Log in to Online Banking</h3>

        {showMsg && (
          <div className="relative flex items-center justify-between bg-[#EBEFF4] p-5">
            <button className="mr-2 cursor-pointer" onClick={changeHelperText}>
              {data?.basicData?.icon ?? ""}
            </button>

            <p className="mr-2 text-base">{helpMsg}</p>

            <button
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setShowMsg(false)}
            >
              exit
            </button>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-center">
        <UsersDropDown
          items={data?.userData?.users ?? []}
          selected={userSelected}
          onSelect={handleUserSelected}
          className="relative w-full"
          classNameButton="w-full flex justify-between border-[#D0D5DD]"
          classNameList="bg-white"
        />
      </div>

      <button
        id="kyc-btn-verify"
        disabled={typeof userSelected === "undefined"}
        className={`text-cta-black ml-auto bg-[#ffd200] px-6 py-4 hover:bg-[#e8bf2b] ${
          typeof userSelected === "undefined" ? "opacity-50" : ""
        }`}
        onClick={() => {
          if (typeof userSelected !== "undefined") {
            data?.userData?.onSuccess?.(userSelected);
            data?.userData?.onAuthenticate(userSelected);
          }
        }}
      >
        Log in
      </button>

      <div className="flex w-full flex-col justify-start gap-2 text-base">
        <button
          className="!text-cta-black w-fit text-base font-normal"
        >
          <>
            Forgotten your username?{" "}
            <span className="font-bold text-[#005e5d]">&gt;</span>
          </>
        </button>
        <button
          className="!text-cta-black w-fit text-base font-normal"
        >
          <>
            Not registered for Online Banking?{" "}
            <span className="font-bold text-[#005e5d]">&gt;</span>
          </>
        </button>
      </div>
    </div>
  );
};
