import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import AdSidebar from "../adcomponent/AdSidebar";

const AdminLayout = () => {
    const [open, setOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Toggle Dark/Light Mode
    const toggleTheme = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
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
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
            <div className="min-h-screen bg-[#FDF8F3] dark:bg-[#1A0F0A] flex relative">
                
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

                <div className="flex-1 min-w-0">
                    {/* Top Navbar */}
                    <header className="h-14 sm:h-16 border-b border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] bg-white dark:bg-[#261810] flex items-center justify-between px-3 sm:px-4 md:px-6">
                        
                        {/* Left Section - Menu Icon + Title */}
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-1.5 sm:p-2 rounded-lg border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] hover:bg-[#F5EDE3] dark:hover:bg-[#3D2317] transition-colors duration-200 flex-shrink-0"
                                aria-label="Toggle Sidebar"
                            >
                                <FaBars className="text-[#2C1810] dark:text-[#F5EDE3] text-base sm:text-xl" />
                            </button>

                            <Link to ="/admin" className="text-sm sm:text-base md:text-xl font-semibold text-[#2C1810] dark:text-[#F5EDE3] truncate">
                                Admin Panel
                            </Link>
                        </div>

                        {/* Right Section - Theme Toggle + Profile */}
                        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
                            {/* Dark/Light Mode Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-1.5 sm:p-2 rounded-lg border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] hover:bg-[#F5EDE3] dark:hover:bg-[#3D2317] transition-colors duration-200"
                                aria-label="Toggle theme"
                            >
                                {isDark ? (
                                    <FaSun className="text-[#C68E5C] text-sm sm:text-base md:text-xl" />
                                ) : (
                                    <FaMoon className="text-[#6F4E37] text-sm sm:text-base md:text-xl" />
                                )}
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="flex items-center gap-1 sm:gap-2 text-[#2C1810] dark:text-[#F5EDE3]"
                                >
                                    <FaUserCircle 
                                        size={24} 
                                        className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#6F4E37] dark:text-[#C68E5C]" 
                                    />
                                    <span className="hidden sm:inline-block text-xs sm:text-sm md:text-base">
                                        Admin
                                    </span>
                                </button>

                                {open && (
                                    <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white dark:bg-[#261810] border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] rounded-xl shadow-[0_2px_8px_rgba(44,24,16,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] overflow-hidden z-50">
                                        <button className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#5C4033] dark:text-[#C4A882] hover:bg-[#F5EDE3] dark:hover:bg-[#3D2317] transition-colors duration-200">
                                            My Profile
                                        </button>

                                        <button className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#5C4033] dark:text-[#C4A882] hover:bg-[#F5EDE3] dark:hover:bg-[#3D2317] transition-colors duration-200">
                                            Settings
                                        </button>

                                        <button className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors duration-200">
                                            <FaSignOutAlt className="text-sm" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="p-2 sm:p-3 md:p-4 lg:p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;