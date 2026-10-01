import express from "express";
import {
  completePayment,
  getCheckoutStatus,
  initializeTransaction,
  verifyTransaction,
} from "../controller/transaction.js";

const router = express.Router();

router.post("/initialize", initializeTransaction);
router.get("/:reference/verify", verifyTransaction);
router.post("/:reference/complete", completePayment);
router.get("/:reference/status", getCheckoutStatus);

export default router;
