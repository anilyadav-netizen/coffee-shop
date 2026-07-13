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
        <div className=" flex items-center justify-center font-serif py-12">
            <div className="max-w-[104rem] w-full mx-auto overflow-hidden p-6 md:p-10 transition-all duration-500 bg-[#FBF6F0]">

                {/* -------- LAYOUT: LEFT (text + timeline) + RIGHT (open image) -------- */}
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">

                    {/* ---------- LEFT SIDE ---------- */}
                    <div className="flex-1 w-full space-y-6 lg:pr-4">

                        {/* Badge - OUR JOURNEY with highlight */}
                        <div className="inline-block bg-[#FDE8D5] px-6 py-2 rounded-full text-xs tracking-[0.2em] uppercase text-[#99511a] font-sans font-semibold border-[#EAC4A3]">
                            {sectionData.badge}
                        </div>

                        {/* Heading */}
                        <h2 className="text-5xl font-bold">
                            From <span className="text-[#C56E2D]">Bean</span> to Cup
                        </h2>

                        {/* Subtitle */}
                        <p className="text-[#6B6B6B] text-base md:text-lg max-w-sm leading-relaxed">
                            {sectionData.subtitle}
                        </p>

                        {/* ---------- TIMELINE (horizontal with IMAGES in circles) ---------- */}
                        <div className="mt-8 w-full relative">

                            {/* Connecting line (behind circles) */}
                            <div className="absolute top-7 left-0 w-full h-0.5 bg-[#E8D8C8] -z-0"></div>

                            {/* Steps container */}
                            <div className="flex justify-between items-start relative z-10">
                                {allSteps.map((step, index) => {
                                    const isActive = activeStep === step.id;
                                    const isPast = step.id < activeStep;

                                    return (
                                        <div
                                            key={step.id}
                                            className="flex flex-col items-center cursor-pointer group transition-all duration-500"
                                            onClick={() => handleStepClick(step.id)}
                                        >
                                            {/* Circle with IMAGE inside - only one border */}
                                            <div
                                                className={`
                          w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden
                          border-2 transition-all duration-500 ease-in-out
                          flex items-center justify-center
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
                          mt-2 text-sm font-mono font-bold tracking-wider
                          ${isActive ? 'text-[#C8742C]' : 'text-[#6B6B6B]'}
                        `}
                                            >
                                                {step.stepNumber}
                                            </span>

                                            {/* Step title */}
                                            <span
                                                className={`
                          mt-0.5 text-xs md:text-sm font-medium text-center whitespace-nowrap
                          transition-colors duration-300
                          ${isActive ? 'text-[#4A2C1D] font-semibold' : 'text-[#6B6B6B] group-hover:text-[#4A2C1D]'}
                        `}
                                            >
                                                {step.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* ---------- RIGHT SIDE: BIG IMAGE (COMPLETELY OPEN - NO BORDER, NO DIV) ---------- */}
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
                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#4A2C1D] shadow-md">
                                {String(activeStep).padStart(2, "0")} / {String(allSteps.length).padStart(2, "0")}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Add custom animation keyframes */}
            <style >{`
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