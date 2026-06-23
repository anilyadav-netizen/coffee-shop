import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, X, LogOut, UserCircle, Home, Coffee, Users, Camera, Award, Settings, ChevronRight } from "lucide-react";

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

    // Navigation icons mapping
    const getNavIcon = (name) => {
        const icons = {
            'Home': Home,
            'Menu': Coffee,
            'About': Users,
            'Gallery': Camera,
            'Contact': Award,
        };
        return icons[name] || ChevronRight;
    };

    return (
        <>
            {/* Overlay with blur */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-500 lg:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen w-[85%] max-w-sm bg-gradient-to-b from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] backdrop-blur-xl border-r border-white/30 z-50 transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Decorative Elements */}
                <div className="absolute top-20 right-4 opacity-5 text-6xl rotate-12">☕</div>
                <div className="absolute bottom-32 left-4 opacity-5 text-6xl -rotate-12">🫘</div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 text-8xl">📸</div>

                {/* Header - Glass Effect */}
                <div className="relative bg-gradient-to-r from-[#0D7C53]/5 to-green-500/5 backdrop-blur-xl border-b border-white/30 p-3">
                    <div className="flex items-center justify-between">
                        {user ? (
                            <div className="flex items-center gap-3 flex-1">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0D7C53] to-green-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#0D7C53]/30 ring-4 ring-white/50">
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
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-800 font-bold text-base truncate">
                                        {user.name || "User"}
                                    </p>
                                    <p className="text-gray-500 text-xs truncate flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                        {user.email || "user@example.com"}
                                    </p>
                                    <span className="inline-block mt-1 text-[10px] font-medium text-[#0D7C53] bg-[#0D7C53]/10 px-2 py-0.5 rounded-full">
                                        Coffee Lover
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={onClose}
                                className="flex items-center gap-3 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0D7C53] to-green-400 flex items-center justify-center shadow-lg shadow-[#0D7C53]/30 group-hover:scale-110 transition-transform duration-300">
                                    <UserCircle size={24} className="text-white" />
                                </div>
                                <div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-[#0D7C53] to-green-400 bg-clip-text text-transparent">
                                        Welcome!
                                    </span>
                                    <p className="text-xs text-gray-500">Login to continue</p>
                                </div>
                            </Link>
                        )}

                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/80 text-gray-600 hover:text-[#0D7C53] transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 flex-shrink-0"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="relative p-3 overflow-y-auto h-[calc(100vh-180px)] scrollbar-thin scrollbar-thumb-[#0D7C53]/20 scrollbar-track-transparent">
                    {/* Main Navigation */}
                    <div className="space-y-1">

                        {navItems.map((item) => {
                            const Icon = getNavIcon(item.name);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className="group flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:text-[#0D7C53] hover:bg-[#0D7C53]/10 transition-all duration-300 font-medium relative overflow-hidden"
                                >
                                    <span className="w-9 h-9 rounded-xl bg-[#0D7C53]/10 flex items-center justify-center group-hover:bg-[#0D7C53]/20 transition-all duration-300">
                                        <Icon size={22} className="text-[#0D7C53] group-hover:scale-110 transition-transform" />
                                    </span>
                                    <span>{item.name}</span>
                                    <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 text-[#0D7C53]" />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">
                            Quick Actions
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {/* Wishlist */}
                            <button
                                onClick={() => {
                                    handleWishlistClick();
                                    onClose();
                                }}
                                className="group relative overflow-hidden bg-gradient-to-br from-pink-50 to-pink-100/50 hover:from-pink-100 hover:to-pink-200/50 px-4 py-4 rounded-2xl border border-pink-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-200/50"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-pink-300/10 rounded-full blur-2xl"></div>
                                <div className="relative flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-all">
                                        <Heart size={20} className="text-pink-500 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">Wishlist</span>
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30 animate-bounce">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </div>
                            </button>

                            {/* Cart */}
                            <button
                                onClick={() => {
                                    handleCartClick();
                                    onClose();
                                }}
                                className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100/50 hover:from-green-100 hover:to-emerald-200/50 px-4 py-4 rounded-2xl border border-green-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-200/50"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-green-300/10 rounded-full blur-2xl"></div>
                                <div className="relative flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-full bg-[#0D7C53]/10 flex items-center justify-center group-hover:bg-[#0D7C53]/20 transition-all">
                                        <ShoppingCart size={20} className="text-[#0D7C53] group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">Cart</span>
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-[#0D7C53] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-[#0D7C53]/30 animate-bounce">
                                            {totalItems}
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Logout */}
                    {user && (
                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    if (onLogout) onLogout();
                                    onClose();
                                }}
                                className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-200/50 px-4 py-4 rounded-2xl border border-red-200/50 text-red-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-200/50"
                            >
                                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                                    <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                                </div>
                                <span className="font-semibold">Logout</span>
                                <span className="ml-auto text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-all">→</span>
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-white/30">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xs text-gray-400">☕</span>
                            <span className="text-[10px] text-gray-400 font-medium">Brew & Co.</span>
                            <span className="text-xs text-gray-400">🫘</span>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center mt-1">
                            Crafting coffee experiences since 2024
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;