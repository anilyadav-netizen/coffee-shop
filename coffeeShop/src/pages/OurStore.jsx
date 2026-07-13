import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin,
    Clock,
    Phone,
    Star,
    Coffee,
    ShoppingBag,
    Award,
    Users,
    Sparkles,
    ChevronRight,
    Heart,
    ExternalLink,
    Flame
} from 'lucide-react';

const OurStore = () => {
    const [activeLocation, setActiveLocation] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const cafes = [
        {
            id: 1,
            name: "Bloom Cafe & Store",
            city: "Noida",
            address: "Sector 104, Noida Expressway, Uttar Pradesh 201301",
            image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=500&fit=crop",
            rating: 4.8,
            reviews: 234,
            timings: "7:00 AM - 11:00 PM",
            phone: "+91 98765 43210",
            features: ["Free WiFi", "Outdoor Seating", "Pet Friendly", "Plant-Based"]
        },
        {
            id: 2,
            name: "Heritage Brew House",
            city: "Lucknow",
            address: "Hazratganj, Lucknow, Uttar Pradesh 226001",
            image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=500&fit=crop",
            rating: 4.9,
            reviews: 312,
            timings: "8:00 AM - 10:00 PM",
            phone: "+91 87654 32109",
            features: ["Live Music", "Artisan Coffee", "Book Corner", "Heritage Vibes"]
        }
    ];

    const featuredProducts = [
        { id: 1, name: "Artisan Cold Brew", price: "₹249", badge: "Best Seller", emoji: "🧊" },
        { id: 2, name: "Hazelnut Mocha", price: "₹199", badge: "New 2026", emoji: "🌰" },
        { id: 3, name: "Saffron Latte", price: "₹299", badge: "Premium", emoji: "✨" },
        { id: 4, name: "Matcha Bliss", price: "₹269", badge: "Trending", emoji: "🍵" }
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

    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setActiveLocation((prev) => (prev + 1) % cafes.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [isVisible, cafes.length]);

    const currentLocation = cafes[activeLocation];

    return (
        <section
            ref={sectionRef}
            className="relative py-6 px-4 overflow-hidden "
        >
            {/* ========== BACKGROUND EFFECTS - Updated with Food Colors ========== */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#E85D3A]/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#F0744F]/5 rounded-full blur-[100px] animate-pulse-slow-delay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E85D3A]/3 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-[104rem] mx-auto relative z-10">
                {/* ========== HEADER - Updated with Food Colors ========== */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-2">
                        Find Your Perfect
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E85D3A] to-[#F0744F]">
                            Food Spot
                        </span>
                    </h2>
                    <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
                        Visit our handcrafted spaces designed for connection, creativity, and the perfect meal
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] rounded-full mx-auto mt-2" />
                </div>

                {/* ========== LOCATION TABS - Updated with Food Colors ========== */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {cafes.map((cafe, index) => (
                        <button
                            key={cafe.id}
                            onClick={() => setActiveLocation(index)}
                            className={`
                                px-8 py-3 rounded-full transition-all duration-500 text-sm font-medium
                                flex items-center gap-2
                                ${activeLocation === index
                                    ? 'bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white shadow-lg shadow-[#E85D3A]/30'
                                    : 'bg-white border border-[#F3F4F6] text-[#6B7280] hover:bg-[#FFF8F5] hover:border-[#FEE7DD]'}
                            `}
                        >
                            <MapPin className="w-4 h-4" />
                            {cafe.city}
                            {activeLocation === index && (
                                <Sparkles className="w-3 h-3 animate-pulse" />
                            )}
                        </button>
                    ))}
                </div>

                {/* ========== MAIN CONTENT - LOCATION DETAILS ========== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* LEFT - Image */}
                    <div className="relative group">
                        <div className="relative rounded-2xl overflow-hidden bg-white border border-[#FEE7DD] shadow-lg shadow-[#E85D3A]/5">
                            <img
                                src={currentLocation.image}
                                alt={currentLocation.name}
                                className="w-full h-[350px] md:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937]/40 via-transparent to-transparent" />

                            {/* Rating Badge - Updated */}
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-[#FEE7DD] flex items-center gap-2">
                                <Star className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
                                <span className="font-bold text-[#1F2937]">{currentLocation.rating}</span>
                                <span className="text-[#6B7280] text-sm">({currentLocation.reviews})</span>
                            </div>

                            {/* 2026 Badge - Updated */}
                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-lg border border-[#FEE7DD]">
                                <span className="text-sm font-medium text-[#E85D3A] flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-[#E85D3A]" />
                                    2026
                                </span>
                            </div>

                            {/* Features - Updated */}
                            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                                {currentLocation.features.map((feature, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-white/95 backdrop-blur-sm border border-[#FEE7DD] rounded-full px-3 py-1 text-xs text-[#1F2937] shadow-lg"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - Details - Updated */}
                    <div className=" border border-[#FEE7DD] rounded-2xl p-6 shadow-lg shadow-[#E85D3A]/5 hover:shadow-xl hover:shadow-[#E85D3A]/10 transition-all duration-300">
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-[#1F2937] flex items-center gap-2">
                                    {currentLocation.name}
                                    <span className="text-sm bg-[#FFF0EA] text-[#E85D3A] px-3 py-0.5 rounded-full border border-[#FEE7DD]">
                                        {currentLocation.city}
                                    </span>
                                </h3>
                                <p className="text-[#6B7280] text-sm mt-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#E85D3A]" />
                                    {currentLocation.address}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#FFF8F5] border border-[#FEE7DD] rounded-xl p-3">
                                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                                        <Clock className="w-4 h-4 text-[#E85D3A]" />
                                        Timings
                                    </div>
                                    <div className="font-semibold text-[#1F2937] text-sm mt-1">{currentLocation.timings}</div>
                                </div>
                                <div className="bg-[#FFF8F5] border border-[#FEE7DD] rounded-xl p-3">
                                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                                        <Phone className="w-4 h-4 text-[#E85D3A]" />
                                        Contact
                                    </div>
                                    <div className="font-semibold text-[#1F2937] text-sm mt-1">{currentLocation.phone}</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button className="flex-1 py-3 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white rounded-full font-semibold hover:shadow-lg hover:shadow-[#E85D3A]/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Get Directions
                                </button>
                                <button className="py-3 px-5 bg-white border border-[#FEE7DD] rounded-full text-[#6B7280] hover:bg-[#FFF0EA] hover:text-[#E85D3A] transition-all duration-300">
                                    <Heart className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Location Dots - Updated */}
                            <div className="flex justify-center gap-2 pt-2">
                                {cafes.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveLocation(idx)}
                                        className={`
                                            h-1.5 rounded-full transition-all duration-500
                                            ${idx === activeLocation
                                                ? 'w-8 bg-gradient-to-r from-[#E85D3A] to-[#F0744F]'
                                                : 'w-4 bg-[#F3F4F6] hover:bg-[#E85D3A]/30'}
                                        `}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== FEATURED PRODUCTS - Updated ========== */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-[#E85D3A]" />
                            Trending Now ✦ 2026
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {featuredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white border border-[#F3F4F6] rounded-2xl p-5 text-center hover:border-[#FEE7DD] hover:shadow-xl hover:shadow-[#E85D3A]/10 transition-all duration-500 hover:-translate-y-2 group"
                            >
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#FFF0EA] to-[#FEE7DD] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 border border-[#FEE7DD]">
                                    {product.emoji}
                                </div>
                                <div className="mt-3">
                                    <div className="font-semibold text-[#1F2937] text-sm group-hover:text-[#E85D3A] transition-colors duration-300">{product.name}</div>
                                    <div className="text-[#E85D3A] font-bold">{product.price}</div>
                                    <span className="inline-block mt-1 text-[10px] bg-[#FFF0EA] text-[#E85D3A] px-2 py-0.5 rounded-full border border-[#FEE7DD]">
                                        {product.badge}
                                    </span>
                                </div>
                                <Link
                                    to="/menu"
                                    className="mt-3 w-full py-2 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg hover:shadow-[#E85D3A]/30 flex items-center justify-center"
                                >
                                    Quick Order
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========== BOTTOM CTA - Updated ========== */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFF8F5] to-[#FFF0EA] border border-[#FEE7DD] rounded-full px-6 py-3 shadow-lg shadow-[#E85D3A]/5">
                        <Flame className="w-5 h-5 text-[#E85D3A]" />
                        <span className="text-[#1F2937] text-sm font-medium">
                            Visit our stores for the ultimate food experience
                        </span>
                        <button className="px-6 py-2 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-[#E85D3A]/30 transition-all duration-300 hover:scale-105">
                            Find Store
                        </button>
                    </div>
                </div>
            </div>

            {/* ========== CSS ANIMATIONS ========== */}
            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                
                @keyframes pulse-slow-delay {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.15); opacity: 0.7; }
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                
                .animate-pulse-slow-delay {
                    animation: pulse-slow-delay 10s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default OurStore;