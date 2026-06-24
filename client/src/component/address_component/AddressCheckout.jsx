import { useEffect, useState, useRef } from "react";

export default function AddressCheckout({ onAddressChange }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [street, setStreet] = useState("");
  const streetInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Function to update full address and send to parent
  const updateFullAddress = (
    streetValue,
    wardCode,
    districtCode,
    provinceCode
  ) => {
    const ward = wards.find((w) => w.code == wardCode);
    const district = districts.find((d) => d.code == districtCode);
    const province = provinces.find((p) => p.code == provinceCode);

    const addressParts = [
      streetValue,
      ward?.name,
      district?.name,
      province?.name,
    ].filter(Boolean);

    const fullAddress = addressParts.join(", ");

    // Send only full address to parent component
    if (onAddressChange) {
      onAddressChange(fullAddress);
    }
  };

  // --- Load danh sách Tỉnh/TP ---
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then(setProvinces);
  }, []);

  // --- Khi chọn Tỉnh -> load Quận/Huyện ---
  useEffect(() => {
    if (!selectedProvince) return;
    fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts || []));
  }, [selectedProvince]);

  // --- Khi chọn Quận -> load Phường/Xã ---
  useEffect(() => {
    if (!selectedDistrict) return;
    fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards || []));
  }, [selectedDistrict]);

  // Update address when any field changes
  useEffect(() => {
    if (street && selectedWard && selectedDistrict && selectedProvince) {
      updateFullAddress(
        street,
        selectedWard,
        selectedDistrict,
        selectedProvince
      );
    }
  }, [
    street,
    selectedWard,
    selectedDistrict,
    selectedProvince,
    wards,
    districts,
    provinces,
  ]);

  // --- Autocomplete cho tên đường ---
  useEffect(() => {
    if (!window.google || !streetInputRef.current) return;

    // Hủy autocomplete cũ nếu có
    if (autocompleteRef.current) {
      window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
    }

    // Giới hạn phạm vi gợi ý dựa theo quận đã chọn
    const districtName =
      districts.find((d) => d.code == selectedDistrict)?.name || "";
    const provinceName =
      provinces.find((p) => p.code == selectedProvince)?.name || "";
    const area = [districtName, provinceName].filter(Boolean).join(", ");

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      streetInputRef.current,
      {
        types: ["route"], // chỉ gợi ý tên đường
        componentRestrictions: { country: "vn" },
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      const newStreet = place.name || place.formatted_address || "";
      setStreet(newStreet);
    });
  }, [selectedDistrict, selectedProvince]);

  return (
    <div className="max-w-md p-4 space-y-4">
      <h2 className="text-lg font-semibold">Chọn địa chỉ giao hàng</h2>

      {/* --- Tỉnh / Thành phố --- */}
      <div>
        <label className="block mb-1">Tỉnh / Thành phố</label>
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => {
            const value = e.target.value;
            setSelectedProvince(value);
            setSelectedDistrict("");
            setSelectedWard("");
            setStreet("");
            setDistricts([]);
            setWards([]);
            // Clear address when province changes
            if (onAddressChange) {
              onAddressChange("");
            }
          }}
          value={selectedProvince}
        >
          <option value="">-- Chọn tỉnh/thành --</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* --- Quận / Huyện --- */}
      {districts.length > 0 && (
        <div>
          <label className="block mb-1">Quận / Huyện</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedDistrict(value);
              setSelectedWard("");
              setStreet("");
              setWards([]);
              // Clear address when district changes
              if (onAddressChange) {
                onAddressChange("");
              }
            }}
            value={selectedDistrict}
          >
            <option value="">-- Chọn quận/huyện --</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* --- Phường / Xã --- */}
      {wards.length > 0 && (
        <div>
          <label className="block mb-1">Phường / Xã</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setSelectedWard(e.target.value)}
            value={selectedWard}
          >
            <option value="">-- Chọn phường/xã --</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* --- Tên đường (Autocomplete) --- */}
      {selectedWard && (
        <div>
          <label className="block mb-1">Tên đường</label>
          <input
            ref={streetInputRef}
            type="text"
            placeholder="Nhập tên đường..."
            className="w-full p-2 border rounded"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>
      )}

      {/* --- Kết quả --- */}
      {street && (
        <div className="p-2 text-sm bg-gray-100 rounded">
          <strong>Địa chỉ đầy đủ:</strong>{" "}
          {[
            street,
            wards.find((w) => w.code == selectedWard)?.name,
            districts.find((d) => d.code == selectedDistrict)?.name,
            provinces.find((p) => p.code == selectedProvince)?.name,
          ]
            .filter(Boolean)
            .join(", ")}
        </div>
      )}
    </div>
  );
}
