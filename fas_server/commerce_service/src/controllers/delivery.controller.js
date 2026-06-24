import DeliveryService from "../services/delivery.service.js";
import ApiError from "../utils/ApiError.js";

class DeliveryController {
  // CREATE - Tạo phương thức giao hàng mới
  async createDelivery(req, res, next) {
    try {
      const deliveryData = req.body;

      const delivery = await DeliveryService.createDelivery(deliveryData);

      res.status(201).json({
        success: true,
        message: "Tạo phương thức giao hàng thành công",
        data: delivery,
      });
    } catch (err) {
      next(err);
    }
  }

  // READ - Lấy tất cả phương thức giao hàng (Admin)
  async getAllDeliveries(req, res, next) {
    try {
      const filters = {
        isActive: req.query.isActive,
        page: req.query.page || 1,
        limit: req.query.limit || 20,
      };

      const result = await DeliveryService.getAllDeliveries(filters);

      res.status(200).json({
        success: true,
        message: "Lấy danh sách phương thức giao hàng thành công",
        data: result.deliveries,
        pagination: result.pagination,
      });
    } catch (err) {
      next(err);
    }
  }

  // READ - Lấy phương thức giao hàng theo ID
  async getDeliveryById(req, res, next) {
    try {
      const { id } = req.params;

      const delivery = await DeliveryService.getDeliveryById(id);

      res.status(200).json({
        success: true,
        message: "Lấy thông tin phương thức giao hàng thành công",
        data: delivery,
      });
    } catch (err) {
      next(err);
    }
  }

  // UPDATE - Cập nhật phương thức giao hàng
  async updateDelivery(req, res, next) {
    try {
      const { id } = req.params;
      const deliveryData = req.body;

      const delivery = await DeliveryService.updateDelivery(id, deliveryData);

      res.status(200).json({
        success: true,
        message: "Cập nhật phương thức giao hàng thành công",
        data: delivery,
      });
    } catch (err) {
      next(err);
    }
  }

  // DELETE - Xóa phương thức giao hàng
  async deleteDelivery(req, res, next) {
    try {
      const { id } = req.params;

      const result = await DeliveryService.deleteDelivery(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  // Utility - Tính phí giao hàng
  async calculateShippingFee(req, res, next) {
    try {
      const { id } = req.params;
      const { orderAmount } = req.body;

      if (!orderAmount || orderAmount < 0) {
        throw new ApiError(400, "Giá trị đơn hàng không hợp lệ");
      }

      const result = await DeliveryService.calculateShippingFee(
        id,
        orderAmount
      );

      res.status(200).json({
        success: true,
        message: "Tính phí giao hàng thành công",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new DeliveryController();
