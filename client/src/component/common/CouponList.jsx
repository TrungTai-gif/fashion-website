import { useEffect, useState } from "react";
import { couponService } from "../../services/couponService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState(null);

  const { getValidCoupons } = couponService();
  const { data } = useQuery({
    queryKey: ["coupons"],
    queryFn: getValidCoupons,
  });

  useEffect(() => {
    if (data) setCoupons(data);
  }, [data]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);

    toast.info("Đã sao chép mã: " + code);
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (coupons.length === 0)
    return <p className="text-sm text-gray-500">Chưa có mã giảm giá.</p>;

  return (
    <div className="p-3 bg-white rounded-xl">
      <h3 className="font-semibold text-lg mb-2">🎉 Mã giảm giá</h3>

      <div className="flex flex-col md:flex-row gap-2">
        {coupons.map((c) => (
          <div
            key={c._id}
            onClick={() => copyCode(c.code)}
            className="
              flex justify-between items-center 
              p-2 border rounded-lg bg-orange-50 cursor-pointer 
              hover:bg-orange-100 transition
            "
          >
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-orange-700 text-sm">
                {c.code}
              </span>
              <span className="text-xs text-gray-600">
                {c.description || "Giảm giá hấp dẫn"}
              </span>
            </div>

            <span className="text-[10px] text-gray-500">
              HSD {new Date(c.validTo).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponList;
