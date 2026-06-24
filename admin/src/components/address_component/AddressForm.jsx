import { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import { toast } from "react-toastify";

export default function AddressForm({ onClose, user_id }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [street, setStreet] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [phone, setPhone] = useState("");
  const [label, setLabel] = useState("");
  const [is_default, setIsDefault] = useState(false);

  const { addAddress } = userService();
  const queryClient = useQueryClient();

  // add address
  const { mutate: addMutate, isPending: addPending } = useMutation({
    mutationFn: addAddress,
    onSuccess: (res) => {
      onClose();
      queryClient.invalidateQueries(["address"]);
      toast.success("Thêm địa chỉ thành công!");
    },
    onError: () => {
      toast.error("Thêm địa chỉ thất bại!");
    },
  });

  const saveAddress = () => {
    if (
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !street ||
      !phone
    ) {
      toast.warning("Hãy nhập đầy đủ thông tin!");
      return;
    }

    const full_address = [
      street,
      wards.find((w) => w.code == selectedWard)?.name,
      districts.find((d) => d.code == selectedDistrict)?.name,
      provinces.find((p) => p.code == selectedProvince)?.name,
    ]
      .filter(Boolean)
      .join(", ");

    const addressData = {
      user_id,
      label: label || "Địa chỉ mới",
      detail: full_address,
      phone,
      is_default,
    };

    addMutate(addressData);
  };

  // Lấy danh sách Tỉnh/TP
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then(setProvinces);
  }, []);

  // Khi chọn Tỉnh -> load Quận/Huyện
  useEffect(() => {
    if (!selectedProvince) return;
    fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts || []));
  }, [selectedProvince]);

  // Khi chọn Quận -> load Phường/Xã
  useEffect(() => {
    if (!selectedDistrict) return;
    fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards || []));
  }, [selectedDistrict]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 bg-black/10">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">
              Thêm địa chỉ mới
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 transition-colors duration-200 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Nhãn địa chỉ */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nhãn địa chỉ
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Nhà riêng, Văn phòng..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              onChange={(e) => setLabel(e.target.value)}
              value={label}
            />
          </div>

          {/* Tỉnh / Thành phố */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tỉnh / Thành phố <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedDistrict("");
                setSelectedWard("");
                setDistricts([]);
                setWards([]);
              }}
              value={selectedProvince}
            >
              <option value="" className="text-gray-500">
                -- Chọn tỉnh/thành --
              </option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quận / Huyện */}
          {districts.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quận / Huyện <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedWard("");
                  setWards([]);
                }}
                value={selectedDistrict}
              >
                <option value="" className="text-gray-500">
                  -- Chọn quận/huyện --
                </option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Phường / Xã */}
          {wards.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phường / Xã <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                onChange={(e) => setSelectedWard(e.target.value)}
                value={selectedWard}
              >
                <option value="" className="text-gray-500">
                  -- Chọn phường/xã --
                </option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Địa chỉ chi tiết */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Địa chỉ chi tiết <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="street"
              placeholder="Nhập số nhà, tên đường..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              onChange={(e) => setStreet(e.target.value)}
              value={street}
            />
          </div>

          {/* Số điện thoại */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Nhập số điện thoại..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />
          </div>

          {/* Checkbox đặt làm mặc định */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_default"
              checked={is_default}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <label
              htmlFor="is_default"
              className="text-sm font-medium text-gray-700"
            >
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          {/* Hiển thị địa chỉ đầy đủ */}
          {selectedWard && street && (
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="mb-1 text-sm font-medium text-green-800">
                    Địa chỉ đầy đủ:
                  </p>
                  <p className="text-sm leading-relaxed text-green-700">
                    {[
                      street,
                      wards.find((w) => w.code == selectedWard)?.name,
                      districts.find((d) => d.code == selectedDistrict)?.name,
                      provinces.find((p) => p.code == selectedProvince)?.name,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 sm:flex-row">
            <button
              type="button"
              onClick={saveAddress}
              disabled={!selectedWard || !street || !phone || addPending}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {addPending ? "Đang lưu..." : "Lưu địa chỉ"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={addPending}
              className="flex-1 sm:flex-initial px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
