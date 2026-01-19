import express from "express";
import paymentRoutes from "./routes/payment.routes";
import webhookRoutes from "./routes/webhook.routes";
import path from "path";
import bodyParser from "body-parser";
import { razorpayWebhook } from "./controllers/webhook.controller";

import helmet from "helmet";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], 
        // Allow scripts from your own site, inline scripts (needed for your HTML), and Razorpay
        scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"], 
        // Allow styles from your own site and inline styles (needed for your receipt.html)
        styleSrc: ["'self'", "'unsafe-inline'"], 
        // Allow images from self, base64 (data:), and Razorpay logos
        imgSrc: ["'self'", "data:", "https://*.razorpay.com"], 
        // Allow connections to self and Razorpay APIs
        connectSrc: ["'self'", "https://api.razorpay.com", "https://lumberjack.razorpay.com"], 
        // Allow iframes for Razorpay checkout popup
        frameSrc: ["'self'", "https://api.razorpay.com"],
        // Fix for the Font error you saw earlier
        fontSrc: ["'self'", "data:", "https://razorpay-backend-e3ud.onrender.com"],
      },
    },
  })
);

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







