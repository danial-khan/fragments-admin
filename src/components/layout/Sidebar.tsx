import {
  faBars,
  faComments,
  faHome,
  faIcons,
  faLeaf,
  faSignOut,
  faTimes,
  faUser,
  faUserGraduate,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/authContext";
import apiFetch from "../../utils/axios";

const Sidebar = () => {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
    <div className="fixed z-50 h-screen top-[75px]">
      <div className="md:hidden p-4 fixed top-3 left-0 z-50">
        <button onClick={toggleSidebar}>
          <FontAwesomeIcon
            icon={isSidebarOpen ? faTimes : faBars}
            className="text-xl text-secondary"
          />
        </button>
      </div>

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-40
          ${isSidebarOpen ? "w-64" : "w-0 overflow-hidden"}
          md:w-64 md:p-4 md:static md:block text-secondary`}
      >
        <ul className="pt-16 md:pt-0">
          {sidebarItems.map((item, index) => (
            <li
              key={index}
              className="font-semibold cursor-pointer items-center hover:bg-yellow-50 transition-all duration-300 p-3"
            >
              <Link
                to={item.to}
                onClick={toggleSidebar}
                className="flex h-full w-full"
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-lg mr-3 h-5"
                />
                <span className="transition-opacity duration-300 ">
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
              <span className="transition-opacity duration-300  ">Logout</span>
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
