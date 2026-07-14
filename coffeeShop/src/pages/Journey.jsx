import React, { useState, useEffect } from 'react';
import {
    JOURNEY_STEPS,
    JOURNEY_SECTION_DATA,
    getJourneyStepById
} from '../Data/journeyData';

const Journey = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const currentStep = getJourneyStepById(activeStep);
    const sectionData = JOURNEY_SECTION_DATA;
    const allSteps = JOURNEY_STEPS;

    // Auto-change active step every 2.5s
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev % allSteps.length) + 1);
        }, 2500);
        return () => clearInterval(interval);
    }, [isAutoPlaying, allSteps.length]);

    // Manual step click: pause autoplay for 5s then resume
    const handleStepClick = (stepId) => {
        setActiveStep(stepId);
        setIsAutoPlaying(false);
        setTimeout(() => {
            setIsAutoPlaying(true);
        }, 5000);
    };

    return (
        <div className="flex items-center justify-center font-serif py-8 md:py-12">
            <div className="max-w-[104rem] w-full mx-auto overflow-hidden p-4 md:p-6 lg:p-10 transition-all duration-500 bg-[#FBF6F0]">

                {/* -------- LAYOUT: LEFT (text + timeline) + RIGHT (open image) -------- */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-12 items-start">

                    {/* ---------- LEFT SIDE ---------- */}
                    <div className="flex-1 w-full space-y-4 md:space-y-6 lg:pr-4">

                        {/* Badge - OUR JOURNEY with highlight */}
                        <div className="inline-block bg-[#FDE8D5] px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#99511a] font-sans font-semibold border-[#EAC4A3]">
                            {sectionData.badge}
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                            From <span className="text-[#C56E2D]">Bean</span> to Cup
                        </h2>

                        {/* Subtitle */}
                        <p className="text-[#6B6B6B] text-sm md:text-base lg:text-lg max-w-sm leading-relaxed">
                            {sectionData.subtitle}
                        </p>

                        {/* ---------- TIMELINE (horizontal with IMAGES in circles) ---------- */}
                        <div className="mt-6 md:mt-8 w-full relative">
                            {/* Steps container - now with flex-wrap for smaller screens */}
                            <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 sm:gap-2 relative">
                                {allSteps.map((step, index) => {
                                    const isActive = activeStep === step.id;
                                    const isPast = step.id < activeStep;
                                    const isLast = index === allSteps.length - 1;

                                    return (
                                        <div key={step.id} className="flex items-center flex-shrink-0">
                                            {/* Step Circle */}
                                            <div
                                                className="flex flex-col items-center cursor-pointer group transition-all duration-500"
                                                onClick={() => handleStepClick(step.id)}
                                            >
                                                {/* Circle with IMAGE inside */}
                                                <div
                                                    className={`
                                                        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 
                                                        rounded-full overflow-hidden
                                                        border-2 transition-all duration-500 ease-in-out
                                                        flex items-center justify-center
                                                        bg-[#FBF6F0]
                                                        relative z-10
                                                        ${isActive
                                                            ? 'border-[#C8742C] shadow-lg scale-110'
                                                            : isPast
                                                                ? 'border-[#C8742C] opacity-60'
                                                                : 'border-[#E8D8C8] group-hover:border-[#C8742C]'
                                                        }
                                                    `}
                                                >
                                                    <img
                                                        src={step.leftImage}
                                                        alt={step.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Step number */}
                                                <span
                                                    className={`
                                                        mt-1.5 md:mt-2 text-[10px] sm:text-xs md:text-sm font-mono font-bold tracking-wider
                                                        ${isActive ? 'text-[#C8742C]' : 'text-[#6B6B6B]'}
                                                    `}
                                                >
                                                    {step.stepNumber}
                                                </span>

                                                {/* Step title - hidden on very small screens */}
                                                <span
                                                    className={`
                                                        hidden sm:block mt-0.5 text-[10px] sm:text-xs md:text-sm font-medium text-center 
                                                        transition-colors duration-300
                                                        ${isActive ? 'text-[#4A2C1D] font-semibold' : 'text-[#6B6B6B] group-hover:text-[#4A2C1D]'}
                                                    `}
                                                >
                                                    {step.title}
                                                </span>
                                            </div>

                                            {/* Connecting Line - only show if not last and not wrapping */}
                                            {!isLast && (
                                                <div className="hidden sm:block flex-1 min-w-[90px] max-w-[90px] lg:max-w-[90px] xl:max-w-[160px] h-0.5 bg-[#E8D8C8] relative -mt-6 sm:-mt-7 md:-mt-8 lg:-mt-10">
                                                    {/* Extended line with extra width */}
                                                    <div className="absolute top-0 left-0 w-full h-full">
                                                        <div className="absolute top-0 -left-0.5 sm:-left-1 w-[calc(100%+4px)] sm:w-[calc(100%+8px)] h-full">
                                                            {/* Active line fill */}
                                                            <div 
                                                                className={`
                                                                    absolute top-0 left-0 h-full bg-[#C8742C] transition-all duration-500
                                                                    ${activeStep > step.id ? 'w-full' : 'w-0'}
                                                                `}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Mobile line indicator - shows progress on small screens */}
                            {/* <div className="md:hidden mt-6 w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-[#6B6B6B]">Progress</span>
                                    <span className="text-xs font-bold text-[#C8742C]">
                                        {activeStep}/{allSteps.length}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-[#E8D8C8] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#C8742C] rounded-full transition-all duration-500"
                                        style={{ width: `${(activeStep / allSteps.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div> */}
                        </div>

                    </div>

                    {/* ---------- RIGHT SIDE: BIG IMAGE ---------- */}
                    <div className="flex-1 w-full lg:max-w-md xl:max-w-lg">
                        <div
                            key={currentStep?.id}
                            className="
                                relative
                                w-full
                                aspect-[4/3]
                                bg-cover
                                bg-center
                                bg-no-repeat
                                rounded-2xl
                                overflow-hidden
                                transition-all
                                duration-700
                                ease-in-out
                                hover:scale-[1.02]
                            "
                            style={{
                                backgroundImage: `url(${currentStep?.rightImage})`,
                            }}
                        >
                            {/* Soft Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>

                            {/* Step Indicator */}
                            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/90 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold text-[#4A2C1D] shadow-md">
                                {String(activeStep).padStart(2, "0")} / {String(allSteps.length).padStart(2, "0")}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Add custom animation keyframes */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.7s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Journey;