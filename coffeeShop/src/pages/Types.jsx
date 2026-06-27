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
    console.log(categories)

    const navigate = useNavigate();
    const handleCategoryClick = (category) => {
        console.log("Selected:", category.name);
        navigate(`/menu/${category._id}`);
    };

    return (
        <section className="relative px-2 overflow-hidden">
            {/* ========== CONTENT ========== */}
            <div className="container mx-auto relative">
                {/* Header */}
                <div className=" rounded-2xl p-6 text-center mb-3">
                    <h2 className="text-4xl font-bold text-white">
                        Categories
                    </h2>
                    <p className="text-gray-300 text-sm mt-1">
                        Explore our delicious coffee categories
                    </p>
                </div>

                {/* Swiper Slider */}
                <Swiper
                    modules={[Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
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
                    className="mySwiper"
                >
                    {categories.map((category) => (
                        <SwiperSlide key={category._id}>
                            <div
                                onClick={() => handleCategoryClick(category)}
                                className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
                            >
                                {/* Image - Circle */}
                                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-[108px] lg:h-[108px] rounded-full overflow-hidden border-4 border-white/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Text - Niche (Alag se) */}
                                <h3 className="mt-2 text-white font-semibold text-base md:text-lg lg:text-[18px] text-center">
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