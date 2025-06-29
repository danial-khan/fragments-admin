import React, { useCallback } from "react";
import {
  faHome,
  faIcons,
  faSignOut,
  faUser,
  faUserGraduate,
  faUsers,
  faLeaf,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import apiFetch from "../../utils/axios";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/authContext";

const Sidebar = () => {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();
  const sidebarItems = [
    { label: "Dashboard", icon: faHome, to: "/dashboard" },
    { label: "Users", icon: faUser, to: "/dashboard/users" },
    {
      label: "Authors Credentials",
      icon: faUserGraduate,
      to: "/dashboard/authors",
    },
    { label: "Students Credentials", icon: faUsers, to: "/dashboard/students" },
    { label: "Categories", icon: faIcons, to: "/dashboard/categories" },
    { label: "Fragments", icon: faLeaf, to: "/dashboard/fragments" },
    { label: "Comments", icon: faComments, to: "/dashboard/comments" },
  ];

  const logout = useCallback(() => {
    apiFetch
      .post("/auth/logout")
      .then(() => {
        setUser(undefined);
        navigate("/");
      })
      .catch(() => {
        toast("Something went wrong, please try later.", { type: "error" });
      });
  }, []);

  return (
    <aside
      id="sidebar"
      className="fixed left-0 top-18 bg-white h-full shadow-lg transition-all duration-300 ease-in-out w-10 md:w-64 md:p-4 text-secondary"
    >
      <ul>
        {sidebarItems.map((item, index) => (
          <li
            key={index}
            className="font-semibold cursor-pointer items-center hover:bg-yellow-50 transition-all duration-300 p-3"
          >
            <Link key={index} to={item.to} className="flex h-full w-full">
              <FontAwesomeIcon icon={item.icon} className="text-lg mr-3 h-5" />
              <span className="transition-opacity duration-300 hidden md:block">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <ul>
        <li className="font-semibold cursor-pointer items-center hover:bg-yellow-50 transition-all duration-300 p-3">
          <button
            className="flex h-full w-full cursor-pointer"
            onClick={logout}
          >
            <FontAwesomeIcon icon={faSignOut} className="text-lg mr-3 h-5" />
            <span className="transition-opacity duration-300 hidden md:block">
              Logout
            </span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
