import express from "express";
import transactionRoute from "./Routes/transactionRoute.js";

const app = express();

app.use(express.json());


app.post("/webhook", (req, res) => {
  console.log("Webhook received:", req.body);
  res.sendStatus(200);
});

app.use("/v1/transactions", transactionRoute);

export default app;