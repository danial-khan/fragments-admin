import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiFetch from "../../../utils/axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import UserDetailsSkeleton from "../../skeletons/UserDetailsSkeleton";

type UserType = "student" | "author" | "admin" | "moderator";

interface User {
  _id: string;
  name: string;
  email: string;
  type: UserType;
  avatar?: string;
  active: boolean;
  isDeleted: boolean;
  followers: { _id: string; name: string }[];
  following: { _id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

interface Credentials {
  _id: string;
  name: string;
  institution: string;
  expertise: string;
  bio: string;
  file?: string;
  status: "approved" | "rejected" | "pending";
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-secondary mb-4">User Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Type:</strong> {user.type}
          </p>
          <p>
            <strong>Status:</strong> {user.active ? "Active" : "Inactive"}
          </p>
          <p>
            <strong>Deleted:</strong> {user.isDeleted ? "Yes" : "No"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {dayjs(user.createdAt).format("DD MMM YYYY, HH:mm")}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {dayjs(user.updatedAt).format("DD MMM YYYY, HH:mm")}
          </p>
          <p>
            <strong>Followers:</strong> {user.followers.length}
          </p>
          <p>
            <strong>Following:</strong> {user.following.length}
          </p>
        </div>

        {credentials ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">Credentials</h2>
            <p>
              <strong>Name:</strong> {credentials.name}
            </p>
            <p>
              <strong>Institution:</strong> {credentials.institution}
            </p>
            <p>
              <strong>Expertise:</strong> {credentials.expertise}
            </p>
            <p>
              <strong>Bio:</strong> {credentials.bio}
            </p>
            <p>
              <strong>Status:</strong> {credentials.status}
            </p>
            {credentials.file && (
              <p>
                <strong>File:</strong>{" "}
                <a
                  href={credentials.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Document
                </a>
              </p>
            )}
          </div>
        ) : (
          <div className="text-gray-500 italic">No credentials found.</div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Back to Users
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
