import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getSingleProduct,
    getProducts
} from "../redux/Slicer/adminProductSlice";
import {
    addToCart
} from "../redux/Slicer/cartSlice";
import {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    localToggleWishlist
} from "../redux/Slicer/wishlistSlice";
import {
    Heart,
    ShoppingBag,
    ArrowRight,
    ChevronLeft,
    Star,
    Clock,
    Flame,
    Info
} from 'lucide-react';

const DetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State for quantity
    const [quantity, setQuantity] = useState(1);
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    // Redux state selectors
    const { product, loading, error, products } = useSelector(
        (state) => state.adminProducts
    );

    const { items: wishlistItems, loading: wishlistLoading } = useSelector(
        (state) => state.wishlist
    );
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Check if product is in wishlist
    const isProductInWishlist = React.useMemo(() => {
        if (!product || !wishlistItems) return false;
        return wishlistItems.some(
            (item) => item.coffee?._id === product._id || item.coffee === product._id
        );
    }, [product, wishlistItems]);

    // Check if category is non-veg dynamically from Redux
    const isNonVegCategory = React.useMemo(() => {
        if (!product?.category) return false;

        const categoryName = product.category.name?.toLowerCase() || '';
        const categoryType = product.category.type?.toLowerCase() || '';

        // Non-veg keywords
        const nonVegKeywords = [
            'non-veg', 'nonveg', 'non veg', 'non-vegetarian', 'nonvegetarian',
            'chicken', 'mutton', 'fish', 'egg', 'meat', 'pork', 'beef',
            'lamb', 'turkey', 'duck', 'seafood', 'prawn', 'shrimp',
            'crab', 'lobster', 'bacon', 'sausage', 'pepperoni'
        ];

        return nonVegKeywords.some(keyword =>
            categoryName.includes(keyword) || categoryType.includes(keyword)
        );
    }, [product]);

    // Fetch product and wishlist on mount
    useEffect(() => {
        dispatch(getSingleProduct(id));
        dispatch(getProducts());
        if (isAuthenticated) {
            dispatch(getWishlist());
        }
    }, [dispatch, id, isAuthenticated]);

    // Navbar styling
    useEffect(() => {
        const navbar = document.querySelector('nav');
        if (navbar) {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        }
        return () => {
            if (navbar) {
                navbar.style.backgroundColor = '';
                navbar.style.backdropFilter = '';
                navbar.style.boxShadow = '';
            }
        };
    }, []);

    // Handle quantity change
    const handleQuantityChange = (type) => {
        if (type === "increment") {
            if (product?.stock > quantity) {
                setQuantity(quantity + 1);
            } else {
                toast.warning("Not enough stock available");
            }
        } else if (type === "decrement") {
            if (quantity > 1) {
                setQuantity(quantity - 1);
            }
        }
    };

    // Handle Add to Cart
    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to cart");
            navigate("/login");
            return;
        }

        if (product?.stock === 0) {
            toast.error("Product is out of stock");
            return;
        }

        const cartData = {
            coffeeId: product._id,
            quantity: quantity,
            amount: product.discountPrice || product.price,
        };

        dispatch(addToCart(cartData))
            .unwrap()
            .then(() => {
                toast.success(`${product.name} added to cart!`);
            })
            .catch((error) => {
                toast.error(error.message || "Failed to add to cart");
            });
    };

    // Handle Wishlist toggle
    const handleWishlistToggle = () => {
        if (!isAuthenticated) {
            toast.error("Please login to manage wishlist");
            navigate("/login");
            return;
        }

        dispatch(localToggleWishlist({ coffeeId: product._id }));

        if (isProductInWishlist) {
            const wishlistItem = wishlistItems.find(
                (item) => item.coffee?._id === product._id || item.coffee === product._id
            );

            if (wishlistItem) {
                dispatch(removeFromWishlist(wishlistItem._id))
                    .unwrap()
                    .catch((error) => {
                        toast.error(error.message || "Failed to remove from wishlist");
                        dispatch(localToggleWishlist({ coffeeId: product._id }));
                    });
            }
        } else {
            dispatch(addToWishlist({ coffeeId: product._id }))
                .unwrap()
                .catch((error) => {
                    toast.error(error.message || "Failed to add to wishlist");
                    dispatch(localToggleWishlist({ coffeeId: product._id }));
                });
        }
    };

    // Handle Buy Now
    const handleBuyNow = () => {
        if (!isAuthenticated) {
            toast.error("Please login to proceed");
            navigate("/login");
            return;
        }

        if (product?.stock === 0) {
            toast.error("Product is out of stock");
            return;
        }

        const cartData = {
            coffeeId: product._id,
            quantity: quantity,
            amount: product.discountPrice || product.price,
        };

        dispatch(addToCart(cartData))
            .unwrap()
            .then(() => {
                navigate("/checkout");
            })
            .catch((error) => {
                toast.error(error.message || "Failed to process order");
            });
    };

    // Get related products
    const getRelatedProducts = () => {
        if (!products || !product || !product.category) return [];

        return products
            .filter(
                (p) =>
                    p.category?._id === product.category._id &&
                    p._id !== product._id
            )
            .slice(0, 4);
    };

    const relatedProducts = getRelatedProducts();

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]">
                <div className="w-10 h-10 border-4 border-[#0D7C53] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]">
                <p className="text-xl mb-4 text-red-500">{error}</p>
                <button
                    onClick={() => dispatch(getSingleProduct(id))}
                    className="bg-[#0D7C53] text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // No product found
    if (!product) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]">
                <p className="text-xl text-gray-600">Product not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] pt-20 sm:pt-28 px-2 sm:px-4 pb-10 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                <div className="absolute top-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-amber-400/15 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-amber-700/10 rounded-full blur-[70px] sm:blur-[100px] animate-pulse-slow-delay" />
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-20 left-10 text-4xl sm:text-6xl rotate-12 animate-float">🫘</div>
                    <div className="absolute bottom-32 right-20 text-4xl sm:text-6xl -rotate-12 animate-float-delay">☕</div>
                </div>
            </div>

            <div className="max-w-[100rem] mx-auto relative z-10">

                {/* Product Main Section */}
                <div className="bg-white/30 border border-white/40 rounded-2xl sm:rounded-3xl p-2 sm:p-6 md:p-8 shadow-2xl shadow-black/5">
                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">

                        {/* Product Image */}
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden bg-white/50 border border-white/40 shadow-lg">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-fill"
                                />
                            </div>

                            {/* Stock Status Badge */}
                            {product.stock === 0 ? (
                                <span className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                                    Out of Stock
                                </span>
                            ) : product.stock < 10 ? (
                                <span className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                                    Only {product.stock} left
                                </span>
                            ) : null}

                            {/* Wishlist Button on Image */}
                            <button
                                onClick={handleWishlistToggle}
                                disabled={wishlistLoading}
                                className="absolute top-4 left-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 disabled:opacity-50"
                            >
                                <Heart
                                    className={`w-5 h-5 sm:w-6 sm:h-6 ${isProductInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-col">
                            {/* Category - Dynamically from Redux */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span
                                    className={`font-semibold text-sm uppercase tracking-wide px-3 py-1 rounded-full border ${isNonVegCategory
                                        ? 'bg-red-100 text-red-600 border-red-300'
                                        : 'bg-green-100 text-[#0D7C53] border-green-300'
                                        }`}
                                >
                                    {product.category?.name || "Uncategorized"}
                                </span>

                                {product.category?.type && (
                                    <span className={`text-sm font-medium flex items-center gap-1 ${isNonVegCategory ? 'text-red-500' : 'text-[#0D7C53]'
                                        }`}>
                                        {isNonVegCategory ? (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                                <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                <path d="M12 6C9 6 7 9 7 12C7 15 9 18 12 18C15 18 17 15 17 12C17 9 15 6 12 6Z" fill="currentColor" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                                <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                <circle cx="12" cy="12" r="4" fill="currentColor" />
                                            </svg>
                                        )}
                                        {product.category?.type}
                                    </span>
                                )}
                            </div>

                            {/* Product Name */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 text-gray-800">
                                {product.name}
                            </h1>

                            {/* Price Section */}
                            <div className="flex items-center gap-3 mt-3">
                                {product.discountPrice ? (
                                    <>
                                        <span className="text-3xl sm:text-4xl font-bold text-[#0D7C53]">
                                            ₹{product.discountPrice}
                                        </span>
                                        <span className="text-lg sm:text-xl line-through text-gray-400">
                                            ₹{product.price}
                                        </span>
                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {product.discountPercentage || 0}% OFF
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-3xl sm:text-4xl font-bold text-[#0D7C53]">
                                        ₹{product.price}
                                    </span>
                                )}
                            </div>

                            {/* Quick Info Chips */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4">
                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                    <Flame size={16} className="text-orange-500" />
                                    <span>{product.calories || 170} calories</span>
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                    <Clock size={16} className="text-blue-500" />
                                    <span>{product.preparationTime || "15-30"} min</span>
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                    <span>{product.rating || 4.5} Rating</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-5">
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Customize / More Details */}
                            <div className="mt-4 border-t border-gray-200/50 pt-4">
                                <button
                                    onClick={() => setShowMoreDetails(!showMoreDetails)}
                                    className="flex items-center gap-2 text-[#0D7C53] font-medium hover:text-green-700 transition-colors"
                                >
                                    <Info size={18} />
                                    <span>More Details</span>
                                    <ArrowRight
                                        size={16}
                                        className={`transition-transform ${showMoreDetails ? 'rotate-90' : ''}`}
                                    />
                                </button>

                                {showMoreDetails && (
                                    <div className="mt-3 space-y-2 text-sm text-gray-600 bg-white/40 p-4 rounded-xl">
                                        <p><strong>Category:</strong> {product.category?.name}</p>
                                        <p><strong>Type:</strong> {product.category?.type || 'N/A'}</p>
                                        <p><strong>Stock:</strong> {product.stock} units</p>
                                        <p><strong>SKU:</strong> {product.sku || 'N/A'}</p>
                                        {product.ingredients && (
                                            <p><strong>Ingredients:</strong> {product.ingredients}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4 mt-5">
                                <span className="font-medium text-gray-700 text-sm">Quantity:</span>
                                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white/50">
                                    <button
                                        onClick={() => handleQuantityChange("decrement")}
                                        disabled={quantity <= 1}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-transparent hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 sm:px-6 py-1.5 sm:py-2 font-semibold min-w-[40px] sm:min-w-[50px] text-center text-sm sm:text-base">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange("increment")}
                                        disabled={product.stock <= quantity}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-transparent hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-500">
                                    {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                                </span>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="mt-6 w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base sm:text-lg"
                            >
                                <ShoppingBag size={20} className="sm:w-6 sm:h-6" />
                                <span>Add to Cart</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Buy Now Button */}
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="mt-3 w-full py-3 sm:py-3.5 bg-white/80 text-[#0D7C53] border-2 border-[#0D7C53] rounded-full font-semibold hover:bg-[#0D7C53] hover:text-white transition-all duration-300 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-10 sm:mt-16">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                            Related <span className="text-[#0D7C53]">Products</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <div
                                    key={relatedProduct._id}
                                    className="group bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] flex flex-col"
                                    onClick={() => navigate(`/product/${relatedProduct._id}`)}
                                >
                                    <div className="relative overflow-hidden bg-white/50 flex-shrink-0">
                                        <img
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            className="w-full h-[120px] sm:h-[150px] md:h-[180px] lg:h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {relatedProduct.discountPrice && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold">
                                                {relatedProduct.discountPercentage}% OFF
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-1">
                                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                            {relatedProduct.name}
                                        </h3>

                                        {/* Description - New */}
                                        <p className="text-gray-500 text-[12px] sm:text-sm mt-1 line-clamp-2 flex-1">
                                            {relatedProduct.description || 'Delicious item from our menu'}
                                        </p>

                                        <div className="flex items-center gap-2 mt-2">
                                            {relatedProduct.discountPrice ? (
                                                <>
                                                    <span className="font-bold text-[#0D7C53] text-sm sm:text-base">
                                                        ₹{relatedProduct.discountPrice}
                                                    </span>
                                                    <span className="text-xs line-through text-gray-400">
                                                        ₹{relatedProduct.price}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="font-bold text-[#0D7C53] text-sm sm:text-base">
                                                    ₹{relatedProduct.price}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            className="mt-2 w-full py-1.5 sm:py-2 bg-[#0D7C53] text-white rounded-full text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/product/${relatedProduct._id}`);
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
                .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
                .animate-pulse-slow-delay { animation: pulse-slow-delay 10s ease-in-out infinite; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delay { animation: float-delay 7s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default DetailsPage;