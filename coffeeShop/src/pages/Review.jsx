import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Coffee, Flame } from 'lucide-react';
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
                className={`${i < rating ? 'fill-[#FBBF24] text-[#FBBF24]' : 'text-[#E5E7EB]'
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
            <section className="relative py-12 px-4 overflow-hidden ">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="bg-white rounded-3xl p-12 shadow-lg shadow-[#E85D3A]/5 border border-[#FEE7DD]">
                        <div className="w-12 h-12 border-4 border-[#E85D3A] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-[#6B7280]">Loading reviews...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (reviews.length === 0) {
        return (
            <section className="relative py-12 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="bg-white rounded-3xl p-12 shadow-lg shadow-[#E85D3A]/5 border border-[#FEE7DD]">
                        <Coffee className="w-16 h-16 text-[#E5E7EB] mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-[#1F2937]">No Reviews Yet</h3>
                        <p className="text-[#6B7280] mt-2">Be the first to share your experience!</p>
                    </div>
                </div>
            </section>
        );
    }

    const visibleReviews = getVisibleReviews();

    return (
        <section className="relative px-4 py-6 overflow-hidden">
            {/* ========== BACKGROUND EFFECTS - Updated with Food Colors ========== */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#E85D3A]/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#F0744F]/5 rounded-full blur-[100px] animate-pulse-slow-delay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E85D3A]/3 rounded-full blur-[150px]" />
            </div>

            {/* ========== CONTENT ========== */}
            <div className="max-w-[104rem] mx-auto relative z-10">
                {/* Header - Updated with Food Colors */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 rounded-full mb-3">
                        <span className="flex items-center gap-2 px-6 py-2.5 bg-[#FFF0EA] text-[#E85D3A] rounded-full font-semibold border border-[#FEE7DD]">
                            <Flame size={16} />
                            TESTIMONIALS
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937]">
                        What Our <span className="text-[#E85D3A]">Food Lovers</span> Say
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] mx-auto mt-2 rounded-full"></div>
                </div>

                {/* Reviews Carousel */}
                <div className="relative mb-10">
                    {/* Navigation Buttons - Updated with Food Colors */}
                    <button
                        onClick={goToPrevious}
                        className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-[#FEE7DD] rounded-full shadow-lg shadow-[#E85D3A]/10 hover:bg-[#E85D3A] hover:text-white hover:border-[#E85D3A] transition-all duration-300 hover:scale-105"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-[#FEE7DD] rounded-full shadow-lg shadow-[#E85D3A]/10 hover:bg-[#E85D3A] hover:text-white hover:border-[#E85D3A] transition-all duration-300 hover:scale-105"
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
                                    className="bg-white border border-[#F3F4F6] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-[#E85D3A]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#FEE7DD]"
                                >
                                    {/* Top Section: Image + Name + Location */}
                                    <div className="flex items-center gap-3 mb-3">
                                        {/* Image - Small Circle with Food Colors */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={review.avatar}
                                                alt={review.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-[#E85D3A] shadow-md"
                                            />
                                        </div>

                                        {/* Name and Location */}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-lg text-[#1F2937] truncate group-hover:text-[#E85D3A] transition-colors duration-300">
                                                {review.name}
                                            </h3>
                                            <p className="text-base text-[#6B7280] truncate flex items-center gap-1">
                                                {review.location}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2">
                                        {renderStars(review.rating)}
                                        <span className="text-sm font-semibold text-[#1F2937] ml-1">
                                            {review.rating}.0
                                        </span>
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-[#6B7280] leading-relaxed text-base line-clamp-3">
                                        "{review.review}"
                                    </p>

                                    {/* Date */}
                                    <div className="mt-3 text-sm text-[#6B7280]">
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

                {/* Dots Indicator - Updated with Food Colors */}
                <div className="flex justify-center gap-2">
                    {[...Array(totalSlides)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'w-8 bg-gradient-to-r from-[#E85D3A] to-[#F0744F]'
                                : 'w-2 bg-[#E5E7EB] hover:bg-[#E85D3A]/30'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Slide Counter - Updated */}
                <div className="text-center mt-1 text-sm text-[#6B7280]">
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