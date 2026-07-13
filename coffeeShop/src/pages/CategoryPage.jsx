import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import {
  COFFEE_PRODUCTS,
  getDiscountPercentage,
} from "../data/coffeeData";
import { addToCart } from "../redux/Slicer/cartSlice";
import { toggleWishlist, getWishlist, addToWishlist, removeFromWishlist } from "../redux/Slicer/wishlistSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { getProducts } from "../redux/Slicer/adminProductSlice";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toast } from "react-toastify";

// Icons
const HeartIcon = ({ isWishlisted = false, className = "" }) => (
  <svg
    className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-[#E85D3A] text-[#E85D3A]' : 'text-gray-400 group-hover:text-[#E85D3A]'} ${className}`}
    fill={isWishlisted ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CategoryPage = () => {
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // ✅ Redux se cart aur wishlist
  const { totalItems } = useSelector((state) => state.cart);
  const { items: wishlistItems, wishlistCount } = useSelector((state) => state.wishlist);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  // ✅ Page load par wishlist fetch karo
  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  // ✅ Check if item is in wishlist - FIXED: Use consistent ID field
  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some(
      (item) => {
        // Handle both possible ID field names
        const itemId = item.coffee?._id || item.coffee?.id || item._id || item.id;
        return itemId === productId;
      }
    );
  };

  // ✅ Handle Add to Cart from Card - FIXED: Added amount field
  const navigate = useNavigate()
  const handleAddToCart = (product, e) => {
    e.stopPropagation();

    // Use _id or id consistently
    const productId = product._id || product.id;

    // Calculate the amount (use discountPrice if available, otherwise use price)
    const amount = product.discountPrice || product.price;

    dispatch(addToCart({
      coffeeId: productId,
      quantity: 1,
      amount: amount // ✅ Added amount field
    }))
      .unwrap()
      .then(() => {
        toast.success("Item added successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error?.message || "Failed to add to cart");
      })
      .catch((error) => {
        console.log("FULL ERROR =>", error);
        console.log("TYPE =>", typeof error);
        toast.error(error?.message || error || "Failed to add to cart");
      });
  };

  // ✅ Handle Add to Cart from Modal - FIXED: Added amount field with quantity
  const handleModalAddToCart = () => {
    if (!selectedProduct) return;

    const productId = selectedProduct._id || selectedProduct.id;

    // Calculate the amount (use discountPrice if available, otherwise use price)
    const unitPrice = selectedProduct.discountPrice || selectedProduct.price;
    const totalAmount = unitPrice * modalQuantity;

    dispatch(addToCart({
      coffeeId: productId,
      quantity: modalQuantity,
      amount: totalAmount // ✅ Added amount field with total
    }))
      .unwrap()
      .then(() => {
        setSelectedProduct(null);
        setModalQuantity(1);
        toast.success("Added to cart successfully!");
      })
      .catch((error) => {
        toast.error("Failed to add to cart");
      });
  };

  // ✅ Handle quantity change in modal
  const handleModalQuantityChange = (change) => {
    setModalQuantity(prev => Math.max(1, prev + change));
  };

  // ✅ Handle Wishlist Toggle (Redux) - FIXED: Consistent ID
  const handleWishlistToggle = (product, e) => {
    e.stopPropagation();

    const coffeeId = product._id || product.id;

    const alreadyInWishlist = isInWishlist(coffeeId);

    if (alreadyInWishlist) {
      // ❌ REMOVE FROM WISHLIST
      const existingItem = wishlistItems.find(
        (item) =>
          (item.coffee?._id || item.coffee?.id || item._id || item.id) === coffeeId
      );

      if (!existingItem) return;

      dispatch(removeFromWishlist(existingItem._id))
        .unwrap()
        .then(() => {
          toast.info("Item Removed from wishlist");
        })
        .catch((error) => {
          toast.error("Failed to remove from wishlist");
        });

    } else {
      // ✅ ADD TO WISHLIST
      dispatch(addToWishlist({ coffeeId }))
        .unwrap()
        .then(() => {
          toast.success("Item Added to wishlist");
        })
        .catch((error) => {
          toast.error("Failed to add to wishlist");
        });
    }
  };

  // ✅ Handle Modal Wishlist Toggle - FIXED: Consistent ID
  const handleModalWishlistToggle = () => {
    if (!selectedProduct) return;
    const productId = selectedProduct._id || selectedProduct.id;

    // Fix: Use addToWishlist/removeFromWishlist instead of toggleWishlist
    const alreadyInWishlist = isInWishlist(productId);

    if (alreadyInWishlist) {
      const existingItem = wishlistItems.find(
        (item) =>
          (item.coffee?._id || item.coffee?.id || item._id || item.id) === productId
      );

      if (existingItem) {
        dispatch(removeFromWishlist(existingItem._id))
          .unwrap()
          .then(() => {
            toast.info("Removed from wishlist");
          })
          .catch((error) => {
            toast.error("Failed to remove from wishlist");
          });
      }
    } else {
      dispatch(addToWishlist({ coffeeId: productId }))
        .unwrap()
        .then(() => {
          toast.success("Added to wishlist");
        })
        .catch((error) => {
          toast.error("Failed to add to wishlist");
        });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E85D3A]"></div>
      </div>
    );
  }

  return (
    <>
      <section className="relative px-4 overflow-hidden">
        <div className="max-w-[104rem] mx-auto relative">
          {/* Header */}
          <div className="rounded-2xl p-8 mb-2 text-center">
            <h2 className="text-2xl md:text-5xl font-bold text-white tracking-normal">
              Discover Delicious Dishes
            </h2>
            <p className="text-gray-300 mt-1 max-w-2xl mx-auto">
              Freshly brewed happiness in every cup — discover your perfect blend.
            </p>
          </div>

          {/* Swiper */}
          <Swiper
            modules={[Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="!pb-12"
          >
            {products.map((product) => {
              const productId = product._id || product.id;
              const discount = getDiscountPercentage(
                product.price,
                product.discountPrice
              );
              const isWishlisted = isInWishlist(productId);

              return (
                <SwiperSlide key={productId}>
                  <div
                    onMouseEnter={() => setHoveredId(productId)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => navigate(`/product/${productId}`)}
                    className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-black/10 hover:shadow-[#E85D3A]/20 transition-all duration-500 hover:-translate-y-2 hover:bg-white/15 relative cursor-pointer"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-fill group-hover:scale-[1.02] transition duration-700 ease-out"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {discount > 0 && (
                        <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white text-xs px-3.5 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          {discount}% OFF
                        </span>
                      )}

                      {/* Wishlist Button */}
                      <button
                        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all duration-300 hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation when clicking wishlist
                          handleWishlistToggle(product, e);
                        }}
                      >
                        <HeartIcon isWishlisted={isWishlisted} />
                      </button>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="bg-[#E85D3A]/90 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 cursor-pointer">
                          Quick View
                        </span>
                      </div>
                    </div>

                    {/* Content Area - Updated with Food Colors */}
                    <div className="p-4 bg-gradient-to-b bg-white backdrop-blur-sm">
                      <h3 className="font-bold text-[#1F2937] text-base cursor-pointer hover:text-[#E85D3A] transition-colors duration-300 line-clamp-1 flex-1">
                        {product.name}
                      </h3>
                      <p className="text-[#7b818f] text-sm mb-3 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-white/20">
                        <div className="flex items-center gap-3 mt-0">
                          {product.discountPrice ? (
                            <>
                              <span className="font-bold text-2xl text-[#F0744F] tracking-tight">
                                ₹{product.discountPrice}
                              </span>
                              <span className="text-lg font-bold text-[#1F2937]">
                                ₹{product.price}
                              </span>
                              <span className="ml-auto text-xs bg-[#FFF0EA] text-[#E85D3A] px-2 py-0.5 rounded-full font-semibold">
                                Save ₹{product.price - product.discountPrice}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-[#6B7280]">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        className="mt-2 w-full bg-gradient-to-r from-[#E85D3A] to-[#F0744F] hover:shadow-lg hover:shadow-[#E85D3A]/30 text-white py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md flex items-center justify-center gap-2 group/btn"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation when clicking Add to Cart
                          handleAddToCart(product, e);
                        }}
                      >
                        <svg className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>

      {/* Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => {
            setSelectedProduct(null);
            setModalQuantity(1);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-300 shadow-2xl mt-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="relative w-full h-[310px] sm:h-96 bg-[#FFF5F0]/30">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover rounded-t-2xl"
              />

              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setModalQuantity(1);
                }}
                className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition hover:scale-105 border border-gray-100"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {selectedProduct.discountPrice && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                  {getDiscountPercentage(selectedProduct.price, selectedProduct.discountPrice)}% OFF
                </span>
              )}

              {/* Modal Wishlist Button */}
              <button
                className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition hover:scale-105 border border-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalWishlistToggle();
                }}
              >
                <HeartIcon isWishlisted={isInWishlist(selectedProduct._id || selectedProduct.id)} />
              </button>
            </div>

            {/* Content Section - Updated with Food Colors */}
            <div className="p-5 pt-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2.5 py-0.5 bg-[#FFF0EA] text-[#E85D3A] text-[10px] font-semibold tracking-wider uppercase rounded-full mb-1.5">
                    Premium Food
                  </span>
                  <h2 className="text-xl font-extrabold text-[#1F2937]  leading-tight line-clamp-1">
                    {selectedProduct.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-[#7b818f] flex-shrink-0">
                  {selectedProduct.discountPrice ? (
                    <>
                      <span className="text-2xl font-extrabold text-[#E85D3A]">
                        ₹{selectedProduct.discountPrice}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{selectedProduct.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-extrabold text-[#E85D3A]">
                      ₹{selectedProduct.price}
                    </span>
                  )}
                </div>
              </div>

              {selectedProduct.discountPrice && (
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="bg-[#FFF0EA] text-[#E85D3A] px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Save ₹{selectedProduct.price - selectedProduct.discountPrice}
                  </span>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="mt-4 flex gap-2">
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5 border border-gray-200">
                  <button
                    onClick={() => handleModalQuantityChange(-1)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 transition flex items-center justify-center text-lg font-bold text-gray-600"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-800 text-sm">
                    {modalQuantity}
                  </span>
                  <button
                    onClick={() => handleModalQuantityChange(1)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 transition flex items-center justify-center text-lg font-bold text-gray-600"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleModalAddToCart}
                  className="flex-1 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#E85D3A]/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
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
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-pulse-slow-delay { animation: pulse-slow-delay 10s ease-in-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 7s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
      `}</style>
    </>
  );
};

export default CategoryPage;