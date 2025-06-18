"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import apiFetch from "../../../utils/axios";
import { toast } from "react-toastify";
import clsx from "clsx";
import { useAuthContext } from "../../../context/authContext";
import CreateUserModal from "../CreateUserModal";
import TableRowSkeleton from "../../skeletons/TableRowSkeleton";

const Users = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] =
    useState<boolean>(false);
  const [usersData, setUsersData] = useState<any[]>([]);
  const { user } = useAuthContext();

  const getUsers = useCallback(() => {
    setIsLoading(true);
    apiFetch
      .get("/admin/users")
      .then((res) => {
        setUsersData(res.data.users);
      })
      .catch(() => {
        toast("Something went wrong, please try again later", {
          type: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const activateUser = (userId) => {
    const newStatus = true;
    let originalStatus;
    setUsersData((users) => {
      const user = users.find((user) => user._id === userId);
      originalStatus = user.active;
      user.active = newStatus;
      return [...users];
    });
    apiFetch
      .post("/admin/users/active", { userId })
      .then(() => {
        toast("User activated successfully", { type: "success" });
      })
      .catch(() => {
        toast("Error while activating user, please try again later", {
          type: "error",
        });
        setUsersData((users) => {
          const user = users.find((user) => user._id === userId);
          user.active = originalStatus;
          return [...users];
        });
      });
  };

  const deactivateUser = (userId) => {
    const newStatus = false;
    let originalStatus;
    setUsersData((users) => {
      const user = users.find((user) => user._id === userId);
      originalStatus = user.active;
      user.active = newStatus;
      return [...users];
    });
    apiFetch
      .post("/admin/users/inactive", { userId })
      .then(() => {
        toast("User deactivated successfully", { type: "success" });
      })
      .catch(() => {
        toast("Error while deactivating user, please try again later", {
          type: "error",
        });
        setUsersData((users) => {
          const user = users.find((user) => user._id === userId);
          user.active = originalStatus;
          return [...users];
        });
      });
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div>
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onCreated={() => {
          setIsCreateUserModalOpen(false);
          getUsers();
        }}
      />
      <div>
        <h1 className="text-2xl font-bold mb-6 text-secondary">Users</h1>
        {user.type === "admin" && (
          <div className="flex items-end justify-end mb-4">
            <button
              onClick={() => setIsCreateUserModalOpen(true)}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-[#8b4513] transition duration-300 cursor-pointer text-md"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" /> Create New
              Moderator
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Type</th>
              <th className="border border-gray-300 p-2 text-left">
                Created At
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Updated At
              </th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableRowSkeleton columns={7} rows={4} />
            ) : (
              usersData?.map((userData) => (
                <>
                  {/* Main Row */}
                  <tr key={userData._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">
                      {userData.name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {userData.email}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {userData.type}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {userData.createdAt}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {userData.updatedAt}
                    </td>
                    <td
                      className={clsx("px-2", {
                        "bg-green-500 text-white": userData.active,
                        "bg-red-500 text-white": !userData.active,
                      })}
                    >
                      {userData.active ? "Active" : "Inactive"}
                    </td>
                    <td className="border border-gray-300 py-2">
                      <div className="flex justify-center gap-2">
                        <>
                          {userData.active ? (
                            <button
                              onClick={() => deactivateUser(userData._id)}
                              className="bg-red-500 text-white py-2 rounded-lg hover:bg-green-600 px-2"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => activateUser(userData._id)}
                              className="bg-green-500 text-white py-2 rounded-lg hover:bg-red-600 px-2"
                            >
                              Activate
                            </button>
                          )}
                        </>
                      </div>
                    </td>
                  </tr>
                </>
              ))
            )}
            {!isLoading && !usersData.length ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No Users data found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
