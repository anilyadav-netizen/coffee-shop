// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileDropdown from "../component/ProfileDropdown";
import Sidebar from '../component/Sidebar'
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/Slicer/authSlice';
import {
    ShoppingCart,
    Menu as MenuIcon,
    X,
    Heart
} from "lucide-react";

const Navbar = () => {

    const [open, setOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    
    // ✅ Redux se cart aur wishlist
    const { totalItems } = useSelector((state) => state.cart);
    const { wishlistCount } = useSelector((state) => state.wishlist);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Menu", path: "/menu" },
        { name: "About", path: "/about" },
        { name: "Gallery", path: "/gallery" },
        { name: "Contact", path: "/contact" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCartClick = () => {
        navigate('/cart');
    };

    const handleWishlistClick = () => {
        navigate('/wishlist');
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = () => setOpen(false);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-xl shadow-2xl' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/924/924514.png"
                            alt="Coffee Logo"
                            className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute -inset-1 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h1 className="text-2xl font-bold text-white drop-shadow-lg tracking-tight">
                        Coffee<span className="text-[#0D7C53]">Hub</span>
                    </h1>
                </Link>

                {/* Desktop Nav Items */}
                <ul className="hidden lg:flex items-center gap-8">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className="relative cursor-pointer font-medium text-white/80 hover:text-white transition-all duration-300 group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0D7C53] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Right Side */}
                <div className="flex items-center gap-2">
                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistClick}
                        className="relative p-2 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 group hidden md:block"
                    >
                        <Heart size={22} className="text-white/80 group-hover:text-white transition-colors" />
                        {wishlistCount > 0 ? (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                                {wishlistCount}
                            </span>
                        ) : (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full shadow-lg"></span>
                        )}
                    </button>

                    {/* Cart Button */}
                    <button
                        onClick={handleCartClick}
                        className="relative p-2 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 group hidden md:block"
                    >
                        <ShoppingCart size={22} className="text-white/80 group-hover:text-white" />
                        {totalItems > 0 ? (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                                {totalItems}
                            </span>
                        ) : (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full shadow-lg"></span>
                        )}
                    </button>

                    {/* Profile Button */}
                    <ProfileDropdown />

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-all duration-300"
                    >
                        {isMenuOpen ? <X size={24} className="text-white" /> : <MenuIcon size={24} className="text-white" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Sidebar */}
            <Sidebar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                navItems={navItems}
                handleWishlistClick={handleWishlistClick}
                handleCartClick={handleCartClick}
                wishlistCount={wishlistCount}
                totalItems={totalItems}
                user={isAuthenticated ? user : null}
                onLogout={handleLogout}
            />
        </nav>
    );
};

export default Navbar;