import { Router } from "express";
import Order from "../models/Order";
import Cart from "../models/Cart";
import { auth } from "../middleware/auth";

const router = Router();

// Create order from user's cart
router.post("/create", auth, async (req, res) => {
  try {
    const userId = (req as any).userId;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const totalAmount = cart.items.reduce((sum, item) => {
      const product: any = item.productId;
      return sum + product.price * item.quantity;
    }, 0);

    const order = await Order.create({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount,
    });

    // Clear the cart after order is placed
    cart.items = [];
    await cart.save();

    res.json({ message: "Order created successfully", order });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get all orders of a user
router.get("/", auth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const orders = await Order.find({ userId }).populate("items.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Update order status (admin)
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;
