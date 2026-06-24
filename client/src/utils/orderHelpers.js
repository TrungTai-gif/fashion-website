/**
 * Helper functions for Order operations
 */

/**
 * Format cart items to order items
 * @param {Array} cartItems - Items from cart store
 * @returns {Array} Formatted items for order
 */
export const formatCartItemsForOrder = (cartItems) => {
  console.log("iten", cartItems);
  return cartItems.map((item) => ({
    productId: item.product._id,
    variantId: item.variant._id,
    name: item.product.name,
    image: item.variant.image || item.product.image,
    // price: item.price,
    quantity: item.quantity,
  }));
};

/**
 * Calculate order total
 * @param {Array} cartItems - Items from cart
 * @param {Number} shippingFee - Shipping fee
 * @param {Number} discount - Discount amount
 * @returns {Object} Order totals
 */
export const calculateOrderTotal = (shippingFee = 0, discount = 0) => {
  const totalAmount = shippingFee - discount;

  return {
    shippingFee,
    discount,
    totalAmount,
  };
};

/**
 * Create order data object
 * @param {Object} params - Order parameters
 * @returns {Object} Formatted order data
 */

export const createOrderData = ({
  user,
  formData,
  cartItems,
  paymentMethod,
  totalAmount,
  delivery_fee,
  coupon = {},
}) => {
  const items = formatCartItemsForOrder(cartItems);

  const fee = coupon?.discountAmount || 0;

  return {
    userId: user?.id || null,
    name: formData.fullName,
    email: formData.email,
    items: items,
    shippingAddress: {
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.addressDetail,
    },
    coupon: {
      code: coupon?.code,
      discountAmount: coupon?.discountAmount,
    },
    paymentMethod: paymentMethod,
    totalAmount: totalAmount + delivery_fee - fee,
    shippingFee: delivery_fee,
    notes: formData.notes || "",
  };
};

/**
 * Validate order form
 * @param {Object} formData - Form data
 * @param {Array} cartItems - Cart items
 * @returns {Object} Validation result
 */
export const validateOrderForm = (formData, cartItems) => {
  if (!formData.fullName?.trim()) {
    return { isValid: false, message: "Vui lòng nhập họ tên!" };
  }

  if (!formData.email?.trim()) {
    return { isValid: false, message: "Vui lòng nhập email!" };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { isValid: false, message: "Email không hợp lệ!" };
  }

  //   if (!formData.phone?.trim()) {
  //     return { isValid: false, message: "Vui lòng nhập số điện thoại!" };
  //   }

  //   // Phone validation (Vietnamese phone number)
  //   const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  //   if (!phoneRegex.test(formData.phone)) {
  //     return { isValid: false, message: "Số điện thoại không hợp lệ!" };
  //   }

  if (!formData.addressDetail?.trim()) {
    return { isValid: false, message: "Vui lòng nhập địa chỉ giao hàng!" };
  }

  if (!cartItems || cartItems.length === 0) {
    return { isValid: false, message: "Giỏ hàng trống!" };
  }

  return { isValid: true, message: "" };
};

export const formatCartItemsForEmail = (cartItems) => {
  return cartItems.map((item) => ({
    name: item.product.name,
    // price: item.product.price,
    quantity: item.quantity,
  }));
};
/**
 * Format currency for display
 * @param {Number} amount - Amount to format
 * @param {String} currency - Currency symbol
 * @returns {String} Formatted currency string
 */
export const formatCurrency = (amount, currency = "đ") => {
  return `${amount.toLocaleString("vi-VN")} ${currency}`;
};
