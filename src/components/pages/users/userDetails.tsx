import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiFetch from "../../../utils/axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import UserDetailsSkeleton from "../../skeletons/UserDetailsSkeleton";
import {
  generateInitials,
  generatePastelColor,
} from "../../../utils/avatarUtils";

interface User {
  _id: string;
  name: string;
  email: string;
  type: "student" | "author" | "admin" | "moderator";
  avatar?: string;
  active: boolean;
  isDeleted: boolean;
  followers: { _id: string }[];
  following: { _id: string }[];
  createdAt: string;
  updatedAt: string;
}

interface Credentials {
  name: string;
  institution: string;
  expertise: string;
  bio: string;
  status: "approved" | "rejected" | "pending";
  file?: string;
}

const UserDetails: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    apiFetch
      .get(`/admin/users/${userId}`)
      .then((res) => {
        setUser(res.data.user);
        setCredentials(res.data.credentials || null);
      })
      .catch(() => {
        toast.error("Failed to fetch user details.");
        navigate("/admin/users");
      })
      .finally(() => setIsLoading(false));
  }, [userId, navigate]);

  if (isLoading) return <UserDetailsSkeleton />;
  if (!user) return <div className="p-6 text-red-500">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-10">
        <div className="flex items-center gap-6">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border shadow"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow"
              style={{
                backgroundColor: generatePastelColor(user._id),
              }}
            >
              {generateInitials(user.name)}
            </div>
          )}

          <div>
            <h1 className=" text-xl sm:text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
              {user.type}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            User Info
          </h2>
          <ul className="text-sm text-gray-700 space-y-3">
            <li>
              <strong>Status:</strong>{" "}
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  user.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.active ? "Active" : "Inactive"}
              </span>
            </li>
            <li>
              <strong>Soft Deleted:</strong>{" "}
              <span
                className={user.isDeleted ? "text-red-500" : "text-green-600"}
              >
                {user.isDeleted ? "Yes" : "No"}
              </span>
            </li>
            <li>
              <strong>Followers:</strong> {user.followers.length}
            </li>
            <li>
              <strong>Following:</strong> {user.following.length}
            </li>
            <li>
              <strong>Joined:</strong>{" "}
              {dayjs(user.createdAt).format("D MMM YYYY • hh:mm A")}
            </li>
            <li>
              <strong>Last Updated:</strong>{" "}
              {dayjs(user.updatedAt).format("D MMM YYYY • hh:mm A")}
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Credentials
          </h2>
          {credentials ? (
            <ul className="text-sm text-gray-700 space-y-3">
              <li>
                <strong>Name:</strong> {credentials.name}
              </li>
              <li>
                <strong>Institution:</strong> {credentials.institution}
              </li>
              <li>
                <strong>Expertise:</strong> {credentials.expertise}
              </li>
              <li>
                <strong>Bio:</strong> {credentials.bio}
              </li>
              <li>
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    credentials.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : credentials.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {credentials.status}
                </span>
              </li>
              {credentials.file && (
                <li>
                  <strong>Document:</strong>{" "}
                  <a
                    href={credentials.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 transition"
                  >
                    View PDF
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <p className="italic text-gray-400">No credentials submitted.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
