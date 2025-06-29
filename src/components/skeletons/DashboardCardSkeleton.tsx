import React from "react";

const DashboardCardSkeleton = () => {
  return (
    <div className="bg-secondary animate-pulse shadow-lg rounded-lg p-6">
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
};

export default DashboardCardSkeleton;
