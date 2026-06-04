import React, { useEffect, useState } from "react";
import {
  Plus,
  Users,
  Wallet,
  ArrowDown,
  ArrowUp,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner";

import Header from "../components/Header";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import JoinGroupModal from "../components/JoinGroupModal";
import CreateGroupModal from "../components/CreateGroupModal";

function Me() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);

    try {
      const response = await apiFetch("/group/getall");

      if (response.status) {
        setGroups(response.groups || []);
      }
    } catch (err) {
      console.error("Failed to fetch groups", err);
    } finally {
      setLoading(false);
    }
  };
  const totalReceive = groups.reduce(
    (sum, group) => sum + (group.receiveableamount || 0),
    0,
  );

  const totalPay = groups.reduce(
    (sum, group) => sum + (group.payableamount || 0),
    0,
  );

  const finalBalance = totalReceive - totalPay;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-2">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">
              Welcome back, {user?.name}! 👋
            </h2>

            <p className="text-gray-500 mt-1">
              Here's your expense overview and settlements.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="border border-green-500 text-green-600 px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-green-50"
            >
              <Users size={18} />
              Join Group
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-red-500 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
            >
              <Plus size={18} />
              Create Group
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Final Balance */}
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Wallet size={24} className="text-blue-600" />
              </div>

              <div>
                <p className="text-gray-500 text-sm">Final Balance</p>

                <h3
                  className={`text-3xl font-bold ${
                    finalBalance >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  ₹{Math.abs(finalBalance)}
                </h3>

                <p className="text-xs text-gray-500">Net settlement</p>
              </div>
            </div>
          </div>

          {/* Receive */}
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <ArrowDown size={24} className="text-green-600" />
              </div>

              <div>
                <p className="text-gray-500 text-sm">You Will Receive</p>

                <h3 className="text-3xl font-bold text-green-600">
                  ₹{totalReceive}
                </h3>

                <p className="text-xs text-gray-500">Across all groups</p>
              </div>
            </div>
          </div>

          {/* Pay */}
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <ArrowUp size={24} className="text-red-500" />
              </div>

              <div>
                <p className="text-gray-500 text-sm">You Will Pay</p>

                <h3 className="text-3xl font-bold text-red-500">₹{totalPay}</h3>

                <p className="text-xs text-gray-500">Across all groups</p>
              </div>
            </div>
          </div>
        </div>

        {/* Groups */}
        <div>
          <h3 className="font-semibold text-xl mb-4">
            Your Groups ({groups.length})
          </h3>

          {loading ? (
            <div className="bg-white rounded-xl border p-10 text-center">
              Loading groups...
            </div>
          ) : groups.length === 0 ? (
            <div className="bg-white rounded-xl border p-10 text-center text-gray-500">
              No groups found
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map((group, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                      👥
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg">{group.name}</h4>

                      <p className="text-sm text-gray-500">
                        {group.totalMembers} members
                      </p>

                      <p className="text-xs text-gray-400 hidden">
                        Group Code: {group.groupCode}
                      </p>

                      <p className="text-xs text-gray-400">
                        Created by {group.createdBy}
                      </p>
                    </div>
                  </div>

                  {/* Receive */}
                  <div>
                    <p className="text-xs text-gray-500">You will receive</p>

                    <p className="font-semibold text-green-600">
                      ₹{group.receiveableamount}
                    </p>
                  </div>

                  {/* Pay */}
                  <div>
                    <p className="text-xs text-gray-500">You will pay</p>

                    <p className="font-semibold text-red-500">
                      ₹{group.payableamount}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        navigate(`/dashboard?gc=${group.groupCode}`)
                      }
                      className="border border-red-400 text-red-500 px-5 py-2 rounded-lg hover:bg-red-50 transition"
                    >
                      View
                    </button>

                    <MoreVertical size={18} className="cursor-pointer hidden" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <JoinGroupModal
        show={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={fetchGroups}
      />
      <CreateGroupModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchGroups}
      />
    </div>
  );
}

export default Me;
