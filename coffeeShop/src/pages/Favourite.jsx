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
            <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-[#C8A97E]/20"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-[#C8A97E] border-t-transparent animate-spin"></div>
                    </div>
                    <p className="mt-6 text-[#B6B6B6] font-light tracking-wide">Loading favourites...</p>
                </div>
            </div>
        );
    }

    if (favourites.length === 0) {
        return (
            <section className="relative py-20 px-4 overflow-hidden min-h-screen">
                {/* Premium Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,169,126,.12),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(111,78,55,.10),transparent_35%),#0F0F0F]"></div>
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#C8A97E]/5 rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#6F4E37]/8 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-16 shadow-2xl shadow-black/40 max-w-2xl mx-auto hover:scale-[1.02] transition-all duration-700 hover:shadow-[0_30px_80px_rgba(200,169,126,.15)]">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#6F4E37]/20 to-[#C8A97E]/20 flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-white/10">
                                <Heart className="w-16 h-16 text-[#C8A97E]" strokeWidth={1.5} />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#C8A97E] to-[#6F4E37] rounded-full flex items-center justify-center text-[#0F0F0F] text-xs font-bold shadow-lg shadow-[#C8A97E]/20">
                                0
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold text-[#F8F6F3] mb-4 tracking-tight">No Favourites Yet</h2>
                        <p className="text-[#B6B6B6] max-w-md mx-auto mb-10 text-lg font-light leading-relaxed">
                            Discover our curated collection of premium coffees and add your favourites with a single touch.
                        </p>
                        <button
                            onClick={handleViewAll}
                            className="px-10 py-4 bg-gradient-to-r from-[#6F4E37] via-[#A67C52] to-[#C8A97E] text-[#F8F6F3] rounded-full font-medium shadow-lg shadow-[#C8A97E]/20 hover:shadow-[#C8A97E]/40 transition-all duration-500 hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
                        >
                            <span className="relative z-10">Explore Premium Menu</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#C8A97E] via-[#A67C52] to-[#6F4E37] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-12 px-4 overflow-hidden min-h-screen">
            {/* Premium Layered Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,169,126,.12),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(111,78,55,.10),transparent_35%),#0F0F0F]"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C8A97E]/5 rounded-full blur-[200px]"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#6F4E37]/8 rounded-full blur-[150px]"></div>
            </div>

            {/* Content */}
            <div className="max-w-[104rem] mx-auto relative z-10">
                {/* Header - Premium Glass */}
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/30 mb-12 transition-all duration-700">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#F8F6F3] tracking-tight mb-2">
                                All Time Favourites
                            </h2>
                            <p className="text-[#B6B6B6] text-lg font-light">Curated selections our customers adore</p>
                        </div>
                        <button
                            onClick={handleViewAll}
                            className="group flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#6F4E37]/20 to-[#C8A97E]/20 text-[#F8F6F3] rounded-full font-medium hover:bg-gradient-to-r hover:from-[#6F4E37] hover:to-[#C8A97E] transition-all duration-500 border border-white/10 hover:border-transparent hover:scale-105 hover:shadow-lg hover:shadow-[#C8A97E]/20"
                        >
                            <span>View All Menu</span>
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Favourites Grid */}
                {uniqueCategoryItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
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
                                        className="group backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_20px_60px_rgba(200,169,126,.12)]"
                                    >
                                        {/* Image Container */}
                                        <div
                                            className="relative h-64 overflow-hidden bg-[#181818] cursor-pointer"
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                onError={(e) => {
                                                    e.target.src = "https://placehold.co/400x300/181818/B6B6B6?text=No+Image";
                                                }}
                                            />

                                            {/* Dark Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>

                                            {/* Category Badge - Top Left */}
                                            <div className="absolute top-4 left-4 z-10 backdrop-blur-xl bg-white/10 border border-white/10 px-4 py-2 rounded-full shadow-xl">
                                                <div className="flex items-center gap-2">
                                                    {category?.icon && (
                                                        <img
                                                            src={category.icon}
                                                            alt={category.name}
                                                            className="w-5 h-5 rounded-full object-cover"
                                                        />
                                                    )}
                                                    <span className="text-xs font-medium text-[#C8A97E] tracking-wider">
                                                        {category?.name || 'Uncategorized'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Discount Badge - Premium */}
                                            {item.discountPrice && item.discountPrice < item.price && (
                                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-[#6F4E37] to-[#C8A97E] text-[#F8F6F3] text-xs px-4 py-2 rounded-full font-bold shadow-xl shadow-[#C8A97E]/20 flex items-center gap-2 backdrop-blur-sm border border-white/10">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8A97E] opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8A97E]"></span>
                                                    </span>
                                                    {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                                                </div>
                                            )}

                                            {/* Wishlist Icon - Premium & Visible */}
                                            <button
                                                onClick={(e) => handleWishlistToggle(item, e)}
                                                className={`absolute top-4 right-4 z-20 w-11 h-11 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 ${
                                                    isWishlisted 
                                                        ? "bg-[#C8A97E]/30 border border-[#C8A97E]/40" 
                                                        : "bg-white/10 border border-white/20 hover:bg-white/20"
                                                }`}
                                            >
                                                <Heart
                                                    size={20}
                                                    className={`transition-colors duration-300 ${
                                                        isWishlisted
                                                            ? "fill-[#C8A97E] text-[#C8A97E]"
                                                            : "text-[#F8F6F3] opacity-80"
                                                    }`}
                                                />
                                            </button>

                                            {/* Quick View Button - Premium */}
                                            <button
                                                onClick={() => handleItemClick(item)}
                                                className="absolute bottom-6 left-1/2 -translate-x-1/2 backdrop-blur-xl bg-white/15 text-[#F8F6F3] px-8 py-3.5 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-gradient-to-r hover:from-[#6F4E37] hover:to-[#C8A97E] border border-white/20 shadow-2xl hover:scale-105 whitespace-nowrap"
                                            >
                                                Explore Item
                                            </button>
                                        </div>

                                        {/* Content - Premium */}
                                        <div className="p-6 bg-gradient-to-b from-white/5 to-transparent">
                                            <div className="flex items-start justify-between mb-1">
                                                <h3
                                                    className="font-bold text-[#F8F6F3] text-lg cursor-pointer hover:text-[#C8A97E] transition-colors duration-300 line-clamp-1"
                                                    onClick={() => handleItemClick(item)}
                                                >
                                                    {item.name}
                                                </h3>
                                            </div>

                                            <p className="text-[#B6B6B6] text-sm mb-3 line-clamp-2 font-light leading-relaxed">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl font-bold text-[#F8F6F3]">
                                                        ₹{displayPrice.toFixed(2)}
                                                    </span>
                                                    {item.discountPrice && item.discountPrice < item.price && (
                                                        <span className="text-sm text-[#B6B6B6] line-through">
                                                            ₹{originalPrice.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Add to Cart Button - Premium */}
                                            <button
                                                onClick={(e) => handleAddToCart(item, e)}
                                                className={`w-full mt-4 font-medium py-3.5 rounded-xl transition-all duration-500 flex items-center justify-center gap-2 group/btn ${
                                                    isAdded
                                                        ? "bg-gradient-to-r from-[#6F4E37] to-[#C8A97E] text-[#F8F6F3] shadow-lg shadow-[#C8A97E]/20"
                                                        : "bg-gradient-to-r from-[#6F4E37] via-[#A67C52] to-[#C8A97E] text-[#F8F6F3] hover:shadow-2xl hover:shadow-[#C8A97E]/30 hover:scale-[1.02] hover:-translate-y-0.5"
                                                }`}
                                            >
                                                {isAdded ? (
                                                    <>
                                                        <span>Added to Cart</span>
                                                        <span className="text-[#C8A97E]">✓</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingBag
                                                            size={18}
                                                            className="group-hover/btn:scale-110 transition-transform duration-300"
                                                        />
                                                        <span>Add to Cart</span>
                                                        <ChevronRight
                                                            size={16}
                                                            className="group-hover/btn:translate-x-1 transition-transform duration-300"
                                                        />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* View More / Show Less Button - Centered */}
                        {uniqueCategoryItems.length > 10 && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="group flex items-center gap-3 px-10 py-4 backdrop-blur-2xl bg-white/5 border border-white/10 text-[#F8F6F3] rounded-full font-medium hover:bg-gradient-to-r hover:from-[#6F4E37] hover:to-[#C8A97E] transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#C8A97E]/20"
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
                        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-16 shadow-2xl shadow-black/40 max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                                <Search size={32} className="text-[#B6B6B6]" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#F8F6F3] mb-2">No Items in this Category</h3>
                            <p className="text-[#B6B6B6] font-light">Try selecting a different category</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Favourite;