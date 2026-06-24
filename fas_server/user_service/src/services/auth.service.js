import AuthToken from "../models/authToken.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// import { sendEmail } from "../services/email.service.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

// Login user
const authService = {
  login: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "User not found");

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Password is not match");
    } else {
      const accessToken = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "60m" }
      );
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: "2d",
        }
      );

      await AuthToken.create({
        user_id: user._id,
        refreshToken,
        type: "refresh",
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      return {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          avatar: user.avatar && "",
        },
      };
    }
  },

  loginGoogle: async (payload) => {
    const { email, name, picture, sub } = payload; // sub = Google user ID
    if (!email) throw new Error("Google account missing email");

    // // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name,
        email,
        provider: "google",
        avatar: picture,
        googleId: sub,
      });
    } else if (user && user.provider !== "google") {
      user.googleId = user.googleId || sub;
      user.avatar = user.avatar || picture;
      await user.save();
    }
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "2d",
      }
    );

    await AuthToken.create({
      user_id: user._id,
      refreshToken,
      type: "refresh",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        avatar: user.avatar && "",
      },
    };
  },

  login_admin: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "User not found");
    if (user.role != "admin") {
      throw new ApiError(400, "Access denied!");
    } else {
      return await authService.login(email, password);
    }
  },

  // Refresh access token
  refreshAccessToken: async (oldtoken) => {
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    let decoded;
    try {
      decoded = jwt.verify(oldtoken, JWT_REFRESH_SECRET);
    } catch (error) {
      throw new ApiError(
        401,
        "Invalid or expired refresh token",
        "Token Error"
      );
    }

    const userId = decoded.userId;

    const storedToken = await AuthToken.findOne({
      user_id: userId,
      type: "refresh",
      refreshToken: oldtoken,
    });
    if (!storedToken) {
      throw new ApiError(
        401,
        "Refresh token not found or expired",
        "Token Error"
      );
    }

    const user = await User.findOne({ _id: userId });

    if (!user || !user._id) {
      throw new ApiError(
        404,
        "User Not Found",
        "User does not exist in User Service"
      );
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );
    storedToken.refreshToken = oldtoken;
    storedToken.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await storedToken.save();

    return new ApiResponse({
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        refreshToken: oldtoken,
      },
    });
  },
  // Logout user
  logout: async (refreshToken) => {
    try {
      // Try to remove by exact refreshToken first
      let deleted = await AuthToken.findOneAndDelete({
        refreshToken,
        type: "refresh",
      });

      // If not found, attempt to decode token to find user and remove tokens for that user
      // if (!deleted) {
      //   try {
      //     const decoded = jwt.verify(
      //       refreshToken,
      //       process.env.JWT_REFRESH_SECRET
      //     );
      //     const userId = decoded.userId;
      //     // delete all refresh tokens for that user (safe fallback)
      //     deleted = await AuthToken.deleteMany({
      //       user_id: userId,
      //       type: "refresh",
      //     });
      //   } catch (e) {
      //     // couldn't decode -> token invalid or tampered
      //     throw new ApiError(404, "Refresh token not found", "Logout Error");
      //   }
      // }

      return { message: "Logged out successfully" };
    } catch (error) {
      throw error;
    }
  },
  // Change password
  changePassword: async (userId, oldPassword, newPassword) => {
    // Step 1: Lấy user theo ID
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Step 2: Validate mật khẩu cũ
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      throw new ApiError(404, "Mật khảu cũ không khớp!");
    }

    // Step 3: Hash mật khẩu mới và lưu
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Step 4: Trả response
    return user;
  },
  // Forgot password
  forgotPassword: async (email) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new ApiError(
        404,
        "User Not Found",
        "No account found with that email"
      );
    }
    // sửa giúp
    // const resetToken = crypto.randomBytes(32).toString("hex");
    // await AuthToken.create({
    //   user_id: user._id,
    //   token: resetToken,
    //   type: "forgot_password",
    //   expires_at: new Date(Date.now() + 10 * 60 * 1000),
    // });

    // // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${user.email}`;
    // // gửi luôn khỏi gọi
    // const { subject, html } = resetPasswordTemplate(resetLink);

    // await sendEmail(user.email, subject, html);

    return { email: email, message: "had sent email" };
  },

  // Forgot password
  resetPassword: async (email, newPassword) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new ApiError(
        404,
        "User Not Found",
        "No account found with that email"
      );
    }

    // Hash mật khẩu mới và lưu
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return user;
  },
};

export default authService;
