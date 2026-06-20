// contactData.js

import { 
    MapPin, 
    Phone, 
    Mail, 
    Clock 
} from 'lucide-react';
import { 
    FaFacebook, 
    FaInstagramSquare, 
    FaYoutube 
} from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";

// Contact Information Data
export const contactInfo = [
    {
        id: 1,
        icon: MapPin,
        title: "Visit Us",
        details: ["Noida", "Sector-15"],
        color: "from-blue-500 to-cyan-400"
    },
    {
        id: 2,
        icon: Phone,
        title: "Call Us",
        details: ["+91 7309390571", "+91 1234567891"],
        color: "from-green-500 to-emerald-400"
    },
    {
        id: 3,
        icon: Mail,
        title: "Email Us",
        details: ["hello@coffeehub.com", "support@coffeehub.com"],
        color: "from-purple-500 to-pink-400"
    },
    {
        id: 4,
        icon: Clock,
        title: "Working Hours",
        details: ["Mon-Sun: 7:00 AM - 10:00 PM", "Open 365 Days"],
        color: "from-amber-500 to-orange-400"
    }
];

// Social Links Data
export const socialLinks = [
    { 
        id: 1,
        icon: FaInstagramSquare, 
        label: "Instagram", 
        color: "hover:bg-pink-500",
        url: "#"
    },
    { 
        id: 2,
        icon: FaFacebook, 
        label: "Facebook", 
        color: "hover:bg-blue-600",
        url: "#"
    },
    { 
        id: 3,
        icon: AiFillTwitterCircle, 
        label: "Twitter", 
        color: "hover:bg-sky-500",
        url: "#"
    },
    { 
        id: 4,
        icon: FaYoutube, 
        label: "YouTube", 
        color: "hover:bg-red-600",
        url: "#"
    }
];

// Hero Section Data
export const heroData = {
    title: "Let's Connect",
    titleHighlight: "Connect",
    subtitle: "Over Coffee",
    description: "Have a question, feedback, or just want to say hello? We'd love to hear from you!",
    badge: "GET IN TOUCH",
    backgroundImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1400&h=800&fit=crop&auto=format",
    decorativeEmojis: ["☕", "🫘", "☕"]
};

// Form Section Data
export const formData = {
    title: "Send Us a Message",
    titleHighlight: "Message",
    description: "We'll get back to you within 24 hours",
    successMessage: {
        title: "Message Sent! ☕",
        description: "Thank you for reaching out. We'll get back to you soon!"
    },
    fields: [
        {
            id: "name",
            name: "name",
            type: "text",
            label: "Your Name",
            placeholder: "Name",
            icon: "User",
            required: true
        },
        {
            id: "email",
            name: "email",
            type: "email",
            label: "Email Address",
            placeholder: "@gmail.com",
            icon: "Mail",
            required: true
        }
    ],
    messageField: {
        id: "message",
        name: "message",
        label: "Message",
        placeholder: "Tell us how we can help you...",
        rows: 4,
        required: true
    },
    submitButton: {
        text: "Send Message",
        loadingText: "Sending...",
        icon: "Send"
    }
};

// Map Section Data
export const mapData = {
    title: "Find Us Here",
    titleHighlight: "Here",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11236.955298445497!2d77.3091759996231!3d28.58338783397603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce45e3eccb8a7%3A0xd5eb60e62b19e6ba!2sSector%2015%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1781779821920!5m2!1sen!2sin",
    height: "400px"
};