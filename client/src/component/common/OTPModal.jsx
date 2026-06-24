import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const OTPModal = ({
  isOpen,
  onClose,
  onVerify,
  email,
  isLoading = false,
  onResendOTP,
}) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOtp("");
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Chỉ cho phép số
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    setIsVerifying(true);
    try {
      await onVerify(otp);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (onResendOTP) {
      await onResendOTP();
      setOtp("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-xl shadow-xl border border-pink-200">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text">
            Xác thực OTP
          </h2>
          <p className="text-gray-600">Mã OTP đã được gửi đến email</p>
          <p className="font-medium text-pink-600">{email}</p>
          <div className="w-14 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-pink-400 to-pink-600"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Nhập mã OTP (6 số)"
              value={otp}
              onChange={handleChange}
              maxLength={6}
              className="w-full px-4 py-3 text-lg font-bold text-center border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:outline-none"
              disabled={isVerifying}
              autoFocus
            />
            <p className="mt-2 text-sm text-center text-gray-500">
              {otp.length}/6 số
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isVerifying || otp.length !== 6}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all shadow-md ${
                isVerifying || otp.length !== 6
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-700 hover:-translate-y-1"
              } text-white`}
            >
              {isVerifying ? "Đang xác thực..." : "Xác thực"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="w-full px-4 py-2 font-medium text-pink-600 hover:text-pink-700 disabled:text-gray-400"
            >
              {isLoading ? "Đang gửi..." : "Gửi lại mã OTP"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 font-medium text-gray-600 hover:text-gray-700"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPModal;
