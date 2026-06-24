import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import api from "./api";

export const statisticService = () => {
  const resource = "/api/statistic/";

  // Lấy thống kê sản phẩm: tổng số và top 5 sản phẩm ít hàng nhất
  const getProductStatistic = async () => {
    try {
      const response = await api.get(`${resource}products`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product statistics:", error);
      toast.error("Lỗi khi lấy thống kê sản phẩm");
      throw error;
    }
  };

  // Lấy tổng số đơn hàng theo trạng thái
  const getTotalOrder = async () => {
    try {
      const response = await api.get(`${resource}orders/total`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order statistics:", error);
      toast.error("Lỗi khi lấy thống kê đơn hàng");
      throw error;
    }
  };

  // Lấy doanh thu theo số ngày (để hiển thị chart)
  const getRevenue = async (days = 7) => {
    try {
      const response = await api.get(`${resource}revenue?days=${days}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching revenue statistics:", error);
      toast.error("Lỗi khi lấy thống kê doanh thu");
      throw error;
    }
  };

  // Lấy đơn hàng theo số ngày (để hiển thị chart)
  const getOrdersByDays = async (days = 7) => {
    try {
      const response = await api.get(`${resource}orders?days=${days}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order by days statistics:", error);
      toast.error("Lỗi khi lấy thống kê đơn hàng theo ngày");
      throw error;
    }
  };

  // Lấy thống kê tổng quan (tất cả dữ liệu)
  const getOverallStatistics = async () => {
    try {
      const response = await api.get(`${resource}overview`);
      return response.data;
    } catch (error) {
      console.error("Error fetching overall statistics:", error);
      toast.error("Lỗi khi lấy thống kê tổng quan");
      throw error;
    }
  };

  // Lấy thống kê doanh thu theo khoảng thời gian tùy chỉnh
  const getRevenueByDateRange = async (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const response = await api.get(`${resource}revenue?days=${diffDays}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching revenue by date range:", error);
      toast.error("Lỗi khi lấy doanh thu theo khoảng thời gian");
      throw error;
    }
  };

  // Lấy thống kê đơn hàng theo khoảng thời gian tùy chỉnh
  const getOrdersByDateRange = async (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const response = await api.get(`${resource}orders?days=${diffDays}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by date range:", error);
      toast.error("Lỗi khi lấy đơn hàng theo khoảng thời gian");
      throw error;
    }
  };

  return {
    getProductStatistic,
    getTotalOrder,
    getRevenue,
    getOrdersByDays,
    getOverallStatistics,
    getRevenueByDateRange,
    getOrdersByDateRange,
  };
};
