import { useEffect, useState } from "react";
import { categoriesService } from "../../services/categoriesService";
import { toast } from "react-toastify";

const CategoryModel = ({ refetch, setShowModal, editing, category }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { updateCategory, createCategory } = categoriesService();
  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    }
  }, [category]);

  const handleEdit = async () => {
    if (name.trim() === "") return;
    const newCategory = { name, description };
    const res = await updateCategory(category._id, newCategory);
    if (res && res.success) {
      toast.success("Category updated!");
      setShowModal(false);
      if (refetch) refetch();
    } else {
      toast.error(res.message);
    }
  };

  const handleAdd = async () => {
    if (name.trim() === "") return;
    const res = await createCategory({ name, description });
    if (res && res.success) {
      toast.success("Category added!");
      setShowModal(false);
      refetch();
    } else {
      toast.error(res?.message || "Add failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) return handleEdit();
    handleAdd();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 bg-opacity-40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg space-y-4"
      >
        <h3 className="text-lg font-bold text-blue-700">Add new category</h3>
        <label htmlFor="name">Category name</label>
        <input
          type="text"
          name="name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <label htmlFor="description">Description</label>
        <textarea
          type="text"
          name="description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-black"
          >
            cancel
          </button>
          {editing ? (
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Update
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryModel;
