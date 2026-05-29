import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export default function SearchableSelect({
    members,
    paidBy,
    setPaidBy,
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 0);
        }
    }, [open]);

    const filteredMembers = members.filter((member) =>
        member.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div
            ref={dropdownRef}
            className="mt-8 relative w-full"
        >
            <label className="text-sm font-medium text-gray-700">
                Paid by
            </label>

            {/* Trigger */}
            <div
                onClick={() => {
                    setOpen(true);

                    setTimeout(() => {
                        searchInputRef.current?.focus();
                    }, 0);
                }}
                className="w-full mt-3 min-h-12 px-4 rounded-xl border border-gray-300 bg-white flex items-center justify-between text-sm shadow-sm hover:border-purple-500 transition-all cursor-text"
            >
                {!open ? (
                    <span
                        className={
                            paidBy
                                ? "text-gray-900"
                                : "text-gray-400"
                        }
                    >
                        {paidBy || "Select Member"}
                    </span>
                ) : (
                    <div className="flex items-center gap-2 w-full">
                        <Search className="w-4 h-4 text-gray-400 shrink-0" />

                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search member..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full h-11 text-sm outline-none bg-transparent"
                        />
                    </div>
                )}

                <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""
                        }`}
                />
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">

                    {/* Search */}


                    {/* Options */}
                    <div className="max-h-60 overflow-y-auto p-2">
                        {filteredMembers.map((member) => (
                            <button
                                key={member.id}
                                type="button"
                                onClick={() => {
                                    setPaidBy(member.name);
                                    setOpen(false);
                                    setSearch("");
                                }}
                                className="w-full px-4 py-3 rounded-xl text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                            >
                                {member.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}