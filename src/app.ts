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
        // defaultSrc: ["'self'"], 
        scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"], 
        styleSrc: ["'self'", "'unsafe-inline'"], 
        imgSrc: ["'self'", "data:", "https://*.razorpay.com"], 
        connectSrc: ["'self'", "https://api.razorpay.com", "https://lumberjack.razorpay.com"], 
        frameSrc: ["'self'", "https://api.razorpay.com"],
        // Fix: Allow fonts from self, data URIs (base64), and Razorpay CDN
        fontSrc: [
          "https://font.example.com",
          "'self'", 
          "data:", 
          "https://checkout.razorpay.com",
          "https://*.razorpay.com"
            // Example font CDN
        ],
      },
    },
  })
);


// app.use((req, res, next) => {
//   // Don't apply CSP to checkout page to avoid conflicts with Razorpay's own CSP
//   if (req.path === '/checkout.html' || req.path === '/') {
//     return next();
//   }
  
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"], 
//         scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"], 
//         styleSrc: ["'self'", "'unsafe-inline'"], 
//         imgSrc: ["'self'", "data:", "https://*.razorpay.com"], 
//         connectSrc: ["'self'", "https://api.razorpay.com", "https://lumberjack.razorpay.com"], 
//         frameSrc: ["'self'", "https://api.razorpay.com"],
//         fontSrc: ["'self'", "data:", "https://checkout.razorpay.com", "https://*.razorpay.com", "https://font.example.com"],
//       },
//     },
//   })(req, res, next);
// });

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use("/payments", paymentRoutes);
app.use("/webhooks", webhookRoutes);

app.post(
  "/webhooks/razorpay",
  bodyParser.raw({ type: "application/json" }),
  razorpayWebhook
);

app.use('/', paymentRoutes);

export default app;