import React, { useState, useEffect } from 'react';
import {
  JOURNEY_STEPS,
  JOURNEY_SECTION_DATA,
  getJourneyStepById,
  getFixedImage
} from '../Data/journeyData';

const Journey = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentStep = getJourneyStepById(activeStep);
  const sectionData = JOURNEY_SECTION_DATA;
  const allSteps = JOURNEY_STEPS;
  const fixedImage = getFixedImage(); // Fixed image for right side

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
    <div className="bg-[#FDF8F2] min-h-screen flex items-center justify-center p-6 font-serif">
      <div className="max-w-[95rem] w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10 transition-all duration-500">

        {/* -------- LAYOUT: LEFT (text + timeline) + RIGHT (fixed image) -------- */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-center">

          {/* ---------- LEFT SIDE ---------- */}
          <div className="flex-1 w-full space-y-6 lg:pr-4">

            {/* Badge */}
            <div className="inline-block bg-[#FFF7EF] border border-[#E8D8C8] rounded-full px-5 py-1.5 text-xs tracking-[0.2em] uppercase text-[#C8742C] font-sans font-semibold">
              {sectionData.badge}
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4A2C1D] leading-tight">
              {sectionData.title}
            </h1>

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
                      {/* Circle with IMAGE inside - using your imported images */}
                      <div
                        className={`
                          w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden
                          border-2 transition-all duration-500 ease-in-out
                          flex items-center justify-center
                          ${isActive
                            ? 'border-[#C8742C] shadow-lg scale-110 ring-4 ring-[#C8742C] ring-offset-2'
                            : isPast
                            ? 'border-[#C8742C] opacity-60'
                            : 'border-[#E8D8C8] group-hover:border-[#C8742C]'
                          }
                        `}
                      >
                        <img
                          src={step.image}
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

          {/* ---------- RIGHT SIDE: FIXED IMAGE (SingleImage.png) ---------- */}
          <div className="flex-1 w-full lg:max-w-md xl:max-w-lg">
            <div className="relative overflow-hidden rounded-2xl shadow-xl bg-[#FFF7EF] border border-[#E8D8C8] transition-all duration-500">
              {/* Fixed image - never changes */}
              <div
                className="relative w-full aspect-[4/3] bg-cover bg-center transition-all duration-700 ease-in-out transform hover:scale-[1.02]"
                style={{ backgroundImage: `url(${fixedImage})` }}
              >
                <div className="absolute inset-0 bg-black/5"></div>
              </div>
              {/* Step indicator on image */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#4A2C1D] shadow-md">
                {String(activeStep).padStart(2, '0')} / {String(allSteps.length).padStart(2, '0')}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Journey;