import clsx from "clsx";
import React from "react";

const Loader = ({
  isFixed = true,
  className,
}: {
  isFixed?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "w-full h-full backdrop-blur-sm flex items-center justify-center z-50",
        isFixed ? "fixed top-0 left-0" : false,
        className
      )}
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-secondary border-opacity-75"></div>
    </div>
  );
};

export default Loader;
