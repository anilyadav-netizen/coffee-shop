import React, { useState, useMemo, useRef } from 'react';
import {
    Heart,
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    Camera,
    Upload,
    Plus,
    Image as ImageIcon,
    Trash2
} from 'lucide-react';
import {
    GALLERY_ITEMS
} from '../data/galleryData';

import feel from '../assets/Images/feel.jpg';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [likedItems, setLikedItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [userImages, setUserImages] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newImageTitle, setNewImageTitle] = useState('');
    const [newImageDesc, setNewImageDesc] = useState('');
    const [newImageFile, setNewImageFile] = useState(null);
    const [newImagePreview, setNewImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const itemsPerPage = 8;

    // Combine gallery images + user images
    const allImages = useMemo(() => {
        return [...GALLERY_ITEMS, ...userImages];
    }, [userImages]);

    // Get current items for pagination (only for desktop)
    const currentItems = useMemo(() => {
        // For mobile, show all images without pagination
        if (window.innerWidth < 768) {
            return allImages;
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return allImages.slice(startIndex, endIndex);
    }, [currentPage, allImages]);

    const totalPages = Math.ceil(allImages.length / itemsPerPage);

    // Handle like toggle
    const toggleLike = (itemId, e) => {
        e.stopPropagation();
        setLikedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    // Handle image click
    const handleImageClick = (item) => {
        setSelectedImage(item);
        document.body.style.overflow = 'hidden';
    };

    // Close lightbox
    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    // Navigate through lightbox
    const navigateLightbox = (direction) => {
        const currentIndex = allImages.findIndex(item => item.id === selectedImage.id);
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % allImages.length
            : (currentIndex - 1 + allImages.length) % allImages.length;
        setSelectedImage(allImages[newIndex]);
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle upload submission
    const handleUploadSubmit = () => {
        if (!newImageFile || !newImageTitle.trim()) {
            alert('Please select an image and add a title');
            return;
        }

        const newImage = {
            id: `user-${Date.now()}`,
            title: newImageTitle,
            description: newImageDesc || 'Shared by our community',
            image: newImagePreview,
            likes: 0,
            isUserImage: true
        };

        setUserImages(prev => [newImage, ...prev]);
        setShowUploadModal(false);
        setNewImageTitle('');
        setNewImageDesc('');
        setNewImageFile(null);
        setNewImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle delete user image
    const deleteUserImage = (itemId, e) => {
        e.stopPropagation();
        setUserImages(prev => prev.filter(img => img.id !== itemId));
    };

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedImage) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') navigateLightbox('prev');
                if (e.key === 'ArrowRight') navigateLightbox('next');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

    // Handle window resize to update current items
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* ========== HERO SECTION WITH OVERLAP ========== */}
            <section className="relative h-[50vh] md:h-[80vh] min-h-[400px] md:min-h-[500px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src={feel}
                        alt="Gallery Hero"
                        className="w-full h-full object-cover"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 text-7xl rotate-12">☕</div>
                    <div className="absolute bottom-20 right-10 text-7xl -rotate-12">🫘</div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl">📸</div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 mt-5 md:mt-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-2 rounded-full mb-1 md:mb-6 animate-fade-in-down">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                        <span className="text-white/90 text-sm font-medium tracking-wider">SHARE YOUR MOMENTS</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
                        Capture the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D7C53] to-green-400">Coffee Vibe</span>
                    </h1>

                    <p className="text-white/80 max-w-2xl mx-auto text-base sm:text-lg md:text-xl animate-fade-in-up delay-200">
                        Share your coffee moments with our community and get featured!
                    </p>

                    <div className="w-24 h-1 bg-gradient-to-r from-[#0D7C53] to-green-400 mx-auto mt-2 md:mt-6 rounded-full animate-fade-in-up delay-300"></div>

                    {/* Upload Button */}
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="mt-3 md:mt-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0D7C53] to-green-500 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        <Camera size={20} />
                        Share Your Moment
                    </button>
                </div>
            </section>

            {/* ========== GALLERY SECTION WITH GLASS EFFECT ========== */}
            <section className="relative px-4 py-8 overflow-hidden">
                {/* Glass Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                    <div className="absolute inset-0 pointer-events-none opacity-10">
                        <div className="absolute top-20 left-10 text-6xl rotate-12 animate-float">🫘</div>
                        <div className="absolute bottom-32 right-20 text-6xl -rotate-12 animate-float-delay">☕</div>
                    </div>
                </div>

                <div className="max-w-[95rem] mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-[#0D7C53]/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4 border border-white/20">
                            <span className="text-[#0D7C53] text-sm font-semibold tracking-wider">COMMUNITY GALLERY</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                            Our <span className="text-[#0D7C53]">Gallery</span>
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto mt-2">
                            A visual journey through our coffee culture and community moments
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#0D7C53] to-green-500 mx-auto mt-4 rounded-full"></div>
                    </div>

                    {/* Gallery Stats */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-6">
                            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl px-4 py-2 shadow-xl">
                                <span className="text-sm text-gray-600">Total Photos</span>
                                <span className="ml-2 font-bold text-[#0D7C53]">{allImages.length}</span>
                            </div>
                            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl px-4 py-2 shadow-xl">
                                <span className="text-sm text-gray-600">Community Uploads</span>
                                <span className="ml-2 font-bold text-[#0D7C53]">{userImages.length}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0D7C53] text-white rounded-full font-medium hover:bg-green-700 transition-all shadow-lg hover:shadow-xl text-sm"
                        >
                            <Plus size={16} />
                            Add Your Photo
                        </button>
                    </div>

                    {/* Gallery Grid - Glass Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {currentItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleImageClick(item)}
                                className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-square backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                />

                                {/* User Image Badge */}
                                {item.isUserImage && (
                                    <div className="absolute top-3 left-3 bg-[#0D7C53]/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <Camera size={12} />
                                        Community
                                    </div>
                                )}

                                {/* Delete Button for User Images */}
                                {item.isUserImage && (
                                    <button
                                        onClick={(e) => deleteUserImage(item.id, e)}
                                        className="absolute top-3 right-12 p-1.5 bg-red-500/80 backdrop-blur rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} className="text-white" />
                                    </button>
                                )}

                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h4 className="text-white font-semibold text-sm truncate">{item.title}</h4>
                                        <p className="text-white/70 text-xs truncate">{item.description}</p>
                                    </div>
                                </div>

                                {/* Like Button */}
                                <button
                                    onClick={(e) => toggleLike(item.id, e)}
                                    className="absolute top-3 right-3 p-1.5 bg-black/50 backdrop-blur rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Heart
                                        size={16}
                                        className={likedItems[item.id] ? 'fill-red-500 text-red-500' : 'text-white'}
                                    />
                                </button>

                                {/* Quick View Icon */}
                                <div className="absolute top-3 left-3 p-1.5 bg-black/50 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-all">
                                    <ZoomIn size={16} className="text-white" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination - Only show on desktop */}
                    {!isMobile && totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg backdrop-blur-xl bg-white/20 border border-white/30 hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
                            >
                                <ChevronLeft size={18} className="text-gray-600" />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-lg font-medium transition-all shadow-xl ${currentPage === i + 1
                                        ? 'bg-[#0D7C53] text-white shadow-lg shadow-[#0D7C53]/30'
                                        : 'backdrop-blur-xl bg-white/20 border border-white/30 text-gray-600 hover:bg-white/40'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg backdrop-blur-xl bg-white/20 border border-white/30 hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
                            >
                                <ChevronRight size={18} className="text-gray-600" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ========== UPLOAD MODAL - GLASS EFFECT ========== */}
            {showUploadModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setShowUploadModal(false)}
                >
                    <div
                        className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl max-w-md w-full p-8 shadow-2xl shadow-black/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#0D7C53]/20 rounded-xl">
                                    <Upload className="w-6 h-6 text-[#0D7C53]" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Share Your Moment</h3>
                            </div>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="p-2 hover:bg-white/30 rounded-full transition-all"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Image Upload Area */}
                        <div
                            className="relative border-2 border-dashed border-white/40 rounded-2xl p-8 text-center cursor-pointer hover:border-[#0D7C53] transition-all bg-white/20 backdrop-blur-sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {newImagePreview ? (
                                <img
                                    src={newImagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-xl"
                                />
                            ) : (
                                <>
                                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">Click to upload your photo</p>
                                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Max 5MB)</p>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </div>

                        {/* Title Input */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Photo Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newImageTitle}
                                onChange={(e) => setNewImageTitle(e.target.value)}
                                placeholder="e.g., Morning Coffee Bliss"
                                className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D7C53] focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Description Input */}
                        <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description (Optional)
                            </label>
                            <input
                                type="text"
                                value={newImageDesc}
                                onChange={(e) => setNewImageDesc(e.target.value)}
                                placeholder="Tell us about your coffee moment..."
                                className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D7C53] focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Upload Button */}
                        <button
                            onClick={handleUploadSubmit}
                            disabled={!newImageFile || !newImageTitle.trim()}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-[#0D7C53] to-green-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Upload size={18} />
                            Upload to Gallery
                        </button>
                    </div>
                </div>
            )}

            {/* ========== LIGHTBOX MODAL - GLASS EFFECT ========== */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
                    onClick={closeLightbox}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all text-white"
                        >
                            <X size={24} />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={() => navigateLightbox('prev')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all text-white"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => navigateLightbox('next')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all text-white"
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Image */}
                        <img
                            src={selectedImage.image}
                            alt={selectedImage.title}
                            className="w-full h-auto max-h-[80vh] object-contain"
                        />

                        {/* Image Info - Glass Effect */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-white text-xl font-bold">{selectedImage.title}</h3>
                                    <p className="text-white/80 text-sm">{selectedImage.description}</p>
                                    {selectedImage.isUserImage && (
                                        <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full mt-1">
                                            <Camera size={12} />
                                            Community Upload
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-white/60 text-sm flex items-center gap-1">
                                        <Heart size={14} className="fill-red-500 text-red-500" />
                                        {selectedImage.likes || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* ========== CSS ANIMATIONS ========== */}
            <style >{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                
                @keyframes pulse-slow-delay {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.15); opacity: 0.7; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(12deg); }
                    50% { transform: translateY(-20px) rotate(15deg); }
                }
                
                @keyframes float-delay {
                    0%, 100% { transform: translateY(0px) rotate(-12deg); }
                    50% { transform: translateY(20px) rotate(-15deg); }
                }
                
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                
                .animate-pulse-slow-delay {
                    animation: pulse-slow-delay 10s ease-in-out infinite;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-float-delay {
                    animation: float-delay 7s ease-in-out infinite;
                }
                
                .animate-fade-in-down {
                    animation: fade-in-down 0.8s ease-out forwards;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
                
                .delay-200 { animation-delay: 200ms; }
                .delay-300 { animation-delay: 300ms; }
            `}</style>
        </>
    );
};

export default Gallery;