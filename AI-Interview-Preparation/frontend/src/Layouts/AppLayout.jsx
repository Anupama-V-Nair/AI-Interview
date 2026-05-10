import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      
      <Sidebar />

      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;