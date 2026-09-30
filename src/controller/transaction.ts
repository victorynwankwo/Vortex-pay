import type { Request, Response } from "express";
import pool from "../db.js";
import { generateReference } from "../util/genereteRefernce.js";

export async function initializeTransaction(
  req: Request,
  res: Response
) {
  try {
    const { amount_cents, email } = req.body;

    if (!amount_cents || !email) {
      return res.status(400).json({
        message: "amount_cents and email are required"
      });
    }

    const reference = generateReference();

    // For now, we'll use our demo merchant.
    const merchantResult = await pool.query(
      `SELECT id FROM merchants LIMIT 1`
    );

    const merchant = merchantResult.rows[0];

    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found"
      });
    }

    await pool.query(
      `INSERT INTO transactions
        (reference, merchant_id, amount_cents, email)
       VALUES ($1, $2, $3, $4)`,
      [reference, merchant.id, amount_cents, email]
    );

    return res.status(201).json({
      message: "Transaction initialized",
      reference,
      checkout_url: `http://localhost:3000/pay/${reference}`
    });

  } catch (error) {
    console.error("Initialize transaction error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}