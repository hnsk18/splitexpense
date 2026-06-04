import React, { useState } from "react";
import { Link2, Plus, Send } from "lucide-react";
import InviteMemberModal from "../../components/InviteMemberModal";
const members = [
  {
    upi: "Rohan",
    name: "Rohan",
    role: "You",
    status: "To receive",
    amount: 960,
    avatar: "R",
    avatarBg: "bg-amber-100 text-amber-700",
  },
  {
    upi: "Priya",
    name: "Priya",
    role: "",
    status: "To pay",
    amount: -240,
    avatar: "P",
    avatarBg: "bg-rose-100 text-rose-700",
  },
  {
    upi: "Amit",
    name: "Amit",
    role: "",
    status: "To pay",
    amount: -240,
    avatar: "A",
    avatarBg: "bg-sky-100 text-sky-700",
  },
  {
    upi: "Neha",
    name: "Neha",
    role: "",
    status: "To pay",
    amount: -240,
    avatar: "N",
    avatarBg: "bg-orange-100 text-orange-700",
  },
  {
    upi: "Suresh",
    name: "Suresh",
    role: "",
    status: "To receive",
    amount: 240,
    avatar: "S",
    avatarBg: "bg-emerald-100 text-emerald-700",
  },
];

function generateColor(str) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; // Convert to 32-bit integer
  }

  const color = `#${(hash >>> 0).toString(16).padStart(8, "0").slice(0, 6)}`;
  console.log(str, color);
  return color;
}

function RightPanel({ userData, grpname }) {
  console.log(userData);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  return (
    <section className="flex-1 min-w-0 bg-white border border-gray-200 rounded-2xl shadow-[0_14px_36px_rgba(15,23,42,0.08)] p-4 md:p-5 flex flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Members</h2>
          <p className="mt-1 text-xs text-gray-500">
            Balance overview for the {grpname} group
          </p>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-lg text-gray-500 font-medium">
            Total Balance
          </span>

          <span
            className={`text-lg font-bold ${userData?.total >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            ₹{userData?.total || 0}
          </span>
        </div>
      </div>
      <div className="mt-2 flex flex-col">
        <div className="pr-1">
          {userData?.balances?.map((member, index) => (
            <div
              key={member.upi}
              className={`flex items-center gap-3 border-b border-gray-200 py-4 last:border-b-0 ${index === 0 ? "pt-5" : ""}`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold`}
                style={{
                  backgroundColor: generateColor(member.upi),
                  color:
                    generateColor(member.upi).toLowerCase() === "#ffffff"
                      ? "#000"
                      : "#fff",
                }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-base font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  {member.role ? (
                    <span className="text-xs text-gray-400">
                      ({member.role})
                    </span>
                  ) : null}
                </div>
              </div>

              {member.amount > 0 && (
                <>
                  <div
                    className={`hidden md:flex w-28 justify-center text-xs font-semibold shrink-0 ${member.amount >= 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    "To " + {member.amount > 0 ? "pay" : "receive"}
                  </div>

                  <div
                    className={`w-20 text-right text-base font-semibold shrink-0 ${member.amount >= 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    {`₹${Math.abs(member.amount)}`}
                  </div>

                  <button
                    className={`ml-1 rounded-xl border px-4 py-2 text-xs font-semibold transition ${member.amount >= 0 ? "border-green-500 text-green-600 hover:bg-green-50" : "border-red-500 text-red-500 hover:bg-red-50"}`}
                  >
                    {member.amount > 0 ? "Request" : "Pay Now"}
                  </button>
                </>
              )}
            </div>
          ))}
          <div
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-3 border-b border-gray-200 py-4 cursor-pointer"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold border border-gray-300`}
            >
              <Link2 size={16} />
            </div>

            <div className="min-w-0 flex-1 flex-col items-center">
              <p className="truncate text-base font-semibold text-gray-900">
                Invite Member
              </p>
              <small className="text-xs text-gray-500">
                Share invite link or add a new member
              </small>
            </div>
          </div>
        </div>
      </div>
      <InviteMemberModal
        show={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        groupCode={userData?.groupCode}
      />
    </section>
  );
}

export default RightPanel;
