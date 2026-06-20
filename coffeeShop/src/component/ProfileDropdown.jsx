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
        <div className="relative" ref={dropdownRef}>
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
                    className={`transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border z-[9999] overflow-hidden">
                    {!isAuthenticated ? (
                        <div className="flex flex-col">
                            <Link
                                to="/login"
                                onClick={() => setOpen(false)}
                                className="px-4 py-3 hover:bg-gray-100"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                onClick={() => setOpen(false)}
                                className="px-4 py-3 hover:bg-gray-100"
                            >
                                Register
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* User Info */}
                            <div className="p-4 border-b bg-gray-50">
                                <p className="font-semibold text-gray-800">
                                    {user?.name}
                                </p>

                                <p className="text-sm text-gray-500 truncate">
                                    {user?.email}
                                </p>
                            </div>

                            {/* Menu */}
                            {/* <Link
                                to="/profile"
                                onClick={() => setOpen(false)}
                                className="block px-4 py-3 hover:bg-gray-100"
                            >
                                My Profile
                            </Link> */}

                            <Link
                                to="/orders"
                                onClick={() => setOpen(false)}
                                className="block px-4 py-3 hover:bg-gray-100"
                            >
                                My Orders
                            </Link>

                            <Link
                                to="/wishlist"
                                onClick={() => setOpen(false)}
                                className="block px-4 py-3 hover:bg-gray-100"
                            >
                                Wishlist
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;