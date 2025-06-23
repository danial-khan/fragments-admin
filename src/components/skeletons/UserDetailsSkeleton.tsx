import React from "react";
import clsx from "clsx";

const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={clsx("bg-gray-200 animate-pulse rounded-md", className)} />
);

const UserDetailsSkeleton: React.FC = () => {
  return (
    <div className="p-6">
      <div className="h-8 bg-gray-300 rounded-md w-48 mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <SkeletonBox className="h-4 w-2/3" />
          <SkeletonBox className="h-4 w-1/2" />
          <SkeletonBox className="h-4 w-1/3" />
          <SkeletonBox className="h-4 w-2/5" />
          <SkeletonBox className="h-4 w-1/4" />
          <SkeletonBox className="h-4 w-1/2" />
          <SkeletonBox className="h-4 w-2/3" />
        </div>

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
  );
};

export default UserDetailsSkeleton;
