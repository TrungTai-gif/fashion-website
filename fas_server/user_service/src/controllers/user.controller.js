// controllers/user.controller.js
import userService from "../services/user.service.js";
import addressService from "../services/address.service.js";
import ApiResponse from "../utils/apiResponse.js";

const userController = {
  register: async (req, res, next) => {
    const { name, email, password, role = "user" } = req.body;
    try {
      const user = await userService.createUser(name, email, password, role);

      res.json(
        new ApiResponse({
          message: "User created successfully",
          data: { user },
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();
      return res.json(
        new ApiResponse({
          success: true,
          data: users,
          message: "Users fetched",
        })
      );
    } catch (error) {
      throw error;
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.id);
      const addresses = await addressService.getAddressByUserId(req.params.id);
      res.json(
        new ApiResponse({
          data: { user, addresses },
          message: "Profile fetched successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  validateCredentials: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userService.validateUser(email, password);
      res.json(
        new ApiResponse({
          success: true,
          data: user,
          message: "Credentials valid",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getByEmail: async (req, res, next) => {
    try {
      const user = await userService.getUserByEmail(req.params.email);
      res.json(
        new ApiResponse({ success: true, data: user, message: "User found" })
      );
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const user = await userService.updateProfile(req.body.user);
      res.json(
        new ApiResponse({ success: true, data: user, message: "User found" })
      );
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const user = await userService.deleteUser(req.params.id);
      res.json(
        new ApiResponse({ success: true, data: user, message: "User found" })
      );
    } catch (error) {
      next(error);
    }
  },

  getAdmin: async (req, res, next) => {
    try {
      const admin = await userService.getAdmin();

      if (!admin) {
        return res.status(404).json(
          new ApiResponse({
            success: false,
            message: "Admin not found",
          })
        );
      }

      return res.json(
        new ApiResponse({
          success: true,
          data: admin,
          message: "Admin fetched successfully",
        })
      );
      return res.json({ success: true });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};

export default userController;
