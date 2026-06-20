import React, { useState } from "react";
import {
  COFFEE_PRODUCTS,
  getDiscountPercentage,
} from "../data/coffeeData";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext"; // ✅ Import Wishlist

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Types from "./Types";

// Icons with green theme
const StarIcon = () => (
  <svg className="w-4 h-4 text-green-500 fill-green-500" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);

const HeartIcon = ({ isWishlisted = false, className = "" }) => (
  <svg 
    className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-500'} ${className}`} 
    fill={isWishlisted ? "currentColor" : "none"} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CoffeeIcon = () => (
  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
);

const CategoryPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist(); // ✅ Wishlist functions

  // ✅ Handle Add to Cart from Card
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    
    const item = {
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      originalPrice: product.price,
      image: product.image,
      category: "Coffee",
      quantity: 1
    };
    
    addToCart(item);
    
    const btn = e.currentTarget;
    btn.textContent = "Added ✓";
    btn.style.background = "linear-gradient(to right, #16a34a, #22c55e)";
    setTimeout(() => {
      btn.innerHTML = `
        <svg class="w-4 h-4 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Add to Cart
      `;
      btn.style.background = "linear-gradient(to right, #0D7C53, #16a34a)";
    }, 1500);
  };

  // ✅ Handle Add to Cart from Modal
  const handleModalAddToCart = () => {
    if (!selectedProduct) return;
    
    const item = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.discountPrice || selectedProduct.price,
      originalPrice: selectedProduct.price,
      image: selectedProduct.image,
      category: "Coffee",
      quantity: modalQuantity
    };
    
    addToCart(item);
    setSelectedProduct(null);
    setModalQuantity(1);
  };

  // ✅ Handle quantity change in modal
  const handleModalQuantityChange = (change) => {
    setModalQuantity(prev => Math.max(1, prev + change));
  };

  // ✅ Handle Wishlist Toggle
  const handleWishlistToggle = (product, e) => {
    e.stopPropagation();
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      originalPrice: product.price,
      image: product.image,
      category: "Coffee",
      description: product.description || "Premium coffee blend",
      likes: product.likes || 0
    };
    toggleWishlist(wishlistItem);
  };

  // ✅ Handle Modal Wishlist Toggle
  const handleModalWishlistToggle = () => {
    if (!selectedProduct) return;
    const wishlistItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.discountPrice || selectedProduct.price,
      originalPrice: selectedProduct.price,
      image: selectedProduct.image,
      category: "Coffee",
      description: selectedProduct.description || "Premium coffee blend",
      likes: selectedProduct.likes || 0
    };
    toggleWishlist(wishlistItem);
  };

  return (
    <>
      <section className="relative px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-20 left-10 text-6xl rotate-12 animate-float">🫘</div>
            <div className="absolute bottom-32 right-20 text-6xl -rotate-12 animate-float-delay">🫘</div>
            <div className="absolute top-1/3 right-1/4 text-4xl rotate-45 animate-float-slow">☕</div>
            <div className="absolute bottom-1/4 left-1/3 text-5xl -rotate-45 animate-float-delay">🫘</div>
          </div>
        </div>

        <div className="max-w-[104rem] mx-auto relative">
          {/* Header */}
          <div className="rounded-2xl p-8 mb-5 text-center">
            <span className="inline-block px-4 py-1.5 bg-green-100/80 backdrop-blur-sm text-green-800 text-xs font-semibold tracking-wider uppercase rounded-full mb-3">
              Brewed Perfection
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0D7C53] tracking-tight">
              Our Coffee Collection
            </h2>
            <p className="text-gray-500 mt-1 max-w-2xl mx-auto">
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
            {COFFEE_PRODUCTS.map((product) => {
              const discount = getDiscountPercentage(
                product.price,
                product.discountPrice
              );
              const isWishlisted = isInWishlist(product.id);

              return (
                <SwiperSlide key={product.id}>
                  <div
                    onMouseEnter={() => setHoveredId(product.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedProduct(product)}
                    className="group relative cursor-pointer bg-white/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 border border-white/30"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {discount > 0 && (
                        <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-600 to-[#0D7C53] text-white text-xs px-3.5 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          {discount}% OFF
                        </span>
                      )}

                      {/* ✅ Wishlist Button - Now Functional */}
                      <button
                        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all duration-300 hover:scale-110"
                        onClick={(e) => handleWishlistToggle(product, e)}
                      >
                        <HeartIcon isWishlisted={isWishlisted} />
                      </button>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="bg-[#0D7C53]/90 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          Quick View
                        </span>
                      </div>
                    </div>

                    <div className="p-5 relative">
                      <div className="flex items-center gap-1.5 mb-2">
                        <CoffeeIcon />
                        <span className="text-xs font-medium text-green-600 uppercase tracking-wider">
                          Specialty Blend
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-green-700 transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-3 mt-3">
                        {product.discountPrice ? (
                          <>
                            <span className="font-bold text-2xl text-[#0D7C53] tracking-tight">
                              ₹{product.discountPrice}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.price}
                            </span>
                            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                              Save ₹{product.price - product.discountPrice}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-2xl text-[#0D7C53] tracking-tight">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      <button
                        className="mt-4 w-full bg-gradient-to-r from-[#0D7C53] to-green-600 hover:from-green-600 hover:to-[#0D7C53] text-white py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                        onClick={(e) => handleAddToCart(product, e)}
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

      {/* Modal - Updated with Wishlist */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => {
            setSelectedProduct(null);
            setModalQuantity(1);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-300 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="relative w-full h-80 sm:h-96 bg-green-50/30">
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
                <span className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-[#0D7C53] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                  {getDiscountPercentage(selectedProduct.price, selectedProduct.discountPrice)}% OFF
                </span>
              )}

              {/* ✅ Modal Wishlist Button */}
              <button 
                className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition hover:scale-105 border border-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalWishlistToggle();
                }}
              >
                <HeartIcon isWishlisted={isInWishlist(selectedProduct.id)} />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-5 pt-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold tracking-wider uppercase rounded-full mb-1.5">
                    Premium Blend
                  </span>
                  <h2 className="text-xl font-extrabold text-gray-800 leading-tight line-clamp-1">
                    {selectedProduct.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {selectedProduct.discountPrice ? (
                    <>
                      <span className="text-2xl font-extrabold text-[#0D7C53]">
                        ₹{selectedProduct.discountPrice}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{selectedProduct.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-extrabold text-[#0D7C53]">
                      ₹{selectedProduct.price}
                    </span>
                  )}
                </div>
              </div>

              {selectedProduct.discountPrice && (
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Save ₹{selectedProduct.price - selectedProduct.discountPrice}
                  </span>
                </div>
              )}

              <div className="mt-4">
                <span className="text-xs font-semibold text-gray-700 block mb-1.5">Select Size</span>
                <div className="flex gap-1.5">
                  {['250g', '500g', '1kg'].map((size) => (
                    <button
                      key={size}
                      className="flex-1 py-1.5 px-2 rounded-lg border-2 border-gray-200 text-xs font-medium hover:border-[#0D7C53] hover:bg-green-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

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
                  className="flex-1 bg-[#0D7C53] text-white py-2.5 rounded-lg font-semibold hover:bg-green-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
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
    </>
  );
};

export default CategoryPage;