import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../redux/Slicer/categorySlice";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";  // <-- import Autoplay
import "swiper/css";

const Types = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories } = useSelector(
        (state) => state.category
    );


    useEffect(() => {

        if (categories.length === 0) {
            dispatch(getCategories());
        }

    }, [dispatch, categories.length]);

    const handleCategoryClick = (category) => {
        navigate(`/menu/${category._id}`);
    };

    return (
        <section className="bg-white py-1.5 md:py-8 overflow-hidden">
            <div className="max-w-[100rem] mx-auto px-3 sm:px-5">

                {/* Heading – Desktop center, Mobile as per Zomato */}
                <div className="flex items-center justify-between mb-3 md:mb-6">
                    <div className="w-full md:text-center">   {/* Full width + center text on desktop */}
                        {/* Mobile heading */}
                        <h2 className="text-xl text-center font-bold text-gray-800 md:hidden">
                            What's on your <span className="text-[#E86A33]"> mind?</span>
                        </h2>
                        {/* Desktop heading – center */}
                        <h2 className="hidden md:block text-3xl md:text-5xl font-bold font-serif text-black">
                            Categories
                        </h2>
                        <p className="hidden md:block text-gray-500 mt-1 text-lg">
                            Explore our wide selection of flavors
                        </p>
                        <div className="hidden md:block w-14 h-[3px] bg-[#d97745] mx-auto rounded-full mt-2 md:mt-4"></div>
                    </div>
                    {/* Mobile "See all" – removed as requested */}
                </div>

                {/* Categories Swiper with Autoplay */}
                <Swiper
                    modules={[Autoplay]}   // enable autoplay
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,  // continues after user interaction
                    }}
                    loop={true}              // infinite loop for autoplay
                    spaceBetween={12}
                    breakpoints={{
                        // Mobile – Zomato style
                        0: {
                            slidesPerView: 4,
                            spaceBetween: 8,
                        },
                        480: {
                            slidesPerView: 4.5,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 5,
                            spaceBetween: 12,
                        },
                        // Desktop – old design
                        768: {
                            slidesPerView: 5,
                            spaceBetween: 16,
                        },
                        1024: {
                            slidesPerView: 6,
                            spaceBetween: 16,
                        },
                        1280: {
                            slidesPerView: 7,
                            spaceBetween: 16,
                        },
                        1536: {
                            slidesPerView: 9,
                            spaceBetween: 16,
                        },
                    }}
                    className="pb-2"
                >
                    {categories?.map((category) => (
                        <SwiperSlide key={category._id}>
                            <div
                                onClick={() => handleCategoryClick(category)}
                                className="
                                    bg-white
                                    rounded-xl
                                    transition-all
                                    duration-200
                                    cursor-pointer
                                    py-2
                                    px-1
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    group
                                    border border-gray-200        
                                    hover:border-[#E85D3A]/40    
                                    md:shadow-md
                                    md:shadow-[#dbcec6]
                                    md:hover:shadow-[#E85D3A]/25
                                    md:border-[#E86A33]/30
                                    md:hover:border-[#E86A33]/50
                                "
                            >
                                <div
                                    className="
                                        w-14 h-14
                                        sm:w-16 sm:h-16
                                        md:w-24 md:h-24
                                        rounded-full
                                        bg-[#FFF4EC]
                                        flex
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        relative
                                        transition-all
                                        duration-300
                                        md:group-hover:scale-105
                                    "
                                >
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E85D3A]/10 to-transparent pointer-events-none hidden md:block"></div>

                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="
                                            w-full h-full
                                            object-cover
                                            group-hover:scale-110
                                            transition-transform
                                            duration-500
                                            ease-out
                                        "
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/96/FFE8D6/d97745?text=?";
                                        }}
                                    />
                                </div>

                                <h3 className="
                                    mt-1
                                    text-[11px] sm:text-[13px] md:text-[16px]
                                    font-semibold
                                    text-gray-700
                                    md:group-hover:text-[#E85D3A]
                                    transition-colors
                                    duration-300
                                    text-center
                                    truncate w-full
                                    max-w-[80px] md:max-w-none
                                ">
                                    {category.name}
                                </h3>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Types;