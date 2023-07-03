import React from "react";

export const Card = () => {
  return (
    <div className="flex w-full flex-col gap-5 rounded-lg border bg-[#DB0011] p-10">
      <h3 className="text-[18px] font-semibold text-white">Cards</h3>

      <div className="flex w-full flex-col gap-5 rounded-lg border border-dashed p-5">
        <div className="flex justify-between">
          <button color="white">{"sim-card-chip"}</button>
        </div>

        <div className="flex justify-between text-[32px] font-extrabold text-white">
          <span>....</span>
          <span>....</span>
          <span>....</span>
          <span>....</span>
        </div>

        <div className="flex justify-between text-white">
          <p>Full name</p>
          <p>mm / aa</p>
        </div>

        <button className="border-none !bg-white !text-[#DB0011]">
          Active card
        </button>
      </div>
    </div>
  );
};
