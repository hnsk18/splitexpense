import React, { useState, useRef, useEffect } from "react";
import { LogOut, Pencil, QrCode } from "lucide-react";
import UpiQrModal from "./UpiQrModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePopup({ onClose }) {
  const dropdownRef = useRef(null);
  const [showQR, setShowQR] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      className="absolute top-14 right-0 w-[320px] rounded-2xl border border-gray-200 bg-white shadow-xl p-5 z-50"
      ref={dropdownRef}
    >
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile</h2>

      {/* Avatar */}
      <div className="flex justify-center mb-5 relative">
        <img
          src="https://i.pravatar.cc/120"
          alt="profile"
          className="w-24 h-24 rounded-full object-cover border"
        />

        <button className="absolute bottom-1 right-22 bg-white border rounded-full p-1 shadow hover:bg-gray-100 transition">
          <Pencil size={14} className="text-gray-600" />
        </button>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="text-sm text-gray-500">Name</label>

        <div className="mt-1 flex items-center justify-between border rounded-lg px-3 py-2">
          <span className="text-gray-700">{user?.name}</span>

          <button>
            <Pencil size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="text-sm text-gray-500">Phone Number</label>

        <div className="mt-1 flex items-center justify-between border rounded-lg px-3 py-2">
          <span className="text-gray-700">{user?.phone}</span>

          <button>
            <Pencil size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* UPI */}
      <div className="mb-4">
        <label className="text-sm text-gray-500">UPI ID</label>

        <div className="mt-1 flex items-center justify-between border rounded-lg px-3 py-2">
          <span className="text-gray-700">{user?.upi}</span>

          <button
            onClick={() => setShowQR(!showQR)}
            className="hover:bg-gray-100 p-1 rounded transition"
          >
            <QrCode size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* QR */}
      <UpiQrModal show={showQR} onClose={() => setShowQR(false)} upi={user?.upi} />

      {/* Logout */}
      <button
        className="flex items-center gap-2 text-red-500 font-medium hover:text-red-600 transition active:bg-red-50 active:text-red-700 px-3 py-2 rounded-lg mt-2"
        onClick={() => {
          sessionStorage.setItem("splitexpense_logout", "1");
          logout();
          navigate("/login", { replace: true });
        }}
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
