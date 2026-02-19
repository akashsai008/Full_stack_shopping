import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";






dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use("/api/orders", orderRoutes);

// ✅ Routes (IMPORTANT CHANGE HERE)
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("ShopEZ Backend Running 🚀");
});
import { Product, Cart, User } from "./Schema.js";

// ✅ Get Counts for Admin Dashboard
app.get("/api/admin/stats", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Cart.countDocuments(); // since demo checkout deletes cart

    res.json({
      totalProducts,
      totalUsers,
      totalOrders
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});


const PORT = 6001;

// ✅ MongoDB Connection
mongoose.connect(process.env.DRIVER_LINK)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
