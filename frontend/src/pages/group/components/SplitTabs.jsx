import React from "react";
import { IndianRupee, Users, Percent } from "lucide-react";

const SplitTabs = ({ splitType, setSplitType }) => {
    const tab = (type, Icon, label) => (
        <button
            onClick={() => setSplitType(type)}
            className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm transition ${splitType === type ? "bg-white text-purple-700 shadow-sm" : "text-gray-600"
                }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );

    return (
        <div className="bg-gray-100 rounded-xl p-1 flex">
            {tab("amount", IndianRupee, "Amount")}
            {tab("share", Users, "Share")}
            {tab("percent", Percent, "Percent")}
        </div>
    );
};

export default SplitTabs;
