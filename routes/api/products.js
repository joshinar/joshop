const express = require("express");
const { check, validationResult } = require("express-validator/check");
const auth = require("../../jwtmiddleware/auth");
const User = require("../../models/User");
const Product = require("../../models/Product");
const router = express.Router();

// get all products
router.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Get a single product

router.get("/api/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Server Error" });
  }
});

// Get current users products
router.get("/api/products/me", auth, async (req, res) => {
  try {
    const products = await Product.find({ user: req.userId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ Error: "Server Error" });
  }
});

// Add or update product detail

router.post(
  "/api/products",
  [
    auth,
    [
      check("title", "Please include a title for the product")
        .not()
        .isEmpty(),
      check("description", "Add description to the product")
        .not()
        .isEmpty(),
      check("price", "Enter price for the product")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, price, image } = req.body;
    try {
      let product = await Product.findOne({ title }).populate();

      const newProduct = {
        title,
        description,
        price,
        user: req.userId,
        image
      };
      if (product) {
        await Product.findOneAndUpdate(title, newProduct);
        return res.json(product);
      }
      product = new Product(newProduct);
      await product.save();
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Delete product

router.delete("/api/products/:id", auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product removed successfully!" });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
