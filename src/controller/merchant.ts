import type { Request, Response } from "express";
import pool from "../db.js";
import { generatePublicKey, generateSecretKey } from "../util/generateKey.js";

export async function createMerchant(req: Request, res: Response) {
  try {
    const { name, webhook_url } = req.body ?? {};

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }

    const publicKey = generatePublicKey();
    const secretKey = generateSecretKey();

    const result = await pool.query(
      `INSERT INTO merchants (name, public_key, secret_key, webhook_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, public_key, secret_key, webhook_url`,
      [name, publicKey, secretKey, webhook_url ?? null]
    );

    return res.status(201).json({
      message: "Merchant created",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create merchant error:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
}