import { Router } from "express";
import {auth} from "../middleware/auth";
import isAdmin from "../middleware/isAdmin";
import Product from "../models/Product";
import Blog from "../models/Blog";

const router = Router();
router.use(auth, isAdmin);

// create product
router.post("/product", async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// update product
router.put("/product/:id", async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// delete product
router.delete("/product/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// create blog
router.post("/blog", async (req, res) => {
  try {
    const b = await Blog.create(req.body);
    res.json(b);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// update blog
router.put("/blog/:id", async (req, res) => {
  try {
    const b = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(b);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// delete blog
router.delete("/blog/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;
