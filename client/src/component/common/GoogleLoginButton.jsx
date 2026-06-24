import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "../../store/authStore";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";

const GoogleLoginButton = () => {
  const { login } = useAuth();
  const { loginGoogle } = authService();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSuccess = async (credentialResponse) => {
    const credential = credentialResponse.credential;

    try {
      const res = await loginGoogle(credential);

      if (res.success) {
        const { accessToken, refreshToken, user } = res.data;

        // Lưu thông tin đăng nhập vào store (Zustand)
        login({ accessToken, refreshToken, user });

        toast.success("Đăng nhập Google thành công!");
      } else {
        toast.error(res.message || "Đăng nhập Google thất bại!");
      }
    } catch (err) {
      console.error("Đăng nhập Google thất bại:", err);
      toast.error("Lỗi khi đăng nhập Google!");
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Đăng nhập Google thất bại!")}
        useOneTap // dùng popup “One Tap”
        // type="redirect" // hoặc dùng redirect toàn trang
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
