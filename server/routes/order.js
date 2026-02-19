import express from "express";
import { Order } from "../Schema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const orders = await Order.find()
    .populate("userId")
    .populate("products.productId");

  res.json(orders);
});

export default router;
