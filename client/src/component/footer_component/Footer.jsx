import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SiZalo } from "react-icons/si";
import FooterContact from "./FooterContact";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white">
      <div className=" px-20 md:mx-10  lg:mx-20 grid w-full grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
        <FooterContact />
        {/* <!-- Column: Company --> */}
        <ul className="flex flex-col gap-5">
          <p className="font-sans text-xl antialiased  text-current  mb-2 font-semibold opacity-50">
            Hỗ trợ khách hàng
          </p>
          <li>
            <Link
              href="#"
              className="font-sans antialiased text-base text-current py-1 hover:text-primary"
            >
              Sản phẩm khuyến mãi
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="font-sans antialiased text-base text-current py-1 hover:text-primary"
            >
              Sản phẩm bán chạy
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="font-sans antialiased text-base text-current py-1 hover:text-primary"
            >
              Tất cã sản phẩm
            </Link>
          </li>
        </ul>
        {/* <!-- Column: Help Center --> */}
        <ul className="flex flex-col gap-5">
          <p className="font-sans antialiased text-xl text-current mb-2 font-semibold opacity-50">
            Liên kết
          </p>
          <li>
            <Link
              href="#"
              className="font-sans antialiased text-base text-current py-1 hover:text-primary"
            >
              Sản phẩm mới
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="font-sans antialiased text-base text-current py-1 hover:text-primary"
            >
              Nam
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="font-sans antialiased text-base text-current py-1 hover:text-primary"
            >
              Nữ
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="font-sans antialiased text-base text-current py-1 hover:text-primary"
            >
              Phụ kiện
            </Link>
          </li>
        </ul>
        {/* <!-- Column: Resources --> */}
        <ul className="flex flex-col gap-5">
          <p className="font-sans antialiased text-xl text-current mb-2 font-semibold opacity-50">
            Chính sách
          </p>
          <li>
            <Link
              href="#"
              className="font-sans antialiased text-base text-current py-1 hover:text-primary"
            >
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="font-sans antialiased text-base text-current py-1 hover:text-primary"
            >
              Hướng dẫn mua hàng
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="font-sans antialiased text-base text-current py-1 hover:text-primary"
            >
              Chính sách kiểm hàng
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="font-sans antialiased text-base text-current py-1 hover:text-primary"
            >
              Chính sách vận chuyển
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="font-sans antialiased text-base text-current py-1 hover:text-primary"
            >
              Chính sách thanh toán và bảo mật
            </Link>
          </li>
        </ul>
      </div>
      {/* <!-- Footer Bottom Section --> */}
      <div className=" text-gray-600 bg-white mt-5 flex flex-col w-full items-center justify-center gap-4 border-t border-stone-200 py-4 md:flex-row md:justify-around">
        <div className="font-sans antialiased text-sm text-current text-center">
          © 2025{" "}
          <Link href="#" className="hover:underline">
            TrungTai
          </Link>
          . All Rights Reserved.
        </div>
        {/* <!-- Social Media Links --> */}
        <div className="flex gap-2 sm:justify-center">
          <Link
            href="#"
            className="inline-grid place-items-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 text-sm min-w-[34px] min-h-[34px] rounded-md bg-transparent text-stone-800 hover:bg-stone-200/10"
          >
            <FaFacebookF />
          </Link>
          <Link
            href="#"
            className="inline-grid place-items-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 text-sm min-w-[34px] min-h-[34px] rounded-md bg-transparent text-stone-800 hover:bg-stone-200/10"
          >
            <SiZalo />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
