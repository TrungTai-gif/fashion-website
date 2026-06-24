import statisticService from "../services/statistic.service.js";

const statisticController = {
  // GET /api/statistic/products
  async getProductStatistic(req, res) {
    try {
      const result = await statisticService.getProductStatistic();

      if (result.success) {
        res.status(200).json({
          success: true,
          message: "Lấy thống kê sản phẩm thành công",
          data: result.data,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Error in getProductStatistic controller:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy thống kê sản phẩm",
        error: error.message,
      });
    }
  },

  // GET /api/statistic/orders/total
  async getTotalOrder(req, res) {
    try {
      const result = await statisticService.getTotalOrder();

      if (result.success) {
        res.status(200).json({
          success: true,
          message: "Lấy thống kê đơn hàng thành công",
          data: result.data,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Error in getTotalOrder controller:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy thống kê đơn hàng",
        error: error.message,
      });
    }
  },

  // GET /api/statistic/revenue?days=7
  async getRevenue(req, res) {
    try {
      const days = parseInt(req.query.days) || 7;

      if (days <= 0 || days > 365) {
        return res.status(400).json({
          success: false,
          message: "Số ngày phải từ 1 đến 365",
        });
      }

      const result = await statisticService.getRevenue(days);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: `Lấy thống kê doanh thu ${days} ngày thành công`,
          data: result.data,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Error in getRevenue controller:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy thống kê doanh thu",
        error: error.message,
      });
    }
  },

  // GET /api/statistic/orders?days=7
  async getOrdersByDays(req, res) {
    try {
      const days = parseInt(req.query.days) || 7;

      if (days <= 0 || days > 365) {
        return res.status(400).json({
          success: false,
          message: "Số ngày phải từ 1 đến 365",
        });
      }

      const result = await statisticService.getOrdersByDays(days);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: `Lấy thống kê đơn hàng ${days} ngày thành công`,
          data: result.data,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Error in getOrdersByDays controller:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy thống kê đơn hàng theo ngày",
        error: error.message,
      });
    }
  },

  // GET /api/statistic/overview
  async getOverallStatistics(req, res) {
    try {
      const result = await statisticService.getOverallStatistics();

      if (result.success) {
        res.status(200).json({
          success: true,
          message: "Lấy thống kê tổng quan thành công",
          data: result.data,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Error in getOverallStatistics controller:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy thống kê tổng quan",
        error: error.message,
      });
    }
  },
};

export default statisticController;
