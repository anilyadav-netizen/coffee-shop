import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../redux/Slicer/categorySlice";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const Types = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { categories } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    const handleCategoryClick = (category) => {
        navigate(`/menu/${category._id}`);
    };

    return (
        <section className="relative bg-[#f0e9e4] py-8 overflow-hidden">


            {/* Decorative Images */}
            <img
                src="/images/leaf.png"
                alt=""
                className="absolute top-0 left-0 w-28 opacity-90"
            />
            <img
                src="/images/beans.png"
                alt=""
                className="absolute top-4 right-5 w-24"
            />

            <div className="max-w-7xl mx-auto px-5">

                {/* Heading */}
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-bold font-serif text-[#222]">
                        Categories
                    </h2>
                    <p className="text-gray-500 mt-2 text-lg">
                        Explore our wide selection of flavors
                    </p>
                    <div className="w-14 h-[3px] bg-[#d97745] mx-auto rounded-full mt-4"></div>
                </div>

                {/* Categories Swiper - Same gap as grid */}
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    spaceBetween={16} // Same as grid gap-4
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                            spaceBetween: 16,
                        },
                        480: {
                            slidesPerView: 2,
                            spaceBetween: 16,
                        },
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 16,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 16,
                        },
                        1024: {
                            slidesPerView: 5,
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
                    {categories.map((category) => (
                        <SwiperSlide key={category._id}>
                            <div
                                onClick={() => handleCategoryClick(category)}
                                className="
                                    bg-white
                                    rounded-2xl
                                    shadow-md
                                    hover:shadow-xl
                                    hover:shadow-[#E85D3A]/25
                                    transition-all
                                    duration-300
                                    cursor-pointer
                                    py-3
                                    lg:px-3
                                    sm:px-1
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    hover:-translate-y-1
                                    group
                                "
                            >
                                {/* Image Container */}
                                <div
                                    className="
                                        w-24
                                        h-24
                                        rounded-full
                                        bg-[#FFF4EC]
                                        flex
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        relative
                                        transition-all
                                        duration-300
                                    "
                                >
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E85D3A]/10 to-transparent pointer-events-none"></div>
                                    
                                    {/* Image */}
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="
                                            w-full
                                            h-full
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

                                    {/* Shine effect on hover */}
                                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-full transform rotate-45"></div>
                                    </div>
                                </div>

                                <h3 className="mt-3 text-[16px] font-bold text-gray-800 group-hover:text-[#E85D3A] transition-colors duration-300 text-center">
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