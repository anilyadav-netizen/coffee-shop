import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategoryById, getItemsByCategory, CATEGORIES } from "../data/menuData";
import Banner from '../assets/Images/Banner.png';
import Banner2 from '../assets/Images/Banner2.png';
import Banner3 from '../assets/Images/Banner3.png';
import Banner4 from '../assets/Images/Banner4.png';
import Banner5 from '../assets/Images/Banner5.png';
import {
    ArrowLeft,
    Star,
    TrendingUp,
    ShoppingBag,
    Heart,
    Share2,
    ChevronRight,
    Search,
    X
} from "lucide-react";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

const MenuPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [addedItems, setAddedItems] = useState({});

    const effectiveCategoryId = categoryId ? parseInt(categoryId) : 1;

    const category = useMemo(() => {
        const cat = getCategoryById(effectiveCategoryId);
        return cat;
    }, [effectiveCategoryId]);

    const items = useMemo(() => {
        const itemsList = getItemsByCategory(effectiveCategoryId);
        return itemsList || [];
    }, [effectiveCategoryId]);

    const categoryBanners = {
        1: Banner,
        2: Banner2,
        3: Banner3,
        4: Banner4,
        5: Banner5
    };

    const currentBanner = categoryBanners[effectiveCategoryId] || Banner;

    // ✅ Handle Add to Cart
    const handleAddToCart = (item, e) => {
        e.stopPropagation();
        const cartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.originalPrice,
            image: item.image,
            category: category?.name || 'Coffee',
            quantity: 1
        };
        addToCart(cartItem);

        // Show feedback
        setAddedItems(prev => ({ ...prev, [item.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [item.id]: false }));
        }, 1500);
    };

    // ✅ Handle Wishlist Toggle
    const handleWishlistToggle = (item, e) => {
        e.stopPropagation();
        const wishlistItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.originalPrice || item.price,
            image: item.image,
            category: category?.name || 'Coffee',
            description: item.description || 'Premium coffee blend',
            likes: item.rating || 0
        };
        toggleWishlist(wishlistItem);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!items || items.length === 0) {
            setFilteredItems([]);
            return;
        }

        if (searchTerm.trim() === "") {
            setFilteredItems(items);
        } else {
            const filtered = items.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
            );
            setFilteredItems(filtered);
        }
    }, [searchTerm, items]);

    const clearSearch = () => {
        setSearchTerm("");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1A0F0A] to-[#3D2013] overflow-x-hidden">
                <div className="text-center">
                    <div className="relative w-48 h-64 mx-auto">
                        {/* Coffee pouring animation - Same as before */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="w-16 h-12 bg-[#6B4F3A] rounded-t-full rounded-b-lg shadow-lg relative">
                                <div className="absolute -bottom-2 right-0 w-6 h-3 bg-[#6B4F3A] rounded-br-full"></div>
                                <div className="absolute top-2 left-2 w-3 h-6 bg-white/10 rounded-full"></div>
                            </div>
                        </div>

                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                            <div className="w-3 h-32 bg-gradient-to-b from-[#3C1A0A] to-[#5C2A12] rounded-full animate-pour"></div>
                            <div className="absolute -left-6 top-8 w-5 h-7 bg-[#4A2512] rounded-full animate-drop-big-1 shadow-lg"></div>
                            <div className="absolute right-6 top-14 w-4 h-6 bg-[#3C1A0A] rounded-full animate-drop-big-2 shadow-lg"></div>
                            <div className="absolute -left-8 top-24 w-6 h-8 bg-[#4A2512] rounded-full animate-drop-big-3 shadow-lg"></div>
                            <div className="absolute right-8 top-28 w-4 h-5 bg-[#3C1A0A] rounded-full animate-drop-big-4 shadow-lg"></div>
                            <div className="absolute left-2 top-10 w-1.5 h-2 bg-[#5C2A12] rounded-full animate-splash-1"></div>
                            <div className="absolute right-2 top-16 w-1.5 h-2 bg-[#5C2A12] rounded-full animate-splash-2"></div>
                        </div>

                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                            <div className="relative">
                                <div className="w-32 h-36 bg-[#8B6B4A] rounded-b-2xl rounded-t-lg shadow-2xl relative">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#7A5D40] to-[#6B4F3A] rounded-b-2xl rounded-t-lg"></div>
                                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#3C1A0A] rounded-b-2xl animate-fill-coffee">
                                        <div className="absolute -top-1 left-0 right-0 h-2 bg-gradient-to-b from-[#5C2A12] to-[#3C1A0A]">
                                            <div className="absolute top-0 left-4 w-8 h-0.5 bg-[#6B3A1A] rounded-full animate-ripple"></div>
                                            <div className="absolute top-0 right-6 w-6 h-0.5 bg-[#6B3A1A] rounded-full animate-ripple-2"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-1 left-0 right-0 h-2.5 bg-[#9B7B5A] rounded-t-lg shadow-lg"></div>
                                <div className="absolute -right-5 top-4 w-7 h-16 border-[5px] border-[#8B6B4A] rounded-r-full border-l-0"></div>
                            </div>
                        </div>

                        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
                            <div className="w-2 h-3 bg-[#5C2A12] rounded-full animate-splash-surface-1"></div>
                            <div className="w-2 h-3 bg-[#5C2A12] rounded-full animate-splash-surface-2"></div>
                            <div className="w-2 h-3 bg-[#5C2A12] rounded-full animate-splash-surface-3"></div>
                        </div>

                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 -mt-8 flex gap-5">
                            <div className="w-1.5 h-16 bg-gradient-to-t from-white/20 to-transparent rounded-full animate-steam-1"></div>
                            <div className="w-1.5 h-20 bg-gradient-to-t from-white/20 to-transparent rounded-full animate-steam-2"></div>
                            <div className="w-1.5 h-14 bg-gradient-to-t from-white/20 to-transparent rounded-full animate-steam-3"></div>
                        </div>
                    </div>

                    <p className="mt-6 text-[#D4A574] font-medium text-lg tracking-wider">
                        Pouring...
                    </p>
                </div>

                <style jsx>{`
                    @keyframes pour {
                        0% { transform: scaleY(0.5); opacity: 0.7; }
                        50% { transform: scaleY(1); opacity: 1; }
                        100% { transform: scaleY(0.5); opacity: 0.7; }
                    }
                    @keyframes drop-big-1 {
                        0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
                        100% { transform: translateY(130px) translateX(-20px) scale(0.3); opacity: 0; }
                    }
                    @keyframes drop-big-2 {
                        0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
                        100% { transform: translateY(110px) translateX(25px) scale(0.3); opacity: 0; }
                    }
                    @keyframes drop-big-3 {
                        0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
                        100% { transform: translateY(100px) translateX(-30px) scale(0.2); opacity: 0; }
                    }
                    @keyframes drop-big-4 {
                        0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
                        100% { transform: translateY(95px) translateX(20px) scale(0.2); opacity: 0; }
                    }
                    @keyframes fill-coffee {
                        0% { height: 10%; opacity: 0.5; }
                        30% { height: 30%; opacity: 0.8; }
                        60% { height: 60%; opacity: 1; }
                        100% { height: 95%; opacity: 1; }
                    }
                    @keyframes ripple {
                        0% { transform: translateX(0) scaleX(1); opacity: 0.8; }
                        50% { transform: translateX(15px) scaleX(2); opacity: 0.3; }
                        100% { transform: translateX(0) scaleX(1); opacity: 0.8; }
                    }
                    @keyframes ripple-2 {
                        0% { transform: translateX(0) scaleX(1); opacity: 0.8; }
                        50% { transform: translateX(-12px) scaleX(1.8); opacity: 0.3; }
                        100% { transform: translateX(0) scaleX(1); opacity: 0.8; }
                    }
                    @keyframes splash-surface-1 {
                        0% { transform: translateY(0) scale(1); opacity: 1; }
                        100% { transform: translateY(-20px) translateX(-15px) scale(0); opacity: 0; }
                    }
                    @keyframes splash-surface-2 {
                        0% { transform: translateY(0) scale(1); opacity: 1; }
                        100% { transform: translateY(-25px) translateX(15px) scale(0); opacity: 0; }
                    }
                    @keyframes splash-surface-3 {
                        0% { transform: translateY(0) scale(1); opacity: 1; }
                        100% { transform: translateY(-18px) translateX(-5px) scale(0); opacity: 0; }
                    }
                    @keyframes splash-1 {
                        0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
                        100% { transform: translateY(60px) translateX(-15px) scale(0); opacity: 0; }
                    }
                    @keyframes splash-2 {
                        0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
                        100% { transform: translateY(50px) translateX(15px) scale(0); opacity: 0; }
                    }
                    @keyframes steam-1 {
                        0% { transform: translateY(0) scaleX(1); opacity: 0.4; }
                        100% { transform: translateY(-60px) scaleX(3) rotate(-8deg); opacity: 0; }
                    }
                    @keyframes steam-2 {
                        0% { transform: translateY(0) scaleX(1); opacity: 0.4; }
                        100% { transform: translateY(-70px) scaleX(4) rotate(8deg); opacity: 0; }
                    }
                    @keyframes steam-3 {
                        0% { transform: translateY(0) scaleX(1); opacity: 0.4; }
                        100% { transform: translateY(-55px) scaleX(3.5) rotate(-5deg); opacity: 0; }
                    }
                    .animate-pour { animation: pour 0.6s ease-in-out infinite; }
                    .animate-drop-big-1 { animation: drop-big-1 0.5s ease-in infinite 0.1s; }
                    .animate-drop-big-2 { animation: drop-big-2 0.6s ease-in infinite 0.3s; }
                    .animate-drop-big-3 { animation: drop-big-3 0.55s ease-in infinite 0.5s; }
                    .animate-drop-big-4 { animation: drop-big-4 0.45s ease-in infinite 0.2s; }
                    .animate-fill-coffee { animation: fill-coffee 2s ease-out infinite; }
                    .animate-ripple { animation: ripple 0.8s ease-in-out infinite; }
                    .animate-ripple-2 { animation: ripple-2 0.9s ease-in-out infinite 0.3s; }
                    .animate-splash-surface-1 { animation: splash-surface-1 0.4s ease-out infinite 0.15s; }
                    .animate-splash-surface-2 { animation: splash-surface-2 0.4s ease-out infinite 0.35s; }
                    .animate-splash-surface-3 { animation: splash-surface-3 0.4s ease-out infinite 0.55s; }
                    .animate-splash-1 { animation: splash-1 0.4s ease-out infinite 0.2s; }
                    .animate-splash-2 { animation: splash-2 0.4s ease-out infinite 0.4s; }
                    .animate-steam-1 { animation: steam-1 1.5s ease-out infinite; }
                    .animate-steam-2 { animation: steam-2 1.8s ease-out infinite 0.5s; }
                    .animate-steam-3 { animation: steam-3 1.6s ease-out infinite 1s; }
                `}</style>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center overflow-x-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                </div>
                <div className="text-center max-w-md mx-auto p-8 relative z-10">
                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-12 shadow-2xl shadow-black/5">
                        <div className="w-24 h-24 bg-red-100/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">🔍</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">Category Not Found</h2>
                        <p className="text-gray-500 mb-6">
                            The category you're looking for doesn't exist or has been removed.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-[#0D7C53] text-white rounded-full hover:bg-green-700 transition shadow-lg hover:shadow-xl"
                        >
                            Go Back Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen overflow-x-hidden">
                {/* Hero Banner */}
                <div className="relative pt-24 pb-20 md:pb-72 overflow-hidden">
                    <div className="absolute inset-0 w-full h-full">
                        <img
                            src={currentBanner}
                            alt={`${category.name} Banner`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50"></div>
                    </div>

                    <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-yellow-400/10 rounded-full blur-2xl opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-white/5 rounded-full blur-3xl opacity-30"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <button
                            onClick={() => navigate('/')}
                            className="mb-6 inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/20 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-white/30 text-sm sm:text-base"
                        >
                            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                            Back to Home
                        </button>

                        <div className="text-center">
                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                                {category.name}
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-4"></div>
                            <p className="text-white/90 text-center max-w-2xl mx-auto text-base sm:text-lg drop-shadow">
                                Explore our delicious {category.name.toLowerCase()} items
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="relative -mt-16 pb-12">
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />

                        <div className="absolute -top-40 -left-40 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-amber-400/15 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-slow"></div>
                        <div className="absolute -bottom-40 -right-40 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-amber-700/10 rounded-full blur-[70px] sm:blur-[100px] animate-pulse-slow-delay"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-emerald-500/5 rounded-full blur-[100px] sm:blur-[150px] animate-pulse-slow"></div>

                        <div className="absolute inset-0 pointer-events-none opacity-10">
                            <div className="absolute top-20 left-10 text-2xl sm:text-6xl rotate-12 animate-float">🫘</div>
                            <div className="absolute bottom-32 right-20 text-2xl sm:text-6xl -rotate-12 animate-float-delay">🫘</div>
                            <div className="absolute top-1/3 right-[15%] text-xl sm:text-4xl rotate-45 animate-float-slow">☕</div>
                            <div className="absolute bottom-[25%] left-[15%] text-2xl sm:text-5xl -rotate-45 animate-float-delay">🫘</div>
                        </div>
                    </div>

                    <div className="container mx-auto px-3 sm:px-4 relative z-10">
                        {/* Category Selector */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 backdrop-blur-xl bg-white/20 border border-white/30 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-2xl shadow-black/5">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => navigate(`/menu/${cat.id}`)}
                                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium transition-all duration-300 ${effectiveCategoryId === cat.id
                                        ? 'bg-[#0D7C53] text-white shadow-lg'
                                        : 'backdrop-blur-sm bg-white/40 border border-white/20 text-gray-600 hover:bg-white/60'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-md mx-auto mb-6 sm:mb-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder={`Search ${category.name}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 backdrop-blur-xl bg-white/30 border-2 border-white/30 rounded-full shadow-xl shadow-black/5 focus:outline-none focus:ring-2 focus:ring-[#0D7C53] focus:border-transparent transition-all text-gray-800 placeholder:text-gray-400 text-sm sm:text-base"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Items Grid */}
                        {filteredItems && filteredItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pb-12">
                                {filteredItems.map((item) => {
                                    const isWishlisted = isInWishlist(item.id);
                                    const isAdded = addedItems[item.id];

                                    return (
                                        <div
                                            key={item.id}
                                            className="group backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl sm:rounded-2xl shadow-md shadow-black/5 hover:shadow-lg transition-all duration-500 overflow-hidden hover:-translate-y-1"
                                        >
                                            {/* Image Container */}
                                            <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden bg-gray-100/50">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => {
                                                        e.target.src = "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
                                                    }}
                                                />

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                {item.isFeatured && (
                                                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-[#0D7C53] to-green-500 text-white text-[8px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full shadow-md flex items-center gap-0.5 sm:gap-1 backdrop-blur-sm">
                                                        <Star size={10} className="sm:w-3 sm:h-3 fill-yellow-400" />
                                                        Featured
                                                    </div>
                                                )}

                                                {/* ✅ Wishlist Button - Top Right */}
                                                <button
                                                    onClick={(e) => handleWishlistToggle(item, e)}
                                                    className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all duration-300 hover:scale-110"
                                                >
                                                    <Heart
                                                        size={16}
                                                        className={`sm:w-[18px] sm:h-[18px] transition-colors ${isWishlisted
                                                            ? 'fill-red-500 text-red-500'
                                                            : 'text-gray-400 hover:text-red-500'
                                                            }`}
                                                    />
                                                </button>

                                                {/* ❌ Quick View Button - REMOVED */}
                                            </div>

                                            {/* Content */}
                                            <div className="p-3 sm:p-4 md:p-5">
                                                <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg group-hover:text-[#0D7C53] transition-colors mb-0.5 sm:mb-1 truncate">
                                                    {item.name}
                                                </h3>

                                                <p className="text-gray-600 text-[10px] sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                                                    {item.description}
                                                </p>

                                                <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} className="sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                    <span className="text-[8px] sm:text-xs text-gray-500 ml-0.5 sm:ml-1">(24)</span>
                                                </div>

                                                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/20">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <span className="text-base sm:text-lg md:text-xl font-bold text-[#0D7C53]">
                                                            ₹{item.price.toFixed(2)}
                                                        </span>
                                                        {item.originalPrice && (
                                                            <span className="text-[8px] sm:text-xs text-gray-400 line-through">
                                                                ₹{item.originalPrice.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-xs font-medium text-green-600 bg-green-100/60 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                                                        <TrendingUp size={10} className="sm:w-3 sm:h-3" />
                                                        {item.points} Pts
                                                    </div>
                                                </div>

                                                {/* ✅ Add to Cart Button with Feedback */}
                                                <button
                                                    onClick={(e) => handleAddToCart(item, e)}
                                                    className={`w-full mt-2 sm:mt-3 md:mt-4 font-medium py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 group/btn text-sm sm:text-base ${isAdded
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gradient-to-r from-[#0D7C53] to-green-600 text-white hover:shadow-lg hover:shadow-[#0D7C53]/30'
                                                        }`}
                                                >
                                                    {isAdded ? (
                                                        <>
                                                            <span>Added ✓</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShoppingBag size={14} className="sm:w-[18px] sm:h-[18px] group-hover/btn:scale-110 transition-transform" />
                                                            Add to Cart
                                                            <ChevronRight size={12} className="sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 sm:py-20">
                                <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl shadow-black/5 max-w-2xl mx-auto">
                                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100/50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                        <Search size={28} className="sm:w-10 sm:h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-gray-700">No Items Found</h3>
                                    <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
                                        {searchTerm ? (
                                            <>No results for "<span className="font-medium">{searchTerm}</span>"</>
                                        ) : (
                                            <>This category is currently empty. Check back later!</>
                                        )}
                                    </p>
                                    {searchTerm && (
                                        <button
                                            onClick={clearSearch}
                                            className="mt-3 sm:mt-4 px-4 sm:px-6 py-1.5 sm:py-2 backdrop-blur-sm bg-white/40 border border-white/20 text-gray-700 rounded-full hover:bg-white/60 transition-colors text-sm sm:text-base"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* CSS Animations */}
            <style >{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                @keyframes pulse-slow-delay {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.15); opacity: 0.7; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(12deg); }
                    50% { transform: translateY(-20px) rotate(15deg); }
                }
                @keyframes float-delay {
                    0%, 100% { transform: translateY(0px) rotate(-12deg); }
                    50% { transform: translateY(20px) rotate(-15deg); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(45deg); }
                    50% { transform: translateY(-15px) rotate(50deg); }
                }
                .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
                .animate-pulse-slow-delay { animation: pulse-slow-delay 10s ease-in-out infinite; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delay { animation: float-delay 7s ease-in-out infinite; }
                .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
            `}</style>
        </>
    );
};

export default MenuPage;