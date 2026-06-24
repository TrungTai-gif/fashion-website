import { useEffect, useMemo, useState } from "react";
import Title from "../common/Title";
import { userService } from "../../services/userService";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../store/authStore";
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";

const UserCheckout = ({ form, setForm }) => {
  const { getUserAddress } = userService();
  const { accessToken, user } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState(null);

  const {
    data: addresses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses", user.id],
    queryFn: () => getUserAddress(user.id),
    enabled: !!accessToken && !!user.id,
  });

  const defaultAddress = useMemo(() => {
    if (!Array.isArray(addresses)) return null;
    const def = addresses.find((a) => a.isDefault);
    return def || addresses[0] || null;
  }, [addresses]);

  useEffect(() => {
    if (defaultAddress && !selectedAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [defaultAddress]);

  useEffect(() => {
    if (selectedAddress) {
      form.phone = selectedAddress.phone;
      form.addressDetail = selectedAddress.detail;
    }
  }, [selectedAddress]);
  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <>
          <div className="space-y-3">
            <div className="flex sm:flex-row flex-col gap-4">
              {/* Họ và tên */}
              <div className="flex-1">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ và tên
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  required
                  className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-black"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </div>

              {/* Email */}
              <div className="flex-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  required
                  className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-black"
                  type="email"
                  placeholder="Nhập email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <label
                htmlFor="note"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ghi chú giao hàng (tuỳ chọn)
              </label>
              <textarea
                id="note"
                name="note"
                className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-black"
                rows={3}
                placeholder="Nhập ghi chú nếu có..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
          </div>

          {isLoading && (
            <div className="py-4">
              <Spinner />
            </div>
          )}

          {isError && (
            <p className="text-red-600 text-sm">
              Không tải được danh sách địa chỉ.
            </p>
          )}

          {Array.isArray(addresses) && addresses.length > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between flex-row">
                <p className="flex text-sm text-gray-600">
                  Chọn địa chỉ giao hàng
                </p>
                <Link className="flex border rounded-2xl px-2" to={"/profile"}>
                  Thêm địa chỉ{" "}
                </Link>
              </div>

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition ${
                      selectedAddress === addr
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mt-1"
                      checked={selectedAddress === addr}
                      onChange={() => setSelectedAddress(addr)}
                    />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {addr.label || "Địa chỉ"}
                        {addr.isDefault ? (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-black text-white">
                            Mặc định
                          </span>
                        ) : null}
                      </div>
                      <div className="text-gray-700">{addr.detail}</div>
                      {addr.phone && (
                        <div className="text-gray-500">SĐT: {addr.phone}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between flex-row">
                <p className="flex text-sm text-gray-600">
                  Chưa có địa chỉ. Vui lòng thêm địa chỉ trong hồ sơ của bạn.
                </p>
                <Link className="flex border rounded-2xl px-2" to={"/profile"}>
                  Thêm địa chỉ{" "}
                </Link>
              </div>
            </>
          )}
        </>
      </div>
    </>
  );
};

export default UserCheckout;
