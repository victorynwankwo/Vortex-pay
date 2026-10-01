import express from "express";
import { createMerchant } from "../controller/merchant.js";

const router = express.Router();

router.post("/create", createMerchant);

export default router;
