import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getRecentReviews } from '../data/reviewData';

const Review = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cardsPerView, setCardsPerView] = useState(3);

    useEffect(() => {
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
                size={16}
                className={`${i < rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-gray-300'
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
            <div className="py-8 text-center bg-white">
                <div className="w-12 h-12 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading reviews...</p>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="py-12 text-center bg-white">
                <p className="text-gray-500">No reviews yet</p>
            </div>
        );
    }

    const visibleReviews = getVisibleReviews();

    return (
        <section className="py-8 px-4 bg-white">
            <div className="max-w-[95em] mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-[#1F2937]">
                        What Our <span className="text-[#DC8D64]">Food Lovers</span> Say
                    </h2>
                </div>

                {/* Reviews Carousel */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={goToPrevious}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#E86A33] rounded-full shadow-md hover:bg-[#d45a2a] focus:bg-[#d45a2a] active:bg-[#c04e24] transition-all duration-300 hover:shadow-lg focus:outline-none"
                        aria-label="Previous"
                        style={{ border: 'none' }}
                    >
                        <ChevronLeft size={20} className="text-white" />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#E86A33] rounded-full shadow-md hover:bg-[#d45a2a] focus:bg-[#d45a2a] active:bg-[#c04e24] transition-all duration-300 hover:shadow-lg focus:outline-none"
                        aria-label="Next"
                        style={{ border: 'none' }}
                    >
                        <ChevronRight size={20} className="text-white" />
                    </button>

                    {/* Cards Grid */}
                    <div className="overflow-hidden px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {visibleReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-[#FEF5EC] rounded-2xl p-3 border border-[#F5E6D8] hover:border-[#E8D5C4] transition-all duration-300 hover:shadow-lg"
                                >
                                    {/* Header: Avatar + Name + Location */}
                                    <div className="flex items-center gap-3 mb-3">
                                        {/* Small Avatar Circle */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={review.avatar}
                                                alt={review.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-[#D97706]"
                                            />
                                        </div>

                                        {/* Name and Location */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-[#3A2A20] text-lg truncate">
                                                {review.name}
                                            </h3>
                                            <p className="text-sm text-[#9B8A7A] truncate">
                                                {review.location}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating Stars */}
                                    <div className="flex items-center gap-1 mb-2">
                                        {renderStars(review.rating)}
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-[#6D5A4C] line-clamp-3 leading-relaxed">
                                        {review.review}
                                    </p>

                                    {/* Date */}
                                    <div className="mt-3 text-xs text-[#A89888]">
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

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                    {[...Array(totalSlides)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'w-8 bg-[#D97706]'
                                : 'w-2 bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Review;