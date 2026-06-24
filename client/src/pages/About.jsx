import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Về Chúng Tôi</h1>

          {/* Ảnh */}
          <div className="overflow-hidden rounded-2xl shadow-md">
            <img
              src={assets.about_bg}
              alt="About us"
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
          </div>

          {/* Nội dung */}
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-gray-700">
            Chúng tôi mang đến những thiết kế thời trang hiện đại, tinh tế và
            chất lượng, giúp bạn tự tin thể hiện phong cách riêng.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Sứ Mệnh Của Chúng Tôi
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Chúng tôi thành lập với mong muốn mang đến cho khách hàng những
                sản phẩm thời trang chất lượng, phù hợp xu hướng và giá cả hợp
                lý.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Từng sản phẩm đều được lựa chọn kỹ lưỡng, từ chất liệu, kiểu
                dáng cho đến từng chi tiết may mặc, để mang đến trải nghiệm tốt
                nhất cho khách hàng.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-pink-100 px-4 py-2 rounded-full">
                  <span className="text-pink-800 font-medium">
                    Thiết Kế Hiện Đại
                  </span>
                </div>
                <div className="bg-pink-100 px-4 py-2 rounded-full">
                  <span className="text-pink-800 font-medium">
                    Chất Liệu Cao Cấp
                  </span>
                </div>
                <div className="bg-pink-100 px-4 py-2 rounded-full">
                  <span className="text-pink-800 font-medium">
                    Phong Cách Đa Dạng
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={assets.hero_img}
                alt="Fashion Store"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những giá trị làm nên thương hiệu và định hướng phát triển của
              chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chất Lượng
              </h3>
              <p className="text-gray-600">
                Sản phẩm được chọn lọc kỹ lưỡng, chú trọng từ chất liệu đến từng
                chi tiết nhỏ nhất.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Thời Trang
              </h3>
              <p className="text-gray-600">
                Luôn cập nhật xu hướng mới nhất để mang đến phong cách hiện đại
                và phù hợp với từng khách hàng.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Khách Hàng
              </h3>
              <p className="text-gray-600">
                Luôn lắng nghe và đồng hành cùng khách hàng để mang đến trải
                nghiệm mua sắm tốt nhất.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Đội Ngũ Của Chúng Tôi
            </h2>
            <p className="text-lg text-gray-600">
              Những con người nhiệt huyết đứng sau thương hiệu thời trang của
              chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <img
                src={assets.hero_img}
                alt="CEO"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Lê Thị Bích My
              </h3>
              <p className="text-pink-600 mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Người sáng lập thương hiệu, định hướng phát triển và phong cách
                của cửa hàng.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <img
                src={assets.dev_logo}
                alt="Designer"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nguyễn Trung Tài
              </h3>
              <p className="text-pink-600 mb-2">Head of Design</p>
              <p className="text-gray-600 text-sm">
                Nhà thiết kế chính, mang đến những bộ sưu tập thời trang độc đáo
                và sáng tạo.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <img
                src={assets.logo}
                alt="Marketing Director"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Huỳnh Thị Thanh Nhung
              </h3>
              <p className="text-pink-600 mb-2">Marketing Director</p>
              <p className="text-gray-600 text-sm">
                Người phụ trách xây dựng thương hiệu, quảng bá và kết nối với
                khách hàng.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center text-gray-600 text-sm py-8">
        CÔNG TY TNHH THỜI TRANG STYLE | MST: 0386659647 | 165 Âu Dương Lân,
        Phường 2, Quận 8, TP HCM. Hotline: 0906 954 368 | Email: cskh@fitme.com
      </footer>
    </div>
  );
};

export default About;
