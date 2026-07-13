import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../redux/Slicer/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Types = () => {

    const dispatch = useDispatch()
    const { categories } = useSelector(
        (state) => state.category
    )

    useEffect(() => {
        dispatch(getCategories())
    }, [dispatch])

    const navigate = useNavigate();
    const handleCategoryClick = (category) => {
        console.log("Selected:", category.name);
        navigate(`/menu/${category._id}`);
    };

    return (
        <section className="relative px-2 overflow-hidden">
            {/* ========== CONTENT ========== */}
            <div className="container mx-auto relative">
                {/* Header - Updated with Food Colors */}
                <div className="rounded-2xl p-6 text-center mb-3">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] tracking-tight mb-2 flex items-center justify-center gap-3">
                        Categories
                        <span className="text-3xl">🍔</span>
                    </h2>
                    <p className="text-[#6B7280] text-sm mt-1 max-w-2xl mx-auto">
                        Explore our delicious fast-food categories
                    </p>
                </div>

                {/* Swiper Slider */}
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    breakpoints={{
                        320: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 4,
                            spaceBetween: 15,
                        },
                        768: {
                            slidesPerView: 5,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 7,
                            spaceBetween: 25,
                        },
                        1280: {
                            slidesPerView: 9,
                            spaceBetween: 30,
                        },
                    }}
                    className="mySwiper bg-gradient-to-br from-[#FFF8F5] to-white rounded-3xl p-8 md:p-12 shadow-lg border border-[#FEE7DD]"
                >
                    {categories.map((category) => (
                        <SwiperSlide key={category._id}>
                            <div
                                onClick={() => handleCategoryClick(category)}
                                className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 mt-3 group"
                            >
                                {/* Image - Circle with Food Colors */}
                                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-[108px] lg:h-[108px] rounded-full overflow-hidden border-4 border-[#E85D3A]/20 shadow-md hover:shadow-xl hover:border-[#E85D3A]/60 transition-all duration-300 group-hover:shadow-[#E85D3A]/20">
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Text - Updated with Food Colors */}
                                <h3 className="mt-2 text-[#1F2937] font-semibold text-base md:text-lg lg:text-[18px] text-center mb-3 group-hover:text-[#E85D3A] transition-colors duration-300">
                                    {category.name}
                                </h3>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Optional: Add custom styles for Swiper navigation buttons */}
            <style jsx>{`
                .mySwiper .swiper-button-next,
                .mySwiper .swiper-button-prev {
                    color: #E85D3A;
                    background: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    box-shadow: 0 2px 10px rgba(232, 93, 58, 0.2);
                    transition: all 0.3s ease;
                }
                .mySwiper .swiper-button-next:hover,
                .mySwiper .swiper-button-prev:hover {
                    background: #E85D3A;
                    color: white;
                    box-shadow: 0 4px 15px rgba(232, 93, 58, 0.4);
                    transform: scale(1.05);
                }
                .mySwiper .swiper-button-next:after,
                .mySwiper .swiper-button-prev:after {
                    font-size: 16px;
                    font-weight: bold;
                }
                .mySwiper .swiper-pagination-bullet {
                    background: #E85D3A;
                    opacity: 0.3;
                }
                .mySwiper .swiper-pagination-bullet-active {
                    background: #E85D3A;
                    opacity: 1;
                }
            `}</style>
        </section>
    );
};

export default Types;