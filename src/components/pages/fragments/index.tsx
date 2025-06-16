"use client";
import React, { useEffect, useState, useCallback } from "react";
import apiFetch from "../../../utils/axios";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ShowFragmentModal from "../ShowFragmentModal";
import { toast } from "react-toastify";

export interface Fragment {
  _id: string;
  title: string;
  author: { _id: string; name: string };
  category: { _id: string; name: string };
  status: string;
  description?: string;
  content?: string;
  tags?: string[];
  upvotes?: string[];
  downvotes?: string[];
  replies?: string[];
  viewCount?: number;
  subscriptionCount: number;
  createdAt: string;
  updatedAt?: string;
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

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("published"); // default to published
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [categoriesData, setCategoriesData] = useState<Option[]>([]);
  const [authorsData, setAuthorsData] = useState<Option[]>([]);
  const [selectedFragment, setSelectedFragment] = useState<Fragment>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAuthors = useCallback(() => {
    setIsLoading(true);
    apiFetch
      .get("/admin/authors/all")
      .then((res) => {
      setAuthorsData(res.data.authors);
      })
      .catch(() =>
      console.log("Something went wrong loading authors", { type: "error" })
      )
      .finally(() => setIsLoading(false));
  }, []);

  const getCategories = useCallback(() => {
    setIsLoading(true);
    apiFetch
      .get("/admin/categories")
      .then((res) => setCategoriesData(res.data))
      .catch(() =>
        console.log("Something went wrong loading categories", {
          type: "error",
        })
      )
      .finally(() => setIsLoading(false));
  }, []);

  const toggleFragmentStatus = useCallback(
    (fragmentId: string, currentStatus: string) => {
      const newStatus = currentStatus === "published" ? "blocked" : "published";
      let originalStatus: string | undefined;

      setData((prev) => {
        const updated = [...prev];
        const frag = updated.find((f) => f._id === fragmentId);
        if (frag) {
          originalStatus = frag.status;
          frag.status = newStatus;
        }
        return updated;
      });

      apiFetch
        .post(`/admin/fragments/${newStatus}`, { fragmentId })
        .then(() => {
          toast(
            `Fragment ${
              newStatus === "blocked" ? "blocked" : "published"
            } successfully`,
            {
              type: "success",
            }
          );

          if (newStatus === "blocked" && status === "published") {
            setData((prev) => prev.filter((f) => f._id !== fragmentId));
          }
          if (newStatus === "published" && status === "blocked") {
            setData((prev) => prev.filter((f) => f._id !== fragmentId));
          }
        })
        .catch(() => {
          toast(
            "Error while updating fragment status. Please try again later",
            {
              type: "error",
            }
          );
          setData((prev) => {
            const updated = [...prev];
            const frag = updated.find((f) => f._id === fragmentId);
            if (frag) frag.status = originalStatus || frag.status;
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
      if (author) params.author = author;
      if (status) params.status = status;

      const res = await apiFetch.get("/admin/fragments", { params });
      setData(res.data.fragments);
      setTotalPages(res.data.pages);
    } catch (err: any) {
      console.log(err.message || "Error fetching fragments", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    limit,
    debouncedSearch,
    category,
    author,
    status,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    getAuthors();
    getCategories();
    fetchData();
  }, [getAuthors, getCategories, fetchData]);

  const handleView = (frag: Fragment) => {
    setSelectedFragment(frag);
    setIsModalOpen(true);
  };

  const selectClasses =
    "px-4 py-3 rounded-lg bg-white text-secondary border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none";

  return (
    <div className="p-4">
      <ShowFragmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fragment={selectedFragment}
      />

      <h1 className="text-2xl font-bold mb-4 text-secondary">Fragments</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative w-full md:w-1/2">
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

        <select
          value={author}
          onChange={(e) => {
            setAuthor(e.target.value);
            setPage(1);
          }}
          className={selectClasses}
        >
          <option value="">Select a author</option>
          {authorsData.map((auth) => (
            <option key={auth._id} value={auth._id}>
              {auth.name}
            </option>
          ))}
        </select>

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
          <thead className="bg-secondary text-white">
            <tr>
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Author</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Created At</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : data.length ? (
              data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border p-2">{item.title}</td>
                  <td className="border p-2">{item.author.name}</td>
                  <td className="border p-2">{item.category.name}</td>
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
                      className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-secondary transition"
                      onClick={() => handleView(item)}
                    >
                      View
                    </button>
                    <button
                      className={`py-1 px-3 rounded-lg text-white transition ${
                        item.status === "blocked"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      onClick={() =>
                        toggleFragmentStatus(item._id, item.status)
                      }
                    >
                      {item.status === "blocked" ? "Publish" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center">
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
