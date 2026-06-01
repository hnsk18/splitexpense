import React, { useState } from "react";
import { X } from "lucide-react";
import QR from "./QR";

export default function UpiQrModal({ show, onClose, upi }) {
  const [amount, setAmount] = useState("");


  // Dynamic QR Payload
  const qrPayload = `upi://pay?pa=${upi}${amount === "0" || amount === "" ? "" : `&am=${amount}`}&cu=INR`;

  return (
    <>
      {show && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-100"
        >

          {/* Modal */}
          <div className="bg-white w-[320px] rounded-xl shadow-2xl p-5 relative animate-in fade-in zoom-in duration-200">

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 hover:bg-gray-100 p-1 rounded"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <h2 className="text-sm font-semibold text-gray-700 text-center mb-2">
              Scan & Pay
            </h2>

            {/* Amount Input */}
            <div className="mb-5">
              <label className="text-sm text-gray-600">
                Enter Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || Number(value) >= 0) {
                    setAmount(String(Number(value)));
                  }
                }}
                placeholder="Enter amount"
                className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* QR */}
            <div className="flex justify-center mb-4">
              <QR payload={qrPayload} />
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center break-all">
              UPI ID: {upi}
            </p>

            <p className="text-xs text-gray-400 text-center mt-1">
              {amount && amount > 0 ? `Amount: ₹${amount}` : <>&nbsp;</>}
            </p>
          </div>
        </div>)}
    </>
  );
}