// Contact.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Coffee,
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageSquare,
    User,
    ArrowRight,
    Globe,
    Heart,
    Sparkles,
    CheckCircle
} from 'lucide-react';


// Import data from contactData.js
import {
    contactInfo,
    socialLinks,
    heroData,
    formData as formDataConfig,
    mapData
} from '../Data/contactData';

const Contact = () => {
    const [scrollY, setScrollY] = useState(0);
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeField, setActiveField] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormState({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setIsSubmitted(false), 5000);
        }, 1500);
    };

    return (
        <>
            <div className="min-h-screen">
                {/* ========== HERO SECTION - UNCHANGED ========== */}
                <div className="relative  h-[50vh] md:h-[80vh] min-h-[400px] md:min-h-[500px] overflow-hidden">
                    {/* Background Image with Parallax */}
                    <div
                        className="absolute inset-0 w-full h-[115%] -top-[15%]"
                        style={{
                            transform: `translateY(${scrollY * 0.15}px) scale(${1 + scrollY * 0.0002})`,
                        }}
                    >
                        <img
                            src={heroData.backgroundImage}
                            alt="Contact CoffeeHub"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Multi-Layer Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/40"></div>

                    {/* Decorative Patterns */}
                    <div className="absolute inset-0 opacity-10">
                        {heroData.decorativeEmojis.map((emoji, index) => (
                            <div
                                key={index}
                                className={`absolute text-8xl ${index === 0 ? 'top-20 left-10 rotate-12' :
                                    index === 1 ? 'bottom-20 right-10 -rotate-12' :
                                        'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl'}`}
                            >
                                {emoji}
                            </div>
                        ))}
                    </div>

                    {/* Coffee Steam Effect */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-1/4 left-1/3 flex gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-white/30 rounded-full animate-steam"
                                    style={{
                                        height: `${30 + Math.random() * 40}px`,
                                        animationDelay: `${i * 0.4}s`,
                                        animationDuration: `${2 + Math.random() * 2}s`
                                    }}
                                />
                            ))}
                        </div>
                        <div className="absolute top-1/3 right-1/4 flex gap-3">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-0.5 bg-white/20 rounded-full animate-steam"
                                    style={{
                                        height: `${20 + Math.random() * 30}px`,
                                        animationDelay: `${i * 0.5 + 0.5}s`,
                                        animationDuration: `${2.5 + Math.random() * 1.5}s`
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-2 rounded-full mb-6 animate-fade-in-down">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                            <span className="text-white/90 text-sm font-medium tracking-wider">
                                {heroData.badge}
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
                            {heroData.title.split(' ').map((word, index) => (
                                word === heroData.titleHighlight ?
                                    <span key={index} className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D7C53] to-green-400">
                                        {word}
                                    </span> :
                                    <span key={index}>{word} </span>
                            ))}
                            <span className="block text-white">{heroData.subtitle}</span>
                        </h1>

                        <p className="text-white/80 max-w-2xl mx-auto text-base sm:text-lg md:text-xl animate-fade-in-up delay-200">
                            {heroData.description}
                        </p>

                        <div className="w-24 h-1 bg-gradient-to-r from-[#0D7C53] to-green-400 mx-auto mt-6 rounded-full animate-fade-in-up delay-300"></div>
                    </div>
                </div>

                {/* ========== CONTACT SECTION WITH GLASS EFFECT ========== */}
                <section className="relative py-10 px-4 overflow-hidden">
                    {/* Glass Background */}
                    <div className="absolute inset-0 -z-10">
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
                    </div>

                    <div className="max-w-[100rem] mx-auto relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {/* Contact Info - Left Side - Glass Effect */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 shadow-2xl shadow-black/5">
                                    <h2 className="text-2xl font-bold text-[#0D7C53] mb-2">
                                        Get in <span className="text-[#0D7C53]">Touch</span>
                                    </h2>
                                    <p className="text-gray-600 text-base mb-6">
                                        We'd love to hear from you. Reach out to us through any of the channels below.
                                    </p>

                                    <div className="space-y-4">
                                        {contactInfo.map((info) => {
                                            const IconComponent = info.icon;
                                            return (
                                                <div
                                                    key={info.id}
                                                    className="flex items-start gap-4 p-3 rounded-xl backdrop-blur-sm bg-white/40 border border-white/20 hover:bg-white/60 transition-all duration-300 group shadow-sm hover:shadow-md"
                                                >
                                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${info.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                        <IconComponent className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 text-lg">{info.title}</h4>
                                                        {info.details.map((detail, i) => (
                                                            <p key={i} className="text-gray-600 text-sm">{detail}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Social Links - Glass Effect */}
                                    <div className="mt-6 pt-6 border-t border-white/20">
                                        <p className="text-sm font-medium text-gray-600 mb-4">Follow us on social media</p>
                                        <div className="flex gap-3">
                                            {socialLinks.map((social) => {
                                                const IconComponent = social.icon;
                                                return (
                                                    <a
                                                        key={social.id}
                                                        href={social.url}
                                                        className={`p-3 backdrop-blur-sm bg-white/40 border border-white/20 rounded-xl text-gray-600 transition-all duration-300 hover:text-white ${social.color} hover:shadow-lg hover:scale-110`}
                                                        aria-label={social.label}
                                                    >
                                                        <IconComponent className="w-5 h-5" />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form - Right Side - Glass Effect */}
                            <div className="lg:col-span-3">
                                <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-10 shadow-2xl shadow-black/5">
                                    <div className="mb-7">
                                        <h3 className="text-2xl font-bold text-[#0D7C53]">
                                            {formDataConfig.title.split(' ').map((word, index) => (
                                                word === formDataConfig.titleHighlight ?
                                                    <span key={index} className="text-[#0D7C53]">{word} </span> :
                                                    <span key={index}>{word} </span>
                                            ))}
                                        </h3>
                                        <p className="text-gray-600 text-base">
                                            {formDataConfig.description}
                                        </p>
                                    </div>

                                    {isSubmitted ? (
                                        <div className="backdrop-blur-sm bg-green-50/60 border border-green-200/50 rounded-xl p-6 text-center animate-fade-in-up">
                                            <div className="w-16 h-16 bg-green-100/80 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="w-8 h-8 text-green-500" />
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-800">
                                                {formDataConfig.successMessage.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm mt-2">
                                                {formDataConfig.successMessage.description}
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {/* Dynamic Form Fields */}
                                            {formDataConfig.fields.map((field) => {
                                                const IconComponent = field.icon === 'User' ? User : Mail;
                                                const isActive = activeField === field.id;
                                                return (
                                                    <div key={field.id}>
                                                        <label className="block text-lg font-medium text-gray-700 mb-2">
                                                            {field.label}
                                                        </label>
                                                        <div className="relative">
                                                            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${isActive ? 'ring-2 ring-[#0D7C53] ring-offset-2' : ''
                                                                }`}></div>
                                                            <IconComponent className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isActive ? 'text-[#0D7C53]' : 'text-gray-400'
                                                                }`} />
                                                            <input
                                                                type={field.type}
                                                                name={field.name}
                                                                value={formState[field.name]}
                                                                onChange={handleChange}
                                                                onFocus={() => setActiveField(field.id)}
                                                                onBlur={() => setActiveField(null)}
                                                                required={field.required}
                                                                placeholder={field.placeholder}
                                                                className="w-full pl-10 pr-4 py-3 backdrop-blur-sm bg-white/40 border rounded-lg focus:outline-none  border-green-200 transition-all duration-300 text-gray-800 placeholder:text-gray-400"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Message Field */}
                                            <div>
                                                <label className="block text-lg font-medium text-gray-700 mb-1.5">
                                                    {formDataConfig.messageField.label}
                                                </label>
                                                <div className="relative">
                                                    <MessageSquare className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-300 ${activeField === 'message' ? 'text-[#0D7C53]' : 'text-gray-400'
                                                        }`} />
                                                    <textarea
                                                        name={formDataConfig.messageField.name}
                                                        value={formState[formDataConfig.messageField.name]}
                                                        onChange={handleChange}
                                                        onFocus={() => setActiveField('message')}
                                                        onBlur={() => setActiveField(null)}
                                                        required={formDataConfig.messageField.required}
                                                        rows={formDataConfig.messageField.rows}
                                                        placeholder={formDataConfig.messageField.placeholder}
                                                        className="w-full pl-10 pr-4 py-3 backdrop-blur-sm bg-white/40 border rounded-lg focus:outline-none  border-green-200 transition-all duration-300 text-gray-800 placeholder:text-gray-400"
                                                    ></textarea>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`w-full py-3.5 bg-gradient-to-r mt-2 from-[#0D7C53] to-green-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#0D7C53]/20 ${isSubmitting
                                                        ? 'opacity-70 cursor-not-allowed'
                                                        : 'hover:shadow-xl hover:shadow-[#0D7C53]/30 hover:scale-[1.02]'
                                                    }`}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        {formDataConfig.submitButton.loadingText}
                                                    </>
                                                ) : (
                                                    <>
                                                        {formDataConfig.submitButton.text}
                                                        <Send className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== MAP / LOCATION SECTION - Glass Effect ========== */}
                <section className="relative px-4 py-10 overflow-hidden">
                    {/* Glass Background for Map Section */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-amber-50/80 to-orange-50/70" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/20 via-transparent to-orange-100/10" />
                        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-200/15 rounded-full blur-[100px]" />
                    </div>

                    <div className="max-w-[100rem] mx-auto relative z-10">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-[#0D7C53]">
                                {mapData.title.split(' ').map((word, index) => (
                                    word === mapData.titleHighlight ?
                                        <span key={index} className="text-[#0D7C53]">{word} </span> :
                                        <span key={index}>{word} </span>
                                ))}
                            </h2>
                            <div className="w-16 h-1 bg-[#0D7C53] mx-auto mt-3 rounded-full"></div>
                        </div>
                        <div className="w-full overflow-hidden rounded-3xl shadow-2xl border-4 border-white/30 backdrop-blur-sm">
                            <iframe
                                src={mapData.embedUrl}
                                className="w-full h-[400px]"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Map"
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fade-in-down {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes steam {
                    0% {
                        transform: translateY(0) scaleY(0.5);
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.8;
                        transform: translateY(-20px) scaleY(1);
                    }
                    100% {
                        transform: translateY(-40px) scaleY(0.5);
                        opacity: 0;
                    }
                }

                @keyframes scroll {
                    0% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                }

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

                .animate-fade-in-down {
                    animation: fade-in-down 0.8s ease-out forwards;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }

                .animate-steam {
                    animation: steam 2.5s ease-out infinite;
                    transform-origin: bottom;
                }

                .animate-scroll {
                    animation: scroll 1.5s ease-in-out infinite;
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

                .delay-200 {
                    animation-delay: 200ms;
                }

                .delay-300 {
                    animation-delay: 300ms;
                }
            `}</style>
        </>
    );
};

export default Contact;