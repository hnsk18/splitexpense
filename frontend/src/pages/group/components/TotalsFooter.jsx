import React from "react";
import { Wallet, IndianRupee, Clock3 } from "lucide-react";

const TotalsFooter = ({ totalAmount, assignedAmount, remainingAmount, onSplitEqually, onDone }) => {
    return (
        <>
            {/* <div className="hidden mt-6 border border-gray-200 rounded-xl h-20 flex items-center justify-around px-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Wallet className="text-purple-700" />
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Total Amount</p>
                        <h2 className="text-xl font-bold">₹{totalAmount.toFixed(2)}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <IndianRupee className="text-blue-700" />
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Total Assigned</p>
                        <h2 className="text-xl font-bold">₹{assignedAmount.toFixed(2)}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Clock3 className="text-green-700" />
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Remaining</p>
                        <h2 className="text-xl font-bold text-green-700">₹{remainingAmount.toFixed(2)}</h2>
                    </div>
                </div>
            </div> */}

            <div className="mt-4 flex justify-end gap-3">
                <button
                    onClick={onSplitEqually}
                    className="h-10 px-3 rounded-lg border text-sm font-semibold text-purple-700"
                >
                    Split Equally
                </button>

                <button
                    onClick={onDone}
                    disabled={remainingAmount !== 0 || assignedAmount !== totalAmount}
                    className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-700 to-purple-600 text-white text-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                >
                    Done
                </button>
            </div>
        </>
    );
};

export default TotalsFooter;
