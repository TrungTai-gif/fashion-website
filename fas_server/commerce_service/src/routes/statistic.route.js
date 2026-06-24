import express from "express";
import statisticController from "../controllers/statistic.controller.js";

const router = express.Router();
// Route: GET /api/statistic/products
// Mô tả: Lấy thống kê sản phẩm - tổng số và top 5 sản phẩm ít hàng nhất
router.get("/products", statisticController.getProductStatistic);

// Route: GET /api/statistic/orders/total
// Mô tả: Lấy tổng số đơn hàng theo trạng thái
router.get("/orders/total", statisticController.getTotalOrder);

// Route: GET /api/statistic/revenue?days=7
// Mô tả: Lấy doanh thu theo số ngày để hiển thị chart
router.get("/revenue", statisticController.getRevenue);

// Route: GET /api/statistic/orders?days=7
// Mô tả: Lấy đơn hàng theo số ngày để hiển thị chart
router.get("/orders", statisticController.getOrdersByDays);

// Route: GET /api/statistic/overview
// Mô tả: Lấy thống kê tổng quan (tất cả dữ liệu)
router.get("/overview", statisticController.getOverallStatistics);

export default router;
