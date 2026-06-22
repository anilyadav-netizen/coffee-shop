import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, X, LogOut, UserCircle } from "lucide-react";

const Sidebar = ({
    isOpen,
    onClose,
    navItems,
    handleWishlistClick,
    handleCartClick,
    wishlistCount,
    totalItems,
    user,
    onLogout,
}) => {

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen w-72 bg-white/95 backdrop-blur-md border-r border-white/30 z-50 transform transition-transform duration-300 lg:hidden ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200/50">
                    {user ? (
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0D7C53] to-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {user.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user.name} 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    user.name?.charAt(0).toUpperCase() || "U"
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[#0D7C53] font-semibold text-sm truncate">
                                    {user.name || "User"}
                                </p>
                                <p className="text-gray-500 text-xs truncate">
                                    {user.email || ""}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <Link 
                            to="/login" 
                            onClick={onClose}
                            className="flex items-center gap-2 text-[#0D7C53] hover:text-[#0a6a45] transition-colors"
                        >
                            <UserCircle size={24} />
                            <span className="text-xl font-bold">Login</span>
                        </Link>
                    )}

                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-[#0D7C53] transition-colors ml-2 flex-shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="p-5 space-y-5">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className="block text-gray-700 hover:text-[#0D7C53] font-medium transition-colors duration-300"
                        >
                            {item.name}
                        </Link>
                    ))}

                    <div className="border-t border-gray-200/50 pt-5 space-y-3">
                        {/* Wishlist */}
                        <button
                            onClick={() => {
                                handleWishlistClick();
                                onClose();
                            }}
                            className="w-full flex items-center justify-between bg-pink-50 hover:bg-pink-100 px-4 py-3 rounded-xl text-gray-700 border border-pink-200 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Heart size={18} className="text-pink-500" />
                                <span>Wishlist</span>
                            </div>
                            {wishlistCount > 0 && (
                                <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                                    {wishlistCount}
                                </span>
                            )}
                        </button>

                        {/* Cart */}
                        <button
                            onClick={() => {
                                handleCartClick();
                                onClose();
                            }}
                            className="w-full flex items-center justify-between bg-green-50 hover:bg-green-100 px-4 py-3 rounded-xl text-gray-700 border border-green-200 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <ShoppingCart size={18} className="text-[#0D7C53]" />
                                <span>Cart</span>
                            </div>
                            {totalItems > 0 && (
                                <span className="bg-[#0D7C53] text-white text-xs px-2 py-1 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {user && (
                            <button
                                onClick={() => {
                                    if (onLogout) onLogout();
                                    onClose();
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 px-4 py-3 rounded-xl text-red-600 border border-red-200 transition-colors mt-2"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;