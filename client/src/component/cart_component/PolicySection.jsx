import { ShieldCheck, RefreshCcw, Truck, Headphones } from "lucide-react";

const PolicySection = () => {
  const policies = [
    {
      icon: <Truck className="w-6 h-6 text-blue-600" />,
      title: "Giao hàng nhanh chóng",
      description:
        "Miễn phí giao hàng cho đơn từ 500.000đ, giao trong 2-5 ngày.",
    },
    {
      icon: <RefreshCcw className="w-6 h-6 text-green-600" />,
      title: "Đổi trả dễ dàng",
      description:
        "Hỗ trợ đổi trả trong 7 ngày nếu sản phẩm lỗi hoặc không vừa.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-yellow-600" />,
      title: "Cam kết chính hãng",
      description:
        "Tất cả sản phẩm đều được kiểm định và đảm bảo 100% chính hãng.",
    },
    {
      icon: <Headphones className="w-6 h-6 text-pink-600" />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.",
    },
  ];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6 mb-20 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Chính sách mua hàng & đổi trả
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {policies.map((policy, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div>{policy.icon}</div>
            <div>
              <h3 className="text-md font-medium text-gray-800">
                {policy.title}
              </h3>
              <p className="text-md text-gray-600">{policy.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicySection;
