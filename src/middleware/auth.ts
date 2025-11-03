import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    const user: AuthUser = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.email === ADMIN_EMAIL ? "admin" : "user",
    };

    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
