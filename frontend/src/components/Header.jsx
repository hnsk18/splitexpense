// Header.jsx
import React from "react";
import { Bell, ChevronDown } from "lucide-react";

const Header = () => {
    return (
        <header className="w-full flex items-center justify-between px-6 py-2 bg-white border-b border-gray-200">

            {/* Left Section */}
            <div>
                <h1 className="text-2xl font-bold ">
                    💰 Split<span className="text-red-500">Expense</span>
                </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">

                {/* Notification */}
                <button className="hidden relative p-2 rounded-full hover:bg-gray-100 transition">
                    <Bell size={20} className="text-gray-600" />

                    {/* Notification Dot */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition">

                    <img
                        src="https://i.pravatar.cc/40"
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border"
                    />

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800">
                            Sai
                        </p>
                        <p className="text-xs text-gray-500">
                        </p>
                    </div>

                    <ChevronDown size={18} className="text-gray-500" />
                </div>
            </div>
        </header>
    );
};

export default Header;