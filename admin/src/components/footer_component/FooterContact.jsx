import { assets } from "../../assets/assets";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineMail } from "react-icons/md";
import { FaPhoneFlip } from "react-icons/fa6";
const FooterContact = () => {
  return (
    <>
      <div>
        <div className="flex flex-row items-center gap-2 mb-5">
          <div className="rounded-full border overflow-hidden max-w-10">
            <img className="" src={assets.logo} alt="" />
          </div>
          <p className="prata-regular text-2xl">FIT ME</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="">
            CÔNG TY CỔ PHẦN TẬP ĐOÀN FITME Mã số doanh nghiệp 11100011, do Sở kế
            hoạch và đầu tư Thành phố HCM cấp ngày 30/03/2025 Người chịu trách
            nhiệm quản lý website: Secret.
          </div>
          <div className="flex flex-row items-center gap-3">
            <CiLocationOn className="w-6 h-6" />
            <span>165 Âu Dương Lân, Phường 2 Quận 8 Hồ Chí Minh</span>
          </div>
          <div className="flex flex-row items-center gap-3">
            <MdOutlineMail />
            <span>TrungTai@gmail.com</span>
          </div>
          <div className="flex flex-row items-center gap-3">
            <FaPhoneFlip />

            <span>+84 386 659 641</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterContact;
