import React, { useCallback, useEffect, useState } from "react";
import apiFetch from "../../../utils/axios";
import { toast } from "react-toastify";
import Loader from "../../Loader";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeAuthors: 0,
    inActiveAuthors: 0,
    activeStudents: 0,
    inActiveStudents: 0,
    totalActive: 0,
    totalInactive: 0,
  });

  const getStats = useCallback(() => {
    setIsLoading(true);
    apiFetch
      .get("/admin/stats")
      .then((res) => {
        setStats(res.data);
      })
      .catch(() => {
        toast("Something went wrong, please try again later!", {
          type: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getStats();
  }, [getStats]);

  if (isLoading) return <Loader isFixed={false} className="mt-8"/>;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-secondary">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Authors Card */}
        <Link
          className="bg-gradient-to-r bg-secondary text-primary shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105"
          to="/dashboard/authors"
        >
          <h2 className="text-xl font-semibold mb-4">Authors</h2>
          <div className="mb-2">
            <span className="font-bold">Active: </span>
            <span>{stats.activeAuthors}</span>
          </div>
          <div>
            <span className="font-bold">Inactive: </span>
            <span>{stats.inActiveAuthors}</span>
          </div>
        </Link>

        {/* Students Card */}
        <Link
          className="bg-gradient-to-r bg-secondary text-primary shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105"
          to="/dashboard/students"
        >
          <h2 className="text-xl font-semibold mb-4">Students</h2>
          <div className="mb-2">
            <span className="font-bold">Active: </span>
            <span>{stats.activeStudents}</span>
          </div>
          <div>
            <span className="font-bold">Inactive: </span>
            <span>{stats.inActiveStudents}</span>
          </div>
        </Link>

        {/* Total Users Card */}
        <div className="bg-gradient-to-r bg-secondary text-primary shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">Total Users</h2>
          <div className="mb-2">
            <span className="font-bold">Active: </span>
            <span>{stats.totalActive}</span>
          </div>
          <div>
            <span className="font-bold">Inactive: </span>
            <span>{stats.totalInactive}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
