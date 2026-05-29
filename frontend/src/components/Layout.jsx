// layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#f8f9fb] flex flex-col">
            <Header />
            <main className="flex-1 p-2">
                {children || <Outlet />}
            </main>
        </div>
    );
};

export default Layout;