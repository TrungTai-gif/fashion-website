import { assets } from "../../assets/assets";
import Title from "../common/Title";

const PaymentInfo = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <>
      <div className="mb-6">
        <div className="text-xl sm:text-2xl mb-4">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col gap-3">
          {/* <label className="flex items-center cursor-pointer ">
            <input
              checked={paymentMethod === "stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              type="radio"
              name="payment"
              value="stripe"
              className="mr-3"
            />
            <img className="w-20" src={assets.stripe_logo} alt="" />
          </label> */}

          {/* <label className="flex items-center cursor-pointer">
            <input
              checked={paymentMethod === "razorpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              type="radio"
              name="payment"
              value="razorpay"
              className="mr-3"
            />
            <img className="w-20" src={assets.razorpay_logo} alt="" />
          </label> */}

          <label className="flex items-center cursor-pointer">
            <input
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              type="radio"
              name="payment"
              value="cod"
              className="mr-3"
            />
            <span>Cash on Delivery</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default PaymentInfo;
