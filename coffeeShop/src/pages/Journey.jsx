import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Coffee,
    Flame,
    Droplets,
    Package,
    CheckCircle,
    Clock,
    Bean,
    ChevronRight,
    ChevronLeft,
    Award,
    Zap,
    Star,
    Heart,
    Users,
    MapPin,
    Phone,
    Mail,
} from 'lucide-react';

// ===== COFFEE SHOP DATA =====
const COFFEE_SHOP = {
    name: "Brew & Bloom",
    tagline: "Artisan Coffee · Crafted with Love",
    description: "A cozy sanctuary where premium coffee meets community.",
    address: "123 Coffee Lane, Downtown District",
    phone: "+1 (555) 234-5678",
    email: "hello@brewandbloom.com",
    social: {
        instagram: "@brewandbloom",
        facebook: "BrewAndBloom",
        twitter: "@brewandbloom"
    },
    specialties: [
        "Single Origin Espresso",
        "Pour Over V60",
        "Cold Brew",
        "Latte Art",
        "Pastry Pairings"
    ],
    hours: {
        weekdays: "6:30 AM - 8:00 PM",
        weekend: "7:00 AM - 9:00 PM"
    }
};

// ===== CUSTOM TWITTER ICON =====
const TwitterIcon = ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
);

// ===== JOURNEY DATA =====
const journeySteps = [
    {
        id: 1,
        stepNumber: 1,
        title: "Bean Selection",
        subtitle: "Ethiopia Yirgacheffe",
        description: "Hand-picked premium Arabica beans from the highlands of Ethiopia, known for their floral and fruity notes.",
        icon: "Bean",
        duration: "2-3 weeks",
        image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?q=80&w=2070&auto=format&fit=crop",
        color: "from-amber-400 to-amber-600",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-400/30",
        zoomDirection: "top-to-bottom"
    },
    {
        id: 2,
        stepNumber: 2,
        title: "Roasting Process",
        subtitle: "Medium Roast",
        description: "Artisan roasted to perfection, unlocking rich caramel and dark chocolate flavors with a smooth finish.",
        icon: "Flame",
        duration: "12-15 min",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=2070&auto=format&fit=crop",
        color: "from-orange-400 to-orange-600",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-400/30",
        zoomDirection: "bottom-to-top"
    },
    {
        id: 3,
        stepNumber: 3,
        title: "Brewing Excellence",
        subtitle: "Pour Over · 93°C",
        description: "Precision brewing using the V60 method, extracting the perfect balance of acidity and sweetness.",
        icon: "Droplets",
        duration: "3-4 min",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop",
        color: "from-blue-400 to-blue-600",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-400/30",
        zoomDirection: "left-to-right"
    },
    {
        id: 4,
        stepNumber: 4,
        title: "Tasting Notes",
        subtitle: "Floral · Citrus",
        description: "Experience complex flavor profiles with hints of jasmine, bergamot, and dark cocoa.",
        icon: "Coffee",
        duration: "5-7 min",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2070&auto=format&fit=crop",
        color: "from-purple-400 to-purple-600",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-400/30",
        zoomDirection: "right-to-left"
    },
    {
        id: 5,
        stepNumber: 5,
        title: "Perfect Serve",
        subtitle: "Artisanal Presentation",
        description: "Served at optimal temperature with latte art, creating the ultimate coffee experience.",
        icon: "Package",
        duration: "2-3 min",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2070&auto=format&fit=crop",
        color: "from-rose-400 to-rose-600",
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-400/30",
        zoomDirection: "center"
    }
];

// ===== MAIN COMPONENT =====
const Journey = () => {
    const [activeStep, setActiveStep] = useState(2);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Icon mapping
    const getIcon = (iconName, className = "w-5 h-5") => {
        const icons = {
            Bean: <Bean className={className} />,
            Flame: <Flame className={className} />,
            Droplets: <Droplets className={className} />,
            Coffee: <Coffee className={className} />,
            Package: <Package className={className} />
        };
        return icons[iconName] || <Coffee className={className} />;
    };

    // Intersection Observer
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
    }, [isVisible]);

    const currentStep = journeySteps[activeStep];

    // Navigation handlers
    const goToPrevious = () => {
        setActiveStep((prev) => (prev - 1 + journeySteps.length) % journeySteps.length);
    };

    const goToNext = () => {
        setActiveStep((prev) => (prev + 1) % journeySteps.length);
    };

    // ===== SLOW, SMOOTH ZOOM ANIMATIONS =====
    const getZoomVariants = (direction) => {
        const variants = {
            "top-to-bottom": {
                initial: { scale: 0.5, opacity: 0, y: -250 },
                animate: { 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                        duration: 1.2, 
                        ease: [0.25, 0.46, 0.45, 0.94],
                        opacity: { duration: 0.8 }
                    }
                },
                exit: { 
                    scale: 0.5, 
                    opacity: 0, 
                    y: 250,
                    transition: { 
                        duration: 0.9, 
                        ease: [0.55, 0.085, 0.68, 0.53]
                    }
                }
            },
            "bottom-to-top": {
                initial: { scale: 0.5, opacity: 0, y: 250 },
                animate: { 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                        duration: 1.2, 
                        ease: [0.25, 0.46, 0.45, 0.94],
                        opacity: { duration: 0.8 }
                    }
                },
                exit: { 
                    scale: 0.5, 
                    opacity: 0, 
                    y: -250,
                    transition: { 
                        duration: 0.9, 
                        ease: [0.55, 0.085, 0.68, 0.53]
                    }
                }
            },
            "left-to-right": {
                initial: { scale: 0.5, opacity: 0, x: -250 },
                animate: { 
                    scale: 1, 
                    opacity: 1, 
                    x: 0,
                    transition: { 
                        duration: 1.2, 
                        ease: [0.25, 0.46, 0.45, 0.94],
                        opacity: { duration: 0.8 }
                    }
                },
                exit: { 
                    scale: 0.5, 
                    opacity: 0, 
                    x: 250,
                    transition: { 
                        duration: 0.9, 
                        ease: [0.55, 0.085, 0.68, 0.53]
                    }
                }
            },
            "right-to-left": {
                initial: { scale: 0.5, opacity: 0, x: 250 },
                animate: { 
                    scale: 1, 
                    opacity: 1, 
                    x: 0,
                    transition: { 
                        duration: 1.2, 
                        ease: [0.25, 0.46, 0.45, 0.94],
                        opacity: { duration: 0.8 }
                    }
                },
                exit: { 
                    scale: 0.5, 
                    opacity: 0, 
                    x: -250,
                    transition: { 
                        duration: 0.9, 
                        ease: [0.55, 0.085, 0.68, 0.53]
                    }
                }
            },
            "center": {
                initial: { scale: 0.2, opacity: 0, rotate: -15 },
                animate: { 
                    scale: 1, 
                    opacity: 1, 
                    rotate: 0,
                    transition: { 
                        duration: 1.3, 
                        ease: [0.34, 1.56, 0.64, 1],
                        opacity: { duration: 0.8 }
                    }
                },
                exit: { 
                    scale: 0.2, 
                    opacity: 0, 
                    rotate: 15,
                    transition: { 
                        duration: 0.9, 
                        ease: [0.55, 0.085, 0.68, 0.53]
                    }
                }
            }
        };
        return variants[direction] || variants["center"];
    };

    // Get current zoom direction
    const currentZoom = currentStep?.zoomDirection || "center";

    return (
        <section 
            ref={sectionRef} 
            className="relative min-h-screen py-8 px-4 overflow-hidden bg-[#ead9be]"
        >
            {/* ===== BACKGROUND - Updated for White Background ===== */}
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

            <div className="max-w-6xl mx-auto relative z-10">
                {/* ===== HEADER - Updated for White Background ===== */}
                <div className="text-center mb-4 md:mb-10">
                    <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-2 mb-4 shadow-sm">
                        <Award className="w-4 h-4 text-[#E85D3A]" />
                        <span className="text-gray-700 font-medium text-sm tracking-wider">
                            {COFFEE_SHOP.name} · {COFFEE_SHOP.tagline}
                        </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                        From <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E85D3A] to-[#F0744F]">Bean</span> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E85D3A] to-rose-400">Cup</span>
                    </h2>
                    
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-lg font-light">
                        {COFFEE_SHOP.description}
                    </p>
                    
                    {/* Stats - Updated for White Background */}
                    <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-gray-500">
                        <span className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#E85D3A]" />
                            <span>1,200+ Happy Customers</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-[#E85D3A]" />
                            <span>4.9 ★ Rating</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-rose-500" />
                            <span>100% Arabica</span>
                        </span>
                    </div>
                </div>

                {/* ===== MAIN CONTENT - HORIZONTAL CAROUSEL STYLE ===== */}
                <div className="relative">
                    {/* Step Counter */}
                    <div className="text-center mb-4">
                        <span className="text-sm text-gray-400">
                            Step {currentStep.stepNumber} of {journeySteps.length}
                        </span>
                    </div>

                    {/* Main Card - Updated for White Background */}
                    <div className="relative bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* ===== LEFT: IMAGE WITH SLOW ZOOM EFFECT ===== */}
                            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeStep}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        variants={getZoomVariants(currentZoom)}
                                        className="w-full h-full"
                                    >
                                        <motion.img
                                            src={currentStep.image}
                                            alt={currentStep.title}
                                            className="w-full h-full object-cover"
                                            whileHover={{ scale: 1.12 }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                                
                                {/* Zoom Direction Badge - Updated */}
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full px-3 py-1 shadow-sm"
                                >
                                    <span className="text-[8px] text-gray-500 uppercase tracking-wider">
                                        ✦ {currentZoom.replace('-', ' → ')}
                                    </span>
                                </motion.div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/10 to-transparent" />
                                
                                {/* Step Badge with animation - Updated */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="absolute bottom-4 left-4 right-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
                                        <span className="text-gray-900 font-bold text-lg">
                                            Step {currentStep.stepNumber}
                                        </span>
                                        <span className="text-gray-400 text-sm">/ {journeySteps.length}</span>
                                    </div>
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full px-4 py-1.5 shadow-sm"
                                    >
                                        <Clock className="w-4 h-4 text-[#E85D3A]" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {currentStep.duration}
                                        </span>
                                    </motion.div>
                                </motion.div>

                                {/* Live Indicator - Updated */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="absolute top-4 left-4 bg-[#E85D3A]/10 backdrop-blur-md border border-[#E85D3A]/30 rounded-full px-3 py-1 flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 rounded-full bg-[#E85D3A] animate-pulse" />
                                    <span className="text-xs font-medium text-[#E85D3A]">LIVE</span>
                                </motion.div>
                            </div>

                            {/* ===== RIGHT: CONTENT - Updated for White Background ===== */}
                            <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-between">
                                <div>
                                    {/* Icon & Title */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="flex items-center gap-3 mb-3"
                                    >
                                        <div className={`p-2 rounded-xl bg-gradient-to-br ${currentStep.color} bg-opacity-10`}>
                                            {getIcon(currentStep.icon, "w-6 h-6 text-[#E85D3A]")}
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                                            {currentStep.title}
                                        </h3>
                                    </motion.div>
                                    
                                    <motion.p 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="text-[#E85D3A] text-sm font-medium mb-2"
                                    >
                                        {currentStep.subtitle}
                                    </motion.p>
                                    
                                    <motion.p 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="text-gray-600 text-sm md:text-base leading-relaxed"
                                    >
                                        {currentStep.description}
                                    </motion.p>

                                    {/* Progress Dots - Updated */}
                                    <div className="flex gap-2 mt-6">
                                        {journeySteps.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveStep(index)}
                                                className={`
                                                    h-2 rounded-full transition-all duration-500
                                                    ${index === activeStep 
                                                        ? `w-8 bg-gradient-to-r ${currentStep.color}` 
                                                        : index < activeStep 
                                                            ? 'w-2 bg-[#E85D3A]/50' 
                                                            : 'w-2 bg-gray-200 hover:bg-gray-300'}
                                                `}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Navigation Buttons - Updated */}
                                <div className="flex items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={goToPrevious}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all duration-300 text-gray-700 text-sm"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </motion.button>
                                    
                                    <div className="flex gap-1">
                                        {journeySteps.map((step, index) => (
                                            <motion.button
                                                key={index}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setActiveStep(index)}
                                                className={`
                                                    w-8 h-8 rounded-full text-xs font-medium transition-all duration-300
                                                    ${index === activeStep 
                                                        ? `bg-gradient-to-r ${step.color} text-white shadow-lg shadow-[#E85D3A]/20` 
                                                        : index < activeStep 
                                                            ? 'bg-[#E85D3A]/10 text-[#E85D3A] border border-[#E85D3A]/20' 
                                                            : 'bg-gray-100 text-gray-400 border border-gray-200 hover:bg-gray-200'}
                                                `}
                                            >
                                                {step.stepNumber}
                                            </motion.button>
                                        ))}
                                    </div>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={goToNext}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3A] to-[#F0744F] hover:shadow-lg hover:shadow-[#E85D3A]/30 transition-all duration-300 text-white text-sm font-medium"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== BOTTOM: SPECIALTIES - Updated ===== */}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {COFFEE_SHOP.specialties.map((item, index) => (
                        <motion.span 
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.05, duration: 0.4 }}
                            whileHover={{ scale: 1.1, backgroundColor: "#FEF0EA" }}
                            className="px-4 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-600 hover:text-[#E85D3A] transition-all duration-300 cursor-default"
                        >
                            {item}
                        </motion.span>
                    ))}
                </div>

                {/* ===== FOOTER WITH SOCIAL - Updated ===== */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap justify-between items-center gap-4"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">Follow us</span>
                        <div className="flex gap-3">
                            <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                                <TwitterIcon className="w-4 h-4 text-gray-400 hover:text-[#E85D3A] transition-colors cursor-pointer" />
                            </motion.div>
                        </div>
                    </div>
                    <div className="flex gap-4 text-[10px] text-gray-400">
                        <span>🕐 {COFFEE_SHOP.hours.weekdays}</span>
                        <span>📅 {COFFEE_SHOP.hours.weekend}</span>
                    </div>
                </motion.div>
            </div>

            {/* ===== ANIMATIONS ===== */}
            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                @keyframes pulse-slow-delay {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.15); opacity: 0.7; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-25px) rotate(5deg); }
                }
                @keyframes float-delay {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(25px) rotate(-5deg); }
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
                .floating-icon {
                    animation: float 6s ease-in-out infinite;
                }
                .floating-icon-delay {
                    animation: float-delay 7s ease-in-out infinite;
                }
                .floating-icon-slow {
                    animation: float-slow 9s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default Journey;