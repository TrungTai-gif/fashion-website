import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";

const LogoUpload = ({ logo, setLogo, size = "w-24 h-24", className = "" }) => {
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!logo) {
      setPreview("");
      return;
    }

    // Nếu logo là File object (vừa chọn)
    if (logo instanceof File) {
      const objectUrl = URL.createObjectURL(logo);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    if (typeof logo === "string") {
      setPreview(logo);
    }
  }, [logo]);

  // Khi user chọn file mới
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB!");
      return;
    }
    setLogo(file);
  };

  const handleRemoveLogo = () => {
    setPreview("");
    // setLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Logo thương hiệu
      </label>

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Logo preview"
            className={`${size} object-cover rounded-lg border-2 border-gray-200 shadow-sm`}
          />
          <button
            type="button"
            onClick={handleRemoveLogo}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            title="Xóa logo"
          >
            <IoMdClose className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`${size} border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors`}
        >
          <svg
            className="w-8 h-8 text-gray-400 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="text-xs text-gray-500">Upload</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleLogoChange}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Chấp nhận: JPG, PNG, GIF. Tối đa 5MB.
      </p>
    </div>
  );
};

export default LogoUpload;
