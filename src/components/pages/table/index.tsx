import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// Define types for the table props
interface Action {
  label: string;
  onClick: (row: any) => void;
  id: string;
}

interface TableProps {
  columns: { label: string; accessor: string }[];
  resource: string; // URL for fetching data
  actions?: Action[];
  pagination: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  isLoading: boolean;
}

const Table: React.FC<TableProps> = ({
  columns,
  resource,
  actions = [],
  pagination,
  isLoading,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Fetch data from the resource
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${resource}?page=${pagination.currentPage}`);
        const result = await response.json();
        setData(result.data); // Assuming the API returns a 'data' field containing the records
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [resource, pagination.currentPage]);

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const renderActions = (row: any) => {
    return actions.map((action) => (
      <button
        key={action.id}
        onClick={() => action.onClick(row)}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition w-[100px]"
      >
        {action.label}
      </button>
    ));
  };

  return (
    <div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="loader">Loading...</div> {/* You can replace this with a custom loader */}
          </div>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((column) => (
                  <th key={column.accessor} className="border border-gray-300 p-2 text-left">
                    {column.label}
                  </th>
                ))}
                <th className="border border-gray-300 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <>
                  {/* Main Row */}
                  <tr key={index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.accessor} className="border border-gray-300 p-2">
                        {row[column.accessor]}
                      </td>
                    ))}
                    <td className="border border-gray-300 p-2">
                      <div className="flex justify-center gap-2">
                        {renderActions(row)}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row (optional) */}
                  {expandedRow === index && (
                    <tr className="bg-gray-50">
                      <td colSpan={columns.length + 1} className="border border-gray-300 p-4">
                        {/* You can render any additional content for the expanded row */}
                        <p>Expanded Row Details...</p>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
        >
          Prev
        </button>

        <span className="self-center py-2 text-lg">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>

        <button
          onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
