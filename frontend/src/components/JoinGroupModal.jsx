import React, { useState, useEffect, useRef } from "react";
import { X, ShieldCheck } from "lucide-react";
import { apiFetch } from "../services/api";
import {toast} from "sonner";

export default function JoinGroupModal({
  show,
  onClose,
  onSuccess,
}) {
  const [groupCode, setGroupCode] = useState("");
  const [loading, setLoading] = useState(false);

  const firstInputRef = useRef(null);

  useEffect(() => {
    if (show) {
      setGroupCode("");

      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const arr = groupCode.padEnd(6, " ").split("");
    arr[index] = value;

    const updated = arr.join("").trimEnd();

    setGroupCode(updated);

    if (value && index < 5) {
      document
        .getElementById(`code-${index + 1}`)
        ?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !groupCode[index] &&
      index > 0
    ) {
      document
        .getElementById(`code-${index - 1}`)
        ?.focus();
    }
  };

  const handleJoin = async () => {
    const code = groupCode.replace(/\s/g, "");

    if (code.length !== 6) {
      toast.error("Enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch(
        `/group/join/${code}`,
        {
          method: "POST",
          body: JSON.stringify({
            groupId: code,
          }),
        }
      );

      toast.success(response.message);

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white w-[500px] rounded-xl shadow-2xl p-6">

        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-semibold">
              Join a Group
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Enter the 6-digit invite code
              shared by the group admin.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* OTP Style Inputs */}
        <div className="flex justify-center gap-3 my-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              ref={i === 0 ? firstInputRef : null}
              id={`code-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={groupCode[i] || ""}
              onChange={(e) =>
                handleChange(i, e.target.value)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, i)
              }
              className="w-12 h-12 text-center border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          ))}
        </div>

        {/* Info */}
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg flex items-center gap-2 mb-6">
          <ShieldCheck size={16} />

          <span>
            Invite codes are private and only
            valid for joining a group.
          </span>
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-3 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleJoin}
            className="flex-1 bg-red-500 text-white rounded-lg py-3 font-medium hover:bg-red-600 disabled:opacity-50"
          >
            {loading
              ? "Joining..."
              : "Join Group"}
          </button>
        </div>
      </div>
    </div>
  );
}