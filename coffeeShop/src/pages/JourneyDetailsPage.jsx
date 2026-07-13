// src/pages/JourneyDetailsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import CoffeeMaking from '../assets/Video/CoffeeMaking.mp4';
import {
    Coffee, Leaf, Flame, Droplets, Settings,
    ThumbsUp, Award, Package, Users, Shield, Recycle,
    ChevronDown, ChevronUp, Play, MapPin, Clock,
    Star, Heart, ArrowRight, Sparkles, Quote,
    Maximize, Minimize, Plus, Minus, Coffee as CoffeeIcon
} from 'lucide-react';

import {
    timelineData,
    detailedSteps,
    brewingMethods,
    roastLevels,
    coffeeFacts,
    sustainabilityData,
    galleryImages,
    faqData,
    heroContent,
    ctaContent,
} from '../data/JourneyDetailData';
import { Link } from 'react-router-dom';

// Icon mapping
const iconMap = {
    Coffee: Coffee,
    Leaf: Leaf,
    Flame: Flame,
    Settings: Settings,
    Droplets: Droplets,
    CoffeeIcon: CoffeeIcon,
    ThumbsUp: ThumbsUp,
    Award: Award,
    Package: Package,
    Users: Users,
    Shield: Shield,
    Recycle: Recycle,
};

const getIcon = (iconName) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : <Coffee className="w-6 h-6" />;
};

// Components
const Section = ({ children, className = '' }) => (
    <section className={`relative py-6 px-4 md:px-8 ${className}`}>
        <div className="max-w-[90rem] mx-auto">{children}</div>
    </section>
);

const GlassCard = ({ children, className = '' }) => (
    <div
        className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl ${className}`}
    >
        {children}
    </div>
);

const AnimatedSection = ({ children, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [isInView, controls]);

    return (
        <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Hero Section with Video
const HeroSection = () => {
    return (
        <section className="relative h-[30rem] md:h-[60rem] flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ minHeight: '104rem' }}
            >
                <source src={CoffeeMaking} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/70" />

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-20 left-10 text-green-400/20"
                >
                    <Coffee className="w-20 h-20" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-20 right-10 text-green-400/20"
                >
                    <Coffee className="w-16 h-16" />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#10BE7F]/10 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-sm tracking-wider mb-6">
                        {heroContent.badge}
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
                >
                    {heroContent.heading.split(' ').map((word, index) => {
                        if (word === heroContent.highlightedWord) {
                            return (
                                <span key={index} className="text-[#10BE7F]">
                                    {word}{' '}
                                </span>
                            );
                        }
                        return <span key={index}>{word} </span>;
                    })}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8"
                >
                    {heroContent.subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link to="/menu" className="px-8 py-3 bg-[#10BE7F] hover:bg-[#0D7C53] text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105">
                        {heroContent.buttons.primary}
                    </Link>

                </motion.div>
            </div>
        </section>
    );
};

// Timeline Section - Enhanced
const TimelineSection = () => {
    return (
        <Section className="bg-[#0B0B0B]">
            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                    Our Coffee Journey
                </h2>
                <p className="text-white/60 text-center max-w-2xl mx-auto mb-16">
                    From farm to cup, every step is crafted with precision and passion
                </p>
            </AnimatedSection>

            <div className="relative">
                {/* Vertical Line with Gradient */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#10BE7F] via-[#0D7C53] to-transparent" />

                {timelineData.map((item, index) => (
                    <TimelineItem key={item.id} item={item} index={index} />
                ))}
            </div>
        </Section>
    );
};

const TimelineItem = ({ item, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const isLeft = index % 2 === 0;

    return (
        <div ref={ref} className="relative mx-w-[104rem] mb-20 last:mb-0">
            <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`w-full md:w-5/12 ${isLeft ? 'md:text-right' : 'md:text-left'}`}
                >
                    <GlassCard className="p-8 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#10BE7F]/20">
                        <div className={`flex items-center gap-4 mb-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                            <div className="w-14 h-14 rounded-full bg-[#10BE7F]/20 flex items-center justify-center text-[#10BE7F] flex-shrink-0">
                                {getIcon(item.icon)}
                            </div>
                            <span className="text-3xl font-bold text-[#10BE7F]">{item.number}</span>
                        </div>
                        <h3 className={`text-2xl font-bold text-white mb-3 ${isLeft ? 'md:text-right' : ''}`}>
                            {item.title}
                        </h3>
                        <p className={`text-white/70 text-sm leading-relaxed ${isLeft ? 'md:text-right' : ''}`}>
                            {item.description}
                        </p>
                        <div className={`mt-4 flex gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                            <span className="px-3 py-1 bg-[#10BE7F]/10 border border-[#10BE7F]/20 rounded-full text-[#10BE7F] text-xs">
                                Step {item.id}
                            </span>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Center Circle with Pulse Effect */}
                <div className="hidden md:flex w-2/12 justify-center relative">
                    <motion.div
                        animate={isInView ? {
                            scale: [1, 1.2, 1],
                            boxShadow: ['0 0 0 0 rgba(16, 190, 127, 0.7)', '0 0 0 20px rgba(16, 190, 127, 0)']
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-8 h-8 rounded-full bg-[#10BE7F] border-4 border-[#0B0B0B] shadow-lg shadow-[#10BE7F]/30 z-10"
                    />
                    <motion.div
                        animate={isInView ? {
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute w-12 h-12 rounded-full bg-[#10BE7F]/20 -z-0"
                    />
                </div>

                {/* Image with Enhanced Hover */}
                <motion.div
                    initial={{ opacity: 0, x: isLeft ? 80 : -80 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="w-full md:w-5/12"
                >
                    <div className="rounded-2xl overflow-hidden shadow-2xl shadow-[#10BE7F]/10 group">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Detailed Steps Section - Removed Learn More Button
const DetailedStepsSection = () => {
    return (
        <Section className="bg-[#0B0B0B]">
            {detailedSteps.map((step, index) => (
                <DetailedStep key={step.id} step={step} index={index} />
            ))}
        </Section>
    );
};

const DetailedStep = ({ step, index }) => {
    const isEven = index % 2 === 0;

    return (
        <AnimatedSection className="mb-12 last:mb-0">
            <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}>
                {/* Image */}
                <div className="w-full lg:w-1/2">
                    <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[#10BE7F]/10 group">
                        <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-64 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                    <GlassCard className="p-8 hover:bg-white/10 transition-all duration-500">
                        <span className="text-[#10BE7F] font-semibold tracking-wider">{step.number}</span>
                        <h3 className="text-3xl font-bold text-white mt-2 mb-4">{step.title}</h3>

                        <div className="space-y-3 mb-6">
                            {step.content.map((paragraph, i) => (
                                <p key={i} className="text-white/70 text-sm leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {step.features.map((feature, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-1 bg-[#10BE7F]/10 border border-[#10BE7F]/20 rounded-full text-[#10BE7F] text-sm flex items-center gap-1"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    {feature}
                                </span>
                            ))}
                        </div>

                        {/* Quote */}
                        <div className="relative pl-6 border-l-2 border-[#10BE7F]">
                            <Quote className="w-8 h-8 text-[#10BE7F]/30 absolute -left-4 -top-2" />
                            <p className="text-white/60 italic text-sm ml-4">{step.quote}</p>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AnimatedSection>
    );
};

// Brewing Methods Section
const BrewingMethodsSection = () => {
    return (
        <Section className="bg-[#0B0B0B]">
            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
                    Brewing Methods
                </h2>
                <p className="text-white/60 text-center max-w-2xl mx-auto mb-12">
                    Discover the perfect brewing method for your taste
                </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brewingMethods.map((method) => (
                    <BrewingCard key={method.id} method={method} />
                ))}
            </div>
        </Section>
    );
};

const BrewingCard = ({ method }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group"
        >
            <GlassCard className="overflow-hidden h-full">
                <div className="relative overflow-hidden h-48">
                    <img
                        src={method.image}
                        alt={method.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                        {method.name}
                    </h3>
                </div>
                <div className="p-6">
                    <p className="text-white/60 text-sm mb-4">{method.description}</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/40">Brew Time</span>
                            <span className="text-white/80">{method.brewTime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/40">Flavor</span>
                            <span className="text-white/80">{method.flavor}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/40">Difficulty</span>
                            <span className="text-white/80">{method.difficulty}</span>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
};

// Roast Levels Section
const RoastLevelsSection = () => {
    return (
        <Section className="bg-[#0B0B0B]">
            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                    Roast Levels
                </h2>
                <p className="text-white/60 text-center max-w-2xl mx-auto mb-12">
                    Find your perfect roast level
                </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roastLevels.map((roast) => (
                    <RoastCard key={roast.id} roast={roast} />
                ))}
            </div>
        </Section>
    );
};

const RoastCard = ({ roast }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="group"
        >
            <GlassCard className="overflow-hidden h-full">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={roast.image}
                        alt={roast.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div
                        className="absolute bottom-4 left-4 w-12 h-12 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: roast.color }}
                    />
                    <h3 className="absolute bottom-4 right-4 text-white text-xl font-bold">
                        {roast.name}
                    </h3>
                </div>
                <div className="p-6">
                    <p className="text-white/60 text-sm mb-4">{roast.taste}</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/40">Acidity</span>
                            <span className="text-white/80">{roast.acidity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/40">Sweetness</span>
                            <span className="text-white/80">{roast.sweetness}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/40">Body</span>
                            <span className="text-white/80">{roast.body}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/40">Best Drinks</span>
                            <span className="text-white/80">{roast.bestDrinks}</span>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
};

// Coffee Facts Section
const CoffeeFactsSection = () => {
    return (
        <Section className="bg-[#0B0B0B]">
            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                    Coffee Facts
                </h2>
                <p className="text-white/60 text-center max-w-2xl mx-auto mb-12">
                    Numbers that tell our story
                </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {coffeeFacts.map((fact) => (
                    <FactCard key={fact.id} fact={fact} />
                ))}
            </div>
        </Section>
    );
};

const FactCard = ({ fact }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const target = parseInt(fact.number.replace(/[^0-9]/g, ''));
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);
            return () => clearInterval(timer);
        }
    }, [isInView, fact.number]);

    return (
        <motion.div
            ref={ref}
            whileHover={{ scale: 1.05 }}
            className="text-center"
        >
            <GlassCard className="p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#10BE7F]/10 flex items-center justify-center text-[#10BE7F]">
                    {getIcon(fact.icon)}
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                    {fact.number.includes('+') ? `${count}+` : `${count}%`}
                </div>
                <p className="text-white/60 text-sm">{fact.label}</p>
            </GlassCard>
        </motion.div>
    );
};

// Sustainability Section
const SustainabilitySection = () => {
    return (
        <Section className="bg-[#0B0B0B] relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                <Leaf className="w-96 h-96 absolute top-0 left-0 text-[#10BE7F]" />
                <Leaf className="w-72 h-72 absolute bottom-0 right-0 text-[#10BE7F]" />
            </div>

            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                    Sustainability
                </h2>
                <p className="text-white/60 text-center max-w-2xl mx-auto mb-12">
                    Committed to a better future
                </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {sustainabilityData.map((item) => (
                    <SustainabilityCard key={item.id} item={item} />
                ))}
            </div>
        </Section>
    );
};

const SustainabilityCard = ({ item }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group"
        >
            <GlassCard className="p-6 flex items-start gap-4 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[#10BE7F]/10 flex items-center justify-center text-[#10BE7F] flex-shrink-0">
                    {getIcon(item.icon)}
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm">{item.description}</p>
                </div>
            </GlassCard>
        </motion.div>
    );
};

// Gallery Section
const GallerySection = () => {
    return (
        <Section className="bg-[#0B0B0B]">
            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                    Gallery
                </h2>
                <p className="text-white/60 text-center max-w-2xl mx-auto mb-12">
                    A visual journey through our coffee world
                </p>
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image) => (
                    <GalleryItem key={image.id} image={image} />
                ))}
            </div>
        </Section>
    );
};

const GalleryItem = ({ image }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden rounded-2xl aspect-square group cursor-pointer"
        >
            <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="absolute bottom-4 left-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {image.alt}
            </p>
        </motion.div>
    );
};

// FAQ Section
const FAQSection = () => {
    return (
        <Section className="bg-[#0B0B0B]">
            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                    FAQ
                </h2>
                <p className="text-white/60 text-center max-w-2xl mx-auto mb-12">
                    Common questions about our coffee
                </p>
            </AnimatedSection>

            <div className="max-w-3xl mx-auto space-y-4">
                {faqData.map((faq) => (
                    <FAQItem key={faq.id} faq={faq} />
                ))}
            </div>
        </Section>
    );
};

const FAQItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={false}
            animate={{ backgroundColor: isOpen ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)' }}
            className="rounded-2xl border border-white/10 overflow-hidden hover:border-[#10BE7F]/30 transition-colors duration-300"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex justify-between items-center text-left"
            >
                <span className="text-white font-medium">{faq.question}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#10BE7F]" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-[#10BE7F]" />
                )}
            </button>
            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="px-6 pb-4">
                    <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// CTA Section
const CTASection = () => {
    return (
        <section className="relative py-6 px-4 md:px-8 overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
                }}
            />
            <div className="absolute inset-0 bg-black/80" />

            <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 20, 0],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{
                            duration: 4 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                        }}
                        className="absolute text-[#10BE7F]/10"
                        style={{
                            top: `${10 + i * 15}%`,
                            left: `${5 + i * 18}%`,
                        }}
                    >
                        <Coffee className="w-12 h-12" />
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <AnimatedSection>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        {ctaContent.heading}
                    </h2>
                    <p className="text-white/70 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                        {ctaContent.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 bg-[#10BE7F] hover:bg-[#0D7C53] text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105">
                            {ctaContent.buttons.primary}
                        </button>
                        <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white rounded-full font-medium transition-all duration-300">
                            {ctaContent.buttons.secondary}
                        </button>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

// Main Page Component
const JourneyDetailsPage = () => {
    return (
        <div className="bg-[#0B0B0B] min-h-screen overflow-x-hidden">
            <HeroSection />
            <TimelineSection />
            <DetailedStepsSection />
            <BrewingMethodsSection />
            <RoastLevelsSection />
            <CoffeeFactsSection />
            <SustainabilitySection />
            <GallerySection />
            <FAQSection />
            <CTASection />
        </div>
    );
};

export default JourneyDetailsPage;