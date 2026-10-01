import express from "express";
import { initializeTransaction } from "../controller/transaction.js";

const router = express.Router();

router.post("/initialize", initializeTransaction);

export default router;