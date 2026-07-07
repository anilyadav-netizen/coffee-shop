import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import AdSidebar from "../adcomponent/AdSidebar";

const AdminLayout = () => {
    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Initialize theme state from localStorage
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        // Check if theme is saved, default to 'light' if not
        return savedTheme === "dark";
    });

    // Apply theme changes to document and localStorage
    useEffect(() => {
        const htmlElement = document.documentElement;

        if (isDark) {
            htmlElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            htmlElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    // Toggle Dark/Light Mode
    const toggleTheme = () => {
        setIsDark(prevIsDark => !prevIsDark);
    };

    // Toggle Sidebar for Mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Close Sidebar
    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="h-screen bg-[#F8FAFC] dark:bg-dark-bg flex overflow-hidden relative">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
                <AdSidebar onClose={closeSidebar} />
            </div>

            {/* Sidebar - Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar - Mobile */}
            <div className={`
                lg:hidden fixed top-0 left-0 h-full z-50
                transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <AdSidebar onClose={closeSidebar} />
            </div>

            <div className="flex-1 min-w-0 flex flex-col h-screen">
                {/* Top Navbar */}
                <header className="h-[75px] flex-shrink-0 border-b bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border flex items-center justify-between px-3 sm:px-4 md:px-6">
                    {/* Left Section - Menu Icon + Title */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-1.5 sm:p-2 rounded-lg border border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-200 flex-shrink-0"
                            aria-label="Toggle Sidebar"
                        >
                            <FaBars className="text-[#0F172A] dark:text-dark-heading text-base sm:text-xl" />
                        </button>

                        <Link to="/admin" className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F172A] dark:text-dark-heading truncate">
                            Admin Panel
                        </Link>
                    </div>

                    {/* Right Section - Theme Toggle + Profile */}
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
                        {/* Dark/Light Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-1.5 sm:p-2 rounded-lg border border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-200"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <FaSun className="text-[#4F46E5] dark:text-dark-primary text-lg sm:text-xl md:text-xl" />
                            ) : (
                                <FaMoon className="text-[#4F46E5] dark:text-dark-primary text-lg sm:text-xl md:text-xl" />
                            )}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;