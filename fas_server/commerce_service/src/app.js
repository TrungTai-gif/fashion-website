import express from "express";
import dotenv from "dotenv";
import brandRoutes from "./routes/brand.route.js";
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";
import reviewRoutes from "./routes/review.route.js";
import tagRoutes from "./routes/tag.route.js";
import variantRoutes from "./routes/variant.route.js";
import uploadRoutes from "./routes/upload.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import statisticRoutes from "./routes/statistic.route.js";

import deliveryRoutes from "./routes/delivery.route.js";
import couponRoutes from "./routes/coupon.route.js";

import errorHandler from "./middlewares/errorHandler.middleware.js";
import morgan from "morgan";

dotenv.config();
const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// root route
app.get("/", (req, res) => {
  res.json({ service: "ecommerce_service", status: "ok" });
});

// routes
app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/tags", tagRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/statistic", statisticRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/coupons", couponRoutes);

// error handler
app.use(errorHandler);

export default app;
