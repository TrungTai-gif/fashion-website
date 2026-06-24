import { Camera } from "lucide-react";
import { assets } from "../../assets/assets";

const ProfileHeader = ({ profile }) => {
  return (
    <div className="relative overflow-hidden   border-b-1  border-gray-300 mb-5 pb-5">
      <div className="p-4 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 text-center sm:text-left">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-gray-200">
            <img
              src={profile?.avatar || assets.user_img}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition">
            <Camera className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Thông tin */}
        <div className="mt-3 sm:mt-0">
          <h1 className="text-lg font-semibold text-gray-900 mb-0">
            {profile?.name}
          </h1>
          <p className="text-sm text-gray-600">{profile?.email}</p>

          <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-100">
              {profile?.role === "admin" ? "Quản trị viên" : "Người dùng"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
