import { useState } from "react";
import { Shield, CheckCircle } from "lucide-react";

import ChangePasswordForm from "./changePasswordForm";

const SecurityTab = () => {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className="p-8">
        {/* Header Section */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-blue-800 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Bảo mật tài khoản
            </h2>
            <p className="text-gray-600">Quản lý bảo mật và mật khẩu</p>
          </div>
        </div>

        {/* Security Status */}
        <div className=" border rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-200" />
              </div>
              <div>
                <h3 className="font-semibold text-black">
                  Tài khoản được bảo vệ
                </h3>
                <p className="text-black text-sm">
                  Tài khoản của bạn đã được xác thực và bảo mật
                </p>
              </div>
            </div>
            {!showEdit && (
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center space-x-2 px-2 py-1 bg-indigo-700 text-white rounded-xl hover:bg-indigo-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Đổi mật khẩu</span>
              </button>
            )}
          </div>
        </div>

        {showEdit && <ChangePasswordForm setShowEdit={setShowEdit} />}
      </div>
    </>
  );
};

export default SecurityTab;
