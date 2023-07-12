import Image from "next/image";
import React from "react";

export const Content = ({ onClickLogOn }: { onClickLogOn: () => void }) => {
  return (
    <div className="grid grid-cols-8 gap-2">
      <div className="col-span-5">
        <Image
          src={"/images/Card.png"}
          width={600}
          height={800}
          alt=""
          className="w-10/12"
        />
      </div>

      <div className="col-span-3 mt-52">
        <div className="flex items-center gap-4">
          <span className="text-4xl ">💰</span>
          <span className="font-medium text-[#2A9206]">
            START SAVING YOUR MONEY SMARTLY
          </span>
        </div>
        <div className="text-8xl font-bold leading-[110px] text-[#1C1B54]">
          Payments <br></br>
          have never <br></br>
          been easier
        </div>
        <div className="my-8 text-xl text-[#4E4CB7]">
          Discover the easiest and smartest way to manage your personal
          finances. Save, analyse, invest, withdraw, send, and receive money all
          over world with no limit.
        </div>
        <div className="flex items-center gap-8">
          <button
            className="flex w-32 cursor-pointer items-center justify-center rounded-full bg-[#4E4CB7] px-4 py-2 text-white hover:bg-white hover:text-[#4E4CB7]"
            onClick={onClickLogOn}
          >
            Get started
          </button>
          <button className="flex w-48 cursor-pointer items-center justify-center gap-3 px-4 py-2 text-[#4E4CB7]">
            <Image
              src={"/images/bi_download.png"}
              width={16}
              height={16}
              alt=""
            />
            <span>Download App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
