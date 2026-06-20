// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight, Clock, TrendingUp } from "lucide-react";
import HeroImage from '../assets/Images/Hero.png';
import Navbar from '../component/Navbar';

const Hero = () => {
    const [scrollY, setScrollY] = useState(0);
    const navigate = useNavigate();

    const stats = [
        { number: "10+", label: "Years Experience", icon: <Clock size={24} /> },
        { number: "50+", label: "Coffee Blends", icon: <Coffee size={24} /> },
        { number: "5K+", label: "Happy Customers", icon: <TrendingUp size={24} /> },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleOrderNow = () => {
        navigate('/menu');
    };

    const handleExploreMenu = () => {
        navigate('/menu');
    };

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            {/* ✅ Navbar Component */}
            <Navbar />

            {/* Hero Background with Parallax Effect */}
            <div className="absolute inset-0 w-full h-full">
                <div
                    className="w-full h-full transition-transform duration-1000"
                    style={{
                        transform: `scale(${1 + scrollY * 0.001})`,
                    }}
                >
                    <img
                        src={HeroImage}
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>

                {/* Radial Gradient for Depth */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50"></div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-20 w-full h-screen flex flex-col items-center justify-center px-4">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-2 rounded-full mb-6 animate-fade-in-down">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                        <span className="text-white/90 text-sm font-medium">Now Open - 20% Off First Order</span>
                    </div>

                    {/* Main Heading with Animation */}
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
                        Discover Your
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0D7C53] to-green-400">
                            Perfect Cup
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 animate-fade-in-up delay-200">
                        Experience the art of coffee with our carefully crafted blends,
                        sourced from the finest beans around the world.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                        <button
                            onClick={handleOrderNow}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-full transition-all duration-300 shadow-2xl shadow-[#0D7C53]/25 hover:shadow-[#0D7C53]/50 hover:scale-105"
                        >
                            <span className="font-semibold text-lg">Order Now</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        </button>

                        <button
                            onClick={handleExploreMenu}
                            className="px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white rounded-full transition-all duration-300 hover:bg-white/10 backdrop-blur-sm font-medium"
                        >
                            Explore Menu
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 hidden md:flex gap-8 bg-black/40 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/10">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-3 text-white">
                            <span className="text-[#0D7C53]">{stat.icon}</span>
                            <div>
                                <p className="text-2xl font-bold">{stat.number}</p>
                                <p className="text-xs text-white/60">{stat.label}</p>
                            </div>
                            {index < stats.length - 1 && (
                                <div className="w-px h-10 bg-white/10"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                    <div className="w-1 h-2 bg-white/50 rounded-full animate-scroll"></div>
                </div>
            </div>
        </div>
    );
};

export default Hero; // ✅ Export default