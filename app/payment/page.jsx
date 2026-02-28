"use client";
import { useState } from "react";
import { PremiumButton } from "@/components/PremiumButton";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (amount = 500) => {
    setLoading(true);
    
    try {
      // Create order on server
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }), // amount in INR
      });
      
      if (!res.ok) {
        throw new Error("Failed to create order");
      }
      
      const order = await res.json();

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: "AI Interview Scheduler",
          description: "Premium Plan Purchase",
          handler: function (response) {
            alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
            // Here you can redirect or update UI
            console.log("Payment Response:", response);
          },
          prefill: {
            name: "User Name",
            email: "user@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#000000",
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
            }
          }
        });
        rzp.open();
        setLoading(false);
      };
      script.onerror = () => {
        alert("Failed to load Razorpay SDK");
        setLoading(false);
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Choose Your Plan</h1>
        
        <div className="space-y-6">
          {/* Basic Plan */}
          <div className="border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Basic Plan</h3>
            <p className="text-gray-400 mb-4">5 Interviews per month</p>
            <p className="text-3xl font-bold mb-4">₹299</p>
            <PremiumButton 
              label={loading ? "Processing..." : "Buy Basic"}
              onClick={() => handlePayment(299)}
              variant="outline"
            />
          </div>

          {/* Premium Plan */}
          <div className="border border-white/30 rounded-lg p-6 bg-gradient-to-b from-white/5 to-transparent">
            <h3 className="text-xl font-semibold mb-2">Premium Plan</h3>
            <p className="text-gray-400 mb-4">Unlimited Interviews</p>
            <p className="text-3xl font-bold mb-4">₹499</p>
            <PremiumButton 
              label={loading ? "Processing..." : "Buy Premium"}
              onClick={() => handlePayment(499)}
              variant="fill"
            />
          </div>
        </div>
      </div>
    </div>
  );
}