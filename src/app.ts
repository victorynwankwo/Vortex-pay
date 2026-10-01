import express from "express";
import transactionRoute from "./Routes/transactionRoute.js";
import merchantRouter from "./Routes/merchantRouter.js";
import webhookRouter from "./Routes/webhookRouter.js";

const app = express();

app.use(express.json());

app.use("/webhook", webhookRouter);
app.use("/v1/transactions", transactionRoute);
app.use("/v1/merchants", merchantRouter);

export default app;
