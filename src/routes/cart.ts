import { Router } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { auth } from "../middleware/auth";

const router = Router();

// -------------------------------
// GET /api/cart
// -------------------------------
router.get("/", auth, async (req, res) => {
  try {
    const userId = (req as any).user?.id || (req as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.json(cart || { userId, items: [] });
  } catch (err) {
    console.error("Error loading cart:", err);
    res.status(500).json({ message: "Failed to load cart", error: (err as Error).message });
  }
});

// -------------------------------
// POST /api/cart/add
// -------------------------------
router.post("/add", auth, async (req, res) => {
  try {
    const userId = (req as any).user?.id || (req as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: "Missing productId" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const existingItem = cart.items.find((item) => item.productId.toString() === productId);
      if (existingItem) existingItem.quantity += quantity;
      else cart.items.push({ productId, quantity });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.productId");
    res.json({ message: "Item added successfully", items: populatedCart.items });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Failed to add to cart", error: (err as Error).message });
  }
});

// -------------------------------
// DELETE /api/cart/remove/:id
// -------------------------------
router.delete("/remove/:id", auth, async (req, res) => {
  try {
    const userId = (req as any).user?.id || (req as any).userId;
    const productId = req.params.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    const populatedCart = await cart.populate("items.productId");
    res.json({ message: "Item removed successfully", items: populatedCart.items });
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ message: "Failed to remove item", error: (err as Error).message });
  }
});

// -------------------------------
// PUT /api/cart/update/:id
// -------------------------------
router.put("/update/:id", auth, async (req, res) => {
  try {
    const userId = (req as any).user?.id || (req as any).userId;
    const productId = req.params.id;
    const { quantity } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (quantity == null || quantity < 1)
      return res.status(400).json({ message: "Invalid quantity" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await cart.populate("items.productId");
    res.json({ message: "Quantity updated", items: populatedCart.items });
  } catch (err) {
    console.error("Error updating quantity:", err);
    res.status(500).json({ message: "Failed to update quantity", error: (err as Error).message });
  }
});

export default router;
