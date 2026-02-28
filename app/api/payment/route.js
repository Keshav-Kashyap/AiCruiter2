// app/api/payment/route.js
import { razorpay } from "@/lib/razorpay";

export async function POST(req) {
  try {
    const { amount, currency = "INR" } = await req.json();
    
    // Convert USD to INR if needed (approximate conversion rate: 1 USD = 83 INR)
    let finalAmount = amount;
    if (currency === "INR" && amount < 100) {
      // If amount is small (USD), convert to INR
      finalAmount = Math.round(amount * 83);
    }
    
    const options = {
      amount: finalAmount * 100, // amount in paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };
    
    const order = await razorpay.orders.create(options);
    return Response.json(order);
  } catch (error) {
    console.error("Payment order creation failed:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}