import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavouriteItems, toggleFavourite, getFavouriteCount } from '../data/favouriteData';
import {
    Heart,
    Star,
    ShoppingBag,
    ChevronRight,
    Search,
    Clock,
    Flame
} from 'lucide-react';
import { getProducts } from '../redux/Slicer/adminProductSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../redux/Slicer/categorySlice';
import { addToCart } from "../redux/Slicer/cartSlice";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} from "../redux/Slicer/wishlistSlice";
import { toast } from "react-toastify";

const Favourite = () => {

    const dispatch = useDispatch()
    const { products } = useSelector(
        (state) => state.adminProducts
    )
    const { categories } = useSelector(
        (state) => state.category
    )

    const { loading: cartLoading } = useSelector(
        (state) => state.cart
    );

    const { items: wishlistItems } = useSelector(
        (state) => state.wishlist
    );

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getCategories());
        dispatch(getWishlist());
    }, [dispatch]);

    const navigate = useNavigate();
    const [favourites, setFavourites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [addedItems, setAddedItems] = useState({});
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const loadFavourites = () => {
            const items = getFavouriteItems();
            setFavourites(items.filter(item => item.isFavourite));
            setIsLoading(false);
        };
        loadFavourites();
    }, []);

    const handleAddToCart = async (item, e) => {
        e.stopPropagation();
        const amount = item.discountPrice || item.price;

        try {
            await dispatch(
                addToCart({
                    coffeeId: item._id,
                    quantity: 1,
                    amount: amount
                })
            ).unwrap();
            toast.success("Added to cart!");

            setAddedItems((prev) => ({
                ...prev,
                [item._id]: true,
            }));

            setTimeout(() => {
                setAddedItems((prev) => ({
                    ...prev,
                    [item._id]: false,
                }));
            }, 1500);

        } catch (error) {
            console.error("Add To Cart Error:", error);
            toast.error("Failed to add to cart");
        }
    };

    const handleWishlistToggle = async (item, e) => {
        e.stopPropagation();

        try {
            const existingItem = wishlistItems.find(
                (wish) => {
                    const wishCoffeeId = wish.coffee?._id || wish.coffee;
                    return wishCoffeeId === item._id;
                }
            );

            if (existingItem) {
                await dispatch(removeFromWishlist(existingItem._id)).unwrap();
                toast.info("Removed from wishlist");
            } else {
                await dispatch(addToWishlist({ coffeeId: item._id })).unwrap();
                toast.success("Added to wishlist ❤️");
            }
        } catch (error) {
            console.error("Wishlist Error:", error);
            toast.error("Failed to update wishlist");
        }
    };

    const handleItemClick = (item) => {
        navigate(`/menu/${item.category?._id || item.categoryId}`);
    };

    const handleViewAll = () => {
        navigate('/menu');
    };

    const getUniqueCategoryItems = () => {
        const uniqueItems = [];
        const seenCategories = new Set();

        products.forEach(item => {
            const categoryId = item.category?._id || item.categoryId;
            if (!seenCategories.has(categoryId)) {
                seenCategories.add(categoryId);
                uniqueItems.push(item);
            }
        });

        return uniqueItems;
    };

    const uniqueCategoryItems = getUniqueCategoryItems();
    const displayItems = showAll ? uniqueCategoryItems : uniqueCategoryItems.slice(0, 10);

    if (isLoading) {
        return (
            <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-[#E85D3A]/20"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-[#E85D3A] border-t-transparent animate-spin"></div>
                    </div>
                    <p className="mt-6 text-[#6B7280] font-light tracking-wide">Loading favourites...</p>
                </div>
            </div>
        );
    }

    if (favourites.length === 0) {
        return (
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="bg-gradient-to-br from-white to-[#FFF5F0] rounded-3xl p-16 shadow-xl max-w-2xl mx-auto hover:shadow-2xl transition-all duration-700 border border-[#FEE7DD]">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FFE8DE] to-[#FDD7C8] flex items-center justify-center mx-auto mb-8">
                                <Heart className="w-16 h-16 text-[#E85D3A]" strokeWidth={1.5} />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#E85D3A] to-[#F0744F] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-[#E85D3A]/30">
                                0
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold text-[#1F2937] mb-4 tracking-tight">No Favourites Yet</h2>
                        <p className="text-[#6B7280] max-w-md mx-auto mb-10 text-lg font-light leading-relaxed">
                            Discover our mouth-watering fast-food items and add your favourites with a single touch.
                        </p>
                        <button
                            onClick={handleViewAll}
                            className="px-10 py-4 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white rounded-full font-medium shadow-lg shadow-[#E85D3A]/30 hover:shadow-[#E85D3A]/50 transition-all duration-500 hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
                        >
                            <span className="relative z-10">Explore Our Menu</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#F0744F] to-[#E85D3A] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-2 md:py-6 px-4 overflow-hidden ">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E85D3A]/[0.03] rounded-full blur-[150px]"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F0744F]/[0.03] rounded-full blur-[120px]"></div>
            </div>

            {/* Content */}
            <div className="max-w-[102rem] mx-auto relative z-10">
                {/* Header */}
                <div className="bg-[#FFF8F2] rounded-3xl p-4 md:p-8 shadow-lg shadow-[#E85D3A]/5 border border-[#FEE7DD] mb-3.5 md:mb-7 transition-all duration-700">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl md:text-5xl font-bold text-[#1F2937] tracking-tight mb-2 flex items-center gap-3">
                                All Time Favourites
                                <span className="text-3xl">🔥</span>
                            </h2>
                            <p className="text-[#6B7280] text-base md:text-lg font-light -mt-2 md:mt-0">Curated selections our customers adore</p>
                        </div>
                        <button
                            onClick={handleViewAll}
                            className="group flex items-center gap-3 px-8 py-3 md:py-3.5  rounded-full font-medium bg-white text-[#E85D3A] hover:bg-[#E85D3A] hover:text-white transition-all duration-500 border border-[#FEE7DD] hover:border-transparent hover:scale-105 hover:shadow-lg hover:shadow-[#E85D3A]/20"
                        >
                            <span>View All Menu</span>
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Favourites Grid */}
                {uniqueCategoryItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-8">
                            {displayItems.slice(0, 10)?.map((item) => {
                                const isAdded = addedItems[item._id];
                                const isWishlisted = wishlistItems.some(
                                    (wish) => {
                                        const wishCoffeeId = wish.coffee?._id || wish.coffee;
                                        return wishCoffeeId === item._id;
                                    }
                                );
                                const category = item.category;
                                const hasDiscount = item.discountPrice && item.discountPrice < item.price;
                                const discountPercent = item.discountPercentage || 
                                    Math.round(((item.price - item.discountPrice) / item.price) * 100);

                                const displayPrice = item.discountPrice || item.price;
                                const originalPrice = item.price;

                                return (
                                    <div
                                        key={item._id}
                                        className="group rounded-2xl overflow-hidden shadow-md border-[#E86A33]/30 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 border border-[#F3F4F6] hover:border-[#FEE7DD]"
                                    >
                                        {/* Image Container */}
                                        <div
                                            className="relative h-40 md:h-56 overflow-hidden bg-[#FEFAF7] cursor-pointer"
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => {
                                                    e.target.src = "https://placehold.co/400x300/FAFAFA/6B7280?text=No+Image";
                                                }}
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            {/* Category Icon Badge - Left Side */}
                                            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-[#F3F4F6] flex items-center gap-1.5">
                                                {category?.icon ? (
                                                    <img
                                                        src={category.icon}
                                                        alt={category.name}
                                                        className="w-5 h-5 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#E86A33] to-[#F59E6B] flex items-center justify-center text-white text-[10px] font-bold">
                                                        {category?.name?.charAt(0) || 'C'}
                                                    </div>
                                                )}
                                                <span className="text-[10px] font-semibold text-[#E85D3A] tracking-wider uppercase">
                                                    {category?.name || 'Category'}
                                                </span>
                                            </div>

                                            {/* Wishlist Icon - Top Right */}
                                            <button
                                                onClick={(e) => handleWishlistToggle(item, e)}
                                                className={`absolute top-3 right-3 z-20 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border ${
                                                    isWishlisted
                                                        ? "border-[#E85D3A] bg-[#FFF0EA]"
                                                        : "border-[#F3F4F6] hover:border-[#E85D3A]"
                                                }`}
                                            >
                                                <Heart
                                                    size={16}
                                                    className={`transition-colors duration-300 ${
                                                        isWishlisted
                                                            ? "fill-[#E85D3A] text-[#E85D3A]"
                                                            : "text-[#6B7280]"
                                                    }`}
                                                />
                                            </button>

                                            {/* Quick View Button */}
                                            <button
                                                onClick={() => handleItemClick(item)}
                                                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-[#1F2937] px-6 py-2.5 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#D55B25] hover:text-white shadow-lg hover:scale-105 whitespace-nowrap"
                                            >
                                                Quick View
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 -mt-2 md:mt-0 bg-[#FFF8F2]">
                                            <div className="flex items-start justify-between mb-1.5">
                                                <h3
                                                    className="font-bold text-[#1F2937] text-base cursor-pointer hover:text-[#E85D3A] transition-colors duration-300 line-clamp-1 flex-1"
                                                    onClick={() => handleItemClick(item)}
                                                >
                                                    {item.name}
                                                </h3>
                                                
                                                {/* Discount Percentage - At the end of heading */}
                                                {hasDiscount && (
                                                    <div className="flex items-center gap-1 ml-2 flex-shrink-0 bg-gradient-to-r from-[#E86A33] to-[#F59E6B] text-white px-2 py-1 rounded-full text-[12px] font-bold shadow-md">
                                                        {discountPercent}% OFF
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-[#7b818f] text-sm mb-1 md:mb-3 line-clamp-2 leading-relaxed -mt-1">
                                                {item.description || "Delicious fast food item"}
                                            </p>

                                            {/* Price Section with Trusted Colors */}
                                            <div className="flex items-center justify-between -pt-1 md:pt-1.5 border-t border-[#F3F4F6]">
                                                <div className="flex items-center gap-2">
                                                    {hasDiscount ? (
                                                        <>
                                                            <span className="text-lg font-bold text-[#E86A33]">
                                                                ₹{displayPrice.toFixed(2)}
                                                            </span>
                                                            <span className="text-base text-gray-400 line-through font-medium">
                                                                ₹{originalPrice.toFixed(2)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-lg font-bold text-[#1F2937]">
                                                            ₹{displayPrice.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {/* Save Badge - Only when discount exists */}
                                                {hasDiscount && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50 flex items-center gap-0.5">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            ₹{(originalPrice - displayPrice).toFixed(2)} OFF
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button
                                                onClick={(e) => handleAddToCart(item, e)}
                                                className={`w-full mt-1.5 md:mt-3 font-semibold py-2.5 rounded-xl transition-all duration-500 flex items-center justify-center gap-2 text-sm group/btn ${
                                                    isAdded
                                                        ? "bg-[#E86A33] hover:bg-[#D55B25] text-white shadow-lg shadow-[#10B981]/30"
                                                        : "bg-[#E86A33] hover:bg-[#D55B25] text-white hover:shadow-2xl hover:shadow-[#E85D3A]/30 hover:scale-[1.02] hover:-translate-y-0.5"
                                                }`}
                                            >
                                                {isAdded ? (
                                                    <>
                                                        <span>Added to Cart</span>
                                                        <span className="text-white text-lg">✓</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingBag
                                                            size={16}
                                                            className="group-hover/btn:scale-110 transition-transform duration-300"
                                                        />
                                                        <span>Add to Cart</span>
                                                        <span className="text-xs opacity-70">+</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* View More / Show Less Button */}
                        {uniqueCategoryItems.length > 10 && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="group flex items-center gap-3 px-10 py-4 bg-white text-[#1F2937] rounded-full font-medium hover:bg-[#E85D3A] hover:text-white transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#E85D3A]/20 border border-[#F3F4F6]"
                                >
                                    {showAll ? (
                                        <>
                                            <span>Show Less</span>
                                            <ChevronRight size={18} className="rotate-90 group-hover:rotate-[-90deg] transition-transform duration-500" />
                                        </>
                                    ) : (
                                        <>
                                            <span>View More ({uniqueCategoryItems.length - 10} more)</span>
                                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-white rounded-3xl p-16 shadow-xl max-w-2xl mx-auto border border-[#F3F4F6]">
                            <div className="w-20 h-20 bg-[#FFF0EA] rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search size={32} className="text-[#6B7280]" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1F2937] mb-2">No Items in this Category</h3>
                            <p className="text-[#6B7280] font-light">Try selecting a different category</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Favourite;