export const generateForgotPasswordEmail = ({ userName, otpCode }) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #fce4ec; padding: 20px;">
    <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <tr>
        <td style="background-color: #E91E63; color: #fff; text-align: center; padding: 20px 0;">
          <h2 style="margin: 0;">ĐẶT LẠI MẬT KHẨU</h2>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding: 30px;">
          <p>Xin chào <strong>${userName}</strong>,</p>
          <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>Fashionista Shop</strong> 💖</p>
          <p>Vui lòng sử dụng mã OTP bên dưới để xác minh yêu cầu:</p>

          <div style="text-align: center; margin: 24px 0;">
            <span style="
              display: inline-block;
              font-size: 30px;
              font-weight: bold;
              letter-spacing: 8px;
              background-color: #f8bbd0;
              color: #E91E63;
              padding: 14px 24px;
              border-radius: 8px;
            ">
              ${otpCode}
            </span>
          </div>

          <p style="font-size: 15px;">
            Mã OTP sẽ hết hạn sau <strong>5 phút</strong>.<br /> 
            Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
          </p>

          <p style="margin-top: 24px;">
            Trân trọng,<br />
            <strong>Đội ngũ Fashionista Shop</strong><br />
            📞 Hotline: 0901 234 567<br />
            🌐 <a href="https://fashionshop.vn" target="_blank">https://fashionshop.vn</a>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background-color: #f8bbd0; text-align: center; color: #555; font-size: 13px; padding: 12px;">
          © 2025 Fashionista Shop. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `;
};
