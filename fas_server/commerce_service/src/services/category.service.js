import Category from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";

const createCategory = async (data) => {
  try {
    // console.log("Creating category with data:", data);

    const categoryData = {
      name: data.name.trim(),
      description: data.description?.trim() || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: categoryData.name,
    });

    if (existingCategory) {
      throw new Error(
        `Category with name "${categoryData.name}" already exists`
      );
    }

    const category = await Category.create(categoryData);
    console.log("Category created successfully:", category);
    return category;
  } catch (error) {
    console.error("Error in createCategory service:", error);
    throw error;
  }
};

const getCategories = async () => {
  const categories = await Category.find();
  return categories;
};

const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, "Category not found");

  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, "Category not found");

  return category;
};

export default {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
