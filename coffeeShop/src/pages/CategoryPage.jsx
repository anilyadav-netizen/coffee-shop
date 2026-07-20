import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { addToWishlist, removeFromWishlist, getWishlist } from "../redux/Slicer/wishlistSlice";
import { addToCart } from "../redux/Slicer/cartSlice";
import { getProducts } from "../redux/Slicer/adminProductSlice";

// ===== ICONS =====
const HeartIcon = ({ active }) => (
  <svg
    className={`w-5 h-5 transition ${active ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
      }`}
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

// ===== MAIN COMPONENT =====
const CategoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ===== REDUX STATE =====
  const { products, loading } = useSelector((state) => state.adminProducts);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // ===== EFFECTS =====
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getWishlist());
  }, [dispatch]);

  // ===== HELPER FUNCTIONS =====
  const getProductId = (product) => product._id || product.id;

  const isInWishlist = (id) => {
    return wishlistItems.some((item) => {
      const itemId = item.coffee?._id || item.coffee?.id || item._id || item.id;
      return itemId === id;
    });
  };

  const findWishlistItem = (id) => {
    return wishlistItems.find((item) => {
      const itemId = item.coffee?._id || item.coffee?.id || item._id || item.id;
      return itemId === id;
    });
  };

  // ===== HANDLERS =====
  const handleWishlist = (product, e) => {
    e.stopPropagation();
    const id = getProductId(product);
    const existingItem = findWishlistItem(id);

    if (existingItem) {
      dispatch(removeFromWishlist(existingItem._id))
        .unwrap()
        .then(() => toast.info("Removed from Wishlist"))
        .catch(() => toast.error("Failed to remove from wishlist"));
    } else {
      dispatch(addToWishlist({ coffeeId: id }))
        .unwrap()
        .then(() => toast.success("Added to Wishlist"))
        .catch(() => toast.error("Failed to add to wishlist"));
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const id = getProductId(product);
    const amount = product.discountPrice || product.price;

    dispatch(
      addToCart({
        coffeeId: id,
        quantity: 1,
        amount: amount,
      })
    )
      .unwrap()
      .then(() => toast.success("Added to Cart"))
      .catch(() => toast.error("Failed to add to cart"));
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="h-[400px] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-[#e56a3b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ===== MAIN RENDER =====
  return (
    <section className="bg-white py-1 md:py-8 px-4">
      <div className="max-w-[102rem] mx-auto">
        {/* ===== TOP BADGE ===== */}
        <div className="flex justify-center mb-2">
          <span className="bg-[#FFE8DA] text-[#B57863] text-[11px] font-bold uppercase tracking-wider px-4 py-0.5 rounded-full">
            Handpicked Just For You
          </span>
        </div>

        {/* ===== HEADING ===== */}
        <div className="text-center mb-3 md:mb-10">
          <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
            Discover <span className="text-[#E86A33]">Delicious Dishes</span>
          </h2>
         
        </div>

        {/* ===== PRODUCTS SLIDER ===== */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop
          spaceBetween={22}
          breakpoints={{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
        >
          {products?.map((product) => {
            const id = getProductId(product);
            const hasDiscount = product.discountPrice && product.discountPrice < product.price;
            const discountPercent = product.discountPercentage ||
              Math.round(((product.price - product.discountPrice) / product.price) * 100);

            return (
              <SwiperSlide key={id}>
                <div
                  onClick={() => handleProductClick(id)}
                  className="
                    bg-[#FEFAF7]
                    rounded-2xl
                    overflow-hidden
                    border-2
                    border-[#E86A33]/20
                    shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                    hover:shadow-[0_20px_50px_rgba(232,106,51,0.25)]
                    hover:transition-all 
                    duration-500
                    cursor-pointer
                    group 
                  "
                >
                  {/* ===== IMAGE ===== */}
                  <div className="relative h-44 md:h-52 overflow-hidden rounded-t-2xl">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="
                        w-full
                        h-full
                        object-fill
                        duration-500
                        group-hover:scale-105
                        transition-transform
                        ease-in-out
                      "
                    />

                    {/* Discount Badge - Left Side */}
                    {hasDiscount && (
                      <div className="
                        absolute
                        top-3
                        left-3
                        bg-gradient-to-r 
                        from-[#E86A33] 
                        to-[#F59E6B]
                        text-white
                        text-sm
                        font-bold
                        px-2
                        py-1
                        rounded-lg
                        shadow-lg
                        z-20
                        flex
                        items-center
                        justify-center
                        transform
                        transition-transform
                        duration-300
                        hover:scale-105
                        border
                        border-white/20
                      ">
                        <span className="flex items-center gap-1">

                          {discountPercent}% OFF
                        </span>
                      </div>
                    )}

                    {/* Wishlist Button - Top Right */}
                    <button
                      onClick={(e) => handleWishlist(product, e)}
                      className="
                        absolute
                        top-3
                        right-3
                        w-9
                        h-9
                        rounded-full
                        bg-white/95
                        backdrop-blur-sm
                        shadow-lg
                        flex
                        items-center
                        justify-center
                        hover:bg-white
                        hover:scale-110
                        transition-all
                        duration-300
                        z-10
                        border
                        border-gray-100
                      "
                    >
                      <HeartIcon active={isInWishlist(id)} />
                    </button>

                    {/* Quick View Badge - Bottom */}
                    {hasDiscount && (
                      <div className="
                        absolute
                        bottom-3
                        left-3
                        bg-black/70
                        backdrop-blur-sm
                        text-white
                        text-[10px]
                        font-medium
                        px-2.5
                        py-1
                        rounded-md
                        z-20
                        flex
                        items-center
                        gap-1
                        border
                        border-white/10
                      ">
                        <span className="text-[#F59E6B]">★</span>
                        Limited Deal
                      </div>
                    )}
                  </div>

                  {/* ===== CONTENT ===== */}
                  <div className="p-3">
                    <h3 className="font-bold text-[16px] md:text-[18px] text-[#222] line-clamp-1 hover:text-[#E86A33] transition-colors -mt-2 md:mt-0">
                      {product.name}
                    </h3>

                    <p className="text-md text-gray-600 -mt-1 md:mt-2 line-clamp-1 md:line-clamp-2 min-h-[42px] leading-normal md:leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price Section with Trusted Colors */}
                    <div className="mt-2 md:mt-4 flex items-center gap-3 flex-wrap">
                      {hasDiscount ? (
                        <>
                          {/* Discounted Price - Trusted Orange */}
                          <span className="text-2xl font-bold text-[#E86A33]">
                            ₹{product.discountPrice}
                          </span>

                          {/* Original Price - Muted Gray with Strikethrough */}
                          <span className="text-lg text-gray-400 line-through font-medium">
                            ₹{product.price}
                          </span>

                          {/* Save Badge - Trusted Green */}
                          <span className="
                            text-xs 
                            font-bold 
                            text-emerald-600 
                            bg-emerald-50 
                            px-2.5 
                            py-0.5 
                            rounded-full
                            border
                            border-emerald-200/50
                            flex
                            items-center
                            gap-0.5
                          ">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Save ₹{product.price - product.discountPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-[#222]">
                          ₹{product.price}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="
                        w-full
                        mt-2
                        md:mt-4
                        bg-[#E86A33]
                        hover:bg-[#D55B25]
                        text-white
                        py-2
                        rounded-lg
                        font-semibold
                        transition-all
                        duration-300
                        shadow-md
                        hover:shadow-lg
                        hover:shadow-[#E86A33]/30
                        active:scale-95
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
};

export default CategoryPage;