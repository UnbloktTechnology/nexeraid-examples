import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Transactions } from "./Transactions";
import { Transfer } from "./Transfer";
import { Card } from "./Card";

export const Dashboard = () => {
  return (
    <div className="flex space-x-5 p-10 max-h-screen overflow-y-auto">
      <Sidebar />

      <div className="flex flex-col gap-5 w-full h-full">
        <Header/>

        <div className="flex space-x-5">
          <Transactions />

          <div className="flex flex-col gap-5 w-1/4 h-full">
            <Transfer />

            <Card />
          </div>
        </div>
      </div>
    </div>
  )
}
