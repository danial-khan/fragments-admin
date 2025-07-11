import React from "react";
import clsx from "clsx";

const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={clsx("bg-gray-200 animate-pulse rounded-md", className)} />
);

const UserDetailsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-10">
        <div className="flex items-center gap-6">
          <SkeletonBox className="w-20 h-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <SkeletonBox className="h-6 w-48" />
            <SkeletonBox className="h-4 w-40" />
            <SkeletonBox className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 space-y-4">
          <SkeletonBox className="h-6 w-32" />
          <div className="space-y-3">
            <SkeletonBox className="h-4 w-2/3" />
            <SkeletonBox className="h-4 w-1/2" />
            <SkeletonBox className="h-4 w-1/3" />
            <SkeletonBox className="h-4 w-2/5" />
            <SkeletonBox className="h-4 w-1/4" />
            <SkeletonBox className="h-4 w-1/2" />
            <SkeletonBox className="h-4 w-2/3" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 space-y-4">
          <SkeletonBox className="h-6 w-32" />
          <div className="space-y-3">
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-4 w-1/2" />
            <SkeletonBox className="h-4 w-2/3" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-3/5" />
            <SkeletonBox className="h-4 w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSkeleton;
