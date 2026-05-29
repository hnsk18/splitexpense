import React from "react";
import { IndianRupee, X, Percent } from "lucide-react";

const MemberRow = ({ member, updateMemberValue, toggleChecked, splitType }) => {
    return (
        <div className="h-16 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    checked={member.checked}
                    onChange={() => {
                        toggleChecked(member.id);
                    }}
                    className="w-5 h-5 accent-green-600"
                />

                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                    {member.avatar}
                </div>

                <div>
                    <h3 className="text-base font-medium text-gray-900">{member.name}</h3>
                </div>
            </div>

            {member.checked && (
                <>
                    {splitType !== "amount" && member.calculatedAmount !== undefined && (
                        <div className={`text-sm font-medium ${member.calculatedAmount >= 0 ? "text-green-600" : "text-red-500"}`}>
                            <span >₹{member.calculatedAmount}</span>
                        </div>
                    )}
                    <div className="w-36 h-10 border border-gray-300 rounded-lg flex items-center overflow-hidden">
                        <div className="w-12 h-full ml-2 flex items-center justify-center text-sm">
                            {splitType === "amount" ? <IndianRupee size={16} /> : splitType === "share" ? <X size={16} /> : <Percent size={16} />}
                        </div>

                        <input
                            type="number"
                            value={member.value}
                            min={0}
                            onChange={(e) => updateMemberValue(member.id, e.target.value)}
                            className="flex-1 h-full px-3 text-sm outline-none"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default MemberRow;
