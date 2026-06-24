import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
const statisticService = {
  // Lấy thống kê sản phẩm: tổng số và top 5 sản phẩm ít hàng nhất
  async getProductStatistic() {
    try {
      // Tổng số sản phẩm
      const totalProducts = await Product.countDocuments({ isActive: true });

      // Top 5 sản phẩm có ít hàng nhất (stock thấp nhất và > 0)
      const lowStockProducts = await Product.find({
        isActive: true,
        stock: { $gt: 0, $lt: 10 }, // Sản phẩm có stock < 10 và > 0
      })
        .sort({ stock: 1 }) // Sắp xếp tăng dần theo stock
        .limit(5)
        .select("name stock images price category brand")
        .populate("category", "name")
        .populate("brand", "name");

      // Sản phẩm hết hàng
      const outOfStockProducts = await Product.countDocuments({
        isActive: true,
        stock: 0,
      });

      return {
        success: true,
        data: {
          totalProducts,
          outOfStockProducts,
          lowStockProducts,
        },
      };
    } catch (error) {
      console.error("Error in getProductStatistic:", error);
      return {
        success: false,
        message: "Lỗi khi lấy thống kê sản phẩm",
        error: error.message,
      };
    }
  },

  // Lấy tổng số đơn hàng
  async getTotalOrder() {
    try {
      const totalOrders = await Order.countDocuments();
      const pendingOrders = await Order.countDocuments({ status: "pending" });
      const completedOrders = await Order.countDocuments({
        status: "delivered",
      });
      const cancelledOrders = await Order.countDocuments({
        status: "cancelled",
      });

      return {
        success: true,
        data: {
          totalOrders,
          pendingOrders,
          completedOrders,
          cancelledOrders,
        },
      };
    } catch (error) {
      console.error("Error in getTotalOrder:", error);
      return {
        success: false,
        message: "Lỗi khi lấy thống kê đơn hàng",
        error: error.message,
      };
    }
  },

  // Lấy doanh thu theo số ngày (để hiển thị chart)
  async getRevenue(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      const revenueData = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $in: ["delivered", "completed"] }, // Chỉ tính đơn hàng đã hoàn thành
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            totalRevenue: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
        },
      ]);

      // Tạo array đầy đủ các ngày (bao gồm ngày không có doanh thu)
      const result = [];
      for (let i = 0; i < days; i++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - (days - 1 - i));

        const existingData = revenueData.find(
          (item) =>
            item._id.year === currentDate.getFullYear() &&
            item._id.month === currentDate.getMonth() + 1 &&
            item._id.day === currentDate.getDate()
        );

        result.push({
          date: currentDate.toISOString().split("T")[0],
          revenue: existingData ? existingData.totalRevenue : 0,
          orders: existingData ? existingData.orderCount : 0,
        });
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Error in getRevenue:", error);
      return {
        success: false,
        message: "Lỗi khi lấy thống kê doanh thu",
        error: error.message,
      };
    }
  },

  // Lấy đơn hàng theo số ngày (để hiển thị chart)
  async getOrdersByDays(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      const orderData = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
            statusBreakdown: {
              $push: {
                status: "$_id.status",
                count: "$count",
              },
            },
            totalOrders: { $sum: "$count" },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
        },
      ]);

      // Tạo array đầy đủ các ngày
      const result = [];
      for (let i = 0; i < days; i++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - (days - 1 - i));

        const existingData = orderData.find(
          (item) =>
            item._id.year === currentDate.getFullYear() &&
            item._id.month === currentDate.getMonth() + 1 &&
            item._id.day === currentDate.getDate()
        );

        const statusCounts = {
          pending: 0,
          confirmed: 0,
          shipping: 0,
          delivered: 0,
          cancelled: 0,
        };

        if (existingData) {
          existingData.statusBreakdown.forEach((status) => {
            statusCounts[status.status] = status.count;
          });
        }

        result.push({
          date: currentDate.toISOString().split("T")[0],
          totalOrders: existingData ? existingData.totalOrders : 0,
          ...statusCounts,
        });
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Error in getOrdersByDays:", error);
      return {
        success: false,
        message: "Lỗi khi lấy thống kê đơn hàng theo ngày",
        error: error.message,
      };
    }
  },

  // Lấy thống kê tổng quan
  async getOverallStatistics() {
    try {
      const [productStats, orderStats, revenueStats] = await Promise.all([
        this.getProductStatistic(),
        this.getTotalOrder(),
        this.getRevenue(30), // 30 ngày gần nhất
      ]);

      // Tính tổng doanh thu
      const totalRevenue = revenueStats.data.reduce(
        (sum, day) => sum + day.revenue,
        0
      );
      const avgDailyRevenue = totalRevenue / 30;

      return {
        success: true,
        data: {
          products: productStats.data,
          orders: orderStats.data,
          revenue: {
            total: totalRevenue,
            avgDaily: avgDailyRevenue,
          },
          revenueChart: revenueStats.data,
        },
      };
    } catch (error) {
      console.error("Error in getOverallStatistics:", error);
      return {
        success: false,
        message: "Lỗi khi lấy thống kê tổng quan",
        error: error.message,
      };
    }
  },
};

export default statisticService;
