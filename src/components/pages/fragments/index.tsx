"use client";
import {
  faBan,
  faCheckCircle,
  faEye,
  faInfoCircle,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import apiFetch from "../../../utils/axios";
import SelectSkeleton from "../../skeletons/SelectSkeleton";
import TableRowSkeleton from "../../skeletons/TableRowSkeleton";
import ShowFragmentModal from "../ShowFragmentModal";
import { useAuthContext } from "../../../context/authContext";
import useDotLoader from "../../../hooks/useDotLoader";
import useDebounce from "../../../hooks/useDebounce";
import { Link } from "react-router-dom";
import { FragmentFeedbackReviewModal } from "../FragmentFeedbackReviewModal";

export interface Fragment {
  _id: string;
  title: string;
  author: { _id: string; name: string };
  category: { _id: string; name: string };
  status: string;
  aiReviewStatus: string;
  aiReviewFeedback: any;
  aiReviewSummary: string;
  createdAt: string;
  updatedAt?: string;
  description?: string;
  content: string;
  upvotes?: Array<any>;
  downvotes?: Array<any>;
  replies?: Array<any>;
  viewCount?: number;
  subscriptionCount?: number;
}

interface Option {
  _id: string;
  name: string;
}

const Fragments: React.FC = () => {
  const [data, setData] = useState<Fragment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingFragmentId, setDeletingFragmentId] = useState<string | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const { user } = useAuthContext();
  const dots = useDotLoader(!!deletingFragmentId);
  const [fragmentId, setFragmentId] = useState("");
  const debouncedFragmentId = useDebounce(fragmentId, 500);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("published");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [categoriesData, setCategoriesData] = useState<Option[]>([]);
  const [authorsData, setAuthorsData] = useState<Option[]>([]);
  const [selectedFragment, setSelectedFragment] = useState<Fragment>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [authorsLoading, setAuthorsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const getAuthors = useCallback(async () => {
    setAuthorsLoading(true);
    try {
      const res = await apiFetch.get("/admin/authors/all");
      setAuthorsData(res.data.authors);
    } catch {
      toast.error("Failed loading authors");
    } finally {
      setAuthorsLoading(false);
    }
  }, []);

  const getCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const res = await apiFetch.get("/admin/categories");
      setCategoriesData(res.data);
    } catch {
      toast.error("Failed loading categories");
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const toggleFragmentStatus = useCallback(
    (fragmentId: string, currentStatus: string) => {
      const newStatus = currentStatus === "published" ? "blocked" : "published";
      let prevStatus: string | undefined;

      setData((prev) =>
        prev.map((f) => {
          if (f._id === fragmentId) {
            prevStatus = f.status;
            return { ...f, status: newStatus };
          }
          return f;
        })
      );

      apiFetch
        .post(`/admin/fragments/${newStatus}`, { fragmentId })
        .then(() => {
          toast.success(`Fragment ${newStatus} successfully`);
          if (
            (newStatus === "blocked" && status === "published") ||
            (newStatus === "published" && status === "blocked")
          ) {
            setData((prev) => prev.filter((f) => f._id !== fragmentId));
          }
        })
        .catch(() => {
          toast.error("Error updating status");
          setData((prev) =>
            prev.map((f) =>
              f._id === fragmentId
                ? { ...f, status: prevStatus || f.status }
                : f
            )
          );
        });
    },
    [status]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page,
        limit,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      };
      if (category) params.category = category;
      if (author) params.author = author;
      if (status) params.status = status;
      if (debouncedFragmentId) params.fragmentId = debouncedFragmentId;

      const res = await apiFetch.get("/admin/fragments", { params });
      setData(res.data.fragments);
      setTotalPages(res.data.pages);
    } catch (err: any) {
      toast.error(err.message || "Error fetching fragments");
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    limit,
    debouncedSearch,
    debouncedFragmentId,
    category,
    author,
    status,
    sortBy,
    sortOrder,
  ]);

  const deleteFragment = (fragmentId: string) => {
    if (!confirm("Are you sure you want to delete this fragment?")) return;

    setDeletingFragmentId(fragmentId);

    startTransition(() => {
      apiFetch
        .delete(`/admin/fragments/${fragmentId}`)
        .then(() => {
          toast.success("Fragment deleted successfully");
          setData((prev) => prev.filter((f) => f._id !== fragmentId));
        })
        .catch(() => {
          toast("Error deleting user. Please try again later.", {
            type: "error",
          });
          fetchData();
        })
        .finally(() => {
          setDeletingFragmentId(null);
        });
    });
  };

  useEffect(() => {
    getAuthors();
    getCategories();
    fetchData();
  }, [getAuthors, getCategories, fetchData]);

  // Open view modal
  const handleView = (frag: Fragment) => {
    setSelectedFragment(frag);
    setIsModalOpen(true);
  };

  const selectClasses =
    "px-4 py-3 rounded-lg bg-white text-secondary border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none";

  return (
    <div className="p-4 relative">
      <ShowFragmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fragment={selectedFragment}
      />

      <FragmentFeedbackReviewModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        aiStatus={selectedFragment?.aiReviewStatus}
        feedback={selectedFragment?.aiReviewFeedback}
        summary={selectedFragment?.aiReviewSummary}
      />

      <h1 className="text-2xl font-bold mb-4 text-secondary">Fragments</h1>

      <div className="flex flex-col xl:flex-row gap-4 mb-4">
        <div className="relative w-full xl:w-1/2">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search fragments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-secondary border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>
        <div className="relative w-full xl:w-2/12">
          <input
            type="text"
            placeholder="Fragment ID..."
            value={fragmentId}
            onChange={(e) => {
              setFragmentId(e.target.value);
              setPage(1);
            }}
            className="w-full pl-4 pr-4 py-3 rounded-lg bg-white text-secondary border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>
        {categoriesLoading ? (
          <SelectSkeleton />
        ) : (
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className={selectClasses}
          >
            <option value="">Select a category</option>
            {categoriesData.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}

        {authorsLoading ? (
          <SelectSkeleton />
        ) : (
          <select
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              setPage(1);
            }}
            className={selectClasses}
          >
            <option value="">Select an author</option>
            {authorsData.map((auth) => (
              <option key={auth._id} value={auth._id}>
                {auth.name}
              </option>
            ))}
          </select>
        )}

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className={selectClasses}
        >
          <option value="">All</option>
          <option value="published">Published</option>
          <option value="blocked">Blocked</option>
        </select>
        <select
          value={`${sortBy}_${sortOrder}`}
          onChange={(e) => {
            const [newSort, newOrder] = e.target.value.split("_");
            setSortBy(newSort);
            setSortOrder(newOrder as "asc" | "desc");
            setPage(1);
          }}
          className={selectClasses}
        >
          <option value="createdAt_desc">Newest First</option>
          <option value="createdAt_asc">Oldest First</option>
          <option value="views_desc">Most Views</option>
          <option value="upvotes_desc">Most Upvotes</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-secondary text-white text-xs sm:text-sm ">
            <tr>
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Author</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">AI Status</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Created At</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableRowSkeleton columns={7} rows={limit} />
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50  text-xs sm:text-sm"
                >
                  <td className="border p-2">{item.title}</td>
                  <td className="border p-2 cursor-pointer hover:underline">
                    <Link to={`/dashboard/users/${item.author._id}`}>
                      {" "}
                      {item.author.name}{" "}
                    </Link>
                  </td>
                  <td className="border p-2">{item.category.name}</td>
                  <td
                    className={clsx(
                      "border p-2 capitalize text-white font-medium rounded",
                      {
                        "bg-yellow-500": item.aiReviewStatus === "pending",
                        "bg-red-500": item.aiReviewStatus === "rejected",
                        "bg-green-600": item.aiReviewStatus === "approved",
                      }
                    )}
                  >
                    {item.aiReviewStatus || "pending"}
                  </td>
                  <td
                    className={clsx("border p-2", {
                      "bg-green-500 text-white": item.status === "published",
                      "bg-red-500 text-white": item.status === "blocked",
                    })}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </td>
                  <td className="border p-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      className="bg-yellow-500 text-white  mt-2 py-2 px-3 rounded-lg hover:bg-secondary transition"
                      onClick={() => handleView(item)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      className="bg-blue-500 text-white  mt-2 py-2 px-3 rounded-lg hover:bg-blue-700 transition"
                      onClick={() => {
                        setSelectedFragment(item);
                        setIsFeedbackModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </button>
                    <button
                      className={`py-2 px-3 rounded-lg text-white  mt-2 transition  ${
                        item.status === "blocked"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      onClick={() =>
                        toggleFragmentStatus(item._id, item.status)
                      }
                    >
                      {item.status === "blocked" ? (
                        <FontAwesomeIcon icon={faCheckCircle} />
                      ) : (
                        <FontAwesomeIcon icon={faBan} />
                      )}
                    </button>
                    {user.type === "admin" && (
                      <button
                        onClick={() => deleteFragment(item._id)}
                        disabled={deletingFragmentId === item._id}
                        className={clsx(
                          "text-white py-2 mt-2 rounded-lg px-3 font-medium transition-all duration-300",
                          deletingFragmentId === item._id
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-gray-700 hover:bg-gray-900"
                        )}
                      >
                        {deletingFragmentId === item._id ? (
                          `${dots}`
                        ) : (
                          <FontAwesomeIcon icon={faTrash} />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No fragments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={clsx("px-4 py-2 rounded", {
            "bg-gray-200 cursor-not-allowed": page === 1,
            "bg-secondary text-white hover:bg-secondary-dark": page > 1,
          })}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={clsx("px-4 py-2 rounded", {
            "bg-gray-200 cursor-not-allowed": page === totalPages,
            "bg-secondary text-white hover:bg-secondary-dark":
              page < totalPages,
          })}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Fragments;
