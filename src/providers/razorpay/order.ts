import { razorpay } from "../../config/razorpay";

export const createRazorpayOrder = async (
  bookingId: string,
  amount: number
) => {
  return await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: bookingId,
    payment_capture: true
  });
};
