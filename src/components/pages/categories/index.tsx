"use client";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import apiFetch from "../../../utils/axios";
import { toast } from "react-toastify";
import clsx from "clsx";
import { cateogryColors } from "../../../utils/categories";
import { useAuthContext } from "../../../context/authContext";

const Categories = () => {
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
  });
  const { user } = useAuthContext();

  const getCategories = useCallback(() => {
    setIsLoading(true);
    apiFetch
      .get("/admin/categories")
      .then((res) => {
        setCategoriesData(res.data);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreateLoading(true);
    apiFetch
      .post("/admin/categories", newCategory)
      .then(() => {
        toast("Category created successfully", { type: "success" });
        setNewCategory({ name: "" });
        getCategories();
      })
      .catch(() => {
        toast("Error while creating category, please try again later", {
          type: "error",
        });
      })
      .finally(() => {
        setIsCreateLoading(false);
      });
  };

  const deleteCategory = (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    setCategoriesData((categories) =>
      categories.filter((category) => category._id !== categoryId)
    );

    apiFetch
      .delete(`/admin/categories/${categoryId}`)
      .then(() => {
        toast("Category deleted successfully", { type: "success" });
      })
      .catch(() => {
        toast("Error while deleting category, please try again later", {
          type: "error",
        });
        getCategories();
      });
  };

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-secondary">Categories</h1>

      {/* Create Category Form */}
      <div className="mb-8 p-4 border border-gray-300 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-secondary text-white py-2 px-4 rounded hover:bg-primary-dark"
            disabled={isCreateLoading}
          >
            {isCreateLoading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Slug</th>
              <th className="border border-gray-300 p-2 text-left">Color</th>
              <th className="border border-gray-300 p-2 text-left">
                Created At
              </th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : (
              categoriesData?.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">
                    {category.name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {category.slug}
                  </td>
                  <td
                    className={clsx(
                      "px-2 capitalize",
                      cateogryColors[category.color]
                    )}
                  >
                    {category.color}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(category.createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => deleteCategory(category._id)}
                        className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 px-2"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {!isLoading && !categoriesData?.length ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No categories found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
