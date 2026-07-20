import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Banner from '../assets/Images/Banner.png';
import imagebg from '../assets/Images/imagebg.jpg';

import { getProducts } from "../redux/Slicer/adminProductSlice";
import { getCategories } from "../redux/Slicer/categorySlice";
import { toast } from "react-toastify";
import {
    ArrowLeft,
    Star,
    TrendingUp,
    ShoppingBag,
    Heart,
    Search,
    X,
    Grid3x3,
    Flame
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slicer/cartSlice";
import { addToWishlist, removeFromWishlist, getWishlist } from "../redux/slicer/wishlistSlice";

const MenuPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categoryId } = useParams();

    // Get categories from Redux
    const { categories, loading: categoriesLoading } = useSelector(
        (state) => state.category
    );

    // Get products from Redux
    const { products, loading: productsLoading } = useSelector(
        (state) => state.adminProducts
    );

    const { items: wishlistItems } = useSelector((state) => state.wishlist);
    console.log(items)

    // State
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCards, setVisibleCards] = useState(new Set());
    const cardRefs = useRef({});
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // Changed from 8 to 20

    // Fetch data
    useEffect(() => {
        dispatch(getCategories());
        dispatch(getProducts());
        dispatch(getWishlist());
    }, [dispatch]);

    // ===== AUTO ANIMATE ITEMS ON CATEGORY CHANGE OR SEARCH =====
    useEffect(() => {
        if (filteredItems.length === 0) {
            setVisibleCards(new Set());
            return;
        }

        setVisibleCards(new Set());
        setIsAnimating(true);

        // Auto show items with delay
        const timer = setTimeout(() => {
            // Show only current page items
            const startIdx = (currentPage - 1) * itemsPerPage;
            const endIdx = startIdx + itemsPerPage;
            const currentPageItems = filteredItems.slice(startIdx, endIdx);
            const allIds = currentPageItems?.map(item => item._id);
            setVisibleCards(new Set(allIds));
            setIsAnimating(false);
        }, 300);

        return () => {
            clearTimeout(timer);
            setIsAnimating(false);
        };
    }, [filteredItems, currentPage]);

    // Reset to first page when search or category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryId]);

    // ===== Create "All" category =====
    const allCategories = useMemo(() => {
        if (!categories || categories.length === 0) return [];

        const allCategory = {
            _id: 'all',
            name: 'All',
            icon: null,
            isAll: true
        };

        return [allCategory, ...categories];
    }, [categories]);

    // Find the current category from URL param
    const currentCategory = useMemo(() => {
        if (!categories || categories.length === 0) return null;

        if (!categoryId || categoryId === 'all') {
            return allCategories[0];
        }

        const found = categories.find(cat => String(cat._id) === String(categoryId));
        return found || allCategories[0];
    }, [categories, categoryId, allCategories]);

    // Redirect if no categoryId
    useEffect(() => {
        if (categories && categories.length > 0 && !categoryId) {
            navigate(`/menu/all`, { replace: true });
        }
    }, [categories, categoryId, navigate]);

    // Filter products based on category
    const categoryProducts = useMemo(() => {
        if (!products || products.length === 0) return [];

        if (!categoryId || categoryId === 'all') {
            return products;
        }

        return products.filter(product => {
            if (product.category && typeof product.category === 'object') {
                return String(product.category._id) === String(categoryId);
            }
            if (product.category && typeof product.category === 'string') {
                return String(product.category) === String(categoryId);
            }
            if (product.categoryId) {
                return String(product.categoryId) === String(categoryId);
            }
            return false;
        });
    }, [products, categoryId]);

    // Category banners mapping
    const categoryBanners = {
        'all': Banner,
    };

    const currentBanner = useMemo(() => {
        if (!currentCategory) return Banner;
        return categoryBanners[currentCategory._id] || Banner;
    }, [currentCategory]);

    // Handle loading state
    useEffect(() => {
        if (!categoriesLoading && !productsLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [categoriesLoading, productsLoading]);

    // Handle search
    useEffect(() => {
        if (!categoryProducts || categoryProducts.length === 0) {
            setFilteredItems([]);
            return;
        }

        if (searchTerm.trim() === "") {
            setFilteredItems(categoryProducts);
        } else {
            const filtered = categoryProducts.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
            );
            setFilteredItems(filtered);
        }
    }, [searchTerm, categoryProducts]);

    // Pagination logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Animation will be triggered by the useEffect that depends on currentPage
    };

    // ✅ Handle Add to Cart - FIXED: Added amount field
    const handleAddToCart = (item, e) => {
        e.stopPropagation();

        // Calculate the amount (use discountPrice if available, otherwise use price)
        const amount = item.discountPrice || item.price;

        dispatch(
            addToCart({
                coffeeId: item._id,
                quantity: 1,
                amount: amount // ✅ Added amount field
            })
        )
            .unwrap()
            .then(() => {
                toast.success("Item added successfully in cart");
            })
            .catch((err) => {
                toast.error(err || "Failed to add cart");
            });
    };

    // ✅ Check if item is in wishlist - FIXED: Consistent ID handling
    const isInWishlist = (productId) => {
        return wishlistItems?.some(
            (item) => {
                const wishCoffeeId = item.coffee?._id || item.coffee;
                return wishCoffeeId === productId;
            }
        );
    };

    // ✅ Handle Wishlist Toggle - FIXED: Consistent ID handling
    const handleWishlistToggle = (item, e) => {
        e.stopPropagation();

        const coffeeId = item._id;

        const wishlistItem = wishlistItems.find(
            (w) => {
                const wishCoffeeId = w.coffee?._id || w.coffee;
                return wishCoffeeId === coffeeId;
            }
        );

        if (wishlistItem) {
            dispatch(removeFromWishlist(wishlistItem._id))
                .unwrap()
                .then(() => {
                    toast.success("Item Removed from wishlist");
                })
                .catch((err) => {
                    toast.error(err || "Failed to remove wishlist");
                });
        } else {
            dispatch(addToWishlist({ coffeeId }))
                .unwrap()
                .then(() => {
                    toast.success("Item added successfully in wishlist");
                })
                .catch((err) => {
                    toast.error(err || "Failed to add wishlist");
                });
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    // ============ LOADING STATE ============
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#ebe0ce] overflow-x-hidden">
                <div className="text-center">
                    <div className="relative w-48 h-64 mx-auto">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="w-16 h-12 bg-[#E85D3A] rounded-t-full rounded-b-lg shadow-lg relative">
                                <div className="absolute -bottom-2 right-0 w-6 h-3 bg-[#E85D3A] rounded-br-full"></div>
                                <div className="absolute top-2 left-2 w-3 h-6 bg-white/10 rounded-full"></div>
                            </div>
                        </div>

                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                            <div className="w-3 h-32 bg-gradient-to-b from-[#E85D3A] to-[#F0744F] rounded-full animate-pour"></div>
                            <div className="absolute -left-6 top-8 w-5 h-7 bg-[#E85D3A] rounded-full animate-drop-big-1 shadow-lg"></div>
                            <div className="absolute right-6 top-14 w-4 h-6 bg-[#F0744F] rounded-full animate-drop-big-2 shadow-lg"></div>
                            <div className="absolute -left-8 top-24 w-6 h-8 bg-[#E85D3A] rounded-full animate-drop-big-3 shadow-lg"></div>
                            <div className="absolute right-8 top-28 w-4 h-5 bg-[#F0744F] rounded-full animate-drop-big-4 shadow-lg"></div>
                            <div className="absolute left-2 top-10 w-1.5 h-2 bg-[#E85D3A] rounded-full animate-splash-1"></div>
                            <div className="absolute right-2 top-16 w-1.5 h-2 bg-[#E85D3A] rounded-full animate-splash-2"></div>
                        </div>

                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                            <div className="relative">
                                <div className="w-32 h-36 bg-[#FFF0EA] rounded-b-2xl rounded-t-lg shadow-2xl relative border border-[#FEE7DD]">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8F5] to-[#FFF0EA] rounded-b-2xl rounded-t-lg"></div>
                                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#E85D3A] rounded-b-2xl animate-fill-coffee">
                                        <div className="absolute -top-1 left-0 right-0 h-2 bg-gradient-to-b from-[#F0744F] to-[#E85D3A]">
                                            <div className="absolute top-0 left-4 w-8 h-0.5 bg-[#FBBF24] rounded-full animate-ripple"></div>
                                            <div className="absolute top-0 right-6 w-6 h-0.5 bg-[#FBBF24] rounded-full animate-ripple-2"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-1 left-0 right-0 h-2.5 bg-[#E85D3A] rounded-t-lg shadow-lg"></div>
                                <div className="absolute -right-5 top-4 w-7 h-16 border-[5px] border-[#FFF0EA] rounded-r-full border-l-0"></div>
                            </div>
                        </div>

                        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
                            <div className="w-2 h-3 bg-[#E85D3A] rounded-full animate-splash-surface-1"></div>
                            <div className="w-2 h-3 bg-[#F0744F] rounded-full animate-splash-surface-2"></div>
                            <div className="w-2 h-3 bg-[#E85D3A] rounded-full animate-splash-surface-3"></div>
                        </div>

                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 -mt-8 flex gap-5">
                            <div className="w-1.5 h-16 bg-gradient-to-t from-[#E85D3A]/20 to-transparent rounded-full animate-steam-1"></div>
                            <div className="w-1.5 h-20 bg-gradient-to-t from-[#E85D3A]/20 to-transparent rounded-full animate-steam-2"></div>
                            <div className="w-1.5 h-14 bg-gradient-to-t from-[#E85D3A]/20 to-transparent rounded-full animate-steam-3"></div>
                        </div>
                    </div>

                    <p className="mt-6 text-[#E85D3A] font-medium text-lg tracking-wider">
                        Loading Menu...
                    </p>
                </div>

                <style>{`
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

    // ===== No categories case =====
    if (!categories || categories.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center overflow-x-hidden bg-[#ebe0ce]">
                <div className="text-center max-w-md mx-auto p-8 relative z-10">
                    <div className="bg-white rounded-3xl p-12 shadow-lg shadow-[#E85D3A]/5 border border-[#FEE7DD]">
                        <div className="w-24 h-24 bg-[#FFF0EA] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">📋</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-2">No Categories Available</h2>
                        <p className="text-[#6B7280] mb-6">
                            Please add some categories to get started.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white rounded-full hover:shadow-lg hover:shadow-[#E85D3A]/30 transition shadow-lg"
                        >
                            Go Back Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============ MAIN CONTENT ============
    return (
        <>
            <div className="min-h-screen overflow-x-hidden bg-[#FCF2E9]">
                {/* Hero Banner */}
                <div className="relative pt-24 pb-20 md:pb-72 overflow-hidden">
                    <div className="absolute inset-0 w-full h-full">
                        <img
                            src={currentBanner}
                            alt={currentCategory?.name || 'Menu'}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50"></div>
                    </div>

                    <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-[#FBBF24]/10 rounded-full blur-2xl opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-white/5 rounded-full blur-3xl opacity-30"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <button
                            onClick={() => navigate('/')}
                            className="mb-6 inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-white/30 text-sm sm:text-base"
                        >
                            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                            Back to Home
                        </button>

                        <div className="text-center">
                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                                {currentCategory?.name || 'Menu'}
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#E85D3A] to-transparent mx-auto mb-4"></div>
                            <p className="text-white/90 text-center max-w-2xl mx-auto text-base sm:text-lg drop-shadow">
                                {currentCategory?.isAll
                                    ? 'Explore our complete menu'
                                    : `Explore our delicious ${currentCategory?.name?.toLowerCase()} items`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== CONTENT SECTION WITH FOOD COLORS ===== */}
                <div className="relative -mt-16 pb-12">
                    {/* ===== BACKGROUND - Updated with Food Colors ===== */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <img
                            src={imagebg}
                            alt="Menu Background"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-white/90"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F5]/50 via-white/80 to-[#FFF0EA]/50"></div>

                        {/* Decorative Glows - Updated with Food Colors */}
                        <div className="absolute -top-40 -left-40 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#E85D3A]/10 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-slow"></div>
                        <div className="absolute -bottom-40 -right-40 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#F0744F]/10 rounded-full blur-[70px] sm:blur-[100px] animate-pulse-slow-delay"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#E85D3A]/5 rounded-full blur-[100px] sm:blur-[150px] animate-pulse-slow"></div>

                        <div className="absolute inset-0 pointer-events-none opacity-10">
                            <div className="absolute top-20 left-10 text-2xl sm:text-6xl rotate-12 animate-float">🍔</div>
                            <div className="absolute bottom-32 right-20 text-2xl sm:text-6xl -rotate-12 animate-float-delay">🍕</div>
                            <div className="absolute top-1/3 right-[15%] text-xl sm:text-4xl rotate-45 animate-float-slow">🌮</div>
                            <div className="absolute bottom-[25%] left-[15%] text-2xl sm:text-5xl -rotate-45 animate-float-delay">🍟</div>
                        </div>
                    </div>

                    <div className="container mx-auto px-3 sm:px-4 relative z-10">
                        {/* Category Selector - Updated with Food Colors */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 bg-[#FEFAF7] border border-[#FEE7DD] p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg shadow-[#E85D3A]/5">
                            {allCategories?.map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => {
                                        navigate(`/menu/${cat._id}`);
                                        setVisibleCards(new Set());
                                    }}
                                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium transition-all duration-300 flex items-center gap-1 ${String(currentCategory?._id) === String(cat._id)
                                        ? 'bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white shadow-lg shadow-[#E85D3A]/30'
                                        : 'bg-[#FFF8F5] border border-[#FEE7DD] text-[#6B7280] hover:bg-[#FFF0EA] hover:text-[#E85D3A]'
                                        }`}
                                >
                                    {cat.isAll && <Grid3x3 size={14} />}
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar - Updated with Food Colors */}
                        <div className="max-w-md mx-auto mb-6 sm:mb-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
                                <input
                                    type="text"
                                    placeholder={`Search ${currentCategory?.isAll ? 'Menu' : currentCategory?.name}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 bg-white border-2 border-[#FEE7DD] rounded-full shadow-lg shadow-[#E85D3A]/5 focus:outline-none focus:ring-2 focus:ring-[#E85D3A] focus:border-transparent transition-all text-[#1F2937] placeholder:text-[#6B7280]"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#E85D3A]"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Items Grid with Auto Animation - Updated with Food Colors */}
                        {currentItems && currentItems.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 pb-12">
                                {currentItems?.map((item, index) => {
                                    let itemCategoryName = 'Uncategorized';
                                    if (item.category && typeof item.category === 'object') {
                                        itemCategoryName = item.category.name;
                                    } else if (item.category && typeof item.category === 'string') {
                                        const found = categories.find(c => String(c._id) === String(item.category));
                                        itemCategoryName = found?.name || 'Uncategorized';
                                    }

                                    const isVisible = visibleCards.has(item._id);

                                    // Alternate between left and right
                                    const isEven = index % 2 === 0;
                                    const direction = isEven ? 'left' : 'right';

                                    // Calculate display price
                                    const displayPrice = item.discountPrice || item.price;
                                    const originalPrice = item.price;

                                    return (
                                        <div
                                            key={item._id}
                                            ref={(el) => (cardRefs.current[item._id] = el)}
                                            data-id={item._id}
                                            onClick={() => navigate(`/product/${item._id}`)}
                                            className={`group bg-white border border-[#F3F4F6] rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl hover:shadow-[#E85D3A]/10 transition-all duration-700 overflow-hidden hover:-translate-y-2 flex flex-col h-full hover:border-[#FEE7DD]
                                                ${isVisible
                                                    ? 'opacity-100 translate-x-0'
                                                    : `opacity-0 ${direction === 'left' ? '-translate-x-16' : 'translate-x-16'}`
                                                }`}
                                            style={{
                                                transitionDelay: `${index * 80}ms`,
                                            }}
                                        >
                                            {/* Image Container */}
                                            <div className="relative h-28 sm:h-48 md:h-56 overflow-hidden bg-[#FAFAFA] flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-fill group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => {
                                                        e.target.src = "https://placehold.co/400x300/FAFAFA/6B7280?text=No+Image";
                                                    }}
                                                />

                                                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                {/* Discount Badge - Updated with Food Colors */}
                                                {item.discountPrice && item.discountPrice < item.price && (
                                                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white text-[8px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full font-bold shadow-lg shadow-[#E85D3A]/30 flex items-center gap-0.5 sm:gap-1">
                                                        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-full w-full bg-white"></span>
                                                        </span>
                                                        {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                                                    </div>
                                                )}

                                                {item.isFeatured && (
                                                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white text-[8px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full shadow-md flex items-center gap-0.5 sm:gap-1">
                                                        <Star size={10} className="sm:w-3 sm:h-3 fill-white" />
                                                        Featured
                                                    </div>
                                                )}

                                                {currentCategory?.isAll && (
                                                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[8px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full">
                                                        {itemCategoryName}
                                                    </div>
                                                )}

                                                {/* Wishlist Button - Updated */}
                                                <button
                                                    onClick={(e) => handleWishlistToggle(item, e)}
                                                    className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all duration-300 hover:scale-110 border border-[#F3F4F6]"
                                                >
                                                    <Heart
                                                        size={16}
                                                        className={`sm:w-[18px] sm:h-[18px] transition-colors ${isInWishlist(item._id)
                                                            ? 'fill-[#E85D3A] text-[#E85D3A]'
                                                            : 'text-[#6B7280] hover:text-[#E85D3A]'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Content - Updated with Food Colors */}
                                            <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1 bg-[#FEFAF7]">
                                                <h3 className="font-bold text-[#1F2937] text-sm sm:text-base md:text-lg group-hover:text-[#E85D3A] transition-colors mb-0.5 sm:mb-1 truncate">
                                                    {item.name}
                                                </h3>

                                                <div className="h-8 sm:h-10 md:h-12 overflow-hidden">
                                                    <p className="text-[#6B7280] text-[12px] sm:text-sm line-clamp-2">
                                                        {item.description || 'Delicious item from our menu'}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-0 md:pt-2 mt-0 md:mt-2">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <span className="text-base sm:text-lg md:text-xl font-bold text-[#1F2937]">
                                                            ₹{displayPrice.toFixed(2)}
                                                        </span>
                                                        {item.discountPrice && item.discountPrice < item.price && (
                                                            <span className="text-[10px] sm:text-xs text-[#6B7280] line-through">
                                                                ₹{originalPrice.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Add to Cart Button - Updated with Food Colors */}
                                                <button
                                                    onClick={(e) => handleAddToCart(item, e)}
                                                    className="w-full mt-1 sm:mt-3 md:mt-4 font-medium py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base flex-shrink-0 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white hover:shadow-lg hover:shadow-[#E85D3A]/40 hover:scale-[1.02]"
                                                >
                                                    <ShoppingBag size={16} />
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 sm:py-20">
                                <div className="bg-white border border-[#FEE7DD] rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-lg shadow-[#E85D3A]/5 max-w-2xl mx-auto">
                                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#FFF0EA] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                        <Search size={28} className="sm:w-10 sm:h-10 text-[#6B7280]" />
                                    </div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-[#1F2937]">No Items Found</h3>
                                    <p className="text-sm sm:text-base text-[#6B7280] mt-1 sm:mt-2">
                                        {searchTerm ? (
                                            <>No results for "<span className="font-medium text-[#1F2937]">{searchTerm}</span>"</>
                                        ) : (
                                            <>This category is currently empty. Check back later!</>
                                        )}
                                    </p>
                                    {searchTerm && (
                                        <button
                                            onClick={clearSearch}
                                            className="mt-3 sm:mt-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-[#FFF0EA] border border-[#FEE7DD] text-[#E85D3A] rounded-full hover:bg-[#E85D3A] hover:text-white transition-colors text-sm sm:text-base"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Pagination - Updated with Food Colors */}
                        {totalPages > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 sm:mt-6 pb-6">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-[#FEE7DD] text-[#6B7280] text-sm sm:text-base transition-all duration-200 ${currentPage === 1
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-[#FFF0EA] hover:border-[#E85D3A] hover:text-[#E85D3A]"
                                        }`}
                                >
                                    Previous
                                </button>

                                <div className="flex flex-wrap gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)?.map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border transition-all duration-200 text-sm sm:text-base ${currentPage === page
                                                ? "bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white border-[#E85D3A] shadow-lg shadow-[#E85D3A]/30"
                                                : "border-[#FEE7DD] text-[#6B7280] hover:bg-[#FFF0EA] hover:border-[#E85D3A] hover:text-[#E85D3A]"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-[#FEE7DD] text-[#6B7280] text-sm sm:text-base transition-all duration-200 ${currentPage === totalPages
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-[#FFF0EA] hover:border-[#E85D3A] hover:text-[#E85D3A]"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
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