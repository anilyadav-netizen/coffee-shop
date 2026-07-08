import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavouriteItems, toggleFavourite, getFavouriteCount } from '../data/favouriteData';
import {
    Heart,
    Star,
    Trash2,
    ShoppingBag,
    TrendingUp,
    ChevronRight,
    Coffee,
    Utensils,
    Cake,
    Package,
    Leaf,
    X,
    Search
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

    // ✅ Handle Add to Cart - FIXED: Added amount field
    const handleAddToCart = async (item, e) => {
        e.stopPropagation();

        // Calculate the amount (use discountPrice if available, otherwise use price)
        const amount = item.discountPrice || item.price;

        try {
            await dispatch(
                addToCart({
                    coffeeId: item._id,
                    quantity: 1,
                    amount: amount // ✅ Added amount field
                })
            ).unwrap();
            toast.success("Item added to cart successfully!");

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

    // ✅ Handle Wishlist Toggle - FIXED: Consistent ID handling
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
                toast.info("Item Removed from wishlist");
            } else {
                await dispatch(addToWishlist({ coffeeId: item._id })).unwrap();
                toast.success("Item Added to wishlist ❤️");
            }
        } catch (error) {
            console.error("Wishlist Error:", error);
            toast.error("Failed to update wishlist");
        }
    };

    const handleRemoveFavourite = (itemId) => {
        toggleFavourite(itemId);
        setFavourites(favourites.filter(item => item.id !== itemId));
    };

    const handleItemClick = (item) => {
        navigate(`/menu/${item.category?._id || item.categoryId}`);
    };

    const handleViewAll = () => {
        navigate('/menu');
    };

    // ✅ Get unique category items (1 item per category)
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
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#0D7C53] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading favourites...</p>
                </div>
            </div>
        );
    }

    if (favourites.length === 0) {
        return (
            <section className="relative py-16 px-4 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className=" bg-white/20 border border-white/30 rounded-3xl p-12 shadow-2xl shadow-black/5 max-w-2xl mx-auto">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 bg-[#0D7C53]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-16 h-16 text-[#0D7C53]" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                                0
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">No Favourites Yet</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Start exploring our delicious menu and add your favourite items by clicking the heart icon.
                        </p>
                        <button
                            onClick={handleViewAll}
                            className="px-8 py-3 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            Explore Menu
                        </button>
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
                    .animate-pulse-slow {
                        animation: pulse-slow 8s ease-in-out infinite;
                    }
                    .animate-pulse-slow-delay {
                        animation: pulse-slow-delay 10s ease-in-out infinite;
                    }
                `}</style>
            </section>
        );
    }

    return (
        <section className="relative px-4 overflow-hidden pb-5">
            {/* Content */}
            <div className="max-w-[104rem] mx-auto relative z-10">
                {/* Header - Glass Effect */}
                <div className="rounded-3xl p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div>
                                    <h2 className="text-3xl font-bold text-white">All Time Favourites</h2>
                                    <p className="text-gray-300 text-base">Items Customer love the most</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleViewAll}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#0D7C53]/20 text-white rounded-full font-medium hover:bg-[#0D7C53] hover:text-white transition-all duration-300 border border-white/30"
                        >
                            View All Menu
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Favourites Grid */}
                {uniqueCategoryItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {displayItems.map((item) => {
                                const isAdded = addedItems[item._id];
                                const isWishlisted = wishlistItems.some(
                                    (wish) => {
                                        const wishCoffeeId = wish.coffee?._id || wish.coffee;
                                        return wishCoffeeId === item._id;
                                    }
                                );
                                const category = item.category;

                                // Calculate amount for display
                                const displayPrice = item.discountPrice || item.price;
                                const originalPrice = item.price;

                                return (
                                    <div
                                        key={item._id}
                                        className="group bg-white/30 border border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-black/10 hover:shadow-[#0D7C53]/20 transition-all duration-500 hover:-translate-y-2 hover:bg-white/15 relative"
                                    >
                                        {/* Image Container */}
                                        <div
                                            className="relative h-56 overflow-hidden bg-gray-900/30 cursor-pointer"
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-fill group-hover:scale-110 transition-transform duration-700"
                                                onError={(e) => {
                                                    e.target.src = "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
                                                }}
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Discount Badge */}
                                            {item.discountPrice && item.discountPrice < item.price && (
                                                <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-600 to-[#0D7C53] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                    </span>
                                                    {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                                                </div>
                                            )}

                                            {/* Wishlist Icon */}
                                            <button
                                                onClick={(e) => handleWishlistToggle(item, e)}
                                                className={`absolute top-3 right-3 z-10 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:bg-white ${isWishlisted ? "bg-red-50" : ""
                                                    }`}
                                            >
                                                <Heart
                                                    size={18}
                                                    className={
                                                        isWishlisted
                                                            ? "fill-red-500 text-red-500"
                                                            : "text-gray-700"
                                                    }
                                                />
                                            </button>

                                            {/* Category Badge */}
                                            <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full shadow-md">
                                                {category?.icon && (
                                                    <img
                                                        src={category.icon}
                                                        alt={category.name}
                                                        className="w-5 h-5 rounded-full object-cover"
                                                    />
                                                )}
                                                <span className="text-xs font-semibold text-[#0D7C53]">
                                                    {category?.name || 'Uncategorized'}
                                                </span>
                                            </div>

                                            {/* Quick View Button */}
                                            <button
                                                onClick={() => handleItemClick(item)}
                                                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-gray-800 px-6 py-2.5 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#0D7C53] hover:text-white shadow-lg border border-white/30 hover:scale-105"
                                            >
                                                View Item
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 bg-gradient-to-b from-white/15 to-white/10">
                                            <div className="flex items-start justify-between">
                                                <h3
                                                    className="font-bold text-white text-lg transition-colors cursor-pointer line-clamp-1"
                                                    onClick={() => handleItemClick(item)}
                                                >
                                                    {item.name}
                                                </h3>
                                            </div>

                                            <p className="text-white/80 text-sm mb-2 line-clamp-2">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-1 border-t border-white/20">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-bold text-white">
                                                        ₹{displayPrice.toFixed(2)}
                                                    </span>
                                                    {item.discountPrice && item.discountPrice < item.price && (
                                                        <span className="text-sm text-white/50 line-through">
                                                            ₹{originalPrice.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button
                                                onClick={(e) => handleAddToCart(item, e)}
                                                className={`w-full mt-2 font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn ${isAdded
                                                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                                        : "bg-gradient-to-r from-[#0D7C53] to-[#169466] text-white hover:shadow-lg hover:shadow-[#0D7C53]/30 hover:scale-[1.02]"
                                                    }`}
                                            >
                                                {isAdded ? (
                                                    <span>Added ✓</span>
                                                ) : (
                                                    <>
                                                        <ShoppingBag
                                                            size={18}
                                                            className="group-hover/btn:scale-110 transition-transform"
                                                        />
                                                        Add to Cart
                                                        <ChevronRight
                                                            size={16}
                                                            className="group-hover/btn:translate-x-1 transition-transform"
                                                        />
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
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="flex items-center gap-2 px-8 py-3 bg-[#0D7C53]/20 text-white rounded-full font-medium hover:bg-[#0D7C53] hover:text-white transition-all duration-300 border border-white/30 hover:scale-105"
                                >
                                    {showAll ? (
                                        <>
                                            Show Less
                                            <ChevronRight size={18} className="rotate-90" />
                                        </>
                                    ) : (
                                        <>
                                            View More ({uniqueCategoryItems.length - 10} more)
                                            <ChevronRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className=" bg-white/20 border border-white/30 rounded-3xl p-12 shadow-2xl shadow-black/5 max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gray-100/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700">No Items in this Category</h3>
                            <p className="text-gray-500 mt-2">Try selecting a different category</p>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS Animations */}
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
                
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                
                .animate-pulse-slow-delay {
                    animation: pulse-slow-delay 10s ease-in-out infinite;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-float-delay {
                    animation: float-delay 7s ease-in-out infinite;
                }
                
                .animate-float-slow {
                    animation: float-slow 9s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default Favourite;