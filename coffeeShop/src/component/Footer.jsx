import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa6";
import {
    Coffee,
    MapPin,
    Phone,
    Mail,
    Clock,
    Heart,
    ArrowUp,
    CreditCard,
    Truck,
    Shield
} from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <>
            {/* ========== COFFEE OVERLAY SECTION ========== */}
            <div className="relative w-full h-32 md:h-48 overflow-hidden px-4">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f0a] to-[#0a0604]"></div>

                {/* Coffee Background Image */}
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&h=400&fit=crop&auto=format"
                        alt="Coffee Beans"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Gradient Overlay for Smooth Transition */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a0f0a]/50 to-[#1a0f0a]"></div>

                {/* Floating Coffee Beans with Animation */}
                <div className="absolute inset-0 flex items-center justify-around opacity-30 pointer-events-none">
                    {['☕', '🫘', '☕', '🫘', '☕']?.map((emoji, index) => (
                        <span
                            key={index}
                            className="text-4xl md:text-7xl"
                            style={{
                                animation: `float${index % 2 === 0 ? 'Up' : 'Down'} ${3 + index * 0.5}s ease-in-out infinite`,
                                animationDelay: `${index * 0.3}s`
                            }}
                        >
                            {emoji}
                        </span>
                    ))}
                </div>

                {/* Center Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <span className="text-3xl md:text-5xl mb-2">☕</span>
                    <p className="text-white/60 text-xs md:text-sm font-light tracking-[0.2em] uppercase">
                        Brewed with Passion • Served with Love
                    </p>
                    <div className="w-24 md:w-32 h-0.5 bg-gradient-to-r from-transparent via-[#0D7C53] to-transparent mt-3"></div>
                </div>
            </div>

            {/* ========== MAIN FOOTER ========== */}
            <footer className="relative bg-gradient-to-b from-[#1a0f0a] to-[#0a0604] text-white">
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0D7C53] to-transparent"></div>

                {/* Coffee Bean Pattern Overlay */}
                <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                    <div className="absolute -top-10 -left-10 text-9xl">☕</div>
                    <div className="absolute top-1/4 right-20 text-7xl rotate-12">🫘</div>
                    <div className="absolute bottom-1/4 left-20 text-8xl -rotate-12">☕</div>
                    <div className="absolute -bottom-10 -right-10 text-9xl">🫘</div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 md:pt-12 pb-4 md:pb-8">
                    {/* Main Footer Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-10 lg:gap-8">

                        {/* Brand Section */}
                        <div className="space-y-4">
                            <Link to="/">
                                <div className="flex items-center gap-3">
                                    <div className="relative group">
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/924/924514.png"
                                            alt="Coffee Logo"
                                            className="w-12 h-12 transition-transform duration-300 hover:scale-110 hover:rotate-12"
                                        />
                                        <div className="absolute -inset-1 bg-[#0D7C53]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            Coffee<span className="text-[#0D7C53]">Hub</span>
                                        </h2>
                                        <p className="text-xs text-gray-400">Premium Coffee Since 2020</p>
                                    </div>
                                </div>
                            </Link>

                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                Discover your perfect cup with our carefully crafted blends,
                                sourced from the finest beans around the world.
                            </p>

                            {/* Social Links */}
                            <div className="flex gap-3 pt-2">
                                <a
                                    href="#"
                                    className="p-2.5 bg-white/5 rounded-full hover:bg-[#0D7C53] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#0D7C53]/30"
                                    aria-label="Facebook"
                                >
                                    <FaFacebook size={18} />
                                </a>
                                <a
                                    href="#"
                                    className="p-2.5 bg-white/5 rounded-full hover:bg-[#0D7C53] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#0D7C53]/30"
                                    aria-label="Instagram"
                                >
                                    <FaInstagramSquare size={18} />
                                </a>
                                <a
                                    href="#"
                                    className="p-2.5 bg-white/5 rounded-full hover:bg-[#0D7C53] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#0D7C53]/30"
                                    aria-label="Twitter"
                                >
                                    <AiFillTwitterCircle size={18} />
                                </a>
                                <a
                                    href="#"
                                    className="p-2.5 bg-white/5 rounded-full hover:bg-[#0D7C53] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#0D7C53]/30"
                                    aria-label="Youtube"
                                >
                                    <FaYoutube size={18} />
                                </a>
                            </div>
                        </div>


                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 relative inline-block">
                                Quick Links
                                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-[#0D7C53]"></span>
                            </h3>
                            <ul className="space-y-3">
                                {['Home', 'Menu', 'About', 'Gallery', 'Contact']?.map((item) => (
                                    <li key={item}>
                                        <Link
                                            to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`}
                                            className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-[#0D7C53] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 relative inline-block">
                                Contact Us
                                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-[#0D7C53]"></span>
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group">
                                    <MapPin size={18} className="text-[#0D7C53] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">123 Coffee Street,<br />Brew City, BC 12345</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                                    <Phone size={18} className="text-[#0D7C53] flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                                    <Mail size={18} className="text-[#0D7C53] flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">hello@coffeehub.com</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                                    <Clock size={18} className="text-[#0D7C53] flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">Mon-Sun: 7:00 AM - 10:00 PM</span>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter & Payments */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 relative inline-block">
                                Stay Updated
                                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-[#0D7C53]"></span>
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Subscribe to get special offers and updates.
                            </p>

                            {/* Newsletter Form */}
                            {/* <div className="flex flex-col sm:flex-row gap-2 mb-6">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#0D7C53] focus:ring-1 focus:ring-[#0D7C53] transition-all text-white placeholder-gray-500 text-sm"
                                />
                                <button className="px-4 py-2.5 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#0D7C53]/30 transition-all duration-300 hover:scale-105 text-sm whitespace-nowrap">
                                    Subscribe
                                </button>
                            </div> */}

                            {/* Payment Methods */}
                            <div>
                                <p className="text-gray-400 text-xs mb-2">We Accept</p>
                                <div className="flex gap-3">
                                    <div className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                        <CreditCard size={20} className="text-gray-300" />
                                    </div>
                                    <div className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1">
                                        <Shield size={20} className="text-gray-300" />
                                    </div>
                                    <div className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1">
                                        <Truck size={20} className="text-gray-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-3 md:mt-12 pt-6 border-t border-white/10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-gray-400 text-sm">
                                © {currentYear} CoffeeHub. All rights reserved.
                                Made with <Heart size={14} className="inline text-[#0D7C53] fill-[#0D7C53] animate-pulse" /> by Coffee Lovers
                            </p>

                            <div className="flex items-center gap-6">
                                <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                                <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Terms of Service
                                </Link>
                                <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Cookies
                                </Link>
                            </div>

                            {/* Scroll to Top Button */}
                            <button
                                onClick={scrollToTop}
                                className="p-2.5 bg-[#0D7C53] rounded-full hover:bg-green-700 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#0D7C53]/30 group"
                                aria-label="Scroll to top"
                            >
                                <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ========== CSS ANIMATIONS ========== */}
            <style>{`
                @keyframes floatUp {
                    0%, 100% { 
                        transform: translateY(0) rotate(0deg); 
                        opacity: 0.3;
                    }
                    50% { 
                        transform: translateY(-20px) rotate(10deg); 
                        opacity: 0.6;
                    }
                }

                @keyframes floatDown {
                    0%, 100% { 
                        transform: translateY(0) rotate(0deg); 
                        opacity: 0.3;
                    }
                    50% { 
                        transform: translateY(20px) rotate(-10deg); 
                        opacity: 0.6;
                    }
                }
            `}</style>
        </>
    );
};

export default Footer;