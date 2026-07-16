// src/pages/JourneyDetailsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import CoffeeMaking from '../assets/Video/CoffeeMaking.mp4';
import {
    Coffee, Leaf, Flame, Droplets, Settings,
    ThumbsUp, Award, Package, Users, Shield, Recycle,
    ChevronDown, ChevronUp, Sparkles, Quote,
    Coffee as CoffeeIcon
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
    Coffee, Leaf, Flame, Settings, Droplets,
    CoffeeIcon, ThumbsUp, Award, Package, Users, Shield, Recycle,
};

const getIcon = (iconName) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : <Coffee className="w-6 h-6" />;
};

// ========== Base Components ==========

const Section = ({ children, className = '' }) => (
    <section className={`relative py-4 px-4 md:px-8 ${className}`}>
        <div className="max-w-[104rem] mx-auto">{children}</div>
    </section>
);

// Modern white card with soft shadow
const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const AnimatedSection = ({ children, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) controls.start('visible');
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

// ========== HERO SECTION (unchanged, dark video) ==========
const HeroSection = () => {
    return (
        <section className="relative h-[28rem] md:h-[60rem] flex items-center justify-center overflow-hidden">
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
                    className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#0D7C53]/10 rounded-full blur-3xl"
                />
            </div>

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
                    {heroContent.heading.split(' ').map((word, index) => (
                        <span key={index} className={word === heroContent.highlightedWord ? 'text-[#0D7C53]' : ''}>
                            {word}{' '}
                        </span>
                    ))}
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
                    <Link
                        to="/menu"
                        className="px-8 py-3 bg-[#0D7C53] hover:bg-[#0A5F3E] text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105"
                    >
                        {heroContent.buttons.primary}
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

// ========== TIMELINE SECTION ==========
const TimelineSection = () => {
    return (
        <Section>
            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4">
                    Our Coffee Journey
                </h2>
                <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
                    From farm to cup, every step is crafted with precision and passion
                </p>
            </AnimatedSection>

            <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#0D7C53] via-[#0A5F3E] to-transparent" />

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
        <div ref={ref} className="relative mb-10 last:mb-0">
            <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                <motion.div
                    initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`w-full md:w-5/12 ${isLeft ? 'md:text-right' : 'md:text-left'}`}
                >
                    <Card className="p-8 transition-transform duration-300">
                        <div className={`flex items-center gap-4 mb-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                            <div className="w-14 h-14 rounded-full bg-[#0D7C53]/10 flex items-center justify-center text-[#0D7C53] flex-shrink-0">
                                {getIcon(item.icon)}
                            </div>
                            <span className="text-3xl font-bold text-[#0D7C53]">{item.number}</span>
                        </div>
                        <h3 className={`text-2xl font-bold text-gray-800 mb-3 ${isLeft ? 'md:text-right' : ''}`}>
                            {item.title}
                        </h3>
                        <p className={`text-gray-600 text-sm leading-relaxed ${isLeft ? 'md:text-right' : ''}`}>
                            {item.description}
                        </p>
                        <div className={`mt-4 flex gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                            <span className="px-3 py-1 bg-[#0D7C53]/10 border border-[#0D7C53]/20 rounded-full text-[#0D7C53] text-xs">
                                Step {item.id}
                            </span>
                        </div>
                    </Card>
                </motion.div>

                <div className="hidden md:flex w-2/12 justify-center relative">
                    <motion.div
                        animate={isInView ? {
                            scale: [1, 1.2, 1],
                            boxShadow: ['0 0 0 0 rgba(13, 124, 83, 0.7)', '0 0 0 20px rgba(13, 124, 83, 0)']
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-8 h-8 rounded-full bg-[#0D7C53] border-4 border-white shadow-lg shadow-[#0D7C53]/30 z-10"
                    />
                    <motion.div
                        animate={isInView ? {
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute w-12 h-12 rounded-full bg-[#0D7C53]/20 -z-0"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: isLeft ? 80 : -80 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="w-full md:w-5/12"
                >
                    <div className="rounded-2xl overflow-hidden shadow-lg shadow-[#0D7C53]/10">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-56 object-cover"
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// ========== DETAILED STEPS ==========
const DetailedStepsSection = () => {
    return (
        <Section>
            {detailedSteps.map((step, index) => (
                <DetailedStep key={step.id} step={step} index={index} />
            ))}
        </Section>
    );
};

const DetailedStep = ({ step, index }) => {
    const isEven = index % 2 === 0;

    return (
        <AnimatedSection className="mb-5 last:mb-0">
            <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}>
                <div className="w-full lg:w-1/2">
                    <div className="rounded-3xl overflow-hidden shadow-lg shadow-[#0D7C53]/10 group">
                        <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-64 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    <Card className="p-8 hover:-translate-y-1 transition-transform duration-300">
                        <span className="text-[#0D7C53] font-semibold tracking-wider">{step.number}</span>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2 mb-4">{step.title}</h3>

                        <div className="space-y-3 mb-6">
                            {step.content.map((paragraph, i) => (
                                <p key={i} className="text-gray-600 text-sm leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {step.features.map((feature, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-1 bg-[#0D7C53]/10 border border-[#0D7C53]/20 rounded-full text-[#0D7C53] text-sm flex items-center gap-1"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    {feature}
                                </span>
                            ))}
                        </div>

                        <div className="relative pl-6 border-l-2 border-[#0D7C53]">
                            <Quote className="w-8 h-8 text-[#0D7C53]/30 absolute -left-4 -top-2" />
                            <p className="text-gray-500 italic text-sm ml-4">{step.quote}</p>
                        </div>
                    </Card>
                </div>
            </div>
        </AnimatedSection>
    );
};

// ========== BREWING METHODS ==========
const BrewingMethodsSection = () => {
    return (
        <Section>
            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center">
                    Brewing Methods
                </h2>
                <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8 mt-1">
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
        <motion.div whileHover={{ y: -6 }} className="group h-full">
            <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow">
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
                    <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Brew Time</span>
                            <span className="text-gray-800">{method.brewTime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Flavor</span>
                            <span className="text-gray-800">{method.flavor}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Difficulty</span>
                            <span className="text-gray-800">{method.difficulty}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

const RoastCard = ({ roast }) => {
    return (
        <motion.div whileHover={{ scale: 1.02 }} className="group h-full">
            <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow">
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
                    <p className="text-gray-600 text-sm mb-4">{roast.taste}</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Acidity</span>
                            <span className="text-gray-800">{roast.acidity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Sweetness</span>
                            <span className="text-gray-800">{roast.sweetness}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Body</span>
                            <span className="text-gray-800">{roast.body}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Best Drinks</span>
                            <span className="text-gray-800">{roast.bestDrinks}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

// ========== COFFEE FACTS ==========
const CoffeeFactsSection = () => {
    return (
        <Section>
            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4">
                    Coffee Facts
                </h2>
                <p className="text-gray-600 text-center max-w-2xl mx-auto mb-6">
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
        <motion.div ref={ref} whileHover={{ scale: 1.05 }} className="text-center">
            <Card className="p-8 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0D7C53]/10 flex items-center justify-center text-[#0D7C53]">
                    {getIcon(fact.icon)}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                    {fact.number.includes('+') ? `${count}+` : `${count}%`}
                </div>
                <p className="text-gray-600 text-sm">{fact.label}</p>
            </Card>
        </motion.div>
    );
};

// ========== SUSTAINABILITY ==========
const SustainabilitySection = () => {
    return (
        <Section className="relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                <Leaf className="w-96 h-96 absolute top-0 left-0 text-[#0D7C53]" />
                <Leaf className="w-72 h-72 absolute bottom-0 right-0 text-[#0D7C53]" />
            </div>

            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4">
                    Sustainability
                </h2>
                <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
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
        <motion.div whileHover={{ y: -4 }} className="group">
            <Card className="p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-full bg-[#0D7C53]/10 flex items-center justify-center text-[#0D7C53] flex-shrink-0">
                    {getIcon(item.icon)}
                </div>
                <div>
                    <h3 className="text-gray-800 font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
            </Card>
        </motion.div>
    );
};

// ========== GALLERY ==========
const GallerySection = () => {
    return (
        <Section>
            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4">
                    Gallery
                </h2>
                <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
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
            whileHover={{ scale: 1.04 }}
            className="relative overflow-hidden rounded-2xl aspect-square group cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
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

// ========== FAQ ==========
const FAQSection = () => {
    return (
        <Section>
            <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-3">
                    FAQ
                </h2>
                <p className="text-gray-600 text-center max-w-2xl mx-auto mb-7">
                    Common questions about our coffee
                </p>
            </AnimatedSection>

            <div className="max-w-6xl mx-auto space-y-4">
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
            animate={{ backgroundColor: isOpen ? '#f8fafc' : 'white' }}
            className="rounded-2xl border border-gray-100/80 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex justify-between items-center text-left"
            >
                <span className="text-gray-800 font-medium">{faq.question}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#0D7C53]" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-[#0D7C53]" />
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
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
            </motion.div>
        </motion.div>
    );
};


// ========== MAIN PAGE ==========
const JourneyDetailsPage = () => {
    return (
        <div className="bg-[#FCF2E9] min-h-screen overflow-x-hidden">
            <HeroSection />
            <TimelineSection />
            <DetailedStepsSection />
            <BrewingMethodsSection />
            <CoffeeFactsSection />
            <SustainabilitySection />
            <GallerySection />
            <FAQSection />
        </div>
    );
};

export default JourneyDetailsPage;