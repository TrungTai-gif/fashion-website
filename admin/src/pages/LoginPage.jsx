import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Footer from "../components/footer_component/Footer";
import { useMutation } from "@tanstack/react-query";
import Spinner from "../components/common/Spinner";
import { toast, ToastContainer } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { FaLock } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { useAuth } from "../store/authStore";
import { authService } from "../services/authService";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginAdmin } = authService();
  const { login } = useAuth();
  const { navigate } = useContext(ShopContext);

  const loginMutate = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (res) => {
      if (res.success) {
        login({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          user: res.data.user,
        });
        navigate("/overview");
      } else {
        toast.error(res.message);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = () => {
    loginMutate.mutate({ email, password });
  };

  // useEffect(() => {
  //   toast.warning("tài khoảng admin:vominhtu1212004@gmail.com, pass: 123456");
  // }, []);

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{
          backgroundImage: `url('${assets.background}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {login.isPending && <Spinner />}
        <div className="w-full max-w-130 bg-white/50 rounded-2xl shadow-black shadow-2xl flex flex-col">
          {/* Form Section */}
          <div className="flex-1 py-18 md:px-6 px-4 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome Back 👋
                </h1>
                <p className="text-gray-600 text-sm">
                  Login to continue to your account
                </p>
              </div>
              {/* 
              {error && (
                <div className="mb-4 text-red-600 text-sm text-center bg-red-100 py-2 px-4 rounded-md">
                  {error.detail || "Network error"}
                </div>
              )} */}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-6 text-black  px-8"
              >
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600 " />
                    <input
                      type="email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="secret@example.com"
                      className="w-full pl-10 pr-4 py-2 text-md border bg-gray-100 border-gray-600 rounded-2xl  focus:border-transparent  placeholder-gray-600 transition-all "
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-800 " />
                    <input
                      type="password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-10 pr-4 py-2 text-md border bg-gray-100 border-gray-600 rounded-2xl  focus:border-transparent  placeholder-gray-600 transition-all "
                    />
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-600">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-green-800 font-medium"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-full font-semibold hover:bg-blue-600  transition-all transform hover:-translate-y-0.5"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
