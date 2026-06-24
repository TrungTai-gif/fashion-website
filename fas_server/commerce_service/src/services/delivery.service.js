import Delivery from "../models/delivery.model.js";
import ApiError from "../utils/ApiError.js";

class DeliveryService {
  // CREATE - Tạo mới delivery
  async createDelivery(deliveryData) {
    try {
      // Validate dữ liệu
      if (deliveryData.maxDeliveryDays < deliveryData.deliveryDays) {
        throw new ApiError(
          400,
          "Thời gian giao hàng tối đa phải lớn hơn hoặc bằng thời gian giao hàng tối thiểu"
        );
      }

      const delivery = new Delivery(deliveryData);
      const createdDelivery = await delivery.save();

      return createdDelivery;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(
        500,
        "Lỗi khi tạo phương thức giao hàng: " + err.message
      );
    }
  }

  // READ - Lấy tất cả delivery
  async getAllDeliveries(filters = {}) {
    try {
      const { isActive, page = 1, limit = 20 } = filters;

      // Tạo query
      const query = {};
      if (isActive !== undefined) {
        query.isActive = isActive === "true";
      }

      const skip = (page - 1) * limit;

      const [deliveries, total] = await Promise.all([
        Delivery.find(query)
          .sort({ isActive: -1, baseFee: 1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Delivery.countDocuments(query),
      ]);

      return {
        deliveries,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      throw new ApiError(
        500,
        "Lỗi khi lấy danh sách phương thức giao hàng: " + err.message
      );
    }
  }

  // READ - Lấy delivery theo ID
  async getDeliveryById(deliveryId) {
    try {
      const delivery = await Delivery.findById(deliveryId);

      if (!delivery) {
        throw new ApiError(404, "Không tìm thấy phương thức giao hàng");
      }

      return delivery;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(
        500,
        "Lỗi khi lấy thông tin phương thức giao hàng: " + err.message
      );
    }
  }

  // UPDATE - Cập nhật delivery
  async updateDelivery(deliveryId, deliveryData) {
    try {
      const delivery = await Delivery.findById(deliveryId);

      if (!delivery) {
        throw new ApiError(404, "Không tìm thấy phương thức giao hàng");
      }

      // Validate dữ liệu
      if (deliveryData.maxDeliveryDays < deliveryData.deliveryDays) {
        throw new ApiError(
          400,
          "Thời gian giao hàng tối đa phải lớn hơn hoặc bằng thời gian giao hàng tối thiểu"
        );
      }

      const updatedDelivery = await Delivery.findByIdAndUpdate(
        deliveryId,
        deliveryData,
        { new: true, runValidators: true }
      );

      return updatedDelivery;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(
        500,
        "Lỗi khi cập nhật phương thức giao hàng: " + err.message
      );
    }
  }

  // DELETE - Xóa delivery
  async deleteDelivery(deliveryId) {
    try {
      const delivery = await Delivery.findById(deliveryId);

      if (!delivery) {
        throw new ApiError(404, "Không tìm thấy phương thức giao hàng");
      }

      await Delivery.findByIdAndDelete(deliveryId);

      return { message: "Xóa phương thức giao hàng thành công" };
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(
        500,
        "Lỗi khi xóa phương thức giao hàng: " + err.message
      );
    }
  }

  // Utility - Tính phí giao hàng cho đơn hàng
  async calculateShippingFee(deliveryId, orderAmount) {
    try {
      const delivery = await this.getDeliveryById(deliveryId);

      if (!delivery.isActive) {
        throw new ApiError(
          400,
          "Phương thức giao hàng này hiện không khả dụng"
        );
      }

      const shippingFee = delivery.calculateShippingFee(orderAmount);
      const isFreeShipping = delivery.isFreeShipping(orderAmount);

      return {
        deliveryId: delivery._id,
        deliveryName: delivery.name,
        baseFee: delivery.baseFee,
        shippingFee,
        isFreeShipping,
        freeShippingMinAmount: delivery.freeShippingMinAmount,
        deliveryTimeRange: delivery.deliveryTimeRange,
        estimatedDelivery: {
          min: delivery.deliveryDays,
          max: delivery.maxDeliveryDays,
        },
      };
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, "Lỗi khi tính phí giao hàng: " + err.message);
    }
  }
}

export default new DeliveryService();
