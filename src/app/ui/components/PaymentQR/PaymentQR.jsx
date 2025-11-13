"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

export default function PaymentQR() {
  const [amount, setAmount] = useState("");
  const upiId = "amanrawat3021@oksbi";
  const payeeName = "Aman Rawat";

  const paymentLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="border rounded-lg px-4 py-2 text-center"
      />
      {amount && (
        <div className="p-4 bg-white rounded-xl shadow-md">
          <QRCode value={paymentLink} size={200} />
        </div>
      )}
      <p className="text-gray-600 text-sm">Scan with GPay, Paytm, or PhonePe</p>
    </div>
  );
}
