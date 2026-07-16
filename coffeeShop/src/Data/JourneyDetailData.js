// src/data/JourneyDetailData.js

export const timelineData = [
    {
        id: 1,
        number: '01',
        title: 'Bean Selection',
        icon: 'Coffee',
        description:
            'We carefully source premium Arabica and Robusta beans from sustainable farms around the world.',
        image:
            'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
        id: 2,
        number: '02',
        title: 'Harvesting',
        icon: 'Leaf',
        description:
            'Only ripe coffee cherries are hand-picked to preserve natural sweetness and quality.',
        image:
            'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
        id: 3,
        number: '03',
        title: 'Roasting',
        icon: 'Flame',
        description:
            'Beans are roasted in small batches to unlock unique aroma, sweetness, and flavor notes.',
        image:
            'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    },
    {
        id: 4,
        number: '04',
        title: 'Grinding',
        icon: 'Settings',
        description:
            'Fresh beans are ground to the perfect consistency depending on the brewing method.',
        image:
            'https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1637&q=80',
    },
    {
        id: 5,
        number: '05',
        title: 'Brewing',
        icon: 'Droplets',
        description:
            'Professional baristas carefully brew each cup with precision and attention to detail.',
        image:
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
        id: 6,
        number: '06',
        title: 'Serving',
        icon: 'Coffee',
        description:
            'Every cup is handcrafted with beautiful latte art and served fresh for the perfect coffee experience.',
        image:
            'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1456&q=80',
    },
];

export const detailedSteps = [
    {
        id: 1,
        number: 'STEP 1',
        title: 'Bean Selection',
        image:
            'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        content: [
            'Arabica vs Robusta: We select only the finest Arabica beans for their complex flavor profiles, balanced acidity, and natural sweetness.',
            'Sustainable Farming: Our partner farms use eco-friendly methods that protect biodiversity and support local communities.',
            'Hand-picked Beans: Each coffee cherry is carefully hand-selected at peak ripeness to ensure optimal flavor development.',
            'Quality Inspection: Every batch undergoes rigorous quality control to maintain our exceptional standards.',
        ],
        features: ['Premium Quality', 'Sustainable Farming', 'Fresh Harvest'],
        quote: '"Great coffee begins long before it reaches your cup."',
    },
    {
        id: 2,
        number: 'STEP 2',
        title: 'Harvesting',
        image:
            'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        content: [
            'Selective Picking: Only the reddest, ripest cherries are harvested to maximize natural sweetness and complexity.',
            'Timing is Everything: Harvesting at the right moment ensures optimal sugar content and flavor development.',
            'Traditional Methods: We use traditional hand-picking techniques that have been refined over generations.',
            'Quality Control: Each cherry is inspected to ensure it meets our strict quality standards.',
        ],
        features: ['Hand Picked', 'Peak Ripeness', 'Quality Assured'],
        quote: '"The secret of great coffee lies in the cherry."',
    },
    {
        id: 3,
        number: 'STEP 3',
        title: 'Roasting',
        image:
            'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
        content: [
            'Small Batch Roasting: We roast in small batches to maintain precision and consistency in every batch.',
            'Flavor Development: Our roasting process unlocks the unique flavor notes hidden within each bean.',
            'Temperature Control: Precise temperature management ensures even roasting and optimal flavor extraction.',
            'Cooling Process: Beans are rapidly cooled to lock in freshness and preserve aromatic compounds.',
        ],
        features: ['Small Batch', 'Precision Roast', 'Flavor Locked'],
        quote: '"Roasting is where coffee beans become coffee."',
    },
    {
        id: 4,
        number: 'STEP 4',
        title: 'Grinding',
        image:
            'https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1637&q=80',
        content: [
            'Consistency Matters: We grind to the perfect consistency for each brewing method to ensure optimal extraction.',
            'Fresh Grinding: Beans are ground just before brewing to preserve essential oils and flavors.',
            'Custom Settings: Different brewing methods require different grind sizes for the best results.',
            'Quality Equipment: We use professional-grade grinders for precise and uniform particle size.',
        ],
        features: ['Fresh Ground', 'Perfect Consistency', 'Custom Settings'],
        quote: '"The grind determines the flavor."',
    },
    {
        id: 5,
        number: 'STEP 5',
        title: 'Brewing',
        image:
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        content: [
            'Precision Brewing: Our baristas use precise water temperature and extraction time for perfect results.',
            'Artisan Techniques: We employ time-tested brewing methods that bring out the best in every bean.',
            'Quality Water: Filtered water ensures pure flavor without impurities or unwanted minerals.',
            'Consistent Results: Every cup is brewed to the same high standards for a perfect experience.',
        ],
        features: ['Precision Brew', 'Artisan Methods', 'Pure Water'],
        quote: '"Brewing is the art of extracting perfection."',
    },
    {
        id: 6,
        number: 'STEP 6',
        title: 'Serving',
        image:
            'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1456&q=80',
        content: [
            'Latte Art: Each cup is finished with beautiful latte art that adds visual appeal to the experience.',
            'Freshly Served: Coffee is served immediately to ensure the perfect temperature and freshness.',
            'Presentation: Every detail is considered from the cup selection to the final garnish.',
            'Customer Experience: We aim to create a memorable coffee experience that delights all senses.',
        ],
        features: ['Latte Art', 'Fresh Service', 'Premium Presentation'],
        quote: '"Coffee is an experience, not just a drink."',
    },
];

export const brewingMethods = [
    {
        id: 1,
        name: 'Espresso',
        image:
            'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        description:
            'A concentrated coffee brewed by forcing hot water through finely-ground coffee beans.',
        brewTime: '25-30 seconds',
        flavor: 'Rich, bold, intense',
        difficulty: 'Expert',
    },
    {
        id: 2,
        name: 'French Press',
        image:
            'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        description:
            'A simple method where coffee is steeped in hot water and separated by pressing a plunger.',
        brewTime: '4 minutes',
        flavor: 'Full-bodied, rich',
        difficulty: 'Easy',
    },
    {
        id: 3,
        name: 'Pour Over',
        image:
            'https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
        description:
            'A manual method where hot water is poured over coffee grounds in a filter for precise extraction.',
        brewTime: '3-4 minutes',
        flavor: 'Clean, bright, complex',
        difficulty: 'Intermediate',
    },
    {
        id: 4,
        name: 'Cold Brew',
        image:
            'https://images.unsplash.com/photo-1551329247-8ed9413e34e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
        description:
            'Coffee steeped in cold water for an extended period to produce a smooth, less acidic brew.',
        brewTime: '12-24 hours',
        flavor: 'Smooth, low-acid',
        difficulty: 'Easy',
    },
    {
        id: 5,
        name: 'AeroPress',
        image:
            'https://images.unsplash.com/photo-1570968915860-54d5c92fa9fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        description:
            'A versatile brewer that uses air pressure to produce a smooth, clean cup of coffee quickly.',
        brewTime: '1-2 minutes',
        flavor: 'Clean, smooth, versatile',
        difficulty: 'Beginner',
    },
];

export const roastLevels = [
    {
        id: 1,
        name: 'Light Roast',
        color: '#C69B7A',
        taste: 'Floral, fruity, citrus',
        acidity: 'High',
        sweetness: 'High',
        body: 'Light',
        bestDrinks: 'Pour Over, Drip Coffee',
        image:
            'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
        id: 2,
        name: 'Medium Roast',
        color: '#8B6914',
        taste: 'Nutty, chocolate, caramel',
        acidity: 'Medium',
        sweetness: 'Medium',
        body: 'Medium',
        bestDrinks: 'Espresso, French Press',
        image:
            'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
        id: 3,
        name: 'Dark Roast',
        color: '#3D1F0B',
        taste: 'Smoky, spicy, dark chocolate',
        acidity: 'Low',
        sweetness: 'Low',
        body: 'Full',
        bestDrinks: 'Espresso, Cold Brew',
        image:
            'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
];

export const coffeeFacts = [
    {
        id: 1,
        number: '10 Million+',
        label: 'Coffee Beans Brewed',
        icon: 'Coffee',
    },
    {
        id: 2,
        number: '98%',
        label: 'Customer Satisfaction',
        icon: 'ThumbsUp',
    },
    {
        id: 3,
        number: '50+',
        label: 'Coffee Recipes',
        icon: 'Coffee',
    },
    {
        id: 4,
        number: '15+',
        label: 'Years Experience',
        icon: 'Award',
    },
];

export const sustainabilityData = [
    {
        id: 1,
        title: 'Eco Friendly Packaging',
        icon: 'Package',
        description:
            'We use biodegradable and recyclable materials to minimize environmental impact.',
    },
    {
        id: 2,
        title: 'Supporting Local Farmers',
        icon: 'Users',
        description:
            'We partner directly with farmers to ensure fair wages and sustainable practices.',
    },
    {
        id: 3,
        title: 'Ethically Sourced Beans',
        icon: 'Shield',
        description:
            'All our beans are certified organic and ethically sourced from sustainable farms.',
    },
    {
        id: 4,
        title: 'Waste Reduction',
        icon: 'Recycle',
        description:
            'We compost coffee grounds and recycle materials to reduce our waste footprint.',
    },
];

export const galleryImages = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Coffee Farm',
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
        alt: 'Roasting',
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1637&q=80',
        alt: 'Grinding',
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1456&q=80',
        alt: 'Latte Art',
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Barista',
    },
    {
        id: 6,
        src: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Espresso Machine',
    },
    {
        id: 7,
        src: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Coffee Beans',
    },
    {
        id: 8,
        src: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1456&q=80',
        alt: 'Coffee Cup',
    },
];

export const faqData = [
    {
        id: 1,
        question: 'Why are fresh beans important?',
        answer:
            'Fresh beans retain their natural oils, flavors, and aromas. When beans are freshly roasted, they release carbon dioxide, which helps preserve their quality. Stale beans lose these characteristics and produce flat-tasting coffee.',
    },
    {
        id: 2,
        question: 'How long does roasting take?',
        answer:
            'The roasting process typically takes 8-15 minutes depending on the roast level. Light roasts take less time (around 8-10 minutes), while dark roasts require longer (12-15 minutes) to develop deep flavor profiles.',
    },
    {
        id: 3,
        question: 'What is Arabica coffee?',
        answer:
            'Arabica is a species of coffee plant that produces high-quality beans with complex flavor profiles. It accounts for about 60-70% of the world\'s coffee production and is known for its smooth, balanced taste with notes of fruit and chocolate.',
    },
    {
        id: 4,
        question: 'Which brewing method is strongest?',
        answer:
            'Espresso is the strongest brewing method in terms of caffeine concentration. However, when comparing total caffeine content, cold brew often has more caffeine per serving due to the extended steeping time and higher coffee-to-water ratio.',
    },
    {
        id: 5,
        question: 'Why does grind size matter?',
        answer:
            'Grind size directly affects extraction rate. Finer grounds extract faster, making them suitable for quick methods like espresso. Coarser grounds extract slower, making them better for longer brewing methods like French press to prevent over-extraction.',
    },
];

export const heroContent = {
    badge: 'Coffee Journey',
    heading: 'From Bean to Cup',
    highlightedWord: 'Cup',
    subtitle:
        'Discover how every coffee bean travels from sustainable farms to your cup through a carefully crafted journey of roasting, grinding, brewing, and serving.',
    buttons: {
        primary: 'Explore Our Menu',
        secondary: 'Watch Journey',
    },
};
