import { Router } from "express";
import Blog from "../models/Blog";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const b = await Blog.findById(req.params.id);
    if (!b) return res.status(404).json({ message: "Blog not found" });
    res.json(b);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;
