import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db";

// route imports
import authRoutes from "./routes/auth";
import cartRoutes from "./routes/cart";
import productRoutes from "./routes/products";
import blogRoutes from "./routes/blogs";
import orderRoutes from "./routes/order";
import adminRoutes from "./routes/admin";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

const PORT = process.env.PORT || 4000;

// connect database and start server
connectDB()
  .then(() => {
    app.get("/api/health", (_req, res) => res.json({ ok: true }));

    // register routes
    app.use("/api/auth", authRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/blogs", blogRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/admin", adminRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
