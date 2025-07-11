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
    <div className="  h-screen  ">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="sm:p-3 mt-20  ">
          <div className="flex flex-col md:ml-60  ">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
