"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCheckCircle,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Link } from "react-router-dom";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import apiFetch from "../../../utils/axios";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../context/authContext";
import CreateUserModal from "../CreateUserModal";
import TableRowSkeleton from "../../skeletons/TableRowSkeleton";
import useDotLoader from "../../../hooks/useDotLoader";

const Users = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] =
    useState<boolean>(false);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const { user } = useAuthContext();
  const dots = useDotLoader(!!deletingUserId);

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

  const deleteUser = (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setDeletingUserId(userId);

    startTransition(() => {
      apiFetch
        .delete(`/admin/users/${userId}`)
        .then(() => {
          toast("User deleted successfully", { type: "success" });
          setUsersData((users) => users.filter((u) => u._id !== userId));
        })
        .catch(() => {
          toast("Error deleting user. Please try again later.", {
            type: "error",
          });
          getUsers();
        })
        .finally(() => {
          setDeletingUserId(null);
        });
    });
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className=" p-4 w-full ">
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
              className="px-4 py-2 text-xs sm:text-sm bg-accent text-white rounded-lg hover:bg-[#8b4513] transition duration-300 cursor-pointer text-md"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs sm:text-sm" />{" "}
              Create New Moderator
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto overflow-y-scroll   ">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-secondary text-white  ">
            <tr>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm ">
                Name
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm ">
                Email
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm ">
                Type
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm ">
                Created At
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm ">
                Updated At
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm ">
                Status
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm ">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableRowSkeleton columns={7} rows={4} />
            ) : (
              usersData?.map((userData) => {
                return (
                  <tr
                    key={userData._id}
                    className="hover:bg-gray-50  text-xs sm:text-sm"
                  >
                    <td className="border border-gray-300 p-2 cursor-pointer hover:underline">
                      <Link to={`${userData._id}`}>{userData.name}</Link>
                    </td>
                    <td className="border border-gray-300 p-2 text-xs sm:text-sm ">
                      {userData.email}
                    </td>
                    <td className="border border-gray-300 p-2 text-xs sm:text-sm ">
                      {userData.type}
                    </td>
                    <td className="border border-gray-300 p-2 text-xs sm:text-sm ">
                      {userData.createdAt}
                    </td>
                    <td className="border border-gray-300 p-2 text-xs sm:text-sm ">
                      {userData.updatedAt}
                    </td>
                    <td
                      className={clsx("px-2  ", {
                        "bg-green-500 text-white": userData.active,
                        "bg-red-500 text-white": !userData.active,
                      })}
                    >
                      {userData.active ? "Active" : "Inactive"}
                    </td>
                    <td className="border border-gray-300 py-2 px-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            userData.active
                              ? deactivateUser(userData._id)
                              : activateUser(userData._id)
                          }
                          className={clsx(
                            "text-white py-1 rounded-lg  px-3 font-medium transition-all duration-300   text-xs ",
                            userData.active
                              ? "bg-red-500 hover:bg-green-600"
                              : "bg-green-500 hover:bg-red-600"
                          )}
                        >
                          {userData.active ? (
                            <FontAwesomeIcon icon={faBan} />
                          ) : (
                            <FontAwesomeIcon icon={faCheckCircle} />
                          )}
                        </button>

                        {user.type === "admin" && (
                          <button
                            onClick={() => deleteUser(userData._id)}
                            disabled={deletingUserId === userData._id}
                            className={clsx(
                              "text-white py-2 rounded-lg px-3   font-medium transition-all duration-300",
                              deletingUserId === userData._id
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-gray-700 hover:bg-gray-900"
                            )}
                          >
                            {deletingUserId === userData._id ? (
                              `Deleting${dots}`
                            ) : (
                              <FontAwesomeIcon icon={faTrash} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
            {!isLoading && !usersData.length ? (
              <tr>
                <td colSpan={7} className="p-4 text-center  ">
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
