"use client";
import { useCallback, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../context/authContext";
import apiFetch from "../../../utils/axios";
import clsx from "clsx";
import TableRowSkeleton from "../../skeletons/TableRowSkeleton";
import useDotLoader from "../../../hooks/useDotLoader";

const Authors = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authorsData, setAuthorsData] = useState<any[]>([]);
  const [deletingAuthorId, setDeletingAuthorId] = useState<string | null>(null);
  const dots = useDotLoader(!!deletingAuthorId);
  const { user } = useAuthContext();

  const getAuthors = useCallback(() => {
    setIsLoading(true);
    apiFetch
      .get("/admin/authors")
      .then((res) => {
        setAuthorsData(res.data.authors);
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

  const approveCredentials = useCallback((credentialsId: string) => {
    const newStatus = "approved";
    let originalStatus;
    setAuthorsData((authors) => {
      const author = authors.find((author) => author._id === credentialsId);
      originalStatus = author.status;
      author.status = newStatus;
      return [...authors];
    });
    apiFetch
      .post("/admin/credentials-status/approved", { credentialsId })
      .then(() => {
        toast("Author approved successfully", { type: "success" });
      })
      .catch(() => {
        toast("Error while approving author, please try again later", {
          type: "error",
        });
        setAuthorsData((authors) => {
          const author = authors.find((author) => author._id === credentialsId);
          author.status = originalStatus;
          return [...authors];
        });
      });
  }, []);

  const rejectCredentials = useCallback((credentialsId: string) => {
    const newStatus = "rejected";
    let originalStatus;
    setAuthorsData((authors) => {
      const author = authors.find((author) => author._id === credentialsId);
      originalStatus = author.status;
      author.status = newStatus;
      return [...authors];
    });
    apiFetch
      .post("/admin/credentials-status/rejected", { credentialsId })
      .then(() => {
        toast("Author rejected successfully", { type: "success" });
      })
      .catch(() => {
        toast("Error while rejecting author, please try again later", {
          type: "error",
        });
        setAuthorsData((authors) => {
          const author = authors.find((author) => author._id === credentialsId);
          author.status = originalStatus;
          return [...authors];
        });
      });
  }, []);

  const deleteAuthor = (authorId: string) => {
    if (!confirm("Are you sure you want to delete this author?")) return;

    setDeletingAuthorId(authorId);

    apiFetch
      .delete(`/admin/authors/${authorId}`)
      .then(() => {
        toast("Author deleted successfully", { type: "success" });
        setAuthorsData((authors) => authors.filter((a) => a._id !== authorId));
      })
      .catch(() => {
        toast("Error deleting author. Please try again later.", {
          type: "error",
        });
        getAuthors();
      })
      .finally(() => {
        setDeletingAuthorId(null);
      });
  };

  useEffect(() => {
    getAuthors();
  }, [getAuthors]);

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-secondary">
        Authors Credentials
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">
                Qualification
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Institution
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Expertise
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Credentials
              </th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableRowSkeleton columns={8} rows={4} />
            ) : (
              authorsData.map((author) => (
                <>
                  {/* Main Row */}
                  <tr key={author._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 relative p-3">
                      <button
                        onClick={() => toggleExpand(author._id)}
                        className="flex items-center"
                      >
                        {expandedRow === author._id ? (
                          <FaChevronUp className="mr-2" />
                        ) : (
                          <FaChevronDown className="mr-2" />
                        )}

                        {author.name}
                      </button>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {author.userId?.email}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {author.credentials}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {author.institution}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {author.expertise}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <a
                        onClick={() => {
                          const win = window.open();
                          const iframe = document.createElement("iframe");
                          iframe.src = author.file;
                          iframe.style.height = "100%";
                          iframe.style.width = "100%";
                          const style = document.createElement("style");
                          style.innerHTML = `html, body { padding: 0; margin: 0}`;
                          win?.document.head.appendChild(style);
                          win?.document.body.appendChild(iframe);
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline cursor-pointer"
                      >
                        View
                      </a>
                    </td>
                    <td
                      className={clsx("border border-gray-300 p-2", {
                        "bg-green-500 text-white": author.status === "approved",
                        "bg-red-500 text-white": author.status === "rejected",
                        "bg-gray-500 text-white": author.status === "pending",
                      })}
                    >
                      {author.status.charAt(0).toUpperCase() +
                        author.status.slice(1)}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex justify-center gap-2">
                        {(author.status === "pending" ||
                          author.status === "rejected") && (
                          <button
                            onClick={() => approveCredentials(author._id)}
                            className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition w-[80px]"
                          >
                            Approve
                          </button>
                        )}
                        {(author.status === "pending" ||
                          author.status === "approved") && (
                          <button
                            onClick={() => rejectCredentials(author._id)}
                            className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition w-[80px]"
                          >
                            Reject
                          </button>
                        )}

                        {user.type === "admin" && (
                          <button
                            onClick={() => deleteAuthor(author._id)}
                            disabled={deletingAuthorId === author._id}
                            className={clsx(
                              "text-white py-1 rounded-lg px-3 font-medium transition-all duration-300",
                              deletingAuthorId === author._id
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-gray-700 hover:bg-gray-900"
                            )}
                            style={{ width: "100px" }}
                          >
                            {deletingAuthorId === author._id
                              ? `Deleting${dots}`
                              : "Delete"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedRow === author._id && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="border border-gray-300 p-4">
                        <p>
                          <strong>Bio:</strong> {author.bio}
                        </p>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
            {!isLoading && !authorsData.length ? (
              <tr>
                <td colSpan={8} className="p-4 text-center">
                  No Authors data found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Authors;
