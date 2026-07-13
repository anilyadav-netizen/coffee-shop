// journeyData.js

// Import all journey images
import journey1 from '../assets/Images/journey1.jpg'
import journey2 from '../assets/Images/journey2.jpg'
import journey3 from '../assets/Images/journey3.jpg'
import journey4 from '../assets/Images/journey4.jpg'
import journey5 from '../assets/Images/journey5.jpg'
import SingleImage from '../assets/Images/SingleImage.png'

// Coffee Journey Steps Data
export const JOURNEY_STEPS = [
    {
        id: 1,
        title: "100% Premium Beans",
        subtitle: "From Bean to Cup",
        stepNumber: "01",
        image: journey1,  // Left side circle me journey1
        description: "A journey where premium coffee meets community."
    },
    {
        id: 2,
        title: "Careful Selection",
        subtitle: "From Bean to Cup",
        stepNumber: "02",
        image: journey2,  // Left side circle me journey2
        description: "A journey where premium coffee meets community."
    },
    {
        id: 3,
        title: "Expert Roasting",
        subtitle: "From Bean to Cup",
        stepNumber: "03",
        image: journey3,  // Left side circle me journey3
        description: "A journey where premium coffee meets community."
    },
    {
        id: 4,
        title: "Perfect Brewing",
        subtitle: "From Bean to Cup",
        stepNumber: "04",
        image: journey4,  // Left side circle me journey4
        description: "A journey where premium coffee meets community."
    },
    {
        id: 5,
        title: "Freshly Served",
        subtitle: "From Bean to Cup",
        stepNumber: "05",
        image: journey5,  // Left side circle me journey5
        description: "A journey where premium coffee meets community."
    }
];

// Fixed image for right side
export const FIXED_IMAGE = SingleImage;

// Section Data
export const JOURNEY_SECTION_DATA = {
    badge: "OUR JOURNEY",
    title: "From Bean to Cup",
    subtitle: "A journey where premium coffee meets community."
};

// Helper functions
export const getJourneySteps = () => JOURNEY_STEPS;
export const getJourneyStepById = (id) => JOURNEY_STEPS.find(step => step.id === id);
export const getJourneySectionData = () => JOURNEY_SECTION_DATA;
export const getJourneyStepCount = () => JOURNEY_STEPS.length;
export const getFixedImage = () => FIXED_IMAGE;