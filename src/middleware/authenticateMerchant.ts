import type { Request, Response, NextFunction } from "express";
import pool from "../db.js";

export async function authenticateMerchant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const secretKey = req.headers.authorization?.replace(/^Bearer\s+/i, "");

    if (!secretKey) {
      return res.status(401).json({ message: "Missing API key" });
    }

    const result = await pool.query(
      `SELECT id FROM merchants WHERE secret_key = $1`,
      [secretKey]
    );

    const merchant = result.rows[0];

    if (!merchant) {
      return res.status(401).json({ message: "Invalid API key" });
    }

    // Save the merchant so the controller can use it
    res.locals.merchant = merchant;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}