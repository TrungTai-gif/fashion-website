import { useState } from "react";
import UserFeature from "./UserFeature";
import UserTable from "./UserTable";
import Paginate from "../common/Paginate";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import { userService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

export default function UserManagement({ users = [] }) {
  const { deleteUser } = userService();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 8;

  const queryClient = useQueryClient();

  // Filter users by search term (case-insensitive)
  const filtered = users.filter((u) =>
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayed = filtered.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  const { mutate, isLoading: isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries("users");
      }
    },
    onError: () => {
      toast.error("Xóa thất bại!");
    },
  });

  const deleteData = async (id) => {
    // keep existing behavior for safety
    // toast.warning("Không thể xóa dữ liệu demo.");
    // If you want to enable deletion, uncomment below:
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    mutate({ userId: id });
  };

  return (
    <div className=" border  border-gray-200 rounded-lg p-3 bg-white mb-20">
      {/* <DeleteConfirmModal /> */}
      <UserFeature
        data={filtered}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {isPending && <Spinner />}
      {/* Bảng dữ liệu */}
      <UserTable displayed={displayed} deleteData={deleteData} />

      {/* Phân trang */}
      <Paginate
        data={filtered}
        numberPage={usersPerPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
