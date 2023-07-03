import React from "react";
import { KycVerifyButton } from "@/features/kyc/KycVerifyButton";
import { useGlobalModals } from "@/features/Modals/Hooks/useGlobalModals";

export const KycModal = () => {
  const { data } = useGlobalModals((state) => ({
    data: state.data,
  }));

  return (
    <div className="mt-28 flex w-full flex-col items-center gap-4">
      {/* <Icon icon={data?.basicData?.icon ?? ""} size={105} /> */}
      <div className="flex w-80 flex-col items-center">
        <p className="text-center text-xl font-normal text-white">
          {data?.basicData?.text}
        </p>
      </div>
      <KycVerifyButton />
    </div>
  );
};
