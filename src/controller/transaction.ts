import type { Request, Response } from "express";
import pool from "../db.js";
import { generateReference } from "../util/genereteRefernce.js";

export async function initializeTransaction(req: Request, res: Response) {
  try {
    const { amount_cents, email } = req.body ?? {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Are both fields present?
    if (!amount_cents || !email) {
      return res.status(400).json({
        message: "amount_cents and email are required",
      });
    }

    // 2. Is the amount a whole number above zero?
    if (!Number.isInteger(amount_cents) || amount_cents <= 0) {
      return res.status(400).json({
        message: "amount_cents must be a positive integer",
      });
    }

    // 3. Is the email a string with a valid format?
    if (typeof email !== "string" || !emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const reference = generateReference();

    // For now, we'll use our demo merchant.
    const merchantResult = await pool.query(`SELECT id FROM merchants LIMIT 1`);

    const merchant = merchantResult.rows[0];

    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found",
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
      checkout_url: `http://localhost:3000/pay/${reference}`,
    });
  } catch (error) {
    console.error("Initialize transaction error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}




export async function verifyTransaction(req: Request, res: Response) {
  try {
    const { reference } = req.params;

    const result = await pool.query(
      `SELECT reference, amount_cents, email, status
       FROM transactions
       WHERE reference = $1`,
      [reference]
    );

    const transaction = result.rows[0];

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      message: "Transaction fetched",
      data: transaction,
    });
  } catch (error) {
    console.error("Verify transaction error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


export async function getCheckoutStatus(req: Request, res: Response) {
  try {
    const { reference } = req.params;

    const result = await pool.query(
      `SELECT reference, amount_cents, status
       FROM transactions
       WHERE reference = $1`,
      [reference]
    );

    const transaction = result.rows[0];

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({ data: transaction });
  } catch (error) {
    console.error("Checkout status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}