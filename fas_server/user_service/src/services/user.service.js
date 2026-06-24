import User from "../models/user.model.js";
import Address from "../models/address.model.js";
import ApiError from "../utils/apiError.js";
import bcrypt from "bcrypt";

const userService = {
  createUser: async (name, email, password, role = "user") => {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(400, "Email đã tồn tại", "Bad Request");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return user;
  },

  getAdmin: async () => {
    const user = await User.findOne(
      { role: "admin" },
      "_id role name email avatar"
    );

    return user;
  },

  getUserWithAddress: async (id) => {
    const user = await User.findById(id);
    if (!user) return null;

    const address = await Address.findOne({ user_id: id, isDefault: true });
    return { user, address };
  },

  getUserById: async (id) => {
    return await User.findById(id, "-password");
  },

  getUserByEmail: async (email) => {
    return await User.findOne({ email });
  },

  updatePassword: async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await User.findByIdAndUpdate(id, { password: hashedPassword });
  },

  getAllUsers: async () => {
    const users = await User.find({ role: { $ne: "admin" } });
    const usersWithAddress = await Promise.all(
      users.map(async (user) => {
        let address = await Address.findOne({
          user_id: user._id,
          isDefault: true,
        });
        if (!address) {
          address = await Address.findOne({ user_id: user._id });
        }
        const userObj = user.toObject();
        userObj.address = address;
        return userObj;
      })
    );
    return usersWithAddress;
  },

  updateProfile: async (data) => {
    return await User.findByIdAndUpdate(
      data._id, // id
      { name: data.name },
      { new: true }
    );
  },

  deleteUser: async (id) => {
    return await User.findByIdAndDelete(id);
  },
};

export default userService;
