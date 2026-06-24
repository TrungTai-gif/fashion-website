import { useState, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

const defaultCenter = {
  lat: 10.77653,
  lng: 106.700981,
};

export default function LocationPicker({ onSelect }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");

  const handleMapClick = useCallback(
    async (event) => {
      try {
        setIsGeocoding(true);
        setGeocodeError("");

        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setMarker({ lat, lng });

        // Kiểm tra API key
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          throw new Error("Google Maps API key chưa được cấu hình");
        }

        // Reverse geocoding: tọa độ -> địa chỉ
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
        const res = await fetch(geocodeUrl);

        if (!res.ok) {
          throw new Error(`Lỗi API: ${res.status}`);
        }

        const data = await res.json();

        console.log(data);

        if (data.status !== "OK") {
          throw new Error(`Geocoding error: ${data.status}`);
        }

        // const formatted =
        //   data.results?.[0]?.formatted_address || "Không xác định được địa chỉ";
        // setAddress(formatted);

        // // Gửi dữ liệu cho parent (form)
        // if (onSelect && typeof onSelect === "function") {
        //   onSelect({
        //     address: formatted,
        //     location: {
        //       type: "Point",
        //       coordinates: [lng, lat],
        //     },
        //   });
        // }
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ:", error);
        setGeocodeError(error.message);
        setAddress("Không thể lấy được địa chỉ");
      } finally {
        setIsGeocoding(false);
      }
    },
    [onSelect]
  );

  // Xử lý khi người dùng nhập địa chỉ trực tiếp
  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);

    // Nếu có marker, gửi dữ liệu với địa chỉ mới
    if (marker && onSelect && typeof onSelect === "function") {
      onSelect({
        address: newAddress,
        location: {
          type: "Point",
          coordinates: [marker.lng, marker.lat],
        },
      });
    }
  };

  if (loadError) {
    return (
      <div className="p-4 border border-red-300 rounded-md bg-red-50">
        <p className="text-red-600">Lỗi tải Google Maps: {loadError.message}</p>
        <p className="mt-1 text-sm text-red-500">
          Vui lòng kiểm tra Google Maps API key và kết nối internet.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8 border border-gray-300 rounded-md">
        <div className="text-center">
          <div className="w-6 h-6 mx-auto mb-2 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          <p className="text-gray-600">Đang tải bản đồ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-3">
      <label className="block text-sm font-medium text-gray-600">
        📍 Chọn vị trí đại lý trên bản đồ (click để chọn)
      </label>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker || defaultCenter}
        zoom={13}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>

      <div className="mt-2">
        <label className="text-sm font-semibold text-gray-700">
          Địa chỉ:{" "}
          {isGeocoding && (
            <span className="text-blue-600">(đang lấy địa chỉ...)</span>
          )}
        </label>
        <input
          className={`w-full px-3 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            geocodeError ? "border-red-300" : "border-gray-300"
          }`}
          value={address}
          onChange={handleAddressChange}
          placeholder="Nhập hoặc chọn địa chỉ trên bản đồ"
          disabled={isGeocoding}
        />
        {geocodeError && (
          <p className="mt-1 text-sm text-red-600">{geocodeError}</p>
        )}
        {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
          <p className="mt-1 text-sm text-orange-600">
            ⚠️ Chưa cấu hình Google Maps API key. Vui lòng thêm
            VITE_GOOGLE_MAPS_API_KEY vào file .env
          </p>
        )}
      </div>
    </div>
  );
}
