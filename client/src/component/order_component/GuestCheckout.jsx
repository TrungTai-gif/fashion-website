import Title from "../common/Title";

const GuestCheckout = ({ form, setForm }) => {
  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="space-y-3">
          <input
            required
            className="border border-gray-300 rounded-md py-3 px-4 w-full focus:outline-none focus:border-black"
            type="text"
            placeholder="Họ và tên"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              className="border border-gray-300 rounded-md py-3 px-4 w-full focus:outline-none focus:border-black"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              required
              className="border border-gray-300 rounded-md py-3 px-4 w-full focus:outline-none focus:border-black"
              type="tel"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <input
            required
            className="border border-gray-300 rounded-md py-3 px-4 w-full focus:outline-none focus:border-black"
            type="text"
            placeholder="Địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành)"
            value={form.addressDetail}
            onChange={(e) =>
              setForm({ ...form, addressDetail: e.target.value })
            }
          />
          <textarea
            className="border border-gray-300 rounded-md py-3 px-4 w-full focus:outline-none focus:border-black"
            rows={3}
            placeholder="Ghi chú giao hàng (tuỳ chọn)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>
      </div>
    </>
  );
};

export default GuestCheckout;
