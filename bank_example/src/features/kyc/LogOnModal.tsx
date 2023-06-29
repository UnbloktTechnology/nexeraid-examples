import React, { useState } from "react";

import { UsersDropDown } from "../Components/UsersDropDown";
import { KycVerifyButton } from "@/features/kyc/KycVerifyButton";
import { TEST_USERS, type TestUser } from "@/appConfig";
import { useKycAuthentication } from "@/features/kyc/useKycAuthenticate";
import { toast } from "react-toastify";

export const LogOnModal = () => {
  const [showMsg, setShowMsg] = useState(true);
  const [helpMsg, setHelpMsg] = useState(
    "To open an HSBC account you will need to verify your identity first"
  );
  const [userSelected, setUserSelected] = useState<TestUser>();
  const { authenticate, user, isAuthenticated } = useKycAuthentication();

  const handleUserSelected = (user: TestUser) => {
    setUserSelected(user);
  };

  const changeHelperText = () => {
    if (helpMsg.includes("verify your identity")) {
      setHelpMsg(
        "We've made some exciting changes to your log on screen. If you can't remember your username, select 'Forgotten username' for more help."
      );
    } else {
      setHelpMsg(
        "To open an HSBC account you will need to verify your identity first"
      );
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex w-full flex-col gap-4">
        <h3 className="text-2xl">Log on to Online Banking</h3>

        {showMsg && (
          <div className="relative flex items-center justify-between bg-[#EBEFF4] p-5">
            <button className="mr-2 cursor-pointer" onClick={changeHelperText}>
              {}
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
          items={TEST_USERS}
          selected={userSelected}
          onSelect={handleUserSelected}
          className="relative w-full"
          classNameButton="w-full flex justify-between border-[#D0D5DD]"
          classNameList="bg-white"
        />
      </div>

      {user?.id !== userSelected?.id && (
        <button
          disabled={typeof userSelected === "undefined"}
          className={`ml-auto bg-[#DB0011] px-6 py-4 text-white ${
            typeof userSelected === "undefined" ? "opacity-50" : ""
          }`}
          onClick={() =>
            userSelected
              ? authenticate.mutate({ user: userSelected })
              : toast("Please select a user")
          }
        >
          Log on
        </button>
      )}
      {user?.id === userSelected?.id && isAuthenticated && <KycVerifyButton />}

      <div className="flex w-full flex-col justify-start gap-2 text-base">
        <button className="!text-cta-black w-fit text-base font-normal">
          <>
            Forgotten your username?{" "}
            <span className="font-bold text-[#DB0011]">&gt;</span>
          </>
        </button>
        <button className="!text-cta-black w-fit text-base font-normal">
          <>
            Not registered for Online Banking?{" "}
            <span className="font-bold text-[#DB0011]">&gt;</span>
          </>
        </button>
      </div>
    </div>
  );
};
