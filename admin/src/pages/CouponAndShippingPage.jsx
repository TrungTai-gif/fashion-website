import React, { useState } from "react";
import CouponManagement from "../components/coupon_component/CouponManagement";
import ShippingManagement from "../components/delivery_component/ShippingManagement";
import { MdLocalOffer, MdLocalShipping } from "react-icons/md";

const CouponAndShippingPage = () => {
  const [activeTab, setActiveTab] = useState("coupons");

  const tabs = [
    {
      id: "coupons",
      label: "Quản lý Coupon",
      icon: MdLocalOffer,
      component: CouponManagement,
    },
    {
      id: "shipping",
      label: "Quản lý Phí Vận Chuyển",
      icon: MdLocalShipping,
      component: ShippingManagement,
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50 rounded-2xl">
      {/* Header */}
      <div className="bg-white border-b shadow-sm rounded-2xl">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Coupon & Phí Vận Chuyển
          </h1>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors duration-200`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">{ActiveComponent && <ActiveComponent />}</div>
    </div>
  );
};

export default CouponAndShippingPage;
