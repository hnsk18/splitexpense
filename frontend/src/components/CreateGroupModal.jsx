import React, { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Palmtree,
  House,
  Utensils,
  GraduationCap,
  Briefcase,
  Gift,
} from "lucide-react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const icons = [
  { id: "trip", icon: <Palmtree size={22} /> },
  { id: "home", icon: <House size={22} /> },
  { id: "food", icon: <Utensils size={22} /> },
  { id: "college", icon: <GraduationCap size={22} /> },
  { id: "work", icon: <Briefcase size={22} /> },
  { id: "gift", icon: <Gift size={22} /> },
];

export default function CreateGroupModal({ show, onClose, onSuccess }) {
  const { user } = useAuth();

  const [groupName, setGroupName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("trip");
  const [loading, setLoading] = useState(false);

  const [members, setMembers] = useState([{ upi: "", name: "" }]);

  if (!show) return null;

  const addMemberRow = () => {
    setMembers([...members, { upi: "", name: "" }]);
  };

  const removeMemberRow = (index) => {
    if (members.length === 1) return;

    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    const validMembers = members.filter((m) => m.upi.trim());

    if (validMembers.length === 0) {
      toast.error("Add at least one member");
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch("/group/create", {
        method: "POST",
        body: JSON.stringify({
          name: groupName,
          members: validMembers,
          createdBy: user?.upi,
        }),
      });

      if (response.status) {
        toast.success(`Group created successfully!`);

        setGroupName("");
        setSelectedIcon("trip");
        setMembers([{ upi: "", name: "" }]);

        if (onSuccess) {
          await onSuccess();
        }

        onClose();
      } else {
        toast.error(response.message || "Failed to create group");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white w-[760px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">Create New Group</h2>

            <p className="text-gray-500 mt-1">
              Add group details and invite members to get started.
            </p>
          </div>

          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Group Name */}
        <div className="mb-8">
          <label className="block font-medium mb-2">Group Name</label>

          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Group Icon */}
        <div className="mb-8 hidden">
          <label className="block font-medium mb-3">Group Icon</label>

          <div className="flex gap-4 flex-wrap">
            {icons.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedIcon(item.id)}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition ${
                  selectedIcon === item.id
                    ? "border-red-500 bg-red-50 text-red-500"
                    : "bg-gray-50"
                }`}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Members */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-lg">Add Members</h3>

          <p className="text-gray-500 text-sm mb-4">
            Add members using their UPI ID. Nickname is optional.
          </p>

          <div className="grid grid-cols-[40px_1fr_1fr_40px] gap-4 mb-3 text-sm font-medium text-gray-600">
            <div>#</div>
            <div>UPI ID</div>
            <div>Nickname</div>
            <div></div>
          </div>

          {members.map((member, index) => (
            <div
              key={index}
              className="grid grid-cols-[40px_1fr_1fr_40px] gap-4 mb-4 items-center"
            >
              <div>{index + 1}</div>

              <input
                type="text"
                value={member.upi}
                placeholder="user@upi"
                onChange={(e) => updateMember(index, "upi", e.target.value)}
                className="border rounded-lg px-3 py-2"
              />

              <input
                type="text"
                value={member.name}
                placeholder="Nickname"
                onChange={(e) => updateMember(index, "name", e.target.value)}
                className="border rounded-lg px-3 py-2"
              />

              <button
                type="button"
                onClick={() => removeMemberRow(index)}
                className="text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addMemberRow}
            className="w-full border border-dashed rounded-lg py-3 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50"
          >
            <Plus size={18} />
            Add Another Member
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-3 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleCreateGroup}
            className="flex-1 bg-red-500 text-white rounded-lg py-3 font-medium hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}
