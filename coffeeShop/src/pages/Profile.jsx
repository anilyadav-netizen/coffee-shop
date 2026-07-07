import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus } from "lucide-react";
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    ShoppingBag,
    Heart,
    Settings,
    LogOut,
    Key,
    ChevronRight,
    Award,
    Home,
    Briefcase,
    Building,
    Edit,
    Loader2,
    Package,
    Coffee,
    ShoppingCart,
    Trash2,
    ArrowRight
} from 'lucide-react';
import { logout, getProfile } from '../redux/Slicer/authSlice';
import { getMyOrders } from '../redux/Slicer/paymentSlice';
import { getWishlist, removeFromWishlist } from '../redux/Slicer/wishlistSlice';
import { addToCart, getCart } from '../redux/Slicer/cartSlice';
import { deleteAddress } from '../redux/Slicer/addressSlice';
import { useNavigate } from 'react-router-dom';

// --- Reusable Components with Glass Effect ---

const GlassCard = ({ children, className = '' }) => (
    <div className={`bg-white/20 backdrop-blur-md rounded-2xl shadow-md shadow-black/5 border border-white/30 p-3 transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5 ${className}`}>
        {children}
    </div>
);

const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
        <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-300/60 dark:bg-gray-700/60"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-300/60 dark:bg-gray-700/60 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-300/60 dark:bg-gray-700/60 rounded"></div>
            </div>
        </div>
        <div className="space-y-2">
            <div className="h-3 w-full bg-gray-300/60 dark:bg-gray-700/60 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-300/60 dark:bg-gray-700/60 rounded"></div>
            <div className="h-3 w-2/3 bg-gray-300/60 dark:bg-gray-700/60 rounded"></div>
        </div>
    </div>
);

const getAddressIcon = (type) => {
    switch (type?.toLowerCase()) {
        case 'home': return <Home className="w-4 h-4" />;
        case 'office': return <Briefcase className="w-4 h-4" />;
        case 'hostel': return <Building className="w-4 h-4" />;
        default: return <MapPin className="w-4 h-4" />;
    }
};

// --- Main Profile Component ---

const Profile = () => {
    const dispatch = useDispatch();
    const { user, isLoading, isAuthenticated } = useSelector((state) => state.auth);
    const { orders, loading: ordersLoading } = useSelector((state) => state.payment);
    const { items: wishlistItems, loading: wishlistLoading } = useSelector((state) => state.wishlist);
    const { loading: addressDeleting } = useSelector((state) => state.address);

    const [isEditing, setIsEditing] = useState(false);
    const [addedItems, setAddedItems] = useState({});
    const [deletingAddressId, setDeletingAddressId] = useState(null);
    const [scrollY, setScrollY] = useState(0);

    // ✅ Navbar ko black karne ke liye useEffect
    useEffect(() => {
        const navbar = document.querySelector('nav');
        if (navbar) {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        }
        return () => {
            if (navbar) {
                navbar.style.backgroundColor = '';
                navbar.style.backdropFilter = '';
                navbar.style.boxShadow = '';
            }
        };
    }, []);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch profile, orders, and wishlist when component mounts
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getProfile());
            dispatch(getMyOrders());
            dispatch(getWishlist());
        }
    }, [dispatch, isAuthenticated]);

    const navigate = useNavigate()
    const handleAddAddress = () => {
        navigate("/address/new");
    };

    // If user data is loading, show skeletons
    if (isLoading) {
        return (
            <div className="min-h-screen relative px-4 py-8 pt-20 sm:pt-24 overflow-hidden">
                {/* Glass Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse-slow" />
                </div>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <GlassCard><SkeletonLoader /></GlassCard>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <GlassCard><SkeletonLoader /></GlassCard>
                            <GlassCard><SkeletonLoader /></GlassCard>
                            <GlassCard><SkeletonLoader /></GlassCard>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If no user data, show a message
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center relative px-4 pt-20 sm:pt-24 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                </div>
                <GlassCard className="text-center max-w-md">
                    <User className="w-16 h-16 mx-auto text-gray-400/80 dark:text-gray-600 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">No User Data</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Please log in to view your profile.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 px-6 py-2 bg-[#0D7C53] hover:bg-[#0A6B46] text-white rounded-lg font-medium transition-all hover:shadow-lg"
                    >
                        Login
                    </button>
                </GlassCard>
            </div>
        );
    }

    // Extract user data with fallbacks
    const {
        name = 'Coffee Lover',
        email = 'user@coffeehub.com',
        role = 'customer',
        mobile = '+1 234 567 890',
        createdAt = '2024-01-15',
        avatar = null,
        addresses = [],
    } = user;

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleBadgeColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'manager': return 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-[#0D7C53]/20 text-[#0D7C53] dark:bg-[#0D7C53]/30 dark:text-green-400';
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleUpdateAddress = (addressId) => {
        navigate(`/address/${addressId}`);
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            setDeletingAddressId(addressId);
            try {
                await dispatch(deleteAddress(addressId)).unwrap();
                await dispatch(getProfile()).unwrap();
            } catch (error) {
                console.error('Failed to delete address:', error);
            } finally {
                setDeletingAddressId(null);
            }
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getOrderStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'processing':
                return 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'shipped':
                return 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'cancelled':
                return 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'pending':
                return 'bg-gray-100/80 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
            default:
                return 'bg-gray-100/80 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    const getOrderStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return '✅';
            case 'processing': return '🔄';
            case 'shipped': return '📦';
            case 'cancelled': return '❌';
            case 'pending': return '⏳';
            default: return '📋';
        }
    };

    const getProductImage = (product) => {
        if (product?.coffee?.image) {
            return product.coffee.image;
        }
        if (product?.coffee?.images && product.coffee.images.length > 0) {
            return product.coffee.images[0];
        }
        if (product?.image) {
            return product.image;
        }
        if (product?.images && product.images.length > 0) {
            return product.images[0];
        }
        return 'https://placehold.co/100x100/e2e8f0/64748b?text=☕';
    };

    const getProductName = (product) => {
        if (product?.coffee?.name) return product.coffee.name;
        if (product?.name) return product.name;
        return 'Coffee Item';
    };

    const getProductPrice = (product) => {
        if (product?.price) return product.price;
        if (product?.coffee?.price) return product.coffee.price;
        return 0;
    };

    // Wishlist Functions
    const handleAddToCart = async (item) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const coffeeData = item.coffee || item;
        const coffeeId = coffeeData._id || item._id || item.id;
        const amount = coffeeData.discountPrice || coffeeData.price;

        try {
            const result = await dispatch(addToCart({
                coffeeId: coffeeId,
                quantity: 1,
                amount: amount
            }));

            if (addToCart.fulfilled.match(result)) {
                await dispatch(getCart());
                setAddedItems(prev => ({ ...prev, [item._id || item.id]: true }));
                setTimeout(() => {
                    setAddedItems(prev => ({ ...prev, [item._id || item.id]: false }));
                }, 1500);
            }
        } catch (error) {
            console.error("Add to cart error:", error);
        }
    };

    const handleRemoveFromWishlist = (itemId) => {
        dispatch(removeFromWishlist(itemId))
            .unwrap()
            .catch((error) => {
                console.error("Failed to remove:", error);
            });
    };

    const getWishlistItemData = (item) => {
        const coffeeData = item.coffee || item;
        return {
            id: item._id,
            coffeeId: coffeeData._id || item._id,
            name: coffeeData.name || 'Coffee Item',
            image: coffeeData.image || 'https://placehold.co/100x100/e2e8f0/64748b?text=☕',
            price: coffeeData.discountPrice || coffeeData.price || 0,
            originalPrice: coffeeData.price,
            description: coffeeData.description || ''
        };
    };

    return (
        <div className="min-h-screen relative px-2 py-8 pt-20 sm:pt-24 overflow-hidden">
            {/* Glass Background - Same as About Page */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-20 left-10 text-6xl rotate-12 animate-float">🫘</div>
                    <div className="absolute bottom-32 right-20 text-6xl -rotate-12 animate-float-delay">🫘</div>
                    <div className="absolute top-1/3 right-1/4 text-4xl rotate-45 animate-float-slow">☕</div>
                    <div className="absolute bottom-1/4 left-1/3 text-5xl -rotate-45 animate-float-delay">🫘</div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 mt-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* --- Left Sidebar Profile Card --- */}
                    <div className="lg:col-span-1">
                        <GlassCard className="text-center sticky top-8">
                            {/* Avatar */}
                            <div className="relative mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-[#0D7C53] to-[#0A6B46] flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-white/50 dark:ring-gray-700/50 transition-transform duration-300 hover:scale-105">
                                {avatar ? (
                                    <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    getInitials(name)
                                )}
                            </div>

                            {/* User Info */}
                            <h2 className="mt-4 text-2xl font-bold text-gray-800">{name}</h2>
                            <p className="text-gray-600">{email}</p>

                            {/* Role Badge */}
                            <span className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium ${getRoleBadgeColor(role)}`}>
                                {role?.charAt(0).toUpperCase() + role?.slice(1) || 'Customer'}
                            </span>

                            {/* Join Date */}
                            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-2 text-[#0D7C53]" />
                                Joined {new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>

                            {/* Edit Profile Button */}
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="mt-6 w-full py-2.5 px-4 bg-[#0D7C53] hover:bg-[#0A6B46] text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </GlassCard>
                    </div>

                    {/* --- Right Content Area --- */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. Personal Information Card */}
                        <GlassCard>
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-[#0D7C53]" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500">Full Name</label>
                                    <p className="text-gray-800 font-medium">{name}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Email Address</label>
                                    <p className="text-gray-800 font-medium flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {email}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Mobile Number</label>
                                    <p className="text-gray-800 font-medium flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {mobile}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Account Role</label>
                                    <p className="text-gray-800 font-medium flex items-center gap-2">
                                        <Award className="w-4 h-4 text-gray-400" />
                                        {role?.charAt(0).toUpperCase() + role?.slice(1) || 'Customer'}
                                    </p>
                                </div>
                            </div>
                        </GlassCard>

                        {/* 2. Saved Addresses */}
                        <GlassCard>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-[#0D7C53]" />
                                        Saved Addresses
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {addresses?.length || 0} address{addresses?.length !== 1 ? "es" : ""}
                                    </span>
                                </div>
                                <button
                                    onClick={handleAddAddress}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#0D7C53] hover:bg-[#0A6B46] text-white rounded-lg font-medium transition-all hover:shadow-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Address
                                </button>
                            </div>

                            {addresses && addresses.length > 0 ? (
                                <div className="space-y-4">
                                    {addresses.map((address) => (
                                        <div
                                            key={address._id || address.id}
                                            className={`bg-white/40 backdrop-blur-sm rounded-xl p-2 border transition-all hover:shadow-md ${
                                                address.isDefault
                                                    ? "border-[#0D7C53]/40 bg-[#0D7C53]/5"
                                                    : "border-white/30"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                                            {getAddressIcon(address.type)}
                                                            {address.type || "Home"}
                                                        </span>
                                                        {address.isDefault && (
                                                            <span className="inline-block bg-[#0D7C53]/20 text-[#0D7C53] text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">Name:</span>
                                                            <span className="ml-1 text-gray-800 font-medium">
                                                                {address.fullName}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Phone:</span>
                                                            <span className="ml-1 text-gray-800">
                                                                {address.phone}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Email:</span>
                                                            <span className="ml-1 text-gray-800">
                                                                {address.email}
                                                            </span>
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <span className="text-gray-500">Address:</span>
                                                            <span className="ml-1 text-gray-800">
                                                                {address.address}, {address.city}, {address.state} - {address.pincode}
                                                            </span>
                                                            {address.landmark && (
                                                                <span className="ml-1 text-gray-500">
                                                                    (Landmark: {address.landmark})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4 flex-shrink-0">
                                                    <button
                                                        onClick={() => handleUpdateAddress(address._id || address.id)}
                                                        className="px-4 py-2 bg-[#0D7C53] hover:bg-[#0A6B46] text-white rounded-lg font-medium transition-all hover:shadow-lg flex items-center gap-2 text-sm"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAddress(address._id || address.id)}
                                                        disabled={deletingAddressId === (address._id || address.id)}
                                                        className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg font-medium transition-all hover:shadow-lg flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {deletingAddressId === (address._id || address.id) ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <MapPin className="w-14 h-14 mx-auto text-gray-400/80 mb-4" />
                                    <p className="text-gray-500">No addresses saved yet.</p>
                                    <p className="text-sm text-gray-400 mt-1 mb-5">
                                        Add your first address to get started.
                                    </p>
                                    <button
                                        onClick={handleAddAddress}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D7C53] hover:bg-[#0A6B46] text-white rounded-lg font-medium transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Address
                                    </button>
                                </div>
                            )}
                        </GlassCard>

                        {/* 3. Recent Orders */}
                        <GlassCard>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-[#0D7C53]" />
                                    Recent Orders
                                </h3>
                                <button
                                    onClick={() => navigate('/orderDetails')}
                                    className="text-sm text-[#0D7C53] hover:text-[#0A6B46] font-medium flex items-center gap-1 transition-colors"
                                >
                                    View All Orders
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {ordersLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-white/40 rounded-xl">
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 bg-gray-300/60 rounded"></div>
                                                <div className="h-3 w-20 bg-gray-300/60 rounded"></div>
                                            </div>
                                            <div className="text-right space-y-2">
                                                <div className="h-4 w-16 bg-gray-300/60 rounded"></div>
                                                <div className="h-3 w-12 bg-gray-300/60 rounded ml-auto"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : orders && orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.slice(0, 2).map((order) => {
                                        const isDineIn = order.orderType === 'dine_in';
                                        const tableNumber = order.table?.tableNumber;

                                        return (
                                            <div
                                                key={order._id}
                                                className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 hover:border-[#0D7C53]/30 transition-all overflow-hidden"
                                            >
                                                <div className="p-3 cursor-pointer hover:bg-white/20 transition-colors">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-lg">{getOrderStatusIcon(order.orderStatus)}</span>
                                                            <div>
                                                                <p className="font-medium text-gray-800 text-sm">
                                                                    Order #{order._id?.slice(-6)}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {formatDate(order.createdAt)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                                                isDineIn
                                                                    ? 'bg-purple-100/80 text-purple-700'
                                                                    : 'bg-blue-100/80 text-blue-700'
                                                            }`}>
                                                                {isDineIn ? '🍽️ Dine In' : '🚚 Delivery'}
                                                                {isDineIn && tableNumber && (
                                                                    <span className="font-bold">(Table {tableNumber})</span>
                                                                )}
                                                            </span>
                                                            <div className="text-right">
                                                                <p className="font-bold text-[#0D7C53] text-sm">
                                                                    ₹{order.amount?.toFixed(2) || '0.00'}
                                                                </p>
                                                                <span className={`text-xs px-2 py-0.5 rounded-full ${getOrderStatusColor(order.orderStatus)}`}>
                                                                    {order.orderStatus || 'Pending'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-white/30 p-3">
                                                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                                        <Coffee size={12} />
                                                        {order.products?.length || 0} item{order.products?.length !== 1 ? 's' : ''}
                                                    </p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {order.products?.slice(0, 4).map((product, index) => {
                                                            const imageUrl = getProductImage(product);
                                                            const productName = getProductName(product);
                                                            const productPrice = getProductPrice(product);
                                                            const quantity = product.quantity || 1;
                                                            const totalPrice = productPrice * quantity;

                                                            return (
                                                                <div
                                                                    key={product._id || index}
                                                                    className="flex items-center gap-2 bg-white/30 rounded-lg p-2 hover:bg-white/50 transition-colors"
                                                                >
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt={productName}
                                                                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                                                        onError={(e) => {
                                                                            e.target.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=☕';
                                                                        }}
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-xs font-medium text-gray-800 truncate">
                                                                            {productName}
                                                                        </p>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-xs text-gray-500">
                                                                                Qty: {quantity}
                                                                            </span>
                                                                            <span className="text-xs font-semibold text-[#0D7C53]">
                                                                                ₹{totalPrice.toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                        {order.products?.length > 4 && (
                                                            <div className="flex items-center justify-center bg-white/30 rounded-lg p-2">
                                                                <span className="text-xs text-gray-500">
                                                                    +{order.products.length - 4} more items
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 mx-auto text-gray-400/80 mb-3" />
                                    <p className="text-gray-500">No orders yet.</p>
                                    <p className="text-sm text-gray-400 mt-1">Start shopping to see your orders here.</p>
                                    <button
                                        onClick={() => navigate('/menu')}
                                        className="mt-4 px-6 py-2 bg-[#0D7C53] hover:bg-[#0A6B46] text-white rounded-lg font-medium transition-all hover:shadow-lg"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            )}
                        </GlassCard>

                        {/* 4. Wishlist Section */}
                        <GlassCard>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-[#0D7C53]" />
                                    My Wishlist
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        {wishlistItems?.length || 0} items
                                    </span>
                                    <button
                                        onClick={() => navigate('/wishlist')}
                                        className="text-sm text-[#0D7C53] hover:text-[#0A6B46] font-medium flex items-center gap-1 transition-colors"
                                    >
                                        View All
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {wishlistLoading ? (
                                <div className="space-y-3">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-white/40 rounded-xl">
                                            <div className="w-16 h-16 bg-gray-300/60 rounded-lg"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-32 bg-gray-300/60 rounded"></div>
                                                <div className="h-3 w-20 bg-gray-300/60 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : wishlistItems && wishlistItems.length > 0 ? (
                                <div className="space-y-3">
                                    {wishlistItems.slice(0, 3).map((item) => {
                                        const itemData = getWishlistItemData(item);

                                        return (
                                            <div
                                                key={itemData.id}
                                                className="group bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl p-3 shadow-md shadow-black/5 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100/50 border border-white/20">
                                                        <img
                                                            src={itemData.image}
                                                            alt={itemData.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=☕';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0 flex-1">
                                                                <h3 className="font-semibold text-gray-800 text-sm truncate">
                                                                    {itemData.name}
                                                                </h3>
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {itemData.description || 'Coffee'}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveFromWishlist(itemData.id)}
                                                                className="p-1 rounded-full bg-red-100/80 hover:bg-red-200 transition-all flex-shrink-0"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                            </button>
                                                        </div>
                                                        <div className="flex flex-row items-center justify-between mt-1 gap-2">
                                                            <div className="flex items-center gap-1 flex-wrap">
                                                                <span className="font-bold text-[#0D7C53] text-sm">
                                                                    ₹{itemData.price.toFixed(2)}
                                                                </span>
                                                                {itemData.originalPrice && itemData.originalPrice > itemData.price && (
                                                                    <span className="text-xs text-gray-400 line-through">
                                                                        ₹{itemData.originalPrice.toFixed(2)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() => handleAddToCart(item)}
                                                                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-1.5 text-sm ${
                                                                    addedItems[itemData.id]
                                                                        ? 'bg-[#0D7C53] text-white'
                                                                        : 'bg-[#0D7C53] hover:bg-[#0A6B46] text-white hover:shadow-lg hover:scale-[1.02]'
                                                                }`}
                                                            >
                                                                {addedItems[itemData.id] ? (
                                                                    <>
                                                                        <span>Added ✓</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <ShoppingCart className="w-4 h-4" />
                                                                        Add
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {wishlistItems.length > 3 && (
                                        <button
                                            onClick={() => navigate('/wishlist')}
                                            className="w-full text-center text-sm text-[#0D7C53] hover:text-[#0A6B46] font-medium py-2 transition-colors border-t border-white/30 mt-2 pt-3"
                                        >
                                            + {wishlistItems.length - 3} more items in wishlist
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Heart className="w-12 h-12 mx-auto text-gray-400/80 mb-3" />
                                    <p className="text-gray-500">Your wishlist is empty</p>
                                    <p className="text-sm text-gray-400 mt-1">Start adding your favourite coffee items</p>
                                    <button
                                        onClick={() => navigate('/menu')}
                                        className="mt-4 px-6 py-2 bg-[#0D7C53] hover:bg-[#0A6B46] text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm mx-auto"
                                    >
                                        <Coffee size={16} />
                                        Browse Menu
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            )}
                        </GlassCard>

                        {/* 5. Account Settings */}
                        <GlassCard>
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                                <Settings className="w-5 h-5 text-[#0D7C53]" />
                                Account Settings
                            </h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate('/change-password')}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/40 backdrop-blur-sm hover:bg-white/60 rounded-lg text-gray-700 font-medium transition-all border border-white/30"
                                >
                                    <Key className="w-4 h-4" />
                                    Change Password
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50/80 hover:bg-red-100/80 text-red-600 rounded-lg font-medium transition-all border border-red-200/30"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
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
                
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(45deg); }
                    50% { transform: translateY(-15px) rotate(50deg); }
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
                
                .animate-float-slow {
                    animation: float-slow 9s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Profile;