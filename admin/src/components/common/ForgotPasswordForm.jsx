import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { authService, notificationService } from "@/services";
import OTPModal from "./OTPModal";
import { assets } from "../../assets/assets";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

  const { sendForgotPasswordOTP, verifyOTP } = notificationService();
  const { resetPassword } = authService();

  // Mutation để gửi OTP
  const sendOTPMutation = useMutation({
    mutationFn: sendForgotPasswordOTP,
    onSuccess: (response) => {
      if (response.success) {
        setIsOTPModalOpen(true);
        toast.success("Mã OTP đã được gửi đến email của bạn!");
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi gửi OTP");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Không thể gửi OTP. Vui lòng thử lại!");
    },
  });

  // Mutation để verify OTP và reset password
  const verifyOTPMutation = useMutation({
    mutationFn: verifyOTP,
    onSuccess: (response) => {
      if (response.success) {
        // Sau khi verify OTP thành công, gọi reset password
        resetPasswordMutation.mutate({ email, newPassword });
        setIsOTPModalOpen(false);
      } else {
        toast.error(response.message || "Mã OTP không chính xác");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Mã OTP không chính xác");
    },
  });

  // Mutation để reset password
  const resetPasswordMutation = useMutation({
    mutationFn: ({ email, newPassword }) =>
      resetPassword({ email, newPassword }),
    onSuccess: (response) => {
      if (response) {
        toast.success("Đặt lại mật khẩu thành công!");
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
        // Redirect to login
        window.location.href = "/login";
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi đặt lại mật khẩu");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi đặt lại mật khẩu");
    },
  });

  const handleOTPVerify = (otp) => {
    const verifyData = {
      email: email,
      otp: otp,
      type: "password_reset",
    };
    verifyOTPMutation.mutate(verifyData);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!email) {
      toast.error("Vui lòng nhập email!");
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin mật khẩu!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Gửi OTP để xác nhận
    sendOTPMutation.mutate(email);
  };

  const handleResendOTP = () => {
    sendOTPMutation.mutate(email);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${assets.background})` }}
      ></div>

      {/* Forgot Password Form */}
      <div className="relative z-10 w-full max-w-md px-6 sm:px-8">
        <div className="p-8 transition-all duration-500 bg-white border border-green-200 shadow-2xl rounded-3xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
              Đặt lại mật khẩu
            </h2>
            <p className="text-lg text-gray-600">
              Nhập thông tin để đặt lại mật khẩu
            </p>
            <div className="w-16 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="flex items-center px-3 py-2 mb-4 border-2 border-green-200 rounded-2xl bg-white/70">
              <MdOutlineMailOutline className="text-green-500" />
              <input
                className="w-full pl-2 bg-transparent border-none outline-none"
                type="email"
                required
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={
                  sendOTPMutation.isPending || resetPasswordMutation.isPending
                }
              />
            </div>

            <div className="flex items-center px-3 py-2 mb-4 border-2 border-green-200 rounded-2xl bg-white/70">
              <RiLockPasswordFill className="text-green-500" />
              <input
                className="w-full pl-2 bg-transparent border-none outline-none"
                type="password"
                required
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={
                  sendOTPMutation.isPending || resetPasswordMutation.isPending
                }
              />
            </div>

            <div className="flex items-center px-3 py-2 mb-6 border-2 border-green-200 rounded-2xl bg-white/70">
              <RiLockPasswordFill className="text-green-500" />
              <input
                className="w-full pl-2 bg-transparent border-none outline-none"
                type="password"
                required
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={
                  sendOTPMutation.isPending || resetPasswordMutation.isPending
                }
              />
            </div>

            <button
              type="submit"
              disabled={
                sendOTPMutation.isPending || resetPasswordMutation.isPending
              }
              className={`block w-full py-2 font-semibold text-white transition-all duration-500 shadow-md rounded-2xl hover:-translate-y-1 ${
                sendOTPMutation.isPending || resetPasswordMutation.isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-emerald-700"
              }`}
            >
              {sendOTPMutation.isPending && "Đang gửi OTP..."}
              {resetPasswordMutation.isPending && "Đang cập nhật..."}
              {!sendOTPMutation.isPending &&
                !resetPasswordMutation.isPending &&
                "Đặt lại mật khẩu"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-sm transition-all duration-500 cursor-pointer hover:text-green-600 hover:-translate-y-1"
            >
              ← Quay lại đăng nhập
            </a>
          </div>
        </div>

        {/* Branding section */}
        <div className="mt-8 text-center text-green-500 drop-shadow-lg">
          <h2 className="text-4xl font-bold tracking-wide">PLANT DOCTOR</h2>
          <p className="mt-2 text-green-100">
            🌿 Giải pháp nông nghiệp thông minh, hiệu quả và bền vững 🌿
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        onVerify={handleOTPVerify}
        email={email}
        isLoading={verifyOTPMutation.isPending}
        onResendOTP={handleResendOTP}
      />
    </div>
  );
};

export default ForgotPasswordForm;
