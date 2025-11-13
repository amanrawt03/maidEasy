"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

export const PaymentModal = ({ job, onClose, onPaymentReceived }) => {
  const [amount, setAmount] = useState("");
  const upiId = "amanrawat3021@oksbi";
  const payeeName = "Aman Rawat";

  const paymentLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR`;

  const handleMarkAsPaid = () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    onPaymentReceived(job.job_id, amount);
    onClose();
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Job Completed - Payment</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Job Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Job Summary
            </h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Job Type:</span>
                <span className="font-semibold text-green-600 capitalize">
                  {job.job_type}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Job ID:</span>
                <span className="font-medium text-sm">{job.job_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Completed
                </span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Collect Payment
            </h3>
            <div className="mb-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter payment amount (₹)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center focus:border-green-500 focus:outline-none"
                min="1"
              />
            </div>

            {/* QR Code */}
            {amount && (
              <div className="flex flex-col items-center mb-4">
                <div className="p-4 bg-white rounded-xl shadow-md border">
                  <QRCode value={paymentLink} size={200} />
                </div>
                <p className="text-gray-600 text-sm mt-2 text-center">
                  Show this QR to customer
                  <br />
                  Scan with GPay, Paytm, or PhonePe
                </p>
              </div>
            )}
          </div>

          {/* Payment Instructions */}
          <div className="mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Payment Instructions:
              </h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Enter the payment amount above</li>
                <li>2. Show the QR code to the customer</li>
                <li>3. Wait for payment confirmation</li>
                <li>4. Click "Mark as Paid" once payment is received</li>
              </ol>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleMarkAsPaid}
              disabled={!amount || amount <= 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              Mark as Paid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
