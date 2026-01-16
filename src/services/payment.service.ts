import crypto from "crypto";
import { razorpay } from "../config/razorpay";
import { Payment } from "../models/payment.model";

const payments = new Map<string, Payment>();

export const PaymentService = {
  async createOrder(amount: number, bookingId: string) {
    if (!amount || isNaN(amount) || amount < 1) {
      throw new Error("Invalid amount");
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `rcpt_${bookingId}_${Date.now()}`,
      payment_capture: true,
    });

    payments.set(order.id, {
      id: crypto.randomUUID(),
      orderId: order.id,
      paymentId: "",
      amount,
      currency: "INR",
      status: "created",
      receiptId: order.receipt!,
      createdAt: new Date(),
    });
    console.log("Payment verified:");

    return order;
  },

  verifySignature(orderId: string, paymentId: string, signature: string) {
    const body = `${orderId}|${paymentId}`;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== signature) {
      throw new Error("Invalid payment signature");
    }

    const payment = payments.get(orderId);
    if (payment) {
      payment.paymentId = paymentId;
      payment.status = "paid";
    }
    console.log("Payment verified:", payment);
    return payment;
  },

  markFailed(orderId: string) {
    const payment = payments.get(orderId);
    if (payment) payment.status = "failed";
  },
};
