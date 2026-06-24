import { assets } from "@/assets/assets";
import { Trash2 } from "lucide-react";

const UserTable = ({ displayed, deleteData }) => {
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-md bg-white">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-400 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Họ và tên</th>
              <th className="p-3 text-left">Ảnh</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Địa chỉ</th>
              <th className="p-3 text-center">Tính năng</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((u) => (
              <tr
                key={u._id}
                className="border-b hover:bg-blue-50 transition duration-150"
              >
                <td className="p-3">{u._id.slice(-6)}...</td>

                <td className="p-3">{u.name}</td>
                <td className="p-3">
                  <img
                    src={u.avatar || assets.user_img}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  {u.address?.detail || "Chưa có địa chỉ"}
                </td>
                {console.log(u)}
                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteData(u.id)}
                    className="inline-flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    {/* <Trash2 size={16} /> */}
                    Chặn
                  </button>
                </td>
              </tr>
            ))}
            {displayed.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  Không tìm thấy khách hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserTable;
