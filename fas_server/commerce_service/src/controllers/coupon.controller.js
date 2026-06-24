import CouponService from "../services/coupon.service.js";
import ApiError from "../utils/ApiError.js";

class CouponController {
  // CREATE - Tạo coupon mới
  async createCoupon(req, res, next) {
    try {
      const couponData = req.body;

      const coupon = await CouponService.createCoupon(couponData);

      res.status(201).json({
        success: true,
        message: "Tạo coupon thành công",
        data: coupon,
      });
    } catch (err) {
      next(err);
    }
  }

  // READ - Lấy tất cả coupon (Admin)
  async getAllCoupons(req, res, next) {
    try {
      const filters = {
        isActive: req.query.isActive,
        discountType: req.query.discountType,
        status: req.query.status,
        page: req.query.page || 1,
        limit: req.query.limit || 20,
        search: req.query.search,
      };

      const result = await CouponService.getAllCoupons(filters);

      res.status(200).json({
        success: true,
        message: "Lấy danh sách coupon thành công",
        data: result.coupons,
        pagination: result.pagination,
      });
    } catch (err) {
      next(err);
    }
  }

  // READ - Lấy coupon theo ID
  async getCouponById(req, res, next) {
    try {
      const { id } = req.params;

      const coupon = await CouponService.getCouponById(id);

      res.status(200).json({
        success: true,
        message: "Lấy thông tin coupon thành công",
        data: coupon,
      });
    } catch (err) {
      next(err);
    }
  }

  // READ - Lấy coupon theo mã
  async getCouponByCode(req, res, next) {
    try {
      const { code } = req.params;

      const coupon = await CouponService.getCouponByCode(code);

      res.status(200).json({
        success: true,
        message: "Lấy thông tin coupon thành công",
        data: coupon,
      });
    } catch (err) {
      next(err);
    }
  }

  // READ - Lấy coupon hợp lệ (Public)
  async getValidCoupons(req, res, next) {
    try {
      const coupons = await CouponService.getValidCoupons();

      res.status(200).json({
        success: true,
        message: "Lấy coupon hợp lệ thành công",
        data: coupons,
      });
    } catch (err) {
      next(err);
    }
  }

  // UPDATE - Cập nhật coupon
  async updateCoupon(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const coupon = await CouponService.updateCoupon(id, updateData);

      res.status(200).json({
        success: true,
        message: "Cập nhật coupon thành công",
        data: coupon,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteCoupon(req, res, next) {
    try {
      const { id } = req.params;

      const result = await CouponService.deleteCoupon(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  // Utility - Validate và apply coupon
  async applyCoupon(req, res, next) {
    try {
      const { code } = req.params;
      const { orderAmount } = req.body;
      const userId = req.headers["x-user-id"] || null;

      if (!orderAmount || orderAmount <= 0) {
        throw new ApiError(400, "Giá trị đơn hàng không hợp lệ");
      }

      const result = await CouponService.applyCoupon(code, orderAmount, userId);

      res.status(200).json({
        success: true,
        message: "Áp dụng coupon thành công",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  // Utility - Đánh dấu coupon đã sử dụng
  async useCoupon(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.headers["x-user-id"] || null;

      const coupon = await CouponService.useCoupon(id, userId);

      res.status(200).json({
        success: true,
        message: "Cập nhật sử dụng coupon thành công",
        data: coupon,
      });
    } catch (err) {
      next(err);
    }
  }

  // Utility - Toggle trạng thái hoạt động
  async toggleActiveStatus(req, res, next) {
    try {
      const { id } = req.params;

      const coupon = await CouponService.toggleActiveStatus(id);

      res.status(200).json({
        success: true,
        message: `${coupon.isActive ? "Kích hoạt" : "Tắt"} coupon thành công`,
        data: coupon,
      });
    } catch (err) {
      next(err);
    }
  }

  // Statistics - Thống kê coupon
  async getCouponStats(req, res, next) {
    try {
      const { id } = req.params;

      const stats = await CouponService.getCouponStats(id);

      res.status(200).json({
        success: true,
        message: "Lấy thống kê coupon thành công",
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  }

  // Bulk operations
  async bulkToggleStatus(req, res, next) {
    try {
      const { couponIds, isActive } = req.body;

      if (!Array.isArray(couponIds) || couponIds.length === 0) {
        throw new ApiError(400, "Danh sách coupon ID không hợp lệ");
      }

      const result = await Promise.allSettled(
        couponIds.map((id) => CouponService.toggleActiveStatus(id))
      );

      const successful = result.filter((r) => r.status === "fulfilled").length;
      const failed = result.filter((r) => r.status === "rejected").length;

      res.status(200).json({
        success: true,
        message: `Cập nhật trạng thái thành công ${successful} coupon, thất bại ${failed} coupon`,
        data: {
          successful,
          failed,
          details: result,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new CouponController();
