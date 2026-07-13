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
            className="relative py-6 px-4 overflow-hidden"
        >
            {/* ========== BACKGROUND EFFECTS (Exact same as WhyUs) ========== */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0D7C53]/5 via-transparent to-[#169466]/5" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#0D7C53]/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-[104rem] mx-auto relative z-10">
                {/* ========== HEADER (Exact same as WhyUs) ========== */}
                <div className="text-center mb-8">

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                        Find Your Perfect
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#10be7f] to-[#169466]">
                            Coffee Spot
                        </span>
                    </h2>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                        Visit our handcrafted spaces designed for connection, creativity, and the perfect cup
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#0D7C53] to-[#169466] rounded-full mx-auto mt-2" />
                </div>

                {/* ========== LOCATION TABS ========== */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {cafes.map((cafe, index) => (
                        <button
                            key={cafe.id}
                            onClick={() => setActiveLocation(index)}
                            className={`
                                px-8 py-3 rounded-full transition-all duration-500 text-sm font-medium
                                flex items-center gap-2
                                ${activeLocation === index
                                    ? 'bg-gradient-to-r from-[#0D7C53] to-[#169466] text-white shadow-lg shadow-[#0D7C53]/30'
                                    : 'bg-black/40 border border-white/20 text-white/70 hover:bg-white/10'}
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
                        <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                            <img
                                src={currentLocation.image}
                                alt={currentLocation.name}
                                className="w-full h-[350px] md:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Rating Badge */}
                            <div className="absolute top-4 left-4 bg-black/60 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-sm flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-white">{currentLocation.rating}</span>
                                <span className="text-white/50 text-sm">({currentLocation.reviews})</span>
                            </div>

                            {/* 2026 Badge */}
                            <div className="absolute top-4 right-4 bg-black/60 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
                                <span className="text-sm font-medium text-white flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-[#10be7f]" />
                                    2026
                                </span>
                            </div>

                            {/* Features */}
                            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                                {currentLocation.features.map((feature, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-black/60 border border-white/10 rounded-full px-3 py-1 text-xs text-white/80 backdrop-blur-sm"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - Details */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-black/50 transition-all duration-300">
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                                    {currentLocation.name}
                                    <span className="text-sm bg-[#0D7C53]/30 text-[#10be7f] px-3 py-0.5 rounded-full border border-[#0D7C53]/30">
                                        {currentLocation.city}
                                    </span>
                                </h3>
                                <p className="text-white/50 text-sm mt-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#10be7f]" />
                                    {currentLocation.address}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                    <div className="flex items-center gap-2 text-sm text-white/50">
                                        <Clock className="w-4 h-4 text-[#10be7f]" />
                                        Timings
                                    </div>
                                    <div className="font-semibold text-white text-sm mt-1">{currentLocation.timings}</div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                    <div className="flex items-center gap-2 text-sm text-white/50">
                                        <Phone className="w-4 h-4 text-[#10be7f]" />
                                        Contact
                                    </div>
                                    <div className="font-semibold text-white text-sm mt-1">{currentLocation.phone}</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button className="flex-1 py-3 bg-gradient-to-r from-[#0D7C53] to-[#169466] text-white rounded-full font-semibold hover:shadow-lg hover:shadow-[#0D7C53]/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Get Directions
                                </button>
                                <button className="py-3 px-5 bg-white/5 border border-white/10 rounded-full text-white/70 hover:bg-white/10 transition-all duration-300">
                                    <Heart className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Location Dots */}
                            <div className="flex justify-center gap-2 pt-2">
                                {cafes.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveLocation(idx)}
                                        className={`
                                            h-1.5 rounded-full transition-all duration-500
                                            ${idx === activeLocation
                                                ? 'w-8 bg-gradient-to-r from-[#0D7C53] to-[#169466]'
                                                : 'w-4 bg-white/20 hover:bg-white/40'}
                                        `}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== FEATURED PRODUCTS ========== */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-[#10be7f]" />
                            Trending Now ✦ 2026
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {featuredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 group"
                            >
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#0D7C53]/20 to-[#169466]/20 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 border border-white/10">
                                    {product.emoji}
                                </div>
                                <div className="mt-3">
                                    <div className="font-semibold text-white text-sm">{product.name}</div>
                                    <div className="text-[#10be7f] font-bold">{product.price}</div>
                                    <span className="inline-block mt-1 text-[10px] bg-[#0D7C53]/20 text-[#10be7f] px-2 py-0.5 rounded-full border border-[#0D7C53]/30">
                                        {product.badge}
                                    </span>
                                </div>
                                <Link
                                    to="/menu"
                                    className="mt-3 w-full py-2 bg-gradient-to-r from-[#0D7C53] to-[#169466] text-white rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg hover:shadow-[#0D7C53]/30 flex items-center justify-center"
                                >
                                    Quick Order
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========== BOTTOM CTA (Exact same as WhyUs) ========== */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#0D7C53]/20 to-[#169466]/20 border border-white/20 rounded-full px-6 py-3">
                        <Sparkles className="w-5 h-5 text-[#169466]" />
                        <span className="text-white text-sm font-medium">
                            Visit our stores for the ultimate coffee experience
                        </span>
                        <button className="px-6 py-2 bg-gradient-to-r from-[#0D7C53] to-[#169466] text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-[#0D7C53]/30 transition-all duration-300 hover:scale-105">
                            Find Store
                        </button>
                    </div>
                </div>
            </div>

            {/* ========== CSS ANIMATIONS (Exact same as WhyUs) ========== */}
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