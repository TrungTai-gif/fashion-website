// src/controllers/order.controller.js
import orderService from "../services/order.service.js";
import ApiResponse from "../utils/apiResponse.js";

const orderController = {
  createOrder: async (req, res, next) => {
    try {
      const order = await orderService.createOrder(req.body);

      return res.json(
        new ApiResponse({
          status: 201,
          data: order,
          message: "Order created successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getAllOrders: async (req, res, next) => {
    try {
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        status: req.query.status,
      };
      const result = await orderService.getAllOrders(filters);
      return res.status(200).json(
        new ApiResponse({
          data: result,
          pagination: result.pagination,
          message: "Orders retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getMyOrders: async (req, res, next) => {
    try {
      const orders = await orderService.getOrdersByUserId(req.userId);

      return res.status(200).json(
        new ApiResponse({
          data: orders,
          message: "Orders retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getOrderById: async (req, res, next) => {
    try {
      const order = await orderService.getOrderDetails(req.params.id);

      return res.status(200).json(
        new ApiResponse({
          data: order,
          message: "Order retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  updateOrderStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const order = await orderService.updateOrderStatus(req.params.id, status);

      return res.status(200).json(
        new ApiResponse({
          data: order,
          message: "Order status updated successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  claimGuestOrders: async (req, res, next) => {
    try {
      const { email } = req.body;
      const userId = req.userId;

      if (!email) {
        return res.status(400).json(
          new ApiResponse({
            status: 400,
            message: "Email is required",
          })
        );
      }

      if (!userId) {
        return res.status(401).json(
          new ApiResponse({
            status: 401,
            message: "User must be logged in",
          })
        );
      }

      const result = await orderService.claimGuestOrdersByEmail(email, userId);

      return res.status(200).json(
        new ApiResponse({
          data: result,
          message: result.message,
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getOrdersByEmail: async (req, res, next) => {
    try {
      const { email } = req.query;
      const userId = req.userId || null;

      if (!email) {
        return res.status(400).json(
          new ApiResponse({
            status: 400,
            message: "Email is required",
          })
        );
      }

      const orders = await orderService.getOrdersByEmail(email, userId);

      return res.status(200).json(
        new ApiResponse({
          data: orders,
          message: "Orders retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  deleteOrderById: async (req, res, next) => {
    try {
      const order = await orderService.deleteOrder(req.params.id);
      return res.status(200).json(
        new ApiResponse({
          data: order,
          message: "Order deleted!",
        })
      );
    } catch (error) {
      next(error);
    }
  },
};

export default orderController;
