// src/components/ProfileDropdown.jsx

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { User, ChevronDown } from "lucide-react";

const ProfileDropdown = () => {
    const [open, setOpen] = useState(false);

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Outside click close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
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

    const handleLogout = () => {
        localStorage.removeItem("token");

        // Agar Redux logout action hai to yahan dispatch karo
        // dispatch(logout())

        setOpen(false);
        navigate("/");
        window.location.reload();
    };

    return (

        <div className="relative hidden md:block" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white px-3 py-2 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
            >
                {isAuthenticated ? (
                    <div className="w-7 h-7 rounded-full bg-white text-[#0D7C53] flex items-center justify-center font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                ) : (
                    <User size={18} />
                )}

                <span>
                    {isAuthenticated
                        ? user?.name?.split(" ")[0]
                        : "Login"}
                </span>

                <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-full mt-3 w-72 backdrop-blur-xl bg-white/90 border border-white/30 rounded-2xl shadow-2xl shadow-black/10 z-[9999] overflow-hidden animate-fade-in-down">
                    {!isAuthenticated ? (
                        <div className="flex flex-col p-2">
                            <Link
                                to="/login"
                                onClick={() => setOpen(false)}
                                className="px-4 py-3 rounded-xl text-gray-700 hover:text-[#0D7C53] hover:bg-[#0D7C53]/10 transition-all duration-300 font-medium flex items-center gap-3 group"
                            >
                                <span className="w-8 h-8 rounded-full bg-[#0D7C53]/10 flex items-center justify-center group-hover:bg-[#0D7C53]/20 transition-all">
                                    <svg className="w-4 h-4 text-[#0D7C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </span>
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                onClick={() => setOpen(false)}
                                className="px-4 py-3 rounded-xl text-gray-700 hover:text-[#0D7C53] hover:bg-[#0D7C53]/10 transition-all duration-300 font-medium flex items-center gap-3 group"
                            >
                                <span className="w-8 h-8 rounded-full bg-[#0D7C53]/10 flex items-center justify-center group-hover:bg-[#0D7C53]/20 transition-all">
                                    <svg className="w-4 h-4 text-[#0D7C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </span>
                                Register
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* User Info */}
                            <div className="p-5 border-b border-white/20 bg-gradient-to-r from-[#0D7C53]/5 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0D7C53] to-green-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#0D7C53]/20">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-base">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                            {user?.email || 'user@example.com'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-1">
                                <Link
                                    to="/orders"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-[#0D7C53] hover:bg-[#0D7C53]/10 transition-all duration-300 group"
                                >
                                    <span className="w-9 h-9 rounded-full bg-[#0D7C53]/10 flex items-center justify-center group-hover:bg-[#0D7C53]/20 transition-all">
                                        <svg className="w-6 h-6 text-[#0D7C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </span>
                                    <span className="font-medium text-base">My Orders</span>
                                </Link>

                                <Link
                                    to="/wishlist"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-[#0D7C53] hover:bg-[#0D7C53]/10 transition-all duration-300 group"
                                >
                                    <span className="w-9 h-9 rounded-full bg-[#0D7C53]/10 flex items-center justify-center group-hover:bg-[#0D7C53]/20 transition-all">
                                        <svg className="w-6 h-6 text-[#0D7C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </span>
                                    <span className="font-medium text-base">Wishlist</span>
                                </Link>


                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 group"
                                >
                                    <span className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-all">
                                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </span>
                                    <span className="font-medium text-base">Logout</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;