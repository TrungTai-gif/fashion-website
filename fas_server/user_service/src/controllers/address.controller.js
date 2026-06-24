import addressService from "../services/address.service.js";
import ApiResponse from "../utils/apiResponse.js";

const addressController = {
  addAddress: async (req, res, next) => {
    try {
      const userId = req.headers["x-user-id"];
      const address = await addressService.addAddress(userId, req.body);
      res.json(new ApiResponse({ message: "OK", data: address }));
      return [];
    } catch (error) {
      throw error;
      next(error);
    }
  },

  // getAddressById: async (req, res, next) => {
  //   try {
  //     const address = await addressService.getAddressById(req.params.id);
  //     res.json(new ApiResponse({ data: address }));
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  getAddressByUserId: async (req, res, next) => {
    try {
      const addresses = await addressService.getAddressByUserId(
        req.params.userId
      );
      res.json(new ApiResponse({ data: addresses }));
    } catch (error) {
      next(error);
    }
  },

  updateAddress: async (req, res, next) => {
    try {
      const address = await addressService.updateAddress(
        req.params.addressId,
        req.body
      );
      res.json(new ApiResponse({ message: "Updated", data: address }));
    } catch (error) {
      next(error);
    }
  },

  deleteAddress: async (req, res, next) => {
    try {
      await addressService.deleteAddress(req.params.addressId);
      res.json(new ApiResponse({ message: "Deleted" }));
    } catch (error) {
      next(error);
    }
  },

  setDefaultAddress: async (req, res, next) => {
    try {
      const userId = req.headers["x-user-id"];
      const address = await addressService.setDefaultAddress(
        userId,
        req.params.addressId
      );
      res.json(new ApiResponse({ message: "OK", data: address }));
    } catch (error) {
      throw error;
      // next(error);
    }
  },
};

export default addressController;
