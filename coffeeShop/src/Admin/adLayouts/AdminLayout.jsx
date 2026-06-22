import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import AdSidebar from "../adcomponent/AdSidebar";

const AdminLayout = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex">
            <AdSidebar />

            <div className="flex-1">
                {/* Top Navbar */}
                <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-6">
                    <h2 className="text-xl font-semibold">
                        Admin Panel
                    </h2>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2"
                        >
                            <FaUserCircle size={30} />
                            <span className="hidden md:block">
                                Admin
                            </span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden">
                                <button className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                    My Profile
                                </button>

                                <button className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                    Settings
                                </button>

                                <button className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2">
                                    <FaSignOutAlt />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;