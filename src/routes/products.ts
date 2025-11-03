import { Router } from "express";
import Product from "../models/Product";
import { auth } from "../middleware/auth";

const router = Router();

// Create product (admin only)
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const product = await Product.create({ name, description, price, image, category, stock });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get all products
router.get("/", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products.map(p => ({ ...p.toObject(), id: p._id })));
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ ...product.toObject(), id: product._id });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;
