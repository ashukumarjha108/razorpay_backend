import { Request, Response } from "express";
import crypto from "crypto";
import { PaymentService } from "../services/payment.service";

export const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

    const signature = req.headers["x-razorpay-signature"] as string;

    // Razorpay requires RAW body
    const rawBody = req.body.toString();

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    const data = JSON.parse(rawBody);
    const event = data.event;

    console.log("🔔 Razorpay Webhook Event:", event);

    // ✅ PAYMENT SUCCESS
    if (event === "payment.captured") {
      const payment = data.payload.payment.entity;

      // Reuse existing verification logic
      PaymentService.verifySignature(
        payment.order_id,
        payment.id,
        payment.signature || ""
      );
    }

    // ❌ PAYMENT FAILED
    if (event === "payment.failed") {
      const payment = data.payload.payment.entity;

      // Use EXISTING method
      PaymentService.markFailed(payment.order_id);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Webhook failed" });
  }
};
