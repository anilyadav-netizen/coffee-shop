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
    className={`w-5 h-5 transition ${
      active ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
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

  const handleViewAllMenu = () => {
    navigate("/menu");
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
    <section className="bg-white py-8 px-4">
      <div className="max-w-8xl mx-auto">
        {/* ===== TOP BADGE ===== */}
        <div className="flex justify-center mb-3">
          <span className="bg-[#FFE8DA] text-[#E86A33] text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full">
            Handpicked Just For You
          </span>
        </div>

        {/* ===== HEADING ===== */}
        <div className="text-center mb-10">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            Discover <span className="text-[#E86A33]">Delicious Dishes</span>
          </h2>
          <p className="text-gray-500 mt-2">
            Freshly prepared happiness on every plate
          </p>
        </div>

        {/* ===== PRODUCTS SLIDER ===== */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop
          spaceBetween={22}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
        >
          {products.map((product) => {
            const id = getProductId(product);

            return (
              <SwiperSlide key={id}>
                <div
                  onClick={() => handleProductClick(id)}
                  className="
                    bg-[#FFF8F2]
                    rounded-2xl
                    overflow-hidden
                    border
                    border-[#EFE7E1]
                    shadow-sm
                    hover:shadow-xl
                    duration-300
                    cursor-pointer
                    group
                  "
                >
                  {/* ===== IMAGE ===== */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="
                        w-full
                        h-full
                        object-cover
                        duration-500
                        group-hover:scale-105
                      "
                    />

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleWishlist(product, e)}
                      className="
                        absolute
                        top-3
                        right-3
                        w-9
                        h-9
                        rounded-full
                        bg-white
                        shadow-md
                        flex
                        items-center
                        justify-center
                        hover:bg-gray-50
                        transition
                      "
                    >
                      <HeartIcon active={isInWishlist(id)} />
                    </button>
                  </div>

                  {/* ===== CONTENT ===== */}
                  <div className="p-4">
                    <h3 className="font-bold text-[18px] text-[#222] line-clamp-1 hover:text-[#D55B25] ">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[42px]">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="mt-4">
                      <span className="text-2xl font-bold text-[#222]">
                        ₹{product.discountPrice || product.price}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="
                        w-full
                        mt-4
                        bg-[#E86A33]
                        hover:bg-[#D55B25]
                        text-white
                        py-3
                        rounded-lg
                        font-semibold
                        transition
                        duration-300
                      "
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* ===== VIEW ALL MENU BUTTON ===== */}
        {/* <div className="flex justify-center mt-6">
          <button
            onClick={handleViewAllMenu}
            className="
              group
              border
              border-[#E86A33]
              text-[#E86A33]
              hover:bg-[#E86A33]
              hover:text-white
              px-8
              py-3
              rounded-full
              font-semibold
              transition-all
              duration-300
              flex
              items-center
              gap-3
            "
          >
            View All Menu
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default CategoryPage;