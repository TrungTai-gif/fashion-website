import { userService } from "../../services/userService";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { Lock, Key, AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { useAuth } from "../../store/authStore";
import Spinner from "../common/Spinner";
import { authService } from "../../services/authService";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
const ChangePasswordForm = ({ setShowEdit }) => {
  const { user } = useAuth();
  const [showConfrim, setShowConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { changePassword } = authService();

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Đổi mật khẩu thành công!");
        setShowEdit(false);
        setPasswordData({});
      } else {
        toast.success(res.message);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn đổi mật khẩu không?"
    );
    if (confirmed) {
      mutate({
        userId: user.id,
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const levels = [
      { text: "Rất yếu", color: "bg-red-500" },
      { text: "Yếu", color: "bg-orange-500" },
      { text: "Trung bình", color: "bg-yellow-500" },
      { text: "Mạnh", color: "bg-blue-500" },
      { text: "Rất mạnh", color: "bg-green-500" },
    ];

    return { strength, ...levels[Math.min(strength - 1, 4)] };
  };
  return (
    <>
      {isPending && <Spinner />}

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Lock className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Mật khẩu hiện tại</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="max-w-120 w-full p-2  border-1 border-gray-300 rounded-xl   transition-all duration-300"
                placeholder="Nhập mật khẩu hiện tại"
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <div className="flex flex-row justify-between">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <Key className="w-4 h-4 text-indigo-600" />
                <span>Mật khẩu mới</span>
              </label>
              {/* Password Strength Indicator */}
              {passwordData.newPassword && (
                <div className="mt-3">
                  <span
                    className={`flex-end flex text-sm font-medium  text-blue-600 `}
                  >
                    {getPasswordStrength(passwordData.newPassword).text}
                  </span>
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="max-w-120 w-full p-2 border-1 border-gray-300 rounded-xl  transition-all duration-300"
                placeholder="Nhập mật khẩu mới"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
              <Key className="w-4 h-4 text-indigo-600" />
              <span>Xác nhận mật khẩu mới</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className={`max-w-120 w-full p-2  border-1 rounded-xl transition-all duration-300 ${
                  passwordData.confirmPassword &&
                  passwordData.newPassword !== passwordData.confirmPassword
                    ? "border-red-300 focus:border-red-500  focus:ring-red-100"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
                placeholder="Xác nhận mật khẩu mới"
                required
              />
            </div>

            {passwordData.confirmPassword && (
              <div className="mt-2 flex items-center space-x-2">
                {passwordData.newPassword === passwordData.confirmPassword ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">
                      Mật khẩu khớp
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">
                      Mật khẩu không khớp
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowEdit(false);
                setPasswordData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="px-2  bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium border-1 border-gray-200 hover:border-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={
                passwordData.newPassword !== passwordData.confirmPassword
              }
              className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span> Đổi mật khẩu</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePasswordForm;
