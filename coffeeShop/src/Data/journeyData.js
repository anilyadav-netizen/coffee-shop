// journeyData.js

// Import all 6 journey images
import journey1 from '../assets/Images/journey1.jpg'
import journey2 from '../assets/Images/journey2.jpg'
import journey3 from '../assets/Images/journey3.jpg'
import journey4 from '../assets/Images/journey4.jpg'
import journey5 from '../assets/Images/journey5.jpg'
import journey6 from '../assets/Images/journey6.jpg'

// Coffee Journey Steps Data
export const JOURNEY_STEPS = [
    {
        id: 1,
        title: "Bean Selection",
        subtitle: "Premium Quality",
        description: "We carefully select the finest coffee beans from the best plantations around the world, ensuring only the highest quality makes it to your cup.",
        icon: "Bean",  // ✅ Changed from "Beans" to "Bean" (matches Lucide icon)
        image: journey1,
        color: "from-amber-600 to-amber-700",
        bgColor: "bg-amber-50",
        iconColor: "text-amber-600",
        details: [
            "Sourced from Ethiopia, Colombia & Brazil",
            "100% Arabica beans",
            "Hand-picked at peak ripeness"
        ],
        duration: "~5 min",
        stepNumber: 1
    },
    {
        id: 2,
        title: "Roasting",
        subtitle: "Perfect Temperature",
        description: "Our master roasters bring out the unique flavors and aromas through precise temperature control and timing, creating the perfect roast profile.",
        icon: "Flame",  // ✅ Correct
        image: journey2,
        color: "from-orange-600 to-red-600",
        bgColor: "bg-orange-50",
        iconColor: "text-orange-600",
        details: [
            "Small-batch roasting",
            "Medium-dark roast profile",
            "Caramelization process"
        ],
        duration: "~12 min",
        stepNumber: 2
    },
    {
        id: 3,
        title: "Grinding",
        subtitle: "Consistent Texture",
        description: "We grind our beans to the perfect consistency, ensuring optimal extraction and a rich, smooth flavor in every single cup of coffee.",
        icon: "Droplets",  // ✅ Correct
        image: journey3,
        color: "from-green-600 to-emerald-600",
        bgColor: "bg-green-50",
        iconColor: "text-green-600",
        details: [
            "Burr grinding technology",
            "Consistent particle size",
            "Freshly ground daily"
        ],
        duration: "~3 min",
        stepNumber: 3
    },
    {
        id: 4,
        title: "Brewing",
        subtitle: "Expert Extraction",
        description: "Using state-of-the-art brewing equipment and precise techniques, we extract the full flavor potential from every single coffee bean.",
        icon: "Coffee",  // ✅ Correct
        image: journey4,
        color: "from-blue-600 to-cyan-600",
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        details: [
            "Pour-over & espresso methods",
            "Temperature controlled",
            "Precision timing"
        ],
        duration: "~4 min",
        stepNumber: 4
    },
    {
        id: 5,
        title: "Serving",
        subtitle: "With Love & Care",
        description: "Every cup is served with passion and attention to detail, ensuring you experience the perfect coffee moment, every single time.",
        icon: "Package",  // ✅ Correct
        image: journey5,
        color: "from-purple-600 to-pink-600",
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
        details: [
            "Artistic latte designs",
            "Perfect serving temperature",
            "Made with ❤️"
        ],
        duration: "~2 min",
        stepNumber: 5
    }
];

// Extra 6th image for future use or alternate
export const EXTRA_JOURNEY_IMAGE = journey6;

// Section Data
export const JOURNEY_SECTION_DATA = {
    badge: "COFFEE JOURNEY",
    title: "From Bean to Cup",
    titleHighlight: "Cup",
    subtitle: "Discover the art and science behind every perfect cup of coffee",
    progressLabel: "Progress"
};

// Helper function to get all journey steps
export const getJourneySteps = () => {
    return JOURNEY_STEPS;
};

// Helper function to get a specific step by id
export const getJourneyStepById = (id) => {
    return JOURNEY_STEPS.find(step => step.id === id);
};

// Helper function to get section data
export const getJourneySectionData = () => {
    return JOURNEY_SECTION_DATA;
};

// Helper function to get step count
export const getJourneyStepCount = () => {
    return JOURNEY_STEPS.length;
};

// Helper function to get extra image
export const getExtraJourneyImage = () => {
    return EXTRA_JOURNEY_IMAGE;
};