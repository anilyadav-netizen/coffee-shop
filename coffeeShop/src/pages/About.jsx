import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Coffee,
    Award,
    Heart,
    Users,
    Leaf,
    Clock,
    Star,
    Quote,
    ArrowRight,
    Play,
    MapPin,
    Trophy,
    Sparkles,
    Shield,
    Truck,
    Zap,
    Coffee as CoffeeIcon
} from 'lucide-react';
import Footer from '../component/Footer';
import {
    STATS_DATA,
    VALUES_DATA,
    TEAM_DATA,
    HERO_DATA,
    STORY_DATA,
    VALUES_SECTION_DATA,
    TEAM_SECTION_DATA,
    CTA_DATA,
    getStats,
    getValues,
    getTeam,
    getHeroData,
    getStoryData,
    getValuesSectionData,
    getTeamSectionData,
    getCtaData
} from '../data/aboutData';

const About = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Get data from global
    const stats = getStats();
    const values = getValues();
    const team = getTeam();
    const hero = getHeroData();
    const story = getStoryData();
    const valuesSection = getValuesSectionData();
    const teamSection = getTeamSectionData();
    const cta = getCtaData();

    // Icon mapping
    const getIcon = (iconName, className = "w-6 h-6") => {
        const icons = {
            Trophy: <Trophy className={className} />,
            Coffee: <Coffee className={className} />,
            Users: <Users className={className} />,
            Leaf: <Leaf className={className} />,
            Heart: <Heart className={className} />,
            Shield: <Shield className={className} />,
            Truck: <Truck className={className} />,
            Zap: <Zap className={className} />
        };
        return icons[iconName] || <Coffee className={className} />;
    };

    return (
        <>
            <div className="min-h-screen bg-[#FCF2E9]">
                {/* ========== HERO SECTION - UNCHANGED ========== */}
                <div className="relative h-[50vh] md:h-[80vh] min-h-[400px] md:min-h-[500px] overflow-hidden">
                    <div
                        className="absolute inset-0 w-full h-[120%] -top-[10%]"
                        style={{
                            transform: `translateY(${scrollY * 0.2}px) scale(${1 + scrollY * 0.0003})`,
                        }}
                    >
                        <img
                            src={hero.image}
                            alt="About CoffeeHub"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>

                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-10 text-8xl rotate-12">☕</div>
                        <div className="absolute bottom-20 right-10 text-8xl -rotate-12">🫘</div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl">☕</div>
                    </div>

                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-6 py-2 rounded-full mb-6 animate-fade-in-down">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                            <span className="text-white/90 text-sm font-medium tracking-wider">{hero.badge}</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-2 md:mb-6 leading-tight animate-fade-in-up">
                            {hero.title}
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0D7C53] to-green-400">
                                {hero.highlight}
                            </span>
                        </h1>

                        <p className="text-white/80 max-w-2xl mx-auto text-base sm:text-lg md:text-xl animate-fade-in-up delay-200">
                            {hero.subtitle}
                        </p>

                        <div className="w-24 h-1 bg-gradient-to-r from-[#0D7C53] to-green-400 mx-auto mt-2 md:mt-6 rounded-full animate-fade-in-up delay-300"></div>

                        <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                                <div className="w-1 h-2 bg-white/50 rounded-full animate-scroll"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== OUR STORY SECTION WITH GLASS EFFECT ========== */}
                <section className="relative py-6 md:py-14 px-4 overflow-hidden">
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

                    <div className="max-w-[104rem] mx-auto relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="relative order-2 lg:order-1">
                                <div className="relative rounded-3xl overflow-hidden shadow-md shadow-black/5 border border-white/30  bg-white/10">
                                    <img
                                        src={story.image}
                                        alt="Our Story"
                                        className="w-full h-[440px] object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6  bg-white/40 border border-white/30 rounded-xl p-4 shadow-md">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#0D7C53] p-2 rounded-lg">
                                                <Coffee className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Since {story.since}</p>
                                                <p className="text-sm font-bold text-gray-800">{story.experience}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#0D7C53]/10 rounded-full blur-2xl"></div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                            </div>

                            <div className="order-1 lg:order-2">
                                <div className="inline-flex items-center gap-2 bg-[#0D7C53]/10  px-4 py-1.5 rounded-full mb-4 border border-white/20">
                                    <span className="text-[#0D7C53] text-sm font-semibold tracking-wider">{story.badge}</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                    {story.title} <span className="text-[#0D7C53]">{story.highlight}</span>
                                </h2>
                                <div className="w-16 h-1 bg-[#0D7C53] rounded-full mb-6"></div>
                                <p className="text-gray-600 leading-relaxed mb-4 text-lg">
                                    {story.description1}
                                </p>
                                <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                                    {story.description2}
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    {story.highlights.map((highlight, index) => (
                                        <div key={index} className="flex items-center gap-2  bg-white/20 border border-white/30 p-3 rounded-xl shadow-xl shadow-black/5">
                                            {getIcon(highlight.icon, "w-5 h-5 text-[#0D7C53]")}
                                            <span className="text-base font-medium text-gray-700">{highlight.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== CORE VALUES WITH GLASS EFFECT ========== */}
                <section className="relative px-4 py-5 overflow-hidden">
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
                    <div className="max-w-[102rem] mx-auto relative z-10">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                                {valuesSection.title} <span className="text-[#0D7C53]">{valuesSection.highlight}</span>
                            </h2>
                            <div className="w-16 h-1 bg-[#0D7C53] mx-auto mt-4 rounded-full"></div>
                            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                                {valuesSection.subtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="group  bg-white/20 border border-white/30 rounded-2xl p-6 shadow-md shadow-black/5 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 text-center"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0D7C53]/20  rounded-2xl text-[#0D7C53] group-hover:bg-[#0D7C53] group-hover:text-white transition-all duration-300 mb-4">
                                        {getIcon(value.icon, "w-8 h-8")}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{value.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== TEAM SECTION WITH GLASS EFFECT ========== */}
                <section className="relative py-10 px-4 overflow-hidden">
                    {/* Glass Background */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" />
                        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                        <div className="absolute inset-0 pointer-events-none opacity-10">
                            <div className="absolute top-20 left-10 text-6xl rotate-12 animate-float">🫘</div>
                            <div className="absolute bottom-32 right-20 text-6xl -rotate-12 animate-float-delay">☕</div>
                        </div>
                    </div>

                    <div className="max-w-[100rem] mx-auto relative z-10">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 bg-[#0D7C53]/10  px-4 py-1.5 rounded-full mb-4 border border-white/20">
                                <span className="text-[#0D7C53] text-sm font-semibold tracking-wider">{teamSection.badge}</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                                {teamSection.title} <span className="text-[#0D7C53]">{teamSection.highlight}</span>,
                                <br className="sm:hidden" /> {teamSection.subtitle} <span className="text-[#0D7C53]">{teamSection.highlight2}</span>
                            </h2>
                            <div className="w-16 h-1 bg-[#0D7C53] mx-auto mt-4 rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {team.map((member) => (
                                <div
                                    key={member.id}
                                    className="group  bg-white/20 border border-white/30 rounded-2xl overflow-hidden shadow-md shadow-black/5 hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-5 text-center">
                                        <h3 className="font-bold text-gray-800">{member.name}</h3>
                                        <p className="text-sm text-[#0D7C53] font-medium">{member.role}</p>
                                        <p className="text-xs text-gray-500 mt-1">{member.experience}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
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
                
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes scroll {
                    0% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(8px); }
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
                
                .animate-fade-in-down {
                    animation: fade-in-down 0.8s ease-out forwards;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                
                .animate-scroll {
                    animation: scroll 1.5s ease-in-out infinite;
                }
                
                .delay-200 { animation-delay: 200ms; }
                .delay-300 { animation-delay: 300ms; }
            `}</style>
        </>
    );
};

export default About;