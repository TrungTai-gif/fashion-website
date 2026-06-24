import express from "express";

import createServiceProxy from "../lib/proxyFactory.js";

import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";
const router = express.Router();
const COMMERCE_SERVICE_URL = process.env.COMMERCE_SERVICE_URL;

const productServiceProxy = createServiceProxy(COMMERCE_SERVICE_URL);

// Route: GET /api/statistic/products
// Mô tả: Lấy thống kê sản phẩm - tổng số và top 5 sản phẩm ít hàng nhất
router.get("/products", checkAccessToken, productServiceProxy);

// Route: GET /api/statistic/orders/total
// Mô tả: Lấy tổng số đơn hàng theo trạng thái
router.get("/orders/total", checkAccessToken, productServiceProxy);

// Route: GET /api/statistic/revenue?days=7
// Mô tả: Lấy doanh thu theo số ngày để hiển thị chart
router.get("/revenue", checkAccessToken, productServiceProxy);

// Route: GET /api/statistic/orders?days=7
// Mô tả: Lấy đơn hàng theo số ngày để hiển thị chart
router.get("/orders", checkAccessToken, productServiceProxy);

// Route: GET /api/statistic/overview
// Mô tả: Lấy thống kê tổng quan (tất cả dữ liệu)
router.get("/overview", checkAccessToken, productServiceProxy);

export default router;
