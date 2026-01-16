export interface Payment {
  id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  receiptId: string;
  createdAt: Date;
}
