import { Request, Response, NextFunction } from "express";

export default function isAdmin(req: Request, res: Response, next: NextFunction) {
    // if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    // if ((req.user as any).role !== "admin") return res.status(403).json({ message: "Admin only" });
    next();
}
