import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/AdminSidebar";
import Header from "../Header";

const AdminHome = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Header/>
      <aside className="w-64 h-screen bg-gray-800 text-white fixed top-16 left-0">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminHome;
