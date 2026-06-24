import Coupon from "../models/coupon.model.js";
import ApiError from "../utils/ApiError.js";

class CouponService {
  // CREATE - Tạo coupon mới
  async createCoupon(couponData) {
    try {
      // Validate dữ liệu
      if (new Date(couponData.validFrom) >= new Date(couponData.validTo)) {
        throw new ApiError(400, "Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      }

      if (couponData.type === "percentage" && couponData.discountValue > 100) {
        throw new ApiError(400, "Phần trăm giảm giá không được vượt quá 100%");
      }

      // Kiểm tra mã coupon đã tồn tại chưa
      const existingCoupon = await Coupon.findOne({
        code: couponData.code.toUpperCase(),
      });
      if (existingCoupon) {
        throw new ApiError(400, "Mã coupon đã tồn tại");
      }

      const coupon = new Coupon(couponData);
      const createdCoupon = await coupon.save();

      return createdCoupon;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, "Lỗi khi tạo coupon: " + err.message);
    }
  }

  // READ - Lấy tất cả coupon với filter và pagination
  async getAllCoupons(filters = {}) {
    try {
      const {
        isActive,
        discountType,
        status, // valid, expired, upcoming
        page = 1,
        limit = 20,
        search,
      } = filters;

      // Tạo query
      const query = {};

      if (isActive !== undefined) {
        query.isActive = isActive === "true";
      }

      if (discountType) {
        query.type = discountType;
      }

      if (search) {
        query.$or = [
          { code: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Filter theo trạng thái thời gian
      const now = new Date();
      if (status === "valid") {
        query.validFrom = { $lte: now };
        query.validTo = { $gte: now };
        query.isActive = true;
      } else if (status === "expired") {
        query.validTo = { $lt: now };
      } else if (status === "upcoming") {
        query.validFrom = { $gt: now };
      }

      const skip = (page - 1) * limit;

      const [coupons, total] = await Promise.all([
        Coupon.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Coupon.countDocuments(query),
      ]);

      return {
        coupons,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      throw new ApiError(500, "Lỗi khi lấy danh sách coupon: " + err.message);
    }
  }

  // READ - Lấy coupon theo ID
  async getCouponById(couponId) {
    try {
      const coupon = await Coupon.findById(couponId);

      if (!coupon) {
        throw new ApiError(404, "Không tìm thấy coupon");
      }

      return coupon;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, "Lỗi khi lấy thông tin coupon: " + err.message);
    }
  }

  // READ - Lấy coupon theo mã
  async getCouponByCode(code) {
    try {
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });

      if (!coupon) {
        throw new ApiError(404, "Không tìm thấy mã coupon");
      }

      return coupon;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, "Lỗi khi lấy thông tin coupon: " + err.message);
    }
  }

  // READ - Lấy coupon hợp lệ (cho frontend)
  async getValidCoupons() {
    try {
      const now = new Date();
      const coupons = await Coupon.find({
        isActive: true,
        validFrom: { $lte: now },
        validTo: { $gte: now },
      }).sort({ discountValue: -1 });

      return coupons;
    } catch (err) {
      throw new ApiError(500, "Lỗi khi lấy coupon hợp lệ: " + err.message);
    }
  }

  // DELETE - Xóa coupon
  // UPDATE - Cập nhật coupon
  async updateCoupon(couponId, updateData) {
    try {
      const coupon = await Coupon.findById(couponId);

      if (!coupon) {
        throw new ApiError(404, "Không tìm thấy coupon");
      }

      // Validate dữ liệu
      if (updateData.validFrom && updateData.validTo) {
        if (new Date(updateData.validFrom) >= new Date(updateData.validTo)) {
          throw new ApiError(400, "Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
        }
      }

      if (updateData.type === "percentage" && updateData.discountValue > 100) {
        throw new ApiError(400, "Phần trăm giảm giá không được vượt quá 100%");
      }

      // Kiểm tra mã coupon nếu thay đổi
      if (updateData.code && updateData.code !== coupon.code) {
        const existingCoupon = await Coupon.findOne({
          code: updateData.code.toUpperCase(),
          _id: { $ne: couponId },
        });
        if (existingCoupon) {
          throw new ApiError(400, "Mã coupon đã tồn tại");
        }
      }

      // Cập nhật coupon
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        couponId,
        updateData,
        { new: true, runValidators: true }
      );

      return updatedCoupon;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, "Lỗi khi cập nhật coupon: " + err.message);
    }
  }

  async deleteCoupon(couponId) {
    try {
      const coupon = await Coupon.findById(couponId);

      if (!coupon) {
        throw new ApiError(404, "Không tìm thấy coupon");
      }

      // Kiểm tra xem coupon đã được sử dụng chưa
      if (coupon.usage.totalUsed > 0) {
        throw new ApiError(400, "Không thể xóa coupon đã được sử dụng");
      }

      await Coupon.findByIdAndDelete(couponId);

      return { message: "Xóa coupon thành công" };
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, "Lỗi khi xóa coupon: " + err.message);
    }
  }

  // Utility - Validate và apply coupon
  async applyCoupon(code, orderAmount, userId = null) {
    try {
      const coupon = await this.getCouponByCode(code);

      // Kiểm tra xem có thể sử dụng không
      const validation = coupon.canUse(userId, orderAmount);
      if (!validation.canUse) {
        throw new ApiError(400, validation.reason);
      }

      // Tính toán giảm giá
      const discountAmount = coupon.calculateDiscount(orderAmount);

      return {
        couponId: coupon._id,
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        discountValue: coupon.discountValue,
        discountAmount,
        finalAmount: orderAmount - discountAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
      };
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, "Lỗi khi áp dụng coupon: " + err.message);
    }
  }

  // Utility - Đánh dấu coupon đã sử dụng
  async useCoupon(couponId, userId = null) {
    try {
      const coupon = await Coupon.findById(couponId);

      if (!coupon) {
        throw new ApiError(404, "Không tìm thấy coupon");
      }

      await coupon.markAsUsed(userId);

      return coupon;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(
        500,
        "Lỗi khi cập nhật sử dụng coupon: " + err.message
      );
    }
  }

  // Utility - Toggle trạng thái active
  async toggleActiveStatus(couponId) {
    try {
      const coupon = await Coupon.findById(couponId);

      if (!coupon) {
        throw new ApiError(404, "Không tìm thấy coupon");
      }

      coupon.isActive = !coupon.isActive;
      await coupon.save();

      return coupon;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, "Lỗi khi cập nhật trạng thái: " + err.message);
    }
  }

  // Statistics - Thống kê coupon
  async getCouponStats(couponId) {
    try {
      const coupon = await Coupon.findById(couponId);

      if (!coupon) {
        throw new ApiError(404, "Không tìm thấy coupon");
      }

      const stats = {
        basic: {
          code: coupon.code,
          totalUsed: coupon.usage.totalUsed,
          totalLimit: coupon.usageLimit.totalUsageLimit,
          remainingUsage: coupon.remainingUsage,
          usagePercentage: coupon.usageLimit.totalUsageLimit
            ? Math.round(
                (coupon.usage.totalUsed / coupon.usageLimit.totalUsageLimit) *
                  100
              )
            : 0,
        },

        users: {
          uniqueUsers: coupon.usage.userUsage.length,
          userDetails: coupon.usage.userUsage.map((u) => ({
            userId: u.userId,
            usedCount: u.usedCount,
            lastUsed: u.lastUsed,
          })),
        },

        timeline: {
          validFrom: coupon.validFrom,
          validTo: coupon.validTo,
          isExpired: coupon.isExpired,
          isValid: coupon.isValid,
          daysRemaining: Math.max(
            0,
            Math.ceil((coupon.validTo - new Date()) / (1000 * 60 * 60 * 24))
          ),
        },
      };

      return stats;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, "Lỗi khi lấy thống kê coupon: " + err.message);
    }
  }
}

export default new CouponService();
