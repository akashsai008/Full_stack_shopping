import express from "express";
import { Cart } from "../Schema.js";
import { Order } from "../Schema.js";

const router = express.Router();


// ✅ ADD TO CART
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity: 1 }]
      });
    } else {
      const productIndex = cart.products.findIndex(
        p => p.productId.toString() === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    res.json({ message: "Product added to cart" });

  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
});


// ✅ GET USER CART (WITH PRODUCT DETAILS)
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate("products.productId");

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});


// ✅ ADMIN VIEW ALL CARTS (WITH FULL DETAILS)
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("userId")
      .populate("products.productId");

    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching carts" });
  }
});

// ✅ DEMO CHECKOUT (Clear Cart After Payment)
router.post("/checkout/:userId", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });

    res.json({ message: "Payment Successful & Cart Cleared ✅" });
  } catch (err) {
    res.status(500).json({ message: "Checkout Failed" });
  }
});



router.post("/checkout/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const totalAmount = cart.products.reduce((total, item) => {
      return total + item.quantity * item.productId.price;
    }, 0);

    const newOrder = new Order({
      userId: cart.userId,
      products: cart.products,
      totalAmount
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId: req.params.userId });

    res.json({ message: "Order Placed Successfully" });

  } catch (err) {
    res.status(500).json({ message: "Checkout Failed" });
  }
});



export default router;
