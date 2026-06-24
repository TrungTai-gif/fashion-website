import { useState } from "react";
import { User, Shield, Settings, Camera, Edit3 } from "lucide-react";
import { assets } from "../../assets/assets";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import Spinner from "../common/Spinner";
import SecurityTab from "./securityTab";
import ProfileTab from "./ProfileTab";
import { useAuth } from "../../store/authStore";
import ProfileHeader from "./ProfileHeader";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { getProfile } = userService();
  const { user } = useAuth();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getProfile(user?.id),
    enabled: !!user?.id,
  });

  const tabs = [
    {
      id: "profile",
      name: "Thông tin cá nhân",
      icon: User,
      description: "Quản lý thông tin cá nhân của bạn",
    },
    {
      id: "security",
      name: "Bảo mật",
      icon: Shield,
      description: "Thiết lập bảo mật tài khoản",
    },
  ];

  const profile = userData;

  return (
    <>
      {isLoading && <Spinner />}
      {profile && (
        <div className="min-h-screen border p-2 shadow  border-gray-200 rounded-lg bg-white">
          <div className="flex flex-row ">
            <div className="w-1/3 ">
              <div className=" rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-indigo-600" />
                  Cài đặt tài khoản
                </h3>
                <nav className="space-y-3">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full group relative overflow-hidden rounded-xl p-2 text-left transition-all duration-300 ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
                            : "text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-lg transition-colors ${
                              activeTab === tab.id
                                ? "bg-white/20"
                                : "bg-indigo-100 group-hover:bg-indigo-200"
                            }`}
                          >
                            <IconComponent
                              className={`w-5 h-5 ${
                                activeTab === tab.id
                                  ? "text-white"
                                  : "text-indigo-600"
                              }`}
                            />
                          </div>
                          <div>
                            <div
                              className={`font-medium ${
                                activeTab === tab.id
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {tab.name}
                            </div>
                            <div
                              className={`text-sm ${
                                activeTab === tab.id
                                  ? "text-white/80"
                                  : "text-gray-500"
                              }`}
                            ></div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full">
              <div className="border-l-1 overflow-hidden">
                {activeTab === "profile" && profile && (
                  <ProfileTab user={profile} />
                )}

                {activeTab === "security" && <SecurityTab />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
