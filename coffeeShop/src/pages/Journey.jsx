import React, { useState, useEffect, useRef } from 'react';
import {
    Coffee,
    Flame,
    Droplets,
    Package,
    CheckCircle,
    Clock,
    Bean,
    ChevronRight
} from 'lucide-react';
import {
    getJourneySteps,
    getJourneySectionData,
    getJourneyStepCount
} from '../data/journeyData';

const Journey = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Get data from global
    const journeySteps = getJourneySteps();
    const sectionData = getJourneySectionData();
    const totalSteps = getJourneyStepCount();

    // Clean Icon mapping - matches Lucide icons
    const getIcon = (iconName, className = "w-7 h-7") => {
        const icons = {
            Bean: <Bean className={className} />,
            Flame: <Flame className={className} />,
            Droplets: <Droplets className={className} />,
            Coffee: <Coffee className={className} />,
            Package: <Package className={className} />
        };
        return icons[iconName] || <Coffee className={className} />;
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    // Auto-advance steps
    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % journeySteps.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isVisible, journeySteps.length]);

    const currentStep = journeySteps[activeStep];

    return (
        <section ref={sectionRef} className="relative py-2 md:py-6 px-4 overflow-hidden">
            {/* ========== GLASS BACKGROUND ========== */}
            {/* <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-20 left-10 text-6xl rotate-12 animate-float">🫘</div>
                    <div className="absolute bottom-32 right-20 text-6xl -rotate-12 animate-float-delay">☕</div>
                </div>
            </div> */}

            <div className="max-w-[104rem] mx-auto relative z-10">
                {/* ========== HEADER ========== */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-[#0D7C53]/10 backdrop-blur-sm rounded-full mb-2 border border-white/20">
                        <span className="flex items-center gap-2 px-6 py-2.5 bg-[#0D7C53]/20 backdrop-blur-sm text-white rounded-full font-medium hover:bg-[#0D7C53] hover:text-white transition-all duration-300 border border-white/30">{sectionData.badge}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white">
                        {sectionData.title.split(' ').map((word, index) => (
                            word === sectionData.titleHighlight ?
                                <span key={index} className="text-[#0D7C53]">{word} </span> :
                                <span key={index}>{word} </span>
                        ))}
                    </h2>
                    <p className="text-gray-200 mt-3 max-w-2xl mx-auto">
                        {sectionData.subtitle}
                    </p>
                    <div className="w-16 h-1 bg-[#0D7C53] mx-auto mt-2 rounded-full"></div>
                </div>

                {/* ========== MAIN CONTENT - IMAGE LEFT + STEPS RIGHT ========== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* ===== LEFT SIDE - IMAGE ===== */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/5 border border-white/30 backdrop-blur-xl bg-white/10">
                            <img
                                src={currentStep.image}
                                alt={currentStep.title}
                                className="w-full h-[350px] md:h-[450px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                            {/* Step Badge */}
                            <div className="absolute bottom-4 left-4 backdrop-blur-xl bg-white/40 border border-white/30 rounded-xl px-4 py-2 shadow-xl">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold text-lg">Step {currentStep.stepNumber}</span>
                                    <span className="text-white/60 text-sm">/ {totalSteps}</span>
                                </div>
                            </div>

                            {/* Duration Badge */}
                            <div className="absolute top-4 right-4 backdrop-blur-xl bg-white/40 border border-white/30 rounded-full px-4 py-1.5 shadow-xl flex items-center gap-2">
                                <Clock className="w-4 h-4 text-white" />
                                <span className="text-sm font-medium text-gray-200">{currentStep.duration}</span>
                            </div>
                        </div>
                    </div>

                    {/* ===== RIGHT SIDE - VERTICAL STEP ROADMAP ===== */}
                    <div className="order-1 lg:order-2">
                        <div className="backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl shadow-black/5">
                            <h3 className="text-xl font-bold text-white mb-6 text-center">
                                Journey Steps
                            </h3>

                            {/* Vertical Timeline */}
                            <div className="relative">
                                {/* Vertical Line */}
                                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#0D7C53] via-green-400 to-amber-400 rounded-full"></div>

                                <div className="space-y-4">
                                    {journeySteps.map((step, index) => {
                                        const isActive = index === activeStep;
                                        const isPast = index < activeStep;

                                        return (
                                            <button
                                                key={step.id}
                                                onClick={() => setActiveStep(index)}
                                                className={`
                                                    w-full flex items-start gap-4 p-3 rounded-2xl transition-all duration-300 text-left
                                                    ${isActive
                                                        ? 'backdrop-blur-xl bg-white/40 border-2 border-[#0D7C53] shadow-xl'
                                                        : isPast
                                                            ? 'backdrop-blur-sm bg-white/20 border border-white/30 opacity-70'
                                                            : 'backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/30'}
                                                `}
                                            >
                                                {/* Step Circle with Number */}
                                                <div className="relative flex-shrink-0">
                                                    <div className={`
                                                        w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                                                        ${isActive
                                                            ? 'bg-[#0D7C53] text-white shadow-lg shadow-[#0D7C53]/30 scale-110'
                                                            : isPast
                                                                ? 'bg-[#0D7C53]/60 text-white'
                                                                : 'bg-white/40 text-[#0D7C53] border-2 border-white/30'}
                                                    `}>
                                                        {isPast ? (
                                                            <CheckCircle className="w-6 h-6" />
                                                        ) : (
                                                            <span className="font-bold text-sm">{step.stepNumber}</span>
                                                        )}
                                                    </div>

                                                    {/* Connecting dot on line */}
                                                    {index < journeySteps.length - 1 && (
                                                        <div className={`
                                                            absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
                                                            ${isPast || isActive ? 'bg-[#0D7C53]' : 'bg-gray-300'}
                                                        `}></div>
                                                    )}
                                                </div>

                                                {/* Step Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`
                                                            font-semibold text-sm transition-colors duration-300
                                                            ${isActive ? 'text-white' : isPast ? 'text-white' : 'text-white'}
                                                        `}>
                                                            {step.title}
                                                        </span>
                                                        {isActive && (
                                                            <span className="text-xs flex items-center gap-2 px-2 py-0.5 bg-[#0D7C53]/20 backdrop-blur-sm text-white rounded-full font-medium hover:bg-[#0D7C53] hover:text-white transition-all duration-300 border border-white/30">
                                                                Active
                                                            </span>
                                                        )}
                                                        {isPast && (
                                                            <span className="text-xs px-2 py-0.5 flex items-center gap-2 bg-[#0D7C53]/20 backdrop-blur-sm text-white rounded-full font-medium hover:bg-[#0D7C53] hover:text-white transition-all duration-300 border border-white/30">
                                                                Done
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className={`
                                                        text-xs mt-0.5 line-clamp-2 transition-colors duration-300
                                                        ${isActive ? 'text-gray-200' : 'text-gray-100'}
                                                    `}>
                                                        {step.subtitle}
                                                    </p>
                                                    {/* Show icon for active step */}
                                                    {isActive && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            {getIcon(step.icon, "w-3.5 h-3.5 text-white")}
                                                            <span className="text-xs text-gray-200">{step.duration}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Arrow indicator for active */}
                                                {isActive && (
                                                    <ChevronRight className="w-5 h-5 text-white flex-shrink-0 animate-pulse" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
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

export default Journey;