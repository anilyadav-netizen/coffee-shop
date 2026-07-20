import React, { useState, useEffect, useRef } from 'react';
import restro from '../assets/Images/restaurant.jpg';
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    Clock,
    Phone,
    Star,
    Heart,
    ChevronLeft,
    ChevronRight,
    Wifi,
    Sofa,
    Coffee,
    Users,
    Sparkles
} from 'lucide-react';

// Import images (replace with your actual image imports)
import coffee1 from '../assets/Images/coffee2.jpg';
import coffee2 from '../assets/Images/coffee4.jpg';
import coffee3 from '../assets/Images/coffee5.jpg';
import coffee4 from '../assets/Images/coffee6.jpg';

const OurStore = () => {
    const [activeLocation, setActiveLocation] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    const cafes = [
        {
            id: 1,
            name: "Heritage Brew House",
            city: "Lucknow",
            address: "Hazratganj, Lucknow, Uttar Pradesh 226001",
            image: restro,
            rating: 4.6,
            distance: "2.3 km",
            timings: "06:00 AM - 10:00 PM",
            phone: "+91 98765 12306",
            features: [
                { icon: Wifi, label: "Free Wi-Fi" },
                { icon: Sofa, label: "Indoor Seating" },
                { icon: Coffee, label: "Best Coffee" },
                { icon: Users, label: "Cozy Ambience" }
            ]
        }
    ];

    const featuredProducts = [
        { id: 1, name: "Artisan Cold Brew", price: "₹240", badge: "Trending Now", image: coffee1 },
        { id: 2, name: "Hazelnut Mocha", price: "₹190", badge: "2026", image: coffee2 },
        { id: 3, name: "Salted Latte", price: "₹220", badge: "New", image: coffee3 },
        { id: 4, name: "Matcha Bliss", price: "₹240", badge: "Popular", image: coffee4 }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const currentLocation = cafes[0];

    return (
        <section
            ref={sectionRef}
            className="py-4 md:py-10 px-4 md:px-8 lg:px-12 bg-[#FBF6F0] "
        >
            <div className="max-w-[104rem] mx-auto">


                {/* ========== MAIN TWO-COLUMN LAYOUT ========== */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-6">
                    {/* LEFT COLUMN - Image (3 columns) */}
                    <div className="lg:col-span-3 relative group">
                        <div className="relative rounded-2xl overflow-hidden border-2 border-[#F2E5D8] bg-white shadow-lg">
                            <img
                                src={currentLocation.image}
                                alt={currentLocation.name}
                                className="w-full h-[310px] md:h-[470px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                            {/* Rating Badge - Top Left */}
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                                    <span className="font-bold text-[#1F1B18]">{currentLocation.rating}</span>
                                </div>
                                <div className="w-px h-5 bg-[#E5E5E5]"></div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-[#6B6B6B]" />
                                    <span className="font-medium text-[#6B6B6B]">{currentLocation.distance}</span>
                                </div>
                            </div>

                            {/* Feature Pills - Bottom */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-2 px-4 w-[90%] max-w-full">
                                {currentLocation.features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-md flex items-center gap-1.5 md:gap-2 transition-all duration-300 hover:scale-105 hover:bg-white flex-shrink-0"
                                    >
                                        <feature.icon className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#C56E2D]" />
                                        <span className="text-[10px] md:text-xs font-medium text-[#1F1B18] whitespace-nowrap">
                                            {feature.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Details (2 columns) */}
                    <div className="lg:col-span-2 flex flex-col justify-between">
                        <div className="rounded-2xl p-5 md:p-8 bg-[#FBF6F0] ">
                            {/* Discover Near You Badge */}
                            <div className="mb-4">
                                <span className="inline-block text-[#C56E2D] text-xs font-semibold uppercase bg-[#C56E2D]/10 px-4 py-1.5 rounded-full">
                                    Discover Near You
                                </span>
                            </div>

                            {/* Heading */}
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1F1B18] mb-2">
                                Find Your Perfect <span className="text-[#C56E2D]">Food Spot</span>
                            </h2>

                            {/* Description */}
                            <p className="text-[#6B6B6B] text-sm mb-6">
                                Find our handcrafted spaces designed for connection, creativity & perfect meals.
                            </p>

                            {/* Store Name and City */}
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-[#1F1B18]">
                                        Heritage Brew House
                                    </h3>
                                </div>
                                <span className="bg-[#FBF6F0] text-[#C56E2D] px-4 py-1.5 rounded-full text-sm font-semibold border border-[#F2E5D8]">
                                    Lucknow
                                </span>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-3 mb-6 text-[#6B6B6B]">
                                <MapPin className="w-5 h-5 text-[#C56E2D] mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Hazratganj, Lucknow, Uttar Pradesh 226001</span>
                            </div>

                            {/* Info Cards - Side by Side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {/* Timing Card */}
                                <div className="bg-[#FBF6F0] rounded-xl p-4 shadow-sm border border-[#F2E5D8] transition-all duration-300 hover:shadow-md hover:bg-[#F8F0E8]">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#C56E2D]/10 p-2.5 rounded-lg">
                                            <Clock className="w-4 h-4 text-[#C56E2D]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#6B6B6B] font-medium">Timing</p>
                                            <p className="text-sm font-semibold text-[#1F1B18]">08:00 AM - 10:00 PM</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Card */}
                                <div className="bg-[#FBF6F0] rounded-xl p-4 shadow-sm border border-[#F2E5D8] transition-all duration-300 hover:shadow-md hover:bg-[#F8F0E8]">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#C56E2D]/10 p-2.5 rounded-lg">
                                            <Phone className="w-4 h-4 text-[#C56E2D]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#6B6B6B] font-medium">Contact</p>
                                            <p className="text-sm font-semibold text-[#1F1B18]">+91 98765 12306</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons Row */}
                            <div className="flex items-center gap-3">
                                <button className="flex-1 py-3.5 bg-gradient-to-r from-[#E46F2E] to-[#D95A2B] text-white rounded-full font-semibold hover:shadow-lg hover:shadow-[#C56E2D]/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm group">
                                    <MapPin className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                    Get Directions
                                </button>
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className="w-12 h-12 flex-shrink-0 bg-[#FBF6F0] border-2 border-[#F2E5D8] rounded-full flex items-center justify-center transition-all duration-300 hover:border-[#C56E2D] hover:shadow-md"
                                >
                                    <Heart
                                        className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-[#C56E2D] text-[#C56E2D] scale-110' : 'text-[#6B6B6B]'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== TRENDING NOW SECTION ========== */}
                <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl animate-pulse">🔥</span>
                            <h3 className="text-2xl md:text-3xl font-bold text-[#1F1B18]">
                                Trending Now <span className="text-[#C56E2D]">2026</span>
                            </h3>
                        </div>
                    </div>

                    {/* Product Cards - Horizontal layout with image left, text right */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {featuredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => navigate("/menu")} 
                                className="bg-white border border-[#F2E5D8] rounded-2xl p-4 shadow hover:shadow-lg transition-all duration-500 hover:-translate-y-1 group cursor-pointer flex items-center gap-4"
                            >
                                {/* Left - Small Circular Image */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#F2E5D8] group-hover:border-[#C56E2D] transition-all duration-500 shadow-md group-hover:shadow-lg">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                </div>

                                {/* Right - Name and Price */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-[#1F1B18] text-sm group-hover:text-[#C56E2D] transition-colors duration-300 truncate">
                                        {product.name}
                                    </h4>
                                    <p className="text-[#C56E2D] font-bold text-lg">
                                        {product.price}
                                    </p>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurStore;