import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useAuth } from "../store/authStore";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import GoogleLoginButton from "../component/common/GoogleLoginButton";
const Login = () => {
  const { navigate } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const { loginUser } = authService();
  const { login, accessToken } = useAuth();

  const loginMutate = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      if (res.success) {
        login({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          user: res.data.user,
        });
        navigate("/");
      } else {
        toast.error(res.message);
      }
    },
    onError: (err) => {
      console.log(err.message);
      toast.error("Sai tên hoặc mật khẩu!");
    },
  });

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    loginMutate.mutate({ email, password });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br border m-20">
      <div className="min-h-screen flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${assets.about_img})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-pink-900/60" />

          <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 py-20">
            <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
              <h1 className="text-6xl font-bold text-white mb-4 tracking-wide">
                FIT ME
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
            </div>

            <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-md">
              Discover your perfect style with our premium fashion collection
            </p>

            <div className="space-y-4">
              <p className="text-lg text-purple-200 font-medium">
                ✨ Reputation and Quality ✨
              </p>
              <Link
                to={"/"}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Get Started</span>
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5-5 5M6 12h12"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
          <div className="w-full max-w-md">
            <form
              onSubmit={handleSubmit}
              className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Hello Again!
                </h1>
                <p className="text-gray-600 text-lg">
                  Welcome back to your fashion journey
                </p>
                <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-3 rounded-full"></div>
              </div>
              <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <input
                  id="email"
                  className=" pl-2 w-full outline-none border-none"
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  className="pl-2 w-full outline-none border-none"
                  type="password"
                  name="password"
                  required
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <GoogleLoginButton />
              <button
                type="submit"
                className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
              >
                Login
              </button>
              <div className="flex justify-between mt-4">
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm ml-2 hover:text-blue-500 cursor-pointer hover:-translate-y-1 duration-500 transition-all"
                >
                  Forgot Password ?
                </span>

                <Link
                  to={"/register"}
                  className="text-sm ml-2 hover:text-blue-500 cursor-pointer hover:-translate-y-1 duration-500 transition-all"
                >
                  Don't have an account yet?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
