import Order from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";
import Variant from "../models/variant.model.js";

class OrderService {
  async createOrder(orderData) {
    try {
      if (!orderData.items || orderData.items.length === 0) {
        throw new ApiError(400, "Order must have at least one item");
      }

      let variantPrice = 0;

      // Kiểm tra tồn kho và tính tổng giá
      for (const item of orderData.items) {
        if (item.variantId) {
          const variant = await Variant.findById(item.variantId);

          if (!variant) {
            throw new ApiError(404, `Variant not found for: ${item.name}`);
          }

          // Kiểm tra tồn kho
          if (variant.stock < item.quantity) {
            throw new ApiError(
              400,
              `Sản phẩm "${item.name}" không đủ hàng. Còn lại: ${variant.stock}`
            );
          }

          // Bổ sung field price cho item
          item.price = variant.price;
        }
      }

      // Tạo đơn hàng mới
      const order = new Order({
        ...orderData,
      });

      const createdOrder = await order.save();
      return createdOrder;
      return order;
    } catch (err) {
      throw err;
    }
  }

  async getOrdersByUserId(userId) {
    return Order.find({ userId: userId }).sort({ createdAt: -1 }).lean();
  }

  async getAllOrders(filters = {}) {
    const { page = 1, limit = 20, status } = filters;

    // Tạo query linh hoạt
    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderDetails(orderId) {
    const order = await Order.findById(orderId).lean();
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    return order;
  }

  async updateOrderStatus(orderId, newStatus) {
    try {
      // Populate để lấy thông tin variant
      const order = await Order.findById(orderId).populate("items.variantId");

      if (!order) throw new ApiError(404, "Order not found");

      const oldStatus = order.status;

      // Validate status transition
      const validStatuses = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ];

      if (!validStatuses.includes(newStatus)) {
        throw new ApiError(400, `Invalid status: ${newStatus}`);
      }

      // Logic trừ kho khi chuyển sang "confirmed"
      if (newStatus === "confirmed" && oldStatus !== "confirmed") {
        for (const item of order.items) {
          if (!item.variantId) {
            throw new ApiError(400, `Variant not found for item: ${item.name}`);
          }

          const variant = await Variant.findById(item.variantId);

          if (!variant) {
            throw new ApiError(404, `Variant not found: ${item.variantId}`);
          }

          // Kiểm tra tồn kho
          if (variant.stock < item.quantity) {
            throw new ApiError(
              400,
              `Sản phẩm "${item.name}" không đủ hàng. Còn lại: ${variant.stock}, yêu cầu: ${item.quantity}`
            );
          }

          // Trừ kho
          console.log("đã trừ kho " + item.quantity);
          variant.stock -= item.quantity;
          await variant.save();
        }
      }

      // Logic cộng lại kho khi hủy đơn
      if (newStatus === "cancelled" && oldStatus === "confirmed") {
        for (const item of order.items) {
          if (!item.variantId) continue;

          const variant = await Variant.findById(item.variantId);

          if (variant) {
            // Cộng lại kho
            console.log("đã cộng kho " + item.quantity);
            variant.stock += item.quantity;
            await variant.save();
          }
        }
      }

      // Trường hợp đặc biệt: Hủy đơn đang giao hoặc đã giao
      if (
        newStatus === "cancelled" &&
        (oldStatus === "shipped" || oldStatus === "delivered")
      ) {
        for (const item of order.items) {
          if (!item.variantId) continue;

          const variant = await Variant.findById(item.variantId);

          if (variant) {
            console.log("đã cộng kho " + item.quantity);
            variant.stock += item.quantity;
            await variant.save();
          }
        }
      }

      // Cập nhật trạng thái đơn hàng
      order.status = newStatus;
      await order.save();

      return order;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Claim guest orders by email when user logs in
   * Updates userId for all orders with matching email where userId is null
   */
  async claimGuestOrdersByEmail(email, userId) {
    try {
      // Find all guest orders with matching email
      const result = await Order.updateMany(
        {
          email: email,
          userId: null,
        },
        {
          $set: { userId: userId },
        }
      );

      return {
        success: true,
        claimedOrders: result.modifiedCount,
        message: `Successfully claimed ${result.modifiedCount} guest order(s)`,
      };
    } catch (err) {
      throw new ApiError(500, "Failed to claim guest orders: " + err.message);
    }
  }

  async getOrdersByEmail(email, userId = null) {
    try {
      const query = { email: email };

      // If userId provided, include orders with this userId OR matching email
      if (userId) {
        query.$or = [{ userId: userId }, { email: email, userId: null }];
        delete query.email;
      }

      const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

      return orders;
    } catch (err) {
      throw new ApiError(500, "Failed to fetch orders: " + err.message);
    }
  }

  async deleteOrder(orderId) {
    console.log(orderId);
    const order = await Order.deleteOne({ _id: orderId });
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    return order;
  }
}

export default new OrderService();
