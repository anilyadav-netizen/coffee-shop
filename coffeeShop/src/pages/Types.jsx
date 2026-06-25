import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../data/menuData";
import { getCategories } from "../redux/Slicer/categorySlice";
import { useDispatch, useSelector } from "react-redux";


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
        // Navigate to MenuPage with category ID
        navigate(`/menu/${category._id}`);
    };

    return (
        <section className="relative px-4 overflow-hidden">
            {/* ========== SAME GLASS EFFECT BACKGROUND ========== */}
            {/* <div className="absolute inset-0 -z-10"> */}
                {/* Main Gradient - Same as CategoryPage */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" /> */}

                {/* Secondary Warm Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" /> */}

                {/* Floating Glow 1 - Warm Gold */}
                {/* <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" /> */}

                {/* Floating Glow 2 - Coffee Brown */}
                {/* <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" /> */}

                {/* Decorative Beans - Same as CategoryPage */}
                {/* <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-10 left-10 text-5xl rotate-12 animate-float">🫘</div>
                    <div className="absolute bottom-10 right-10 text-5xl -rotate-12 animate-float-delay">☕</div>
                </div> */}
            {/* </div> */}

            {/* ========== CONTENT WITH GLASS EFFECT ========== */}
            <div className="container mx-auto px-1 items-center justify-between text-center relative">
                {/* Header - Glass Effect Same as CategoryPage */}
                <div className="backdrop-blur-md rounded-2xl p-6 ">
                    <h2 className="text-3xl font-bold text-white">
                        Categories
                    </h2>
                    <p className="text-gray-300 text-sm mt-1">
                        Explore our delicious coffee categories
                    </p>
                </div>

                {/* Categories Grid - Glass Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            onClick={() => handleCategoryClick(category)}
                            className="backdrop-blur-md bg-white/40 border border-white/30 rounded-2xl px-5 py-2.5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-1 md:gap-5 cursor-pointer hover:scale-[1.02] active:scale-95"
                        >
                            <img
                                src={category.icon}
                                alt={category.name}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />

                            <h3 className="font-semibold text-white dark:text-white text-lg">
                                {category.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========== SAME CSS ANIMATIONS ========== */}
            <style
            >{`
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
            `}</style>
        </section>
    );
};

export default Types;