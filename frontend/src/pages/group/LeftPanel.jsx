import React from "react";
import { useSearchParams } from "react-router-dom";
import {
    ChevronDown,
    Copy,
    Plus,
    ArrowRightLeft,
} from "lucide-react";
import { toast } from "react-toastify";

const expenses = [
    {
        date: "26",
        month: "Dec",
        title: "Dinner",
        paidBy: "Rohan",
        amount: "₹1200",
        status: "",
    },
    {
        date: "25",
        month: "Dec",
        title: "Hotel Stay",
        paidBy: "Priya",
        amount: "₹4500",
        status: "",
    },
    {
        date: "24",
        month: "Dec",
        title: "Car Rental",
        paidBy: "Amit",
        amount: "₹3000",
        status: "",
    },
    {
        date: "24",
        month: "Dec",
        title: "Fuel",
        paidBy: "Neha",
        amount: "₹1500",
        status: "Unsettled",
        unsettled: true,
    },
    {
        date: "23",
        month: "Dec",
        title: "Groceries",
        paidBy: "Rohan",
        amount: "₹850",
        status: "Settled",
        settled: true,
    },
    {
        date: "23",
        month: "Dec",
        title: "Groceries",
        paidBy: "Rohan",
        amount: "₹850",
        status: "Settled",
        settled: true,
    },
];

const LeftPanel = ({ setSplitPanelActive }) => {
    const [searchParams] = useSearchParams();
    const groupId = searchParams.get("gc");
    return (
        <aside className="w-full xl:w-80 xl:shrink-0 h-full min-h-0 self-stretch bg-white border border-gray-200 rounded-2xl shadow-[0_14px_36px_rgba(15,23,42,0.08)] p-4 flex flex-col overflow-hidden">

            {/* Trip Card */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">

                {/* Top */}
                <div className="p-3.5 flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">

                        {/* Trip Image */}
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/201/201623.png"
                            alt="trip"
                            className="w-14 h-14 rounded-full border border-gray-200 bg-white object-cover"
                        />

                        {/* Trip Info */}
                        <div className="min-w-0">
                            <h2 className="truncate text-xl font-semibold text-gray-900">
                                Goa Trip
                            </h2>

                            <p className="text-gray-500 mt-1 text-xs font-medium">
                                5 members
                            </p>
                        </div>
                    </div>

                    {/* Dropdown */}
                    <div className="hidden">
                        <button className="w-10 h-10 rounded-xl border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition shrink-0">
                            <ChevronDown size={20} />
                        </button>
                    </div>
                </div>

                {/* Group Code */}
                <div className="border-t border-gray-200 bg-gray-50/80 p-3.5">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600 mb-2.5">
                        Group Code
                    </p>

                    <div className="flex items-center justify-between gap-2.5">

                        <div className="flex items-center gap-2.5 min-w-0">

                            <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm font-semibold tracking-[0.18em] text-gray-800 shadow-sm">
                                {groupId}
                            </div>
                            <button
                                className="copy-btn flex items-center gap-1.5 shrink-0 cursor-pointer rounded-2xl
                                    active:bg-gray-300 active:border active:border-gray-200 p-1.5 transition-transform hover:scale-105"
                                onClick={() => {
                                    navigator.clipboard.writeText(groupId)
                                    toast.success("Group code copied to clipboard!");
                                }}
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                        <div className="hidden">
                            <button
                                className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-600 shrink-0 transition opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                                onClick={() => {
                                    navigator.clipboard.writeText(groupId)
                                    toast.success("Group code copied to clipboard!");
                                }}
                            >
                                <Copy size={16} />
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Expenses Heading */}
            <div className="mt-5 mb-2">
                <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-500">
                    EXPENSES
                </h3>
            </div>

            {/* Add Expense Button */}
            <button
                className="cursor-pointer mb-3 p-2 h-12 border-2 border-red-400 rounded-xl flex items-center justify-center gap-2.5 text-red-500 font-semibold text-sm hover:bg-red-50 transition bg-white"
                onClick={() => setSplitPanelActive(true)}
            >
                <Plus size={18} />
                Add Expense
            </button>

            {/* Expense List */}
            <div className="flex flex-col gap-2.5 flex-1 min-h-0 overflow-y-auto pr-1 overflow-x-hidden max-h-100 last:pb-0.5">
                {expenses.map((expense, index) => (
                    <div
                        key={index}
                        // add hover effect to change border color to red-300 and bg to red-50 if expense is active or unsettled
                        className={`rounded-xl border p-3.5 flex items-center justify-between transition shadow-sm hover:shadow-lg cursor-pointer last:mb-2
                            ${expense.active
                                ? "border-red-200 bg-red-50/40"
                                : "border-gray-200 bg-white"
                            }`
                        }
                    >

                        {/* Left */}
                        <div className="flex items-center gap-3 min-w-0">

                            {/* Date Box */}
                            <div className="w-14 h-14 rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center shrink-0">
                                <span className="text-xl font-semibold text-gray-800 leading-none">
                                    {expense.date}
                                </span>

                                <span className="text-[11px] text-gray-500 mt-0.5">
                                    {expense.month}
                                </span>
                            </div>

                            {/* Expense Details */}
                            <div className="min-w-0">
                                <h4 className="truncate font-semibold text-base text-gray-900">
                                    {expense.title}
                                </h4>

                                <p className="text-xs text-gray-500 mt-0.5 truncate">
                                    {expense.paidBy} paid {expense.amount}
                                </p>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">

                            <span
                                className={`font-bold text-lg ${expense.unsettled
                                    ? "text-red-500"
                                    : expense.settled
                                        ? "text-blue-500"
                                        : expense.active
                                            ? "text-red-500"
                                            : "text-gray-700"
                                    }`}
                            >
                                {expense.amount}
                            </span>

                            {expense.status && (
                                <span
                                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border
                    ${expense.unsettled
                                            ? "border-red-300 text-red-500 bg-red-50"
                                            : "border-blue-300 text-blue-500 bg-blue-50"
                                        }`}
                                >
                                    {expense.status}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </aside >
    );
};

export default LeftPanel;