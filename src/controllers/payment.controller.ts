import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { env } from "../config/env";

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { amount, bookingId } = req.body;

    const order = await PaymentService.createOrder(amount, bookingId);

    res.json({
      key: env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: Number(order.amount) / 100,
      currency: order.currency,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const receipt = PaymentService.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    res.json({
      success: true,
      receipt,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
