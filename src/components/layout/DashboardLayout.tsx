import { ReactNode } from "react";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";

const DashboardLayout = () => {
  const { user } = useAuthContext();
  if (!user) return <Navigate to="/" />;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6 mt-20">
          <div className="flex ml-66 flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
