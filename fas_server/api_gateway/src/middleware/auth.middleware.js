import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

export const checkAccessToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized", code: "MISSING_AUTH_HEADER" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized", code: "MISSING_ACCESS_TOKEN" });
    }

    // Xác thực token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      // console.log("decode gateway", req.user);
      return next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Access token expired",
          code: "TOKEN_EXPIRED",
        });
      }
      return res.status(401).json({
        message: "Invalid access token",
        code: "TOKEN_INVALID",
      });
    }
  } catch (err) {
    // Trường hợp lỗi ngoài JWT
    return res.status(401).json({
      message: "Unauthorized",
      code: "TOKEN_ERROR",
      error: err.message,
    });
  }
};

export const checkRole = (role = []) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden", "You don't have permission"));
    }
    next();
  };
};
