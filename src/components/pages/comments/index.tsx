"use client";
import {
  faBan,
  faCheck,
  faCheckCircle,
  faComment,
  faCommentDots,
  faComments,
  faEye,
  faInfoCircle,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import DOMPurify from "dompurify";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../context/authContext";
import useDebounce from "../../../hooks/useDebounce";
import useDotLoader from "../../../hooks/useDotLoader";
import apiFetch from "../../../utils/axios";
import SelectSkeleton from "../../skeletons/SelectSkeleton";
import TableRowSkeleton from "../../skeletons/TableRowSkeleton";
import ShowCommentModal from "../ShowCommentModal";
import CommentFeedbackReviewModal from "../CommentFeedbackReviewModal";

export interface Reply {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  fragmentId: string;
  fragmentTitle: string;
  categoryName: string;
  depth: number;
  status: string;
  aiReviewStatus: string;
  aiReviewFeedback: any;
  aiReviewSummary: string;
  createdAt: string;
  parentReplyId?: string;
  upvotes?: Array<any>;
  downvotes?: Array<any>;
}

interface Option {
  _id: string;
  name: string;
}

const Replies: React.FC = () => {
  const [data, setData] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [fragmentId, setFragmentId] = useState<string>("");
  const debouncedFragmentId = useDebounce(fragmentId, 500);

  const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { user } = useAuthContext();
  const dots = useDotLoader(!!deletingReplyId);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [userList, setUserList] = useState("");
  const [depth, setDepth] = useState<number | "">("");
  const [status, setStatus] = useState("published");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [categoriesData, setCategoriesData] = useState<Option[]>([]);
  const [usersData, setUsersData] = useState<Option[]>([]);
  const [selectedReply, setSelectedReply] = useState<Reply | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const getUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await apiFetch.get("/admin/users");
      setUsersData(res.data.users);
    } catch {
      toast.error("Failed loading authors");
    } finally {
      setUsersLoading(false);
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

  const toggleReplyStatus = useCallback(
    (reply: Reply) => {
      const newStatus = reply.status === "published" ? "blocked" : "published";
      let originalStatus: string | undefined;

      setData((prev) => {
        const updated = [...prev];
        const target = updated.find((r) => r._id === reply._id);
        if (target) {
          originalStatus = target.status;
          target.status = newStatus;
        }
        return updated;
      });

      apiFetch
        .post(`/admin/replies/${newStatus}`, {
          fragmentId: reply.fragmentId,
          replyId: reply._id,
          depth: reply.depth,
          parentReplyId: reply.parentReplyId,
        })
        .then(() => {
          toast(
            `Reply ${
              newStatus === "blocked" ? "blocked" : "published"
            } successfully`,
            { type: "success" }
          );

          if (newStatus === "blocked" && status === "published") {
            setData((prev) => prev.filter((r) => r._id !== reply._id));
          }
          if (newStatus === "published" && status === "blocked") {
            setData((prev) => prev.filter((r) => r._id !== reply._id));
          }
        })
        .catch(() => {
          toast("Error updating reply status", { type: "error" });

          setData((prev) => {
            const updated = [...prev];
            const target = updated.find((r) => r._id === reply._id);
            if (target) target.status = originalStatus || target.status;
            return updated;
          });
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
      if (userList) params.author = userList;
      if (debouncedFragmentId) params.fragmentId = debouncedFragmentId;
      if (depth) params.depth = depth;
      if (status) params.status = status;

      const res = await apiFetch.get("/admin/comments", { params });
      setData(res.data.replies);
      setTotalPages(res.data.pages);
    } catch (err: any) {
      toast(err.message || "Error fetching replies", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    limit,
    debouncedSearch,
    debouncedFragmentId,
    category,
    userList,
    depth,
    status,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    getUsers();
    getCategories();
    fetchData();
  }, [getUsers, getCategories, fetchData]);

  const handleView = (reply: Reply) => {
    setSelectedReply(reply);
    setIsModalOpen(true);
  };

  const getDepthIcon = (depth: number) => {
    switch (depth) {
      case 1:
        return faComment;
      case 2:
        return faCommentDots;
      case 3:
        return faComments;
      default:
        return faComment;
    }
  };

  const deleteReply = (reply: Reply) => {
    if (!confirm("Are you sure you want to delete this reply?")) return;

    setDeletingReplyId(reply._id);

    startTransition(() => {
      apiFetch
        .delete(`/admin/replies/${reply._id}`, {
          data: { fragmentId: reply.fragmentId },
        })
        .then(() => {
          toast.success("Fragment deleted successfully");
          setData((prev) => prev.filter((r) => r._id !== reply._id));
        })
        .catch(() => {
          toast("Error deleting user. Please try again later.", {
            type: "error",
          });
          fetchData();
        })
        .finally(() => {
          setDeletingReplyId(null);
        });
    });
  };

  const selectClasses =
    "px-4 py-3 rounded-lg bg-white text-secondary border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none";

  return (
    <div className="p-4">
      <ShowCommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reply={selectedReply}
      />

      <CommentFeedbackReviewModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        aiStatus={selectedReply?.aiReviewStatus}
        feedback={selectedReply?.aiReviewFeedback}
        summary={selectedReply?.aiReviewSummary}
      />

      <h1 className="text-2xl font-bold mb-4 text-secondary flex items-center gap-2">
        Comments
      </h1>

      <div className="flex flex-wrap xl:flex-nowrap gap-x-2 gap-y-2 mb-4 md:items-center">
        <div className="relative w-full md:w-[45%] lg:w-1/4">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search replies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-secondary border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>

        <div className="relative w-full md:w-[50%] lg:w-2/12">
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
            className={`${selectClasses} w-full md:w-[45%] lg:w-auto`}
          >
            <option value="">All Categories</option>
            {categoriesData.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}

        {usersLoading ? (
          <SelectSkeleton />
        ) : (
          <select
            value={userList}
            onChange={(e) => {
              setUserList(e.target.value);
              setPage(1);
            }}
            className={`${selectClasses} w-full md:w-[50%] lg:w-[15%] xl:w-[15%] `}
          >
            <option value="">All Users</option>
            {usersData.map((userData) => (
              <option key={userData._id} value={userData._id}>
                {userData.name}
              </option>
            ))}
          </select>
        )}

        <select
          value={depth}
          onChange={(e) => {
            setDepth(e.target.value ? parseInt(e.target.value) : "");
            setPage(1);
          }}
          className={`${selectClasses} w-full md:w-[29%] lg:w-auto`}
        >
          <option value="">All Depths</option>
          <option value="1">Depth 1</option>
          <option value="2">Depth 2</option>
          <option value="3">Depth 3</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className={`${selectClasses} w-full md:w-auto`}
        >
          <option value="">All Statuses</option>
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
          className={`${selectClasses} w-full md:w-[35%] lg:w-auto`}
        >
          <option value="createdAt_desc">Newest First</option>
          <option value="createdAt_asc">Oldest First</option>
          <option value="depth_asc">Shallowest First</option>
          <option value="depth_desc">Deepest First</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-secondary text-white  text-xs sm:text-sm">
            <tr>
              <th className="border p-2 text-left">Content</th>
              <th className="border p-2 text-left">User</th>
              <th className="border p-2 text-left">Fragment</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Depth</th>
              <th className="border p-2 text-left">AI Status</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Created</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableRowSkeleton columns={9} rows={limit} />
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <td
                    className="border p-2  "
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(item.content || ""),
                    }}
                  ></td>
                  <td className="border p-2 cursor-pointer hover:underline">
                    <Link to={`/dashboard/users/${item.author._id}`}>
                      {item.author.name}{" "}
                    </Link>
                  </td>
                  <td className="border p-2">{item.fragmentTitle}</td>
                  <td className="border p-2">{item.categoryName}</td>
                  <td className="border p-2">
                    <FontAwesomeIcon
                      icon={getDepthIcon(item.depth)}
                      className="text-yellow-400 px-1"
                    />
                    {item.depth}
                  </td>
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
                    {item.status?.charAt(0).toUpperCase() +
                      item.status?.slice(1)}
                  </td>
                  <td className="border p-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      className="bg-yellow-500 text-white py-2 px-3 rounded-lg hover:bg-secondary transition"
                      onClick={() => handleView(item)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      className="bg-blue-500 text-white  mt-2 py-2 px-3 rounded-lg hover:bg-blue-700 transition"
                      onClick={() => {
                        setSelectedReply(item);
                        setIsFeedbackModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </button>
                    <button
                      className={`py-2 px-3 rounded-lg mt-3  text-white transition  ${
                        item.status === "blocked"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      onClick={() => toggleReplyStatus(item)}
                    >
                      {item.status === "blocked" ? (
                        <FontAwesomeIcon icon={faCheck} />
                      ) : (
                        <FontAwesomeIcon icon={faBan} />
                      )}
                    </button>
                    {user.type === "admin" && (
                      <button
                        onClick={() => deleteReply(item)}
                        disabled={deletingReplyId === item._id}
                        className={clsx(
                          "text-white py-2 mt-3 rounded-lg px-3 font-medium transition-all duration-300",
                          deletingReplyId === item._id
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-gray-700 hover:bg-gray-900"
                        )}
                      >
                        {deletingReplyId === item._id ? (
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
                <td colSpan={8} className="p-4 text-center">
                  No comments found
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

export default Replies;
