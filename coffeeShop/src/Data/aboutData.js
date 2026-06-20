// data/aboutData.js

// ========== STATS DATA ==========
export const STATS_DATA = [
    {
        number: "10+",
        label: "Years of Excellence",
        icon: "Trophy",
        description: "A decade of crafting perfect coffee"
    },
    {
        number: "50+",
        label: "Coffee Blends",
        icon: "Coffee",
        description: "Diverse flavors from around the world"
    },
    {
        number: "5K+",
        label: "Happy Customers",
        icon: "Users",
        description: "Coffee lovers who trust us daily"
    },
    {
        number: "100%",
        label: "Arabica Beans",
        icon: "Leaf",
        description: "Premium quality beans only"
    }
];

// ========== CORE VALUES DATA ==========
export const VALUES_DATA = [
    {
        icon: "Coffee",
        title: "Quality First",
        description: "We source only the finest beans from the best coffee-growing regions.",
        color: "from-blue-500 to-cyan-400",
        bgColor: "bg-blue-50"
    },
    {
        icon: "Heart",
        title: "Passion for Coffee",
        description: "Every cup is crafted with love and dedication to perfection.",
        color: "from-red-500 to-pink-400",
        bgColor: "bg-red-50"
    },
    {
        icon: "Users",
        title: "Community Focus",
        description: "Creating a warm space where coffee lovers connect and share.",
        color: "from-purple-500 to-indigo-400",
        bgColor: "bg-purple-50"
    },
    {
        icon: "Leaf",
        title: "Sustainable Sourcing",
        description: "Committed to ethical practices and environmental responsibility.",
        color: "from-green-500 to-emerald-400",
        bgColor: "bg-green-50"
    }
];

// ========== TEAM MEMBERS DATA ==========
export const TEAM_DATA = [
    {
        id: 1,
        name: "Arjun Sharma",
        role: "Master Barista",
        image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=300&h=300&fit=crop&auto=format",
        experience: "8 years",
        bio: "Coffee art expert with a passion for latte designs"
    },
    {
        id: 2,
        name: "Priya Patel",
        role: "Coffee Roaster",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&auto=format",
        experience: "6 years",
        bio: "Master roaster with expertise in single-origin beans"
    },
    {
        id: 3,
        name: "Vikram Singh",
        role: "Head Barista",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format",
        experience: "10 years",
        bio: "Specializes in espresso extraction and brew methods"
    },
    {
        id: 4,
        name: "Neha Reddy",
        role: "Coffee Taster",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&auto=format",
        experience: "5 years",
        bio: "Certified coffee taster with a refined palate"
    }
];

// ========== HERO DATA ==========
export const HERO_DATA = {
    badge: "ABOUT COFFEEHUB",
    title: "Where Every Cup Tells",
    highlight: "A Story",
    subtitle: "From bean to cup, we craft experiences that inspire, connect, and bring people together through the love of coffee.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&h=800&fit=crop&auto=format",
    ctaText: "Explore Our Menu",
    ctaLink: "/menu"
};

// ========== STORY SECTION DATA ==========
export const STORY_DATA = {
    badge: "OUR STORY",
    title: "More Than Just",
    highlight: "Coffee",
    description1: "CoffeeHub was born from a simple yet profound love for coffee. What started as a small dream has grown into a community of passionate coffee lovers who believe in the power of a perfect cup.",
    description2: "Our journey is fueled by a commitment to quality, a dedication to sustainability, and a deep respect for the artistry of coffee making. Every bean we source tells a story of craftsmanship and care.",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop&auto=format",
    highlights: [
        { icon: "Trophy", label: "Award Winning" },
        { icon: "Shield", label: "100% Organic" },
        { icon: "Truck", label: "Fresh Roasted" },
        { icon: "Zap", label: "Fast Delivery" }
    ],
    since: "2020",
    experience: "10+ Years of Excellence"
};

// ========== VALUES SECTION DATA ==========
export const VALUES_SECTION_DATA = {
    title: "Our Core",
    highlight: "Values",
    subtitle: "The principles that guide every cup we serve"
};

// ========== TEAM SECTION DATA ==========
export const TEAM_SECTION_DATA = {
    badge: "MEET THE TEAM",
    title: "Passionate",
    highlight: "People",
    subtitle: "Perfect",
    highlight2: "Brews"
};

// ========== CTA SECTION DATA ==========
export const CTA_DATA = {
    title: "Ready to Experience the CoffeeHub Difference?",
    subtitle: "Come visit us or order online and taste the passion in every cup.",
    primaryButton: "Explore Our Menu",
    primaryLink: "/menu",
    secondaryButton: "Get in Touch",
    secondaryLink: "/contact",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=1200&h=400&fit=crop&auto=format"
};

// ========== HELPER FUNCTIONS ==========

// Get all stats
export const getStats = () => {
    return STATS_DATA;
};

// Get all values
export const getValues = () => {
    return VALUES_DATA;
};

// Get all team members
export const getTeam = () => {
    return TEAM_DATA;
};

// Get hero data
export const getHeroData = () => {
    return HERO_DATA;
};

// Get story data
export const getStoryData = () => {
    return STORY_DATA;
};

// Get values section data
export const getValuesSectionData = () => {
    return VALUES_SECTION_DATA;
};

// Get team section data
export const getTeamSectionData = () => {
    return TEAM_SECTION_DATA;
};

// Get CTA data
export const getCtaData = () => {
    return CTA_DATA;
};

// Get team member by ID
export const getTeamMemberById = (id) => {
    return TEAM_DATA.find(member => member.id === id);
};

// Get total team count
export const getTeamCount = () => {
    return TEAM_DATA.length;
};

// Get total stats count
export const getStatsCount = () => {
    return STATS_DATA.length;
};