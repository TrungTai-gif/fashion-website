import cartService from "../services/cart.service.js";
import ApiResponse from "../utils/apiResponse.js";

const cartController = {
  getCart: async (req, res, next) => {
    try {
      const cart = await cartService.getCart(req.userId);
      return res.json(
        new ApiResponse({ data: cart, message: "Cart retrieved successfully" })
      );
    } catch (error) {
      next(error);
    }
  },

  addItem: async (req, res, next) => {
    try {
      const { product, quantity, variant } = req.body;
      const cart = await cartService.addItem(req.userId, {
        product,
        quantity,
        variant,
      });
      return res.json(
        new ApiResponse({
          status: 201,
          data: cart,
          message: "Item added to cart",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  updateItemQuantity: async (req, res, next) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
      const cart = await cartService.updateItemQuantity(
        req.userId,
        itemId,
        quantity
      );
      return res.json(
        new ApiResponse({ data: cart, message: "Cart item updated" })
      );
    } catch (error) {
      next(error);
    }
  },

  removeItem: async (req, res, next) => {
    try {
      const { itemId } = req.params;
      const cart = await cartService.removeItem(req.userId, itemId);
      return res.json(
        new ApiResponse({ data: cart, message: "Cart item removed" })
      );
    } catch (error) {
      next(error);
    }
  },

  clearCart: async (req, res, next) => {
    try {
      const cart = await cartService.clearCart(req.userId);
      return res.json(
        new ApiResponse({ data: cart, message: "Cart cleared successfully" })
      );
    } catch (error) {
      next(error);
    }
  },
};

export default cartController;
