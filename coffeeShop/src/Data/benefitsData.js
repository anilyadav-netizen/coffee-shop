// data/benefitsData.js

export const BENEFITS_DATA = [
    {
        id: 1,
        title: "Boosts Focus & Energy",
        description: "Keeps your mind sharp and productive.",
        icon: "Brain",
        iconColor: "text-blue-500",
        bgColor: "bg-blue-50",
        hoverBgColor: "group-hover:bg-blue-100",
        borderColor: "border-blue-200"
    },
    {
        id: 2,
        title: "Rich in Antioxidants",
        description: "Because the best talks start with a cup.",
        icon: "Shield",
        iconColor: "text-green-500",
        bgColor: "bg-green-50",
        hoverBgColor: "group-hover:bg-green-100",
        borderColor: "border-green-200"
    },
    {
        id: 3,
        title: "Perfect for Adda Moments",
        description: "Because the best talks start with a cup.",
        icon: "Users",
        iconColor: "text-purple-500",
        bgColor: "bg-purple-50",
        hoverBgColor: "group-hover:bg-purple-100",
        borderColor: "border-purple-200"
    },
    {
        id: 4,
        title: "Lifts Your Mood",
        description: "Turns ordinary days into something special.",
        icon: "Smile",
        iconColor: "text-amber-500",
        bgColor: "bg-amber-50",
        hoverBgColor: "group-hover:bg-amber-100",
        borderColor: "border-amber-200"
    }
];

// ========== HELPER FUNCTIONS ==========

// Get all benefits
export const getBenefits = () => {
    return BENEFITS_DATA;
};

// Get benefit by ID
export const getBenefitById = (id) => {
    return BENEFITS_DATA.find(benefit => benefit.id === id);
};

// Get total benefits count
export const getTotalBenefits = () => {
    return BENEFITS_DATA.length;
};

// Get random benefits
export const getRandomBenefits = (limit = 2) => {
    const shuffled = [...BENEFITS_DATA].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
};

// Search benefits
export const searchBenefits = (query) => {
    const searchTerm = query.toLowerCase().trim();
    return BENEFITS_DATA.filter(benefit =>
        benefit.title.toLowerCase().includes(searchTerm) ||
        benefit.description.toLowerCase().includes(searchTerm)
    );
};