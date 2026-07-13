// journeyData.js

// Import all journey images (Left side - circles)
import journey1 from '../assets/Images/journey1.jpg'
import journey2 from '../assets/Images/journey2.jpg'
import journey3 from '../assets/Images/journey3.jpg'
import journey4 from '../assets/Images/journey4.jpg'
import journey5 from '../assets/Images/journey5.jpg'

// Right side images (step ke hisaab se change)
import step1 from '../assets/Images/step1.jpg'
import step2 from '../assets/Images/step2.jpg'
import step3 from '../assets/Images/step3.jpg'
import step4 from '../assets/Images/step4.jpg'
import step5 from '../assets/Images/step5.jpg'

// Coffee Journey Steps Data
export const JOURNEY_STEPS = [
    {
        id: 1,
        title: "100% Premium Beans",
        subtitle: "From Bean to Cup",
        stepNumber: "01",
        leftImage: journey1,  // Left side circle me journey1
        rightImage: step1,    // Right side big image me step1
        description: "A journey where premium coffee meets community."
    },
    {
        id: 2,
        title: "Careful Selection",
        subtitle: "From Bean to Cup",
        stepNumber: "02",
        leftImage: journey2,  // Left side circle me journey2
        rightImage: step2,    // Right side big image me step2
        description: "A journey where premium coffee meets community."
    },
    {
        id: 3,
        title: "Expert Roasting",
        subtitle: "From Bean to Cup",
        stepNumber: "03",
        leftImage: journey3,  // Left side circle me journey3
        rightImage: step3,    // Right side big image me step3
        description: "A journey where premium coffee meets community."
    },
    {
        id: 4,
        title: "Perfect Brewing",
        subtitle: "From Bean to Cup",
        stepNumber: "04",
        leftImage: journey4,  // Left side circle me journey4
        rightImage: step4,    // Right side big image me step4
        description: "A journey where premium coffee meets community."
    },
    {
        id: 5,
        title: "Freshly Served",
        subtitle: "From Bean to Cup",
        stepNumber: "05",
        leftImage: journey5,  // Left side circle me journey5
        rightImage: step5,    // Right side big image me step5
        description: "A journey where premium coffee meets community."
    }
];

// Section Data
export const JOURNEY_SECTION_DATA = {
    badge: "OUR JOURNEY",
    subtitle: "A journey where premium coffee meets community."
};

// Helper functions
export const getJourneySteps = () => JOURNEY_STEPS;
export const getJourneyStepById = (id) => JOURNEY_STEPS.find(step => step.id === id);
export const getJourneySectionData = () => JOURNEY_SECTION_DATA;
export const getJourneyStepCount = () => JOURNEY_STEPS.length;