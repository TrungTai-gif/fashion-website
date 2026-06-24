import { useEffect, useState } from "react";
import {
  Edit,
  Save,
  X,
  User,
  Mail,
  Sparkles,
  Phone,
  Calendar,
} from "lucide-react";
import { userService } from "../../services/userService";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddressManage from "./AddressManage";
import ProfileHeader from "./ProfileHeader";

const ProfileTab = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    addresses: [],
    avatar: "",
    gender: "",
    dob: "",
  });

  const { updateUser } = userService();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (res) => {
      toast.success("Cập nhật thông tin thành công");
      queryClient.invalidateQueries(["profile", user?._id]);
      setIsEditing(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || "Cập nhật thất bại");
    },
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || "",
        email: user.email || "",

        addresses: user.addresses || (user.address ? [user.address] : []),
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  return (
    <>
      <div className="p-8">
        {/* Header Section */}
        <ProfileHeader profile={user} />
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Thông tin cá nhân
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsEditing((s) => !s)}
            className={`flex items-center space-x-2 px-4 py-1 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              isEditing
                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                <span>Hủy</span>
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </>
            )}
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Prepare payload
            const payload = {
              userInfo: {
                ...userInfo,
                _id: user?._id,
              },
            };
            updateMutation.mutate(payload);
          }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Name Field */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Họ và tên</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) =>
                    setUserInfo({
                      ...userInfo,
                      name: e.target.value,
                    })
                  }
                  required
                  disabled={!isEditing}
                  className={`w-full px-2 py-2 border-1 rounded-xl transition-all duration-300 ${
                    isEditing
                      ? "border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-white"
                      : "border-gray-200 bg-gradient-to-r from-gray-50 to-indigo-50 text-gray-700"
                  } placeholder-gray-400`}
                  placeholder="Nhập họ và tên của bạn"
                />
                {isEditing && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            <AddressManage user_id={user._id} />
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  if (user) {
                    setUserInfo({
                      name: user.name,
                      email: user.email,
                      address: user.address || "",
                      avatar: user.avatar || "",
                    });
                  }
                  setIsEditing(false);
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium border-2 border-gray-200 hover:border-gray-300"
              >
                Hủy thay đổi
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </div>
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default ProfileTab;
