import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

router.post("/register", async (req, res) => {
  try {
    const { name = "", email, password, role = "user" } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

     // Admin login (from .env)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({
        token,
        user: { id: "env-admin", name: "Admin", email, role: "admin" },
      });
    }

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;
