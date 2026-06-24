import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix lỗi icon mặc định của Leaflet trong React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function MapPicker({ onSelect }) {
  const [position, setPosition] = useState([21.0285, 105.8542]); // Hà Nội
  const [search, setSearch] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef();

  // Hàm lấy địa chỉ từ tọa độ (reverse geocoding)
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      setIsLoading(true);
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && data.display_name) {
        const formattedAddress = data.display_name;
        setAddress(formattedAddress);

        // Gửi dữ liệu về component cha
        if (onSelect && typeof onSelect === "function") {
          onSelect({
            address: formattedAddress,
            location: {
              type: "Point",
              coordinates: [lng, lat], // GeoJSON format: [longitude, latitude]
            },
            coordinates: [lat, lng], // Leaflet format: [latitude, longitude]
          });
        }

        return formattedAddress;
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
      setAddress("Không thể lấy được địa chỉ");
    } finally {
      setIsLoading(false);
    }
  };

  // Tìm kiếm địa chỉ
  const handleSearch = async () => {
    if (!search) return;

    try {
      setIsLoading(true);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        search + ", Việt Nam"
      )}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newPos = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPos);
        mapRef.current?.setView(newPos, 15);

        // Lấy địa chỉ chi tiết cho vị trí được tìm thấy
        await getAddressFromCoordinates(parseFloat(lat), parseFloat(lon));
      } else {
        alert("Không tìm thấy địa chỉ!");
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      alert("Có lỗi xảy ra khi tìm kiếm địa chỉ!");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi click trên bản đồ
  const handleMapClick = async (latlng) => {
    const newPos = [latlng.lat, latlng.lng];
    setPosition(newPos);
    await getAddressFromCoordinates(latlng.lat, latlng.lng);
  };

  // Lấy địa chỉ cho vị trí mặc định khi component mount
  useEffect(() => {
    getAddressFromCoordinates(position[0], position[1]);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">
        📍 Chọn vị trí trên bản đồ hoặc nhập địa chỉ
      </h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nhập địa chỉ (VD: 1600 Võ Văn Kiệt, TP.HCM)"
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 min-w-[60px]"
        >
          {isLoading ? "..." : "Tìm"}
        </button>
      </div>

      <div className="h-[500px] w-full rounded-lg overflow-hidden shadow border">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(map) => (mapRef.current = map)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}></Marker>
          <LocationMarker onSelect={handleMapClick} />
        </MapContainer>
      </div>

      {/* Hiển thị thông tin địa chỉ */}
      <div className="space-y-2">
        <div className="p-3 border rounded-lg bg-gray-50">
          <div className="mb-1 text-sm font-medium text-gray-700">
            📍 Địa chỉ đã chọn:
            {isLoading && (
              <span className="ml-2 text-blue-600">(đang lấy địa chỉ...)</span>
            )}
          </div>
          <div className="text-gray-800">{address || "Chưa có địa chỉ"}</div>
        </div>

        <div className="p-2 text-sm text-gray-600 border rounded bg-blue-50">
          <strong>Tọa độ:</strong> {position[0].toFixed(6)},{" "}
          {position[1].toFixed(6)}
          <br />
          <span className="text-xs text-gray-500">
            💡 Click trên bản đồ để chọn vị trí mới
          </span>
        </div>
      </div>
    </div>
  );
}
