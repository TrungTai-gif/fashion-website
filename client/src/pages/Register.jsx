import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { userService } from "../services/userService";
const Register = () => {
  const [userName, setUserName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { navigate } = useContext(ShopContext);
  const { register } = userService();

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const registerMutate = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success("Đăng kí thành công mời bạn đăng nhập!");
      navigate("/login");
      resetForm();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className=" m-5  sm:m-10 border border-gray-200">
      <div
        className=" py-10 flex flex-col items-center justify-center bg-gray-100"
        style={{ backgroundImage: `url(${assets.about_img})` }}
      >
        <div
          className="
          w-full
          max-w-100
          flex flex-col
          bg-white
          shadow-md
          px-6
          py-8
          rounded-3xl
        "
        >
          <div className="font-medium self-center text-2xl text-gray-800">
            Tạo tài khoản
          </div>
          <div className="mt-2 self-center text-md text-gray-600">
            Quý khách vui lòng nhập thông tin để đăng ký
          </div>

          <div className="mt-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                registerMutate.mutate({
                  name: userName,
                  email,
                  password,
                });
              }}
            >
              {/* Họ và tên */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="username"
                  className="mb-1  tracking-wide text-gray-600"
                >
                  Họ và tên:
                </label>
                <input
                  id="username"
                  type="text"
                  className=" pl-3 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                  placeholder="Nhập họ và tên"
                  value={userName}
                  required
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="email"
                  className="mb-1  tracking-wide text-gray-600"
                >
                  Email:
                </label>
                <input
                  id="email"
                  type="email"
                  className=" pl-3 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                  placeholder="Nhập email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Mật khẩu */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="password"
                  className="mb-1 tracking-wide text-gray-600"
                >
                  Mật khẩu:
                </label>
                <input
                  id="password"
                  type="password"
                  className="pl-3 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Điều khoản */}
              <div className=" text-gray-600 mb-3">
                Khi nhấn "Đăng ký", bạn đồng ý với{" "}
                <span className="text-blue-500 cursor-pointer">
                  điều khoản dịch vụ
                </span>{" "}
                của chúng tôi.
              </div>

              {/* Nút đăng ký */}
              <button
                type="submit"
                className="
                  flex
                  items-center
                  justify-center
                  text-white text-sm
                  bg-blue-500
                  hover:bg-blue-600
                  rounded-2xl
                  py-2
                  w-full
                  transition
                  duration-150
                  ease-in
                "
              >
                <span className="uppercase">Đăng ký</span>
              </button>
            </form>
          </div>

          {/* Link login */}
          <div className="flex justify-center items-center mt-6">
            <span className="text-gray-700 ">
              Đã có tài khoản?
              <Link to={"/login"} className=" ml-2 text-blue-500 font-semibold">
                Đăng nhập tại đây
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
