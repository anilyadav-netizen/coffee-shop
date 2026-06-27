import React from 'react';
import {
    Coffee,
    Award,
    Clock,
    Heart,
    Leaf,
    Sparkles,
    Zap,
    Users,
    Shield,
    Star,
    TrendingUp,
    Truck,
    ThumbsUp
} from 'lucide-react';

const WhyUs = () => {
    const features = [
        {
            id: 1,
            icon: Coffee,
            title: "Premium Quality Beans",
            description: "Sourced from the finest coffee estates, roasted to perfection for rich flavor",
            color: "from-amber-500 to-orange-500",
            bgColor: "bg-amber-500/10",
            iconColor: "text-amber-500"
        },
        {
            id: 2,
            icon: Award,
            title: "Award Winning Taste",
            description: "Recognized for excellence in coffee brewing and customer satisfaction",
            color: "from-yellow-400 to-yellow-600",
            bgColor: "bg-yellow-500/10",
            iconColor: "text-yellow-500"
        },
        {
            id: 3,
            icon: Clock,
            title: "Fresh Every Day",
            description: "Brewed fresh daily with carefully selected ingredients for perfect taste",
            color: "from-emerald-400 to-emerald-600",
            bgColor: "bg-emerald-500/10",
            iconColor: "text-emerald-500"
        },
        {
            id: 4,
            icon: Heart,
            title: "Made with Love",
            description: "Every cup is crafted with passion and dedication to coffee artistry",
            color: "from-rose-400 to-rose-600",
            bgColor: "bg-rose-500/10",
            iconColor: "text-rose-500"
        },
        {
            id: 5,
            icon: Truck,
            title: "Fast Delivery",
            description: "Quick and reliable delivery to your doorstep with care and precision",
            color: "from-blue-400 to-blue-600",
            bgColor: "bg-blue-500/10",
            iconColor: "text-blue-500"
        },
        {
            id: 6,
            icon: Users,
            title: "1000+ Happy Customers",
            description: "Trusted by coffee lovers who appreciate quality and consistency",
            color: "from-purple-400 to-purple-600",
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
        <section className="relative py-4 px-4 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0D7C53]/5 via-transparent to-[#169466]/5" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#0D7C53]/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-[104rem] mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-5">
                    <div className="inline-flex items-center gap-2 bg-[#0D7C53]/10 backdrop-blur-sm rounded-full px-1 py-1 border border-white/20 mb-4">
                        <span className="px-6 py-2 bg-gradient-to-r from-[#0D7C53] to-[#169466] text-white text-xs font-semibold rounded-full tracking-wider">
                            WHY CHOOSE US
                        </span>
                        <span className="px-4 text-[#0D7C53] text-xs font-medium">
                            ✦ PREMIUM COFFEE
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                        Why Coffee Lovers
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0D7C53] to-[#169466]">
                            Choose Us
                        </span>
                    </h2>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                        Experience the perfect blend of quality, taste, and passion in every cup
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#0D7C53] to-[#169466] rounded-full mx-auto mt-2" />
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 backdrop-blur-xl rounded-2xl p-6">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#0D7C53]/10 relative overflow-hidden"
                        >
                            {/* Glow Effect */}
                            <div className={`absolute -right-20 -top-20 w-40 h-40 ${feature.bgColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#169466] transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-white/70 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-3 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 group"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0D7C53] to-[#169466] group-hover:scale-110 transition-transform duration-300">
                                {stat.value}
                            </div>
                            <div className="text-white/60 text-sm mt-1 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-3 backdrop-blur-xl bg-gradient-to-r from-[#0D7C53]/20 to-[#169466]/20 border border-white/20 rounded-full px-6 py-3">
                        <Sparkles className="w-5 h-5 text-[#169466]" />
                        <span className="text-white/80 text-sm font-medium">
                            Join thousands of happy coffee lovers
                        </span>
                        <button className="px-6 py-2 bg-gradient-to-r from-[#0D7C53] to-[#169466] text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-[#0D7C53]/30 transition-all duration-300 hover:scale-105">
                            Get Started
                        </button>
                    </div>
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