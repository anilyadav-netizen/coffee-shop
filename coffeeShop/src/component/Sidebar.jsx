import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, X } from "lucide-react";

const Sidebar = ({
    isOpen,
    onClose,
    navItems,
    handleWishlistClick,
    handleCartClick,
    wishlistCount,
    totalItems,
}) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
                    isOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen w-72 bg-white/95 backdrop-blur-md border-r border-white/30 z-50 transform transition-transform duration-300 lg:hidden ${
                    isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200/50">
                    <h2 className="text-[#0D7C53] text-xl font-bold">
                        Menu
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-[#0D7C53] transition-colors"
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
                                <Heart
                                    size={18}
                                    className="text-pink-500"
                                />
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
                                <ShoppingCart
                                    size={18}
                                    className="text-[#0D7C53]"
                                />
                                <span>Cart</span>
                            </div>

                            {totalItems > 0 && (
                                <span className="bg-[#0D7C53] text-white text-xs px-2 py-1 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;