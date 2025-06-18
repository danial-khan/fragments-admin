// components/skeletons/TableRowSkeleton.tsx
import React from "react";

interface Props {
  columns: number;
  rows?: number;
}

const TableRowSkeleton: React.FC<Props> = ({ columns, rows = 10 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className="animate-pulse">
          {Array.from({ length: columns }).map((__, colIdx) => (
            <td key={colIdx} className="border p-2">
              <div className="h-4 bg-gray-200 rounded w-full max-w-[80%]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableRowSkeleton;
