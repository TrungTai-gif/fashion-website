export const generateOrderEmailTemplate = ({
  customerName,
  orderCode,
  otpCode,
  orderItems,
  totalAmount,
}) => {
  const itemsHTML = orderItems
    .map(
      (item) => `
<tr>
    <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${item.name}</td>
    <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align:center;">${item.quantity}</td>
   
</tr>
`
    )
    .join("");

  return `
<div style="font-family: Arial, sans-serif; color: #333; background-color: #fce4ec; padding: 20px;">
    <table width="100%"
        style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
        
        <!-- Header -->
        <tr>
            <td
                style="background-color: #E91E63; color: white; padding: 16px 24px; text-align: center; font-size: 20px;">
                XÁC NHẬN ĐƠN HÀNG #${orderCode}
            </td>
        </tr>

        <!-- Body -->
        <tr>
            <td style="padding: 24px;">
                <p>Xin chào <strong>${customerName}</strong>,</p>
                <p>🔥 Cảm ơn bạn đã mua hàng tại <strong>Fashionista Shop</strong> 💖</p>
                <p>Để xác nhận đơn hàng của bạn, vui lòng nhập mã OTP bên dưới:</p>

                <div style="text-align: center; margin: 24px 0;">
                    <span style="
              display: inline-block;
              font-size: 28px;
              letter-spacing: 6px;
              font-weight: bold;
              color: #E91E63;
              background: #f8bbd0;
              padding: 12px 24px;
              border-radius: 6px;
            ">${otpCode}</span>
                </div>

                <p><strong>Mã OTP có hiệu lực trong vòng 5 phút.</strong></p>

                <!-- Order details -->
                <h3 style="margin-top: 30px; color: #E91E63;">Chi tiết đơn hàng</h3>
                <table width="100%" style="border-collapse: collapse; margin-top: 12px;">
                    <thead>
                        <tr style="background-color: #fce4ec;">
                            <th style="padding: 8px 12px; text-align:left;">Sản phẩm</th>
                            <th style="padding: 8px 12px;">SL</th>
                            <th style="padding: 8px 12px; text-align:right;">Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>

                <p style="text-align:right; font-size:16px; margin-top: 12px;">
                    <strong>Tổng cộng: ${totalAmount.toLocaleString()}₫</strong>
                </p>

                <p style="margin-top: 24px;">Nếu bạn không thực hiện đơn hàng này, vui lòng bỏ qua email này.</p>

                <p style="margin-top: 16px; color: #777;">
                    Trân trọng,<br>
                    <strong>Đội ngũ Fashionista Shop</strong><br>
                    📞 Hotline: 0901 234 567<br>
                    🌐 <a href="https://fashionshop.vn" target="_blank">https://fashionshop.vn</a>
                </p>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="background-color: #f8bbd0; padding: 12px; text-align:center; color: #555; font-size: 13px;">
                © 2025 Fashionista Shop. All rights reserved.
            </td>
        </tr>
    </table>
</div>
`;
};
