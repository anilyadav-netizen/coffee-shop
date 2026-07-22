import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    Star,
    ShoppingBag,
    Heart,
    Search,
    X,
    Grid3x3,
    Sliders,
    ChevronDown,
    Check,
} from "lucide-react";

import { getProducts } from "../redux/Slicer/adminProductSlice";
import { getCategories } from "../redux/Slicer/categorySlice";
import { addToCart } from "../redux/slicer/cartSlice";
import { addToWishlist, removeFromWishlist, getWishlist } from "../redux/slicer/wishlistSlice";

import allImage from '../assets/Images/All.png';
import BurgerBanner from '../assets/Images/BurgerBanner.png';
import ChauminBanner from '../assets/Images/ChauminBanner.png';
import coffeeBanner from '../assets/Images/coffeeBanner.png';
import DrinksBanner from '../assets/Images/DrinksBanner.png';
import MomoBanner from '../assets/Images/MomoBanner.png';
import NonvegBanner from '../assets/Images/NonvegBanner.png';
import PizzaBanner from '../assets/Images/PizzaBanner.png';
import StarterBanner from '../assets/Images/StarterBanner.png';
import VegBanner from '../assets/Images/VegBanner.png';
import imagebg from '../assets/Images/imagebg.jpg';

const categoryBannerMap = {
    all: allImage,
    burger: BurgerBanner,
    chaumin: ChauminBanner,
    coffee: coffeeBanner,
    drinks: DrinksBanner,
    momo: MomoBanner,
    nonveg: NonvegBanner,
    pizza: PizzaBanner,
    starter: StarterBanner,
    veg: VegBanner,
};

const MenuPage = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categoryId } = useParams();

    const { categories, loading: categoriesLoading } = useSelector((state) => state.category);
    const { products, loading: productsLoading } = useSelector((state) => state.adminProducts);
    const { items: wishlistItems } = useSelector((state) => state.wishlist);

    // ===== Filter & Sort State =====
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("priceLow");
    const [priceRange, setPriceRange] = useState(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Animated cards
    const [visibleCards, setVisibleCards] = useState(new Set());
    const cardRefs = useRef({});
    const [isAnimating, setIsAnimating] = useState(false);

    // ===== Build category list: "All" + DB categories =====
    const allCategories = useMemo(() => {
        if (!categories || categories.length === 0) return [];
        return [
            { _id: 'all', name: 'All', icon: null, isAll: true },
            ...categories // all DB categories (including Veg, Non‑Veg if they exist)
        ];
    }, [categories]);

    // ===== Determine current category object =====
    const currentCategory = useMemo(() => {
        if (!allCategories || allCategories.length === 0) return null;
        if (!categoryId || categoryId === 'all') return allCategories[0];
        const found = allCategories.find(cat => String(cat._id) === String(categoryId));
        return found || allCategories[0];
    }, [allCategories, categoryId]);

    // ===== Get banner for category =====
    const getCategoryBanner = (category) => {
        if (!category) return allImage;
        const nameKey = category.isAll ? 'all' : category.name?.toLowerCase();
        return categoryBannerMap[nameKey] || allImage;
    };

    const currentBanner = useMemo(() => getCategoryBanner(currentCategory), [currentCategory]);

    // ===== Fetch data =====
    useEffect(() => {
        dispatch(getCategories());
        dispatch(getProducts());
        dispatch(getWishlist());
    }, [dispatch]);

    useEffect(() => {
        if (categories && categories.length > 0 && !categoryId) {
            navigate(`/menu/all`, { replace: true });
        }
    }, [categories, categoryId, navigate]);

    // ===== Filter products =====
    const categoryProducts = useMemo(() => {
        if (!products || products.length === 0) return [];
        if (!categoryId || categoryId === 'all') return products;
        return products.filter((product) => {
            const catId = product.category?._id || product.category || product.categoryId;
            return String(catId) === String(categoryId);
        });
    }, [products, categoryId]);

    // Apply filters & sorting
    const filteredItems = useMemo(() => {
        let result = [...categoryProducts];

        // Search
        if (searchTerm.trim()) {
            result = result.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
            );
        }

        // Price range
        if (priceRange) {
            result = result.filter((item) => {
                const price = item.discountPrice ?? item.price;
                if (price == null) return true;
                if (priceRange === "under100") return price < 100;
                if (priceRange === "100-200") return price >= 100 && price <= 200;
                if (priceRange === "above200") return price > 200;
                return true;
            });
        }

        // Sorting
        if (sortBy === "priceLow") {
            result.sort((a, b) => (a.discountPrice ?? a.price ?? 0) - (b.discountPrice ?? b.price ?? 0));
        } else if (sortBy === "priceHigh") {
            result.sort((a, b) => (b.discountPrice ?? b.price ?? 0) - (a.discountPrice ?? a.price ?? 0));
        }

        return result;
    }, [categoryProducts, searchTerm, priceRange, sortBy]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryId, priceRange, sortBy]);

    // ===== Auto-animate cards =====
    useEffect(() => {
        if (filteredItems.length === 0) {
            setVisibleCards(new Set());
            return;
        }
        setVisibleCards(new Set());
        setIsAnimating(true);
        const timer = setTimeout(() => {
            const startIdx = (currentPage - 1) * itemsPerPage;
            const endIdx = startIdx + itemsPerPage;
            const currentPageItems = filteredItems.slice(startIdx, endIdx);
            const allIds = currentPageItems.map((item) => item._id);
            setVisibleCards(new Set(allIds));
            setIsAnimating(false);
        }, 300);
        return () => {
            clearTimeout(timer);
            setIsAnimating(false);
        };
    }, [filteredItems, currentPage]);

    // ===== Pagination =====
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    const handlePageChange = (page) => setCurrentPage(page);

    // ===== Handlers =====
    const clearSearch = () => setSearchTerm("");

    const handleAddToCart = (item, e) => {
        e.stopPropagation();
        const amount = item.discountPrice || item.price;
        dispatch(addToCart({ coffeeId: item._id, quantity: 1, amount }))
            .unwrap()
            .then(() => toast.success("Item added successfully in cart"))
            .catch((err) => toast.error(err || "Failed to add cart"));
    };

    const isInWishlist = (productId) =>
        wishlistItems?.some((w) => {
            const wishCoffeeId = w.coffee?._id || w.coffee;
            return wishCoffeeId === productId;
        });

    const handleWishlistToggle = (item, e) => {
        e.stopPropagation();
        const coffeeId = item._id;
        const wishlistItem = wishlistItems.find((w) => {
            const wishCoffeeId = w.coffee?._id || w.coffee;
            return wishCoffeeId === coffeeId;
        });
        if (wishlistItem) {
            dispatch(removeFromWishlist(wishlistItem._id))
                .unwrap()
                .then(() => toast.success("Item Removed from wishlist"))
                .catch((err) => toast.error(err || "Failed to remove wishlist"));
        } else {
            dispatch(addToWishlist({ coffeeId }))
                .unwrap()
                .then(() => toast.success("Item added successfully in wishlist"))
                .catch((err) => toast.error(err || "Failed to add wishlist"));
        }
    };

    const applyFilters = () => {
        setIsFilterModalOpen(false);
    };

    const resetFilters = () => {
        setSortBy("priceLow");
        setPriceRange(null);
        setSearchTerm("");
    };

    // ===== Loading state =====
    const isLoading = categoriesLoading || productsLoading;
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#ebe0ce] overflow-x-hidden">
                <div className="text-center">
                    <div className="relative w-48 h-64 mx-auto">{/* loading animation */}</div>
                    <p className="mt-6 text-[#E85D3A] font-medium text-lg tracking-wider">Loading Menu...</p>
                </div>
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center overflow-x-hidden bg-[#ebe0ce]">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="bg-white rounded-3xl p-12 shadow-lg border border-[#FEE7DD]">
                        <div className="w-24 h-24 bg-[#FFF0EA] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">📋</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-2">No Categories Available</h2>
                        <p className="text-[#6B7280] mb-6">Please add some categories to get started.</p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-2 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white rounded-full hover:shadow-lg transition"
                        >
                            Go Back Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ===== MAIN RENDER =====
    return (
        <>
            <div className="min-h-screen overflow-x-hidden bg-[#FCF2E9]">
                {/* Hero Banner */}
                <div className="relative pt-24 pb-20 md:pb-72 overflow-hidden">
                    <div className="absolute inset-0 w-full h-full">
                        <img src={currentBanner} alt={currentCategory?.name || "Menu"} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-[#FBBF24]/10 rounded-full blur-2xl opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-white/5 rounded-full blur-3xl opacity-30"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center">
                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                                {currentCategory?.name || "Menu"}
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#E85D3A] to-transparent mx-auto mb-4"></div>
                            <p className="text-white/90 text-center max-w-2xl mx-auto text-base sm:text-lg drop-shadow">
                                {currentCategory?.isAll
                                    ? "Explore our complete menu"
                                    : `Explore our delicious ${currentCategory?.name?.toLowerCase()} items`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== CONTENT SECTION ===== */}
                <div className="relative -mt-16 pb-5 md:pb-12">
                    {/* Background */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <img src={imagebg} alt="Menu Background" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-white/90"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F5]/50 via-white/80 to-[#FFF0EA]/50"></div>
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
                        {/* ===== SEARCH BAR ===== */}
                        <div className="max-w-md mx-auto mb-1.5 sm:mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
                                <input
                                    type="text"
                                    placeholder="Restaurant name or a dish..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 bg-white border-2 border-[#FEE7DD] rounded-full shadow-lg shadow-[#E85D3A]/5 focus:outline-none focus:ring-2 focus:ring-[#E85D3A] focus:border-transparent transition-all text-[#1F2937] placeholder:text-[#6B7280] text-sm sm:text-base"
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

                        {/* ===== CATEGORY BAR ===== */}
                        <div className="">
                            <div className="">
                                <div
                                    className="flex overflow-x-auto lg:overflow-x-visible scrollbar-hide gap-4 lg:gap-10 px-2 lg:px-0 py-2 lg:justify-center"
                                >
                                    {allCategories?.map((cat) => {
                                        const isActive =
                                            String(currentCategory?._id) === String(cat._id);

                                        const catImage = getCategoryBanner(cat);

                                        return (
                                            <button
                                                key={cat._id}
                                                onClick={() => {
                                                    navigate(`/menu/${cat._id}`);
                                                    setVisibleCards(new Set());
                                                }}
                                                className="flex-shrink-0 flex flex-col items-center group"
                                            >
                                                {/* Category Image */}
                                                <div
                                                    className={`relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden transition-all duration-300 ${isActive
                                                        ? "ring-2 ring-[#E85D3A] shadow-md scale-[1.02]"
                                                        : "ring-1 ring-gray-200 group-hover:ring-[#E85D3A]/40 group-hover:scale-[1.02]"
                                                        }`}
                                                >
                                                    {catImage && (
                                                        <img
                                                            src={catImage}
                                                            alt={cat.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>

                                                {/* Name */}
                                                <span
                                                    className={`mt-2 text-xs md:text-sm lg:text-base font-medium whitespace-nowrap transition-colors ${isActive
                                                        ? "text-[#E85D3A]"
                                                        : "text-gray-700 group-hover:text-[#E85D3A]"
                                                        }`}
                                                >
                                                    {cat.isAll ? "All" : cat.name}
                                                </span>

                                                {/* Active Line */}
                                                <div
                                                    className={` mt-1.5 h-[3px] rounded-full transition-all duration-300 ${isActive
                                                        ? "w-10 lg:w-12 bg-[#E85D3A]"
                                                        : "w-0"
                                                        }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ===== FILTER CHIPS ===== */}
                        <div className="flex items-center gap-1.5 overflow-x-auto mb-2 scrollbar-hide">
                            <button
                                onClick={() => setIsFilterModalOpen(true)}
                                className="flex-shrink-0 flex items-center gap-1 text-[15px] font-medium text-[#1F2937] bg-white border border-[#FEE7DD] px-3 py-1.5 rounded-full hover:bg-[#FFF0EA] hover:border-[#E85D3A] transition-all"
                            >
                                <Sliders size={16} className="text-[#E85D3A]" />
                                Filters
                            </button>

                            <button
                                onClick={() => setPriceRange(priceRange === "under100" ? null : "under100")}
                                className={`flex-shrink-0 text-[13px] px-2.5 py-1.5 rounded-full border transition-all ${priceRange === "under100"
                                    ? "bg-[#E85D3A] text-white border-[#E85D3A]"
                                    : "bg-white border-[#FEE7DD] text-[#6B7280] hover:border-[#E85D3A]"
                                    }`}
                            >
                                Under ₹100
                            </button>
                            <button
                                onClick={() => setPriceRange(priceRange === "100-200" ? null : "100-200")}
                                className={`flex-shrink-0 text-[13px] px-2.5 py-1.5 rounded-full border transition-all ${priceRange === "100-200"
                                    ? "bg-[#E85D3A] text-white border-[#E85D3A]"
                                    : "bg-white border-[#FEE7DD] text-[#6B7280] hover:border-[#E85D3A]"
                                    }`}
                            >
                                ₹100 – ₹200
                            </button>
                            <button
                                onClick={() => setPriceRange(priceRange === "above200" ? null : "above200")}
                                className={`flex-shrink-0 text-[13px] px-2.5 py-1.5 rounded-full border transition-all ${priceRange === "above200"
                                    ? "bg-[#E85D3A] text-white border-[#E85D3A]"
                                    : "bg-white border-[#FEE7DD] text-[#6B7280] hover:border-[#E85D3A]"
                                    }`}
                            >
                                Above ₹200
                            </button>
                        </div>

                        {/* Items Grid - Same as before */}
                        {currentItems && currentItems.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 pb-5 md:pb-12">
                                {currentItems.map((item, index) => {
                                    let itemCategoryName = "Uncategorized";
                                    if (item.category && typeof item.category === "object") {
                                        itemCategoryName = item.category.name;
                                    } else if (item.category && typeof item.category === "string") {
                                        const found = categories.find((c) => String(c._id) === String(item.category));
                                        itemCategoryName = found?.name || "Uncategorized";
                                    }
                                    const isVisible = visibleCards.has(item._id);
                                    const isEven = index % 2 === 0;
                                    const direction = isEven ? "left" : "right";
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
                                                    ? "opacity-100 translate-x-0"
                                                    : `opacity-0 ${direction === "left" ? "-translate-x-16" : "translate-x-16"}`
                                                }`}
                                            style={{ transitionDelay: `${index * 80}ms` }}
                                        >
                                            {/* Image */}
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

                                                {/* Wishlist */}
                                                <button
                                                    onClick={(e) => handleWishlistToggle(item, e)}
                                                    className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all duration-300 hover:scale-110 border border-[#F3F4F6]"
                                                >
                                                    <Heart
                                                        size={16}
                                                        className={`sm:w-[18px] sm:h-[18px] transition-colors ${isInWishlist(item._id)
                                                            ? "fill-[#E85D3A] text-[#E85D3A]"
                                                            : "text-[#6B7280] hover:text-[#E85D3A]"
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1 bg-[#FEFAF7]">
                                                <h3 className="font-bold text-[#1F2937] text-sm sm:text-base md:text-lg group-hover:text-[#E85D3A] transition-colors mb-0.5 sm:mb-1 truncate">
                                                    {item.name}
                                                </h3>

                                                <div className="h-8 sm:h-10 md:h-12 overflow-hidden">
                                                    <p className="text-[#6B7280] text-[12px] sm:text-sm line-clamp-2">
                                                        {item.description || "Delicious item from our menu"}
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

                                                {/* Add to Cart */}
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
                                            <>No items match the selected filters.</>
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-1 sm:mt-6 pb-3 md:pb-6">
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
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

            {/* ===== FILTER MODAL ===== */}
            {isFilterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
                        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-[#FEE7DD]">
                            <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
                                <Sliders size={20} className="text-[#E85D3A]" />
                                Filters
                            </h2>
                            <button
                                onClick={() => setIsFilterModalOpen(false)}
                                className="p-1 hover:bg-[#FFF0EA] rounded-full transition-colors"
                            >
                                <X size={24} className="text-[#6B7280]" />
                            </button>
                        </div>

                        <div className="p-4 space-y-6">
                            {/* Sort By */}
                            <div>
                                <h3 className="font-semibold text-[#1F2937] mb-2">Sort By</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { value: "priceLow", label: "Price: Low → High" },
                                        { value: "priceHigh", label: "Price: High → Low" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSortBy(option.value)}
                                            className={`px-3 py-2 rounded-lg border text-sm transition-all ${sortBy === option.value
                                                ? "border-[#E85D3A] bg-[#FFF0EA] text-[#E85D3A] font-medium"
                                                : "border-[#FEE7DD] text-[#6B7280] hover:bg-[#FFF8F5]"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dish Price */}
                            <div>
                                <h3 className="font-semibold text-[#1F2937] mb-2">Dish Price</h3>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { value: "under100", label: "Under ₹100" },
                                        { value: "100-200", label: "₹100 – ₹200" },
                                        { value: "above200", label: "Above ₹200" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setPriceRange(priceRange === option.value ? null : option.value)}
                                            className={`px-4 py-2 rounded-lg border text-sm transition-all flex items-center gap-1 ${priceRange === option.value
                                                ? "border-[#E85D3A] bg-[#FFF0EA] text-[#E85D3A] font-medium"
                                                : "border-[#FEE7DD] text-[#6B7280] hover:bg-[#FFF8F5]"
                                                }`}
                                        >
                                            {priceRange === option.value && <Check size={14} />}
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 pt-4 border-t border-[#FEE7DD]">
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 text-sm font-medium text-[#6B7280] border border-[#FEE7DD] rounded-lg hover:bg-[#FFF8F5] transition-all flex-1"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#E85D3A] to-[#F0744F] rounded-lg shadow-lg shadow-[#E85D3A]/30 hover:shadow-xl transition-all flex-1"
                                >
                                    Show Results
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-pulse-slow-delay { animation: pulse-slow-delay 10s ease-in-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 7s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }

        /* Hide scrollbar for category and filter chips */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </>
    );
};

export default MenuPage;