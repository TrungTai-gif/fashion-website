import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/categoriesService";
import { Spinner } from "./index";
import { AiOutlineMenu } from "react-icons/ai";

const CategoryFilter = ({ selectedCategory, handleCategoryChange }) => {
  const { getAllCategories } = categoriesService();

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <>
      <div className="flex-shrink-0 hidden w-64 md:block ">
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm ">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-700">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              <AiOutlineMenu className="text-lg" />
              Danh mục sản phẩm
            </h3>
          </div>

          {/* Categories */}
          <div className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`w-full text-left px-3 py-2 rounded-md text-md transition-colors ${
                  !selectedCategory
                    ? "bg-green-400 text-black border scale-105 border-gray-500  font-medium"
                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span>Tất cả sản phẩm</span>
                  {!selectedCategory && (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
              </button>

              {categoriesLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              ) : (
                categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category._id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-md transition-colors ${
                      selectedCategory === category._id
                        ? "bg-green-400 text-black border scale-105 border-gray-500  font-medium"
                        : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span>{category.name}</span>
                      {selectedCategory === category._id && (
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile category filter */}
      <div className="mb-6 md:hidden ">
        <label className="block mb-2 font-medium text-gray-700 text-md">
          Danh mục sản phẩm
        </label>
        <select
          value={selectedCategory || ""}
          onChange={(e) => handleCategoryChange(e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default CategoryFilter;
