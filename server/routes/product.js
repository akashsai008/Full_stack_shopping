import express from "express";
import { Product } from "../Schema.js";

const router = express.Router();


// ✅ GET ALL PRODUCTS + SEARCH
router.get("/", async (req, res) => {
  try {
    const search = req.query.search;

    let products;

    if (search) {
      products = await Product.find({
        name: { $regex: search, $options: "i" }
      });
    } else {
      products = await Product.find();
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// ✅ ADD PRODUCT (for admin)
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Error adding product" });
  }
});
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product Deleted" });
});


export default router;
