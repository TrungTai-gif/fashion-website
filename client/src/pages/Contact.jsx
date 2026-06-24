import { toast } from "react-toastify";
const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Gửi liên hệ thành công!");
  };
  return (
    <>
      <div>
        <div className="flex flex-col justify-center lg:flex-row gap-5 p-20">
          <div className="flex gap-2 w-3/4  flex-col lg:w-1/3">
            <h1 className="mb-3 text-xl">THÔNG TIN LIÊN HỆ</h1>

            <div className="font-bold">Địa chỉ:</div>
            <strong>Khu vực HCM</strong>
            <a href="#" rel="nofollow" target="_blank">
              CH Quận Tân Bình: 81 Nguyễn Minh Hoàng, P.12, Q. Tân Bình, TP.HCM
            </a>
            <a href="#" rel="nofollow" target="_blank">
              CH Quận 7: 160 Lâm Văn Bền, P. Tân Quy, Q.7, TP. HCM
            </a>

            <div className="font-bold">Giờ mở cửa:</div>
            <p>⏰ Thứ 2 - Chủ Nhật: 7:30 - 18:00</p>

            <div className="font-bold">
              Số điện thoại:{" "}
              <a className="link" title="0865399080" href="">
                0865399080
              </a>
            </div>

            <div className="font-bold">
              Email:{" "}
              <a title="emial.vn " className="link" href="mailto:email.vn ">
                TrungTai@gmail.com
              </a>
            </div>
          </div>

          <div className="flex flex-col w-3/4 lg:w-1/3 ">
            <h1 className="mb-3 text-xl">LIÊN HỆ VỚI CHÚNG TÔI</h1>
            <form
              onSubmit={handleSubmit}
              className="flex my-5 py-10 flex-col space-y-4 border p-5 rounded-2xl"
            >
              <input
                placeholder="Họ tên*"
                type="text"
                className="border p-2 rounded-xl"
                required=""
              />

              <input
                placeholder="Email*"
                type="email"
                required=""
                className="border p-2 rounded-xl"
              />

              <input
                placeholder="Số điện thoại*"
                type="number"
                className="border p-2 rounded-xl"
                required=""
              />

              <label htmlFor="comment">Nội dung</label>
              <textarea
                placeholder="Nhập nội dung*"
                id="comment"
                className="border p-2 rounded-xl"
                rows="5"
                required=""
              ></textarea>

              <button
                type="submit"
                className=" border p-2 rounded-xl bg-amber-300"
              >
                Gửi liên hệ của bạn
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
