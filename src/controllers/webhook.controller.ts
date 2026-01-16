import { Request, Response } from "express";
import crypto from "crypto";
import { env } from "../config/env";
import { PaymentService } from "../services/payment.service";

export const razorpayWebhook = (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string;

  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (expected !== signature) {
    return res.status(400).send("Invalid webhook signature");
  }

  const event = req.body.event;
  const payload = req.body.payload;

  if (event === "payment.failed") {
    PaymentService.markFailed(payload.payment.entity.order_id);
  }

  res.json({ status: "ok" });
};
