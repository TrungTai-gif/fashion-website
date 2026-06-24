import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.middleware.js";
import dotenv from "dotenv";

import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import authRoutes from "./routes/auth.route.js";
import brandRoutes from "./routes/brand.route.js";
import categoryRoutes from "./routes/category.route.js";
import vatiantRoutes from "./routes/variant.route.js";
import uploadRoutes from "./routes/upload.route.js";
import cartRoutes from "./routes/cart.route.js";
import ordersRoutes from "./routes/order.route.js";
import searchRoutes from "./routes/search.route.js";
import statisticRoutes from "./routes/statistic.route.js";
import deliveryRoutes from "./routes/delivery.route.js";
import couponRoutes from "./routes/coupon.route.js";
import notificationRoutes from "./routes/notification.route.js";
import morgan from "morgan";

import chatRoutes from "./routes/chat.route.js";

dotenv.config();
const app = express();
app.use(cors());

app.use(morgan("dev"));

app.use("/api/uploads", uploadRoutes);
// Gateway routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/variants", vatiantRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/statistic", statisticRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);
// test root
app.get("/", (req, res) => {
  res.send(" API Gateway is running");
});

app.use(errorHandler);

export default app;
