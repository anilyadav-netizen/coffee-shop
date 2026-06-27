import React from 'react';
import { Coffee, Brain, Shield, Users, Smile, Sparkles } from 'lucide-react';
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

        <section className="relative py-6 px-4 overflow-hidden">

            {/* ========== GLASS EFFECT BACKGROUND ========== */}
            {/* <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-20 left-10 text-6xl rotate-12 animate-float">🫘</div>
                    <div className="absolute bottom-32 right-20 text-6xl -rotate-12 animate-float-delay">🫘</div>
                    <div className="absolute top-1/3 right-1/4 text-4xl rotate-45 animate-float-slow">☕</div>
                    <div className="absolute bottom-1/4 left-1/3 text-5xl -rotate-45 animate-float-delay">🫘</div>
                </div>
            </div> */}

            {/* ========== CONTENT ========== */}
            <div className="max-w-[104rem] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center backdrop-blur-xl rounded-xl">

                    {/* ========== LEFT SIDE - IMAGE WITH GLASS EFFECT ========== */}
                    <div className="relative order-1 lg:order-1">
                        {/* Main Image - Glass Effect */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/5 border border-white/30 backdrop-blur-xl bg-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=900&fit=crop&auto=format"
                                alt="Coffee Benefits"
                                className="w-full h-[400px] md:h-[450px] lg:h-[500px] object-cover"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#0D7C53]/10 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ========== RIGHT SIDE - CONTENT ========== */}
                    <div className="order-2 lg:order-2">
                        {/* Header - NO EXTRA SHADOW OR EFFECTS */}
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 bg-[#0D7C53]/10 backdrop-blur-sm rounded-full mb-2 border border-white/20">
                                <span className="text-sm tracking-wider flex items-center gap-2 px-6 py-2.5 bg-[#0D7C53]/20 backdrop-blur-sm text-white rounded-full font-medium hover:bg-[#0D7C53] hover:text-white transition-all duration-300 border border-white/30">COFFEE BENEFITS</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                                The Benefits of <span className="text-white">Good Coffee</span>
                            </h2>
                            <div className="w-16 h-1 bg-[#0D7C53] rounded-full"></div>
                        </div>

                        {/* Benefits Grid - Glass Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit.id}
                                    className="group backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-5 shadow-sm shadow-black/5 hover:shadow-md transition-all duration-500 hover:-translate-y-1"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2.5 ${benefit.bgColor} rounded-xl ${benefit.hoverBgColor} transition-colors backdrop-blur-sm`}>
                                            {getIcon(benefit.icon, `w-5 h-5 ${benefit.iconColor}`)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">
                                                {benefit.title.split('\n').map((line, i) => (
                                                    <React.Fragment key={i}>
                                                        {line}
                                                        {i < benefit.title.split('\n').length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}
                                            </h3>
                                            <p className="text-base text-gray-300 mt-1 leading-relaxed">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Quote - Glass Effect */}
                        <div className="mt-6 p-4 backdrop-blur-xl bg-gradient-to-r from-[#0D7C53]/10 to-green-500/10 border border-white/30 rounded-2xl shadow-xl shadow-black/5">
                            <p className="text-base text-gray-200 italic flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-gray-300" />
                                "Life is too short for bad coffee — start your day right"
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