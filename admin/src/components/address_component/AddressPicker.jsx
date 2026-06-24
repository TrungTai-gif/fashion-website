import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

export default function AddressPicker({ address, setAddress }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [street, setStreet] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

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

  // Tự động cập nhật địa chỉ khi có đủ thông tin
  useEffect(() => {
    if (selectedWard && street && setAddress) {
      const provinceName = provinces.find(
        (p) => p.code == selectedProvince
      )?.name;
      const districtName = districts.find(
        (d) => d.code == selectedDistrict
      )?.name;
      const wardName = wards.find((w) => w.code == selectedWard)?.name;

      const fullAddress = [street, wardName, districtName, provinceName]
        .filter(Boolean)
        .join(", ");

      setAddress(fullAddress);
    }
  }, [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    street,
    provinces,
    districts,
    wards,
    setAddress,
  ]);

  return (
    <div className="space-y-4 ">
      {/* Form chọn địa chỉ */}
      <div className="p-4 rounded-lg">
        <h4 className="mb-4 text-sm font-medium text-gray-700">
          Tạo địa chỉ mới
        </h4>
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

        {/* Hiển thị địa chỉ được tạo */}
        {/* {selectedWard && street && (
          <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="mb-1 text-sm font-medium text-blue-800">
                  Địa chỉ được tạo:
                </p>
                <p className="text-sm leading-relaxed text-blue-700">
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
        )} */}
      </div>
    </div>
  );
}
