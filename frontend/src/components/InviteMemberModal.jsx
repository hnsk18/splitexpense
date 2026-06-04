import React from "react";
import { X, Copy, ShieldCheck } from "lucide-react";
import QR from "./QR";
import { toast } from "sonner";

export default function InviteMemberModal({ show, onClose, groupCode }) {
  if (!show) return null;

  const inviteLink = `${window.location.origin}/group/join/${groupCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);

      toast.success("Invite link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join my Split Expense group!\n${inviteLink}`,
    );

    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareMail = () => {
    const subject = encodeURIComponent("Join my Split Expense Group");

    const body = encodeURIComponent(
      `Hey,\n\nJoin my Split Expense group using this link:\n${inviteLink}`,
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold">Invite Member</h2>

            <p className="text-sm text-gray-500 mt-1">
              Invite friends to join and start splitting expenses.
            </p>
          </div>

          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={22} />
          </button>
        </div>

        {/* Link */}
        <div className="mt-6 flex gap-2">
          <input
            readOnly
            value={inviteLink}
            className="flex-1 border rounded-lg px-3 py-3 text-sm bg-gray-50"
          />

          <button
            onClick={handleCopy}
            className="border border-red-500 text-red-500 px-4 rounded-lg hover:bg-red-50"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={shareWhatsApp}
            className="flex flex-col items-center border border-green-500 rounded-lg hover:bg-green-50"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg"
              alt=""
              className="w-8 h-8 m-2 p-1"
            />
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t"></div>

          <span className="px-3 text-gray-400 text-sm">OR</span>

          <div className="flex-1 border-t"></div>
        </div>

        {/* QR */}
        <div className="flex justify-center mb-8">
          <div className="border rounded-xl p-4">
            <QR payload={inviteLink} />
          </div>
        </div>

        {/* Share Buttons */}
        

        {/* Footer */}
        <div className="bg-green-50 border rounded-xl p-4 flex gap-3">
          <ShieldCheck className="text-green-600 mt-1" size={20} />

          <div>
            <p className="font-medium">Group code is unique and secure.</p>

            <p className="text-sm text-gray-500">
              Only people with this invite can join.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
