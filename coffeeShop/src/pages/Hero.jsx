// src/components/Hero.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import video from '../assets/Video/coffeeVideo.mp4';
import Navbar from '../component/Navbar';

const Hero = () => {
    const [scrollY, setScrollY] = useState(0);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const navigate = useNavigate();
    const videoRef = useRef(null);

    const stats = [
        { number: "10+", label: "Years Experience", icon: <Clock size={24} /> },
        { number: "50+", label: "Coffee Blends", icon: <Coffee size={24} /> },
        { number: "5K+", label: "Happy Customers", icon: <TrendingUp size={24} /> },
    ];

    // Parallax scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle video loading
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Video autoplay failed:", error);
            });
        }
    }, []);

    const handleOrderNow = () => {
        navigate('/menu');
    };

    const handleExploreMenu = () => {
        navigate('/menu');
    };

    // ✨ Premium Text Animation Variants
    const textRevealFromLeft = {
        hidden: { 
            opacity: 0, 
            x: -120,
            rotateY: -20,
            filter: "blur(10px)"
        },
        visible: {
            opacity: 1,
            x: 0,
            rotateY: 0,
            filter: "blur(0px)",
            transition: {
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { duration: 0.8 }
            }
        }
    };

    const textRevealFromRight = {
        hidden: { 
            opacity: 0, 
            x: 120,
            rotateY: 20,
            filter: "blur(10px)"
        },
        visible: {
            opacity: 1,
            x: 0,
            rotateY: 0,
            filter: "blur(0px)",
            transition: {
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { duration: 0.8 }
            }
        }
    };

    const textRevealFromTop = {
        hidden: { 
            opacity: 0, 
            y: -80,
            rotateX: -15,
            scale: 0.9,
            filter: "blur(8px)"
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { duration: 0.6 }
            }
        }
    };

    const textRevealFromBottom = {
        hidden: { 
            opacity: 0, 
            y: 80,
            rotateX: 15,
            scale: 0.95,
            filter: "blur(8px)"
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { duration: 0.6 }
            }
        }
    };

    // ✨ Premium Character-by-Character Animation for Heading
    const characterVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            rotateX: -30,
            filter: "blur(5px)",
            scale: 0.8
        },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                delay: i * 0.05,
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
                opacity: { duration: 0.4 }
            }
        })
    };

    // ✨ Staggered container for text groups
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.3
            }
        }
    };

    // ✨ Glow animation for premium text effect
    const glowVariants = {
        hidden: { 
            textShadow: "0 0 0px rgba(21, 168, 114, 0)"
        },
        visible: {
            textShadow: [
                "0 0 20px rgba(21, 168, 114, 0.3)",
                "0 0 40px rgba(21, 168, 114, 0.1)",
                "0 0 20px rgba(21, 168, 114, 0.3)"
            ],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    // ✨ Float animation for premium feel
    const floatVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        },
        float: {
            y: [-5, 5, -5],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        },
        tap: {
            scale: 0.95
        }
    };

    // Split text into characters for animation
    const headingText = "Perfect Cup";
    const headingChars = headingText.split("");

    return (
        <div className="relative h-[48vh] md:h-[80vh] min-h-[400px] md:min-h-[500px] lg:min-h-screen overflow-hidden">
            {/* ✅ Navbar Component */}
            <Navbar />

            {/* ✅ Hero Background with Video + Parallax */}
            <div className="absolute inset-0 w-full h-[60vh] md:h-full">
                <motion.div
                    className="w-full h-[40vh] md:h-full relative overflow-hidden"
                    style={{
                        transform: `scale(${1 + scrollY * 0.001})`,
                    }}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{
                        scale: 1 + scrollY * 0.001,
                        opacity: 1
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        onLoadedData={() => setIsVideoLoaded(true)}
                    >
                        <source src={video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Loading overlay while video loads */}
                    {!isVideoLoaded && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-[#0D7C53] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </motion.div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>

                {/* Radial Gradient for Depth */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50"></div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
            </div>

            {/* Hero Content */}
            <div className="relative z-20 w-full h-[53vh] md:h-screen flex flex-col items-center justify-center px-4">
                <motion.div
                    className="text-center max-w-4xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* ✨ Badge - Premium Top Reveal */}
                    <motion.div
                        className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-6 py-2 rounded-full mb-1 md:mb-6 backdrop-blur-sm"
                        variants={textRevealFromTop}
                    >
                        <motion.span 
                            className="w-2 h-2 bg-green-400 rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [1, 0.5, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <span className="text-white/90 text-sm font-medium tracking-wider">
                            Now Open - 20% Off First Order
                        </span>
                    </motion.div>

                    {/* ✨ Main Heading with Premium Animations */}
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-8xl font-bold text-white mb-2 md:mb-6 leading-tight"
                        variants={containerVariants}
                    >
                        {/* "Discover Your" - From Left with 3D effect */}
                        <motion.span 
                            className="block"
                            variants={textRevealFromLeft}
                            whileHover={{
                                scale: 1.02,
                                transition: { duration: 0.3 }
                            }}
                        >
                            Discover Your
                        </motion.span>
                        
                        {/* "Perfect Cup" - Character by character from bottom with glow */}
                        <motion.span 
                            className="block text-transparent bg-clip-text bg-gradient-to-r from-[#15a872] to-green-500"
                            variants={textRevealFromRight}
                            whileHover={{
                                scale: 1.02,
                                transition: { duration: 0.3 }
                            }}
                        >
                            {headingChars.map((char, index) => (
                                <motion.span
                                    key={index}
                                    custom={index}
                                    variants={characterVariants}
                                    className="inline-block"
                                    style={{ display: 'inline-block' }}
                                    whileHover={{
                                        y: -5,
                                        scale: 1.1,
                                        color: '#15a872',
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </motion.span>
                    </motion.h1>

                    {/* ✨ Description - Premium Bottom Reveal with Float */}
                    <motion.p
                        className="hidden md:block text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-3 md:mb-8 font-light tracking-wide"
                        variants={floatVariants}
                        animate="visible"
                        whileHover={{
                            scale: 1.02,
                            letterSpacing: "2px",
                            transition: { duration: 0.3 }
                        }}
                    >
                        <motion.span
                            variants={textRevealFromBottom}
                        >
                            Experience the art of coffee with our carefully crafted blends,
                            sourced from the finest beans around the world.
                        </motion.span>
                    </motion.p>

                    {/* ✨ Action Buttons - Premium Bottom Reveal */}
                    <motion.div
                        className="flex flex-row items-center justify-center gap-3 md:gap-4"
                        variants={containerVariants}
                    >
                        <motion.button
                            onClick={handleOrderNow}
                            variants={{
                                ...buttonVariants,
                                hidden: { 
                                    opacity: 0, 
                                    y: 60,
                                    scale: 0.8,
                                    rotateX: -20
                                },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    rotateX: 0,
                                    transition: {
                                        duration: 0.8,
                                        ease: [0.34, 1.56, 0.64, 1],
                                        opacity: { duration: 0.6 }
                                    }
                                }
                            }}
                            whileHover="hover"
                            whileTap="tap"
                            className="group relative inline-flex items-center gap-2 px-3 sm:px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-full transition-all duration-300 shadow-2xl shadow-[#0D7C53]/25 hover:shadow-[#0D7C53]/50 hover:scale-105 whitespace-nowrap"
                        >
                            <motion.span 
                                className="font-semibold text-sm md:text-lg tracking-wide"
                                whileHover={{ letterSpacing: "1px" }}
                            >
                                Order Now
                            </motion.span>

                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <ArrowRight size={18} />
                            </motion.div>

                            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        </motion.button>

                        <motion.button
                            onClick={handleExploreMenu}
                            variants={{
                                ...buttonVariants,
                                hidden: { 
                                    opacity: 0, 
                                    y: 60,
                                    scale: 0.8,
                                    rotateX: -20
                                },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    rotateX: 0,
                                    transition: {
                                        duration: 0.8,
                                        delay: 0.1,
                                        ease: [0.34, 1.56, 0.64, 1],
                                        opacity: { duration: 0.6 }
                                    }
                                }
                            }}
                            whileHover="hover"
                            whileTap="tap"
                            className="px-3 sm:px-4 md:px-8 py-2.5 md:py-4 border-2 border-white/30 hover:border-white/60 text-white rounded-full transition-all duration-300 hover:bg-white/10 backdrop-blur-sm font-medium text-sm md:text-base tracking-wide whitespace-nowrap"
                        >
                            <motion.span
                                whileHover={{ letterSpacing: "2px" }}
                                transition={{ duration: 0.3 }}
                            >
                                Explore Menu
                            </motion.span>
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* ✨ Stats - Premium Bottom Reveal with Glow */}
                <motion.div
                    className="absolute bottom-16 md:bottom-32 inset-x-0 z-20 hidden md:flex justify-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex gap-8 bg-black/40 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center gap-3 text-white"
                                variants={{
                                    hidden: { 
                                        opacity: 0, 
                                        y: 40,
                                        scale: 0.9
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        transition: {
                                            duration: 0.6,
                                            delay: index * 0.15,
                                            ease: [0.34, 1.56, 0.64, 1]
                                        }
                                    }
                                }}
                                whileHover={{ 
                                    scale: 1.1,
                                    transition: { type: "spring", stiffness: 300 }
                                }}
                            >
                                <motion.span 
                                    className="text-[#0D7C53]"
                                    whileHover={{
                                        rotate: [0, -10, 10, 0],
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {stat.icon}
                                </motion.span>
                                <div>
                                    <motion.p 
                                        className="text-2xl font-bold bg-gradient-to-r from-white to-[#15a872] bg-clip-text text-transparent"
                                        whileHover={{
                                            scale: 1.05,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        {stat.number}
                                    </motion.p>
                                    <p className="text-xs text-white/70 tracking-wider">{stat.label}</p>
                                </div>
                                {index < stats.length - 1 && (
                                    <div className="w-px h-10 bg-white/10"></div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;