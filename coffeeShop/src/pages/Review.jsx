import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Coffee } from 'lucide-react';
import { getRecentReviews } from '../data/reviewData';

const Review = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cardsPerView, setCardsPerView] = useState(3);

    useEffect(() => {
        // Load reviews
        const loadReviews = () => {
            const data = getRecentReviews(12);
            setReviews(data);
            setIsLoading(false);
        };
        loadReviews();
    }, []);

    // Handle responsive cards per view
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setCardsPerView(1);
            } else if (window.innerWidth < 768) {
                setCardsPerView(2);
            } else if (window.innerWidth < 1024) {
                setCardsPerView(3);
            } else {
                setCardsPerView(4);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-slide
    useEffect(() => {
        if (reviews.length === 0) return;

        const totalSlides = Math.ceil(reviews.length / cardsPerView);
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalSlides);
        }, 4000);

        return () => clearInterval(interval);
    }, [reviews.length, cardsPerView]);

    const totalSlides = Math.ceil(reviews.length / cardsPerView);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={14}
                className={`${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    } transition-colors`}
            />
        ));
    };

    // Get visible reviews for current slide
    const getVisibleReviews = () => {
        const start = currentIndex * cardsPerView;
        const end = start + cardsPerView;
        return reviews.slice(start, end);
    };

    if (isLoading) {
        return (
            <section className="relative py-12 px-4 overflow-hidden">
                {/* Glass Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                </div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-12 shadow-2xl shadow-black/5">
                        <div className="w-12 h-12 border-4 border-[#0D7C53] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading reviews...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (reviews.length === 0) {
        return (
            <section className="relative py-12 px-4 overflow-hidden">
                {/* Glass Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                </div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-12 shadow-2xl shadow-black/5">
                        <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700">No Reviews Yet</h3>
                        <p className="text-gray-500 mt-2">Be the first to share your experience!</p>
                    </div>
                </div>
            </section>
        );
    }

    const visibleReviews = getVisibleReviews();

    return (
        <section className="relative px-4 py-6 overflow-hidden">
            {/* ========== GLASS EFFECT BACKGROUND ========== */}
            <div className="absolute inset-0 -z-10">
                {/* Main Gradient - Same as CategoryPage */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                
                {/* Secondary Warm Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />

                {/* Floating Glow 1 - Warm Gold */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" />

                {/* Floating Glow 2 - Coffee Brown */}
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" />

                {/* Floating Glow 3 - Green accent */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse-slow" />

                {/* Decorative Beans */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-20 left-10 text-6xl rotate-12 animate-float">🫘</div>
                    <div className="absolute bottom-32 right-20 text-6xl -rotate-12 animate-float-delay">🫘</div>
                    <div className="absolute top-1/3 right-1/4 text-4xl rotate-45 animate-float-slow">☕</div>
                    <div className="absolute bottom-1/4 left-1/3 text-5xl -rotate-45 animate-float-delay">🫘</div>
                </div>
            </div>

            {/* ========== CONTENT ========== */}
            <div className="max-w-[104rem] mx-auto relative z-10">
                {/* Header - Glass Effect */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-[#0D7C53]/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3 border border-white/20">
                        <span className="text-[#0D7C53] text-sm font-semibold tracking-wider">TESTIMONIALS</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        What Our <span className="text-[#0D7C53]">Coffee Lovers</span> Say
                    </h2>
                    <div className="w-16 h-1 bg-[#0D7C53] mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Reviews Carousel */}
                <div className="relative mb-10">
                    {/* Navigation Buttons - Glass Effect */}
                    <button
                        onClick={goToPrevious}
                        className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 p-2 backdrop-blur-xl bg-white/40 border border-white/30 rounded-full shadow-xl shadow-black/5 hover:bg-[#0D7C53] hover:text-white hover:border-[#0D7C53] transition-all duration-300 hover:scale-105"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 p-2 backdrop-blur-xl bg-white/40 border border-white/30 rounded-full shadow-xl shadow-black/5 hover:bg-[#0D7C53] hover:text-white hover:border-[#0D7C53] transition-all duration-300 hover:scale-105"
                        aria-label="Next"
                    >
                        <ChevronRight size={22} />
                    </button>

                    {/* Cards Grid */}
                    <div className="overflow-hidden px-2 pb-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                            {visibleReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-5 shadow-sm shadow-black/5 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Top Section: Image + Name + Location */}
                                    <div className="flex items-center gap-3 mb-3">
                                        {/* Image - Small Circle with Glass Effect */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={review.avatar}
                                                alt={review.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-[#0D7C53] shadow-md"
                                            />
                                        </div>

                                        {/* Name and Location */}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-lg text-gray-800 truncate">
                                                {review.name}
                                            </h3>
                                            <p className="text-base text-gray-600 truncate flex items-center gap-1">
                                                {review.location}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2">
                                        {renderStars(review.rating)}
                                        <span className="text-sm font-semibold text-gray-600 ml-1">
                                            {review.rating}.0
                                        </span>
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-gray-600 leading-relaxed text-base line-clamp-3">
                                        "{review.review}"
                                    </p>

                                    {/* Date */}
                                    <div className="mt-3 text-sm text-gray-500">
                                        {new Date(review.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dots Indicator - Glass Effect */}
                <div className="flex justify-center gap-2">
                    {[...Array(totalSlides)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? 'w-8 bg-[#0D7C53]'
                                    : 'w-2 bg-gray-300/60 backdrop-blur-sm hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Slide Counter */}
                <div className="text-center mt-3 text-sm text-gray-400">
                    {currentIndex + 1} / {totalSlides}
                </div>
            </div>

            {/* ========== CSS ANIMATIONS ========== */}
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
        </section>
    );
};

export default Review;