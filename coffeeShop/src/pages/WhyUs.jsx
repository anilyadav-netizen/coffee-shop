import React, { useState } from 'react';
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
    ThumbsUp,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const WhyUs = () => {
    const [activeTab, setActiveTab] = useState('whyus'); // 'whyus' or 'premium'
    const [activeFeature, setActiveFeature] = useState(null);

    // ===== WHY CHOOSE US DATA =====
    const whyUsFeatures = [
        {
            id: 1,
            icon: Coffee,
            title: "Premium Quality Beans",
            description: "Sourced from the finest coffee estates, roasted to perfection for rich flavor",
            color: "from-amber-500 to-orange-500",
            bgColor: "bg-amber-500/10",
            iconColor: "text-amber-500",
            detailedDescription: "We source our beans directly from family-owned farms in Ethiopia, Colombia, and Brazil. Each batch is carefully selected, hand-roasted in small quantities, and tested for quality assurance.",
            benefits: [
                "100% Arabica beans",
                "Single-origin sourcing",
                "Small-batch roasting",
                "Farm-to-cup traceability"
            ],
            stats: {
                "Countries": "12+",
                "Roast Levels": "5",
                "Quality Score": "92/100"
            }
        },
        {
            id: 2,
            icon: Award,
            title: "Award Winning Taste",
            description: "Recognized for excellence in coffee brewing and customer satisfaction",
            color: "from-yellow-400 to-yellow-600",
            bgColor: "bg-yellow-500/10",
            iconColor: "text-yellow-500",
            detailedDescription: "Our coffee has been recognized at international competitions for its exceptional flavor profile. We've won 15+ awards for our unique roasting techniques and commitment to quality.",
            benefits: [
                "Gold Medal Winner 2023",
                "Best Roaster Award",
                "Customer Choice Award",
                "International Recognition"
            ],
            stats: {
                "Awards": "15+",
                "Competitions": "8",
                "Rating": "4.9/5"
            }
        },
        {
            id: 3,
            icon: Clock,
            title: "Fresh Every Day",
            description: "Brewed fresh daily with carefully selected ingredients for perfect taste",
            color: "from-emerald-400 to-emerald-600",
            bgColor: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
            detailedDescription: "We roast and brew our coffee fresh every morning. Our beans are never stored for more than 48 hours post-roasting, ensuring you get the freshest cup possible.",
            benefits: [
                "Daily fresh roast",
                "48-hour freshness guarantee",
                "Peak flavor profile",
                "Morning brewed"
            ],
            stats: {
                "Freshness": "24/7",
                "Batch Size": "10kg",
                "Roast Time": "Morning"
            }
        },
        {
            id: 4,
            icon: Heart,
            title: "Made with Love",
            description: "Every cup is crafted with passion and dedication to coffee artistry",
            color: "from-rose-400 to-rose-600",
            bgColor: "bg-rose-500/10",
            iconColor: "text-rose-500",
            detailedDescription: "Our baristas are trained artists who pour their heart into every cup. From latte art to precise brewing temperatures, we ensure every detail is perfect.",
            benefits: [
                "Expert baristas",
                "Hand-crafted brewing",
                "Artistic presentation",
                "Personalized service"
            ],
            stats: {
                "Baristas": "12+",
                "Years Experience": "50+",
                "Cups Made": "50K+"
            }
        },
        {
            id: 5,
            icon: Truck,
            title: "Fast Delivery",
            description: "Quick and reliable delivery to your doorstep with care and precision",
            color: "from-blue-400 to-blue-600",
            bgColor: "bg-blue-500/10",
            iconColor: "text-blue-500",
            detailedDescription: "We understand the importance of fresh coffee. That's why we offer express delivery within 24 hours, with temperature-controlled packaging to preserve flavor.",
            benefits: [
                "24-hour delivery",
                "Temperature controlled",
                "Free shipping over $50",
                "Trackable orders"
            ],
            stats: {
                "Delivery Time": "24hrs",
                "Coverage": "50+ Cities",
                "Satisfaction": "98%"
            }
        },
        {
            id: 6,
            icon: Users,
            title: "1000+ Happy Customers",
            description: "Trusted by coffee lovers who appreciate quality and consistency",
            color: "from-purple-400 to-purple-600",
            bgColor: "bg-purple-500/10",
            iconColor: "text-purple-500",
            detailedDescription: "Join our community of passionate coffee lovers. With over 1000 satisfied customers, we've built a reputation for excellence and consistency that keeps people coming back.",
            benefits: [
                "5-star reviews",
                "Loyalty program",
                "Community events",
                "Referral rewards"
            ],
            stats: {
                "Customers": "1000+",
                "Reviews": "500+",
                "Rating": "4.9/5"
            }
        }
    ];

    // ===== PREMIUM COFFEE DATA =====
    const premiumCoffeeData = {
        title: "Premium Coffee Experience",
        subtitle: "Discover the art of exceptional coffee",
        description: "Our premium coffee collection represents the pinnacle of coffee craftsmanship. Each bean is carefully selected, roasted, and brewed to perfection.",
        features: [
            {
                id: 'p1',
                icon: Leaf,
                title: "Single Origin Excellence",
                description: "100% Arabica beans from the world's best coffee-growing regions",
                details: "Ethiopia, Colombia, Kenya, and Guatemala - each origin brings unique flavor profiles",
                stats: { "Origins": "4", "Altitude": "1200-2000m", "Varieties": "6" }
            },
            {
                id: 'p2',
                icon: Zap,
                title: "Artisan Roasting",
                description: "Small-batch roasting with precision temperature control",
                details: "Our master roasters monitor each batch to unlock the perfect flavor profile",
                stats: { "Roast Levels": "5", "Batch Size": "5kg", "Control": "±1°C" }
            },
            {
                id: 'p3',
                icon: Shield,
                title: "Quality Assurance",
                description: "Rigorous testing and cupping for consistent excellence",
                details: "Every batch is tested for quality, consistency, and flavor purity",
                stats: { "Tests": "12+", "Cupping": "Daily", "Score": "92+" }
            },
            {
                id: 'p4',
                icon: Star,
                title: "Flavor Notes",
                description: "Complex flavor profiles with distinct tasting notes",
                details: "From floral and fruity to chocolate and nutty - there's a flavor for every palate",
                stats: { "Notes": "20+", "Profile": "Complex", "Aroma": "Rich" }
            },
            {
                id: 'p5',
                icon: TrendingUp,
                title: "Sustainable Sourcing",
                description: "Ethically sourced beans with fair trade partnerships",
                details: "We work directly with farmers to ensure sustainable practices and fair compensation",
                stats: { "Partners": "50+", "Fair Trade": "100%", "Impact": "Positive" }
            },
            {
                id: 'p6',
                icon: ThumbsUp,
                title: "Expert Baristas",
                description: "Highly trained professionals dedicated to your coffee experience",
                details: "Our baristas are certified experts who bring passion and precision to every cup",
                stats: { "Baristas": "25+", "Certified": "100%", "Experience": "5+ Years" }
            }
        ]
    };

    const stats = [
        { value: "50+", label: "Coffee Varieties" },
        { value: "1000+", label: "Happy Customers" },
        { value: "99%", label: "Satisfaction Rate" },
        { value: "24/7", label: "Support Available" }
    ];

    const toggleFeature = (id) => {
        setActiveFeature(activeFeature === id ? null : id);
    };

    return (
        <section className="relative py-8 px-4 overflow-hidden bg-[#ead9be]">
            {/* Background Effects - Updated for White Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E85D3A]/5 via-transparent to-[#F0744F]/5" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#E85D3A]/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E85D3A]/5 rounded-full blur-[150px]" />
                <div className="absolute top-10 left-10 text-7xl opacity-[0.03] animate-float">🫘</div>
                <div className="absolute bottom-20 right-20 text-7xl opacity-[0.03] animate-float-delay">☕</div>
                <div className="absolute top-1/3 right-1/4 text-5xl opacity-[0.02] animate-float-slow">✦</div>
                <div className="absolute bottom-1/4 left-1/3 text-5xl opacity-[0.02] animate-float-delay">✦</div>
            </div>

            <div className="max-w-[104rem] mx-auto relative z-10">
                {/* ===== HEADER WITH CLICKABLE TABS - Updated for White Background ===== */}
                <div className="text-center mb-8">
                    {/* Tab Buttons */}
                    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-1 py-1 mb-4 shadow-sm">
                        {/* Why Choose Us Tab */}
                        <button
                            onClick={() => {
                                setActiveTab('whyus');
                                setActiveFeature(null);
                            }}
                            className={`
                                px-6 py-2 text-xs font-semibold rounded-full tracking-wider transition-all duration-300
                                ${activeTab === 'whyus' 
                                    ? 'bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white shadow-lg shadow-[#E85D3A]/30' 
                                    : 'text-gray-600 hover:text-[#E85D3A] hover:bg-gray-50'}
                            `}
                        >
                            WHY CHOOSE US
                        </button>
                        
                        {/* Premium Coffee Tab */}
                        <button
                            onClick={() => {
                                setActiveTab('premium');
                                setActiveFeature(null);
                            }}
                            className={`
                                px-6 py-2 text-xs font-semibold rounded-full tracking-wider transition-all duration-300
                                ${activeTab === 'premium' 
                                    ? 'bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white shadow-lg shadow-[#E85D3A]/30' 
                                    : 'text-gray-600 hover:text-[#E85D3A] hover:bg-gray-50'}
                            `}
                        >
                            ✦ PREMIUM COFFEE
                        </button>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
                        {activeTab === 'whyus' ? 'Why Coffee Lovers' : 'Premium Coffee Collection'}
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E85D3A] to-[#F0744F]">
                            {activeTab === 'whyus' ? 'Choose Us' : 'Experience Excellence'}
                        </span>
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {activeTab === 'whyus' 
                            ? 'Experience the perfect blend of quality, taste, and passion in every cup'
                            : 'Discover our meticulously curated collection of premium coffee beans'
                        }
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] rounded-full mx-auto mt-4" />
                </div>

                {/* ===== FEATURES GRID - Updated for White Background ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 rounded-2xl">
                    {activeTab === 'whyus' 
                        ? // Why Choose Us Features
                          whyUsFeatures.map((feature) => {
                              const isActive = activeFeature === feature.id;
                              return (
                                  <div
                                      key={feature.id}
                                      onClick={() => toggleFeature(feature.id)}
                                      className={`
                                          group bg-white border border-gray-200 rounded-2xl p-6 
                                          transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#E85D3A]/10 
                                          cursor-pointer relative overflow-hidden
                                          ${isActive ? 'border-[#E85D3A]/40 shadow-lg shadow-[#E85D3A]/20' : ''}
                                      `}
                                  >
                                      <div className={`absolute -right-20 -top-20 w-40 h-40 ${feature.bgColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isActive ? 'opacity-100' : ''}`} />

                                      <div className="relative z-10 pointer-events-none">
                                          <div className="flex items-start justify-between">
                                              <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                                                  <feature.icon className={`w-7 h-7 ${feature.iconColor} ${isActive ? 'animate-pulse' : ''}`} />
                                              </div>
                                              {isActive && (
                                                  <div className="bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white text-xs px-3 py-1 rounded-full font-medium pointer-events-none shadow-lg shadow-[#E85D3A]/20">
                                                      ● Active
                                                  </div>
                                              )}
                                          </div>

                                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#E85D3A] transition-colors">
                                              {feature.title}
                                          </h3>

                                          <p className="text-gray-600 text-sm leading-relaxed">
                                              {feature.description}
                                          </p>

                                          <div className="mt-4 flex items-center gap-1 text-gray-400 text-xs group-hover:text-[#E85D3A] transition-colors pointer-events-none">
                                              <span>{isActive ? 'Click to collapse' : 'Click to learn more'}</span>
                                              {isActive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                          </div>

                                          {isActive && (
                                              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-fadeIn pointer-events-none">
                                                  <p className="text-gray-700 text-sm leading-relaxed">
                                                      {feature.detailedDescription}
                                                  </p>
                                                  <div className="space-y-1.5">
                                                      {feature.benefits.map((benefit, idx) => (
                                                          <div key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                                                              <div className="w-1.5 h-1.5 rounded-full bg-[#E85D3A]" />
                                                              <span>{benefit}</span>
                                                          </div>
                                                      ))}
                                                  </div>
                                                  <div className="grid grid-cols-3 gap-2 pt-2">
                                                      {Object.entries(feature.stats).map(([key, value]) => (
                                                          <div key={key} className="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
                                                              <div className="text-[#E85D3A] font-bold text-sm">{value}</div>
                                                              <div className="text-gray-500 text-[10px] uppercase tracking-wider">{key}</div>
                                                          </div>
                                                      ))}
                                                  </div>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              );
                          })
                        : // Premium Coffee Features
                          premiumCoffeeData.features.map((feature) => {
                              const isActive = activeFeature === feature.id;
                              return (
                                  <div
                                      key={feature.id}
                                      onClick={() => toggleFeature(feature.id)}
                                      className={`
                                          group bg-white border border-gray-200 rounded-2xl p-6 
                                          transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#E85D3A]/10 
                                          cursor-pointer relative overflow-hidden
                                          ${isActive ? 'border-[#E85D3A]/40 shadow-lg shadow-[#E85D3A]/20' : ''}
                                      `}
                                  >
                                      <div className={`absolute -right-20 -top-20 w-40 h-40 bg-[#E85D3A]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isActive ? 'opacity-100' : ''}`} />

                                      <div className="relative z-10 pointer-events-none">
                                          <div className="flex items-start justify-between">
                                              <div className={`w-14 h-14 bg-[#FFF0EA] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                                                  <feature.icon className={`w-7 h-7 text-[#E85D3A] ${isActive ? 'animate-pulse' : ''}`} />
                                              </div>
                                              {isActive && (
                                                  <div className="bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white text-xs px-3 py-1 rounded-full font-medium pointer-events-none shadow-lg shadow-[#E85D3A]/20">
                                                      ● Active
                                                  </div>
                                              )}
                                          </div>

                                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#E85D3A] transition-colors">
                                              {feature.title}
                                          </h3>

                                          <p className="text-gray-600 text-sm leading-relaxed">
                                              {feature.description}
                                          </p>

                                          <div className="mt-4 flex items-center gap-1 text-gray-400 text-xs group-hover:text-[#E85D3A] transition-colors pointer-events-none">
                                              <span>{isActive ? 'Click to collapse' : 'Click to learn more'}</span>
                                              {isActive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                          </div>

                                          {isActive && (
                                              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-fadeIn pointer-events-none">
                                                  <p className="text-gray-700 text-sm leading-relaxed">
                                                      {feature.details}
                                                  </p>
                                                  <div className="grid grid-cols-3 gap-2 pt-2">
                                                      {Object.entries(feature.stats).map(([key, value]) => (
                                                          <div key={key} className="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
                                                              <div className="text-[#E85D3A] font-bold text-sm">{value}</div>
                                                              <div className="text-gray-500 text-[10px] uppercase tracking-wider">{key}</div>
                                                          </div>
                                                      ))}
                                                  </div>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              );
                          })
                    }
                </div>

                {/* ===== STATS SECTION - Updated for White Background ===== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-[#E85D3A]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#E85D3A]/10 group"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E85D3A] to-[#F0744F] group-hover:scale-110 transition-transform duration-300">
                                {stat.value}
                            </div>
                            <div className="text-gray-600 text-sm mt-1 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== BOTTOM CTA - Updated for White Background ===== */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-6 py-3 hover:shadow-lg hover:shadow-[#E85D3A]/10 transition-all duration-300">
                        <Sparkles className="w-5 h-5 text-[#E85D3A]" />
                        <span className="text-gray-700 text-sm font-medium">
                            {activeTab === 'whyus' 
                                ? 'Join thousands of happy coffee lovers'
                                : 'Experience the finest premium coffee'
                            }
                        </span>
                        <button className="px-6 py-2 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-[#E85D3A]/30 transition-all duration-300 hover:scale-105">
                            {activeTab === 'whyus' ? 'Get Started ✦' : 'Shop Now ✦'}
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

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(12deg); }
                    50% { transform: translateY(-25px) rotate(15deg); }
                }
                
                @keyframes float-delay {
                    0%, 100% { transform: translateY(0px) rotate(-12deg); }
                    50% { transform: translateY(25px) rotate(-15deg); }
                }
                
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(45deg); }
                    50% { transform: translateY(-15px) rotate(50deg); }
                }
                
                @keyframes fadeIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(-10px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
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
                
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </section>
    );
};

export default WhyUs;