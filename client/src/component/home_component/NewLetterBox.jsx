const NewsletterBox = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gửi dữ liệu email đến API hoặc service
  };

  return (
    <div className="text-center max-w-2xl mx-auto px-4 my-20">
      <p className="text-2xl font-bold text-gray-800">
        Đăng ký nhận bản tin và giảm ngay 20%
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Nhập email của bạn để nhận các ưu đãi đặc biệt, tin tức sản phẩm mới và
        khuyến mãi hấp dẫn từ chúng tôi.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-3/4 flex items-center gap-3 mx-auto mt-6 border rounded-lg pl-3 overflow-hidden"
      >
        <input
          className="w-full sm:flex-1 outline-none py-2 text-sm"
          type="email"
          placeholder="Nhập email của bạn"
          required
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
