import express from "express";
import paymentRoutes from "./routes/payment.routes";
import webhookRoutes from "./routes/webhook.routes";
import path from "path";
import bodyParser from "body-parser";
import { razorpayWebhook } from "./controllers/webhook.controller";

const app = express();

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' https://checkout.razorpay.com"
  );
  next();
});

/* Body parsers */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Static files */
app.use("/assets", express.static("assets"));

/* Routes */
app.use("/api/payments", paymentRoutes);

/* Server start */
app.listen(3000, () => {
  console.log("Server running");
});


app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use("/payments", paymentRoutes);
app.use("/webhooks", webhookRoutes);

app.post(
  "/webhooks/razorpay",
  bodyParser.raw({ type: "application/json" }),
  razorpayWebhook
);

export default app;







