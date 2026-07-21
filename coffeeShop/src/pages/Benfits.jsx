import React from 'react';
import { Coffee, Brain, Shield, Users, Smile, Sparkles, Flame } from 'lucide-react';
import { getBenefits } from '../data/benefitsData';

const Benefits = () => {
    const benefits = getBenefits();

    // Icon mapping
    const getIcon = (iconName, className = "w-5 h-5") => {
        const icons = {
            Brain: <Brain className={className} />,
            Shield: <Shield className={className} />,
            Users: <Users className={className} />,
            Smile: <Smile className={className} />
        };
        return icons[iconName] || <Brain className={className} />;
    };

    return (

        <section className="relative px-4 overflow-hidden ">
            {/* ========== CONTENT ========== */}
            <div className="max-w-[104rem] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-xl">

                    {/* ========== LEFT SIDE - IMAGE WITH GLASS EFFECT ========== */}
                    <div className="relative order-1 lg:order-1">
                        {/* Main Image - Glass Effect */}
                        <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-[#E85D3A]/10 border border-[#FEE7DD] bg-[#FFF8F5]">
                            <img
                                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=900&fit=crop&auto=format"
                                alt="Food Benefits"
                                className="w-full h-[250px] md:h-[450px] lg:h-[500px] object-fill"
                            />

                            {/* Gradient Overlay - Updated with Food Colors */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937]/40 via-transparent to-transparent"></div>

                            {/* Decorative Badge on Image */}
                            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-[#FEE7DD]">
                                <div className="flex items-center gap-2">
                                    <Flame size={16} className="text-[#E85D3A]" />
                                    <span className="text-xs font-semibold text-[#E85D3A]">100% Fresh</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements - Updated Colors */}
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#E85D3A]/10 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#F0744F]/10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ========== RIGHT SIDE - CONTENT ========== */}
                    <div className="order-2 lg:order-2">
                        {/* Header - Updated with Food Colors */}
                        <div className="mb-4 md:mb-8">
                            {/* Badge */}
                            <div className="flex justify-center md:justify-start -mt-9 md:mt-0 mb-1">
                                <div className="inline-flex items-center gap-2 rounded-full">
                                    <span
                                        className="text-sm tracking-wider flex items-center gap-2 px-6 py-2.5 text-[#E85D3A] rounded-full font-semibold border border-[#FEE7DD] hover:bg-[#E86A33] hover:text-white transition-all duration-300"
                                    >
                                        <Flame size={16} />
                                        COFFEE BENEFITS
                                    </span>
                                </div>
                            </div>

                            {/* Heading */}
                            <h2 className="text-2xl md:text-4xl font-bold text-[#1F2937] mb-1 text-center md:text-left">
                                The Benefits of <span className="text-[#E85D3A]">Good Coffee</span>
                            </h2>

                            {/* Underline */}
                            <div className="w-16 h-1 bg-gradient-to-r from-[#E85D3A] to-[#F0744F] rounded-full mx-auto md:mx-0"></div>
                        </div>

                        {/* Benefits Grid - Updated with Food Colors */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-4">
                            {benefits?.map((benefit) => (
                                <div
                                    key={benefit.id}
                                    className="group bg-white border  rounded-2xl p-2 md:p-5  transition-all duration-500 hover:-translate-y-1 hover:border-[#FEE7DD] border-[#E85D3A]/30 shadow-[#E85D3A]/10"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2.5 ${benefit.bgColor} rounded-xl ${benefit.hoverBgColor} transition-colors`}>
                                            {getIcon(benefit.icon, `w-5 h-5 ${benefit.iconColor}`)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#1F2937] text-[17px] group-hover:text-[#E85D3A] transition-colors duration-300 -mt-0.5 md:mt-0">
                                                {benefit.title.split('\n')?.map((line, i) => (
                                                    <React.Fragment key={i}>
                                                        {line}
                                                        {i < benefit.title.split('\n').length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}
                                            </h3>
                                            <p className="text-sm  text-[#6B7280] leading-relaxed ">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Quote - Updated with Food Colors */}
                        <div className="mt-2 md:mt-6 p-2 md:p-4 bg-white border border-[#E85D3A]/30 rounded-2xl shadow-lg shadow-[#E85D3A]/5">
                            <p className="text-base text-[#1F2937] italic flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#E85D3A]" />
                                "Life is too short for bad food — enjoy every bite"
                            </p>
                        </div>
                    </div>

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

export default Benefits;