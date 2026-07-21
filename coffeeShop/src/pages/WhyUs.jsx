import React from 'react';
import {
    Coffee,
    Award,
    Clock,
    Heart,
    Sparkles,
    Users,
    Truck,
} from 'lucide-react';

const WhyUs = () => {
    const features = [
        {
            id: 1,
            icon: Coffee,
            title: "Premium Quality Beans",
            description: "Sourced from the finest coffee estates for the richest flavor.",
            bgColor: "bg-amber-500/10",
            iconColor: "text-amber-500"
        },
        {
            id: 2,
            icon: Award,
            title: "Award Winning Taste",
            description: "Recognized for excellence in coffee brewing and customer satisfaction.",
            bgColor: "bg-yellow-500/10",
            iconColor: "text-yellow-500"
        },
        {
            id: 3,
            icon: Clock,
            title: "Fresh Every Day",
            description: "Brewed fresh daily with carefully selected ingredients.",
            bgColor: "bg-emerald-500/10",
            iconColor: "text-emerald-500"
        },
        {
            id: 4,
            icon: Heart,
            title: "Made with Love",
            description: "Every cup is crafted with passion and dedication to coffee artistry.",
            bgColor: "bg-rose-500/10",
            iconColor: "text-rose-500"
        },
        {
            id: 5,
            icon: Truck,
            title: "Fast Delivery",
            description: "Quick and reliable delivery to your doorstep with care and precision.",
            bgColor: "bg-blue-500/10",
            iconColor: "text-blue-500"
        },
        {
            id: 6,
            icon: Users,
            title: "1000+ Happy Customers",
            description: "Thank you to our loyal customers for your trust and support.",
            bgColor: "bg-purple-500/10",
            iconColor: "text-purple-500"
        }
    ];

    const stats = [
        { value: "50+", label: "Coffee Varieties" },
        { value: "1000+", label: "Happy Customers" },
        { value: "99%", label: "Satisfaction Rate" },
        { value: "24/7", label: "Support Available" }
    ];

    return (
        <section className="relative py-2 md:py-4 px-4 overflow-hidden bg-gradient-to-br from-[#FFF8F2] to-white">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E85D3A]/5 via-transparent to-[#F0744F]/5" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#E85D3A]/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E85D3A]/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-[104rem] mx-auto relative z-10">
                {/* ===== HEADER - Exactly as image ===== */}
                <div className="text-center mb-3 md:mb-6">
                    <div className="inline-flex items-center gap-2 bg-[#FFF0EA] rounded-full px-4 py-1.5 border border-[#FEE7DD] mb-0.5 md:mb-4">
                        <span className="text-[#E85D3A] text-xs font-bold uppercase tracking-wider px-3">
                            WHY CHOOSE US
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-1 md:mb-3">
                        Why Coffee Lovers <span className="text-[#E85D3A]">Choose Us</span>
                    </h2>

                    <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">
                        Experience the perfect blend of quality, taste &amp; passion in every cup
                    </p>

                    <div className="w-16 h-1 bg-[#E85D3A] rounded-full mx-auto mt-2 md:mt-4" />
                </div>

                {/* ===== FEATURES GRID - Exactly as image ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 mb-3 md:mb-6">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="group bg-white border  rounded-2xl p-2 md:p-6 border-[#E85D3A]/30 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#E85D3A]/10"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-0.5">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== STATS SECTION */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2 md:mb-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white border  rounded-2xl p-2 md:p-6 text-center border-[#E85D3A]/30 transition-all duration-300 hover:-translate-y-1 shadow-md shadow-[#E85D3A]/10"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-[#E85D3A]">
                                {stat.value}
                            </div>
                            <div className="text-gray-600 text-sm mt-1 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                
                @keyframes pulse-slow-delay {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.15); opacity: 0.7; }
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                
                .animate-pulse-slow-delay {
                    animation: pulse-slow-delay 10s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default WhyUs;