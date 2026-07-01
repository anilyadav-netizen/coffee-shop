import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io from 'socket.io-client';
import {
    ArrowLeft,
    Package,
    ShoppingBag,
    CheckCircle,
    Coffee,
    Clock,
    Calendar,
    CreditCard,
    Home,
    MapPin,
    Phone,
    Truck,
    Store,
    User,
    ChevronDown,
    ChevronUp,
    Filter,
    PackageCheck,
    Truck as TruckIcon,
    MapPinCheck,
    CircleCheck,
    Loader2,
    AlertCircle,
    Utensils,
    ChefHat,
    Wifi,
    WifiOff,
    RefreshCw
} from "lucide-react";
import { getMyOrders } from "../redux/Slicer/paymentSlice";
import { getProducts } from "../redux/Slicer/adminProductSlice";

const OrderDetailsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Get orders from Redux
    const { orders, loading } = useSelector((state) => state.payment);
    // Get products from Redux
    const { products } = useSelector((state) => state.adminProducts);

    // ==================== SOCKET SETUP ====================
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [reconnecting, setReconnecting] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // State for expanded orders
    const [expandedOrders, setExpandedOrders] = useState({});
    // State for filter
    const [filterType, setFilterType] = useState('all');
    // State for real-time order updates
    const [liveOrders, setLiveOrders] = useState([]);

    // ==================== SOCKET CONNECTION ====================
    useEffect(() => {
        const SOCKET_URL = 'http://localhost:5003';

        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket'],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socketRef.current = socketInstance;
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Socket connected successfully');
            setSocketConnected(true);
            setConnectionError(null);
            setReconnecting(false);

            const userId = localStorage.getItem('userId');
            if (userId) {
                socketInstance.emit('join-user', userId);
                console.log(`Joined user room: ${userId}`);
            }
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setConnectionError(error.message);
            setSocketConnected(false);
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket disconnected');
            setSocketConnected(false);
        });

        socketInstance.on('reconnecting', (attemptNumber) => {
            console.log(`Reconnecting attempt ${attemptNumber}`);
            setReconnecting(true);
        });

        socketInstance.on('reconnect', () => {
            console.log('Socket reconnected');
            setSocketConnected(true);
            setReconnecting(false);
            const userId = localStorage.getItem('userId');
            if (userId) {
                socketInstance.emit('join-user', userId);
            }
            dispatch(getMyOrders());
        });

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
                socketInstance.off('connect');
                socketInstance.off('connect_error');
                socketInstance.off('disconnect');
                socketInstance.off('reconnecting');
                socketInstance.off('reconnect');
            }
        };
    }, [dispatch]);

    // ==================== SOCKET EVENT LISTENERS ====================
    useEffect(() => {
        if (!socketRef.current) return;

        const socketInstance = socketRef.current;

        // Listen for order status updates - FIXED to handle both order room and broadcast
        const handleOrderStatusUpdate = (data) => {
            console.log('Order status updated via socket:', data);

            // Check if this update is for our orders
            const orderExists = liveOrders.some(o => o._id === data.orderId);
            if (!orderExists) return;

            setLiveOrders(prevOrders => {
                const updatedOrders = prevOrders.map(order => {
                    if (order._id === data.orderId) {
                        return {
                            ...order,
                            orderStatus: data.newStatus,
                            tracking: data.tracking || order.tracking,
                            updatedAt: data.timestamp || new Date().toISOString()
                        };
                    }
                    return order;
                });
                return updatedOrders;
            });

            const order = orders.find(o => o._id === data.orderId);
            if (order) {
                const statusLabels = {
                    'pending': 'Pending',
                    'confirmed': 'Confirmed',
                    'preparing': 'Preparing',
                    'out_for_delivery': 'Out for Delivery',
                    'delivered': 'Delivered',
                    'cancelled': 'Cancelled'
                };
                addNotification({
                    id: Date.now(),
                    orderId: data.orderId,
                    message: `Order #${order._id.slice(-8)} status updated to ${statusLabels[data.newStatus] || data.newStatus}`,
                    type: 'status_update',
                    timestamp: new Date().toISOString()
                });
            }

            dispatch(getMyOrders());
        };

        // Listen for order cancellation - FIXED
        const handleOrderCancelled = (data) => {
            console.log('Order cancelled via socket:', data);

            const orderExists = liveOrders.some(o => o._id === data.orderId);
            if (!orderExists) return;

            setLiveOrders(prevOrders => {
                const updatedOrders = prevOrders.map(order => {
                    if (order._id === data.orderId) {
                        return {
                            ...order,
                            orderStatus: 'cancelled',
                            cancelledAt: data.timestamp || new Date().toISOString(),
                            cancelReason: data.reason
                        };
                    }
                    return order;
                });
                return updatedOrders;
            });

            const order = orders.find(o => o._id === data.orderId);
            if (order) {
                addNotification({
                    id: Date.now(),
                    orderId: data.orderId,
                    message: `Order #${order._id.slice(-8)} has been cancelled`,
                    type: 'cancellation',
                    timestamp: new Date().toISOString()
                });
            }

            dispatch(getMyOrders());
        };

        // Listen for rider assignment - FIXED
        const handleRiderAssigned = (data) => {
            console.log('Rider assigned via socket:', data);

            const orderExists = liveOrders.some(o => o._id === data.orderId);
            if (!orderExists) return;

            setLiveOrders(prevOrders => {
                const updatedOrders = prevOrders.map(order => {
                    if (order._id === data.orderId) {
                        return {
                            ...order,
                            assignedRider: data.rider,
                            orderStatus: 'out_for_delivery'
                        };
                    }
                    return order;
                });
                return updatedOrders;
            });

            const order = orders.find(o => o._id === data.orderId);
            if (order) {
                addNotification({
                    id: Date.now(),
                    orderId: data.orderId,
                    message: `Order #${order._id.slice(-8)} is out for delivery with ${data.rider?.name || 'a rider'}`,
                    type: 'rider_assigned',
                    timestamp: new Date().toISOString()
                });
            }

            dispatch(getMyOrders());
        };

        // Listen for kitchen notes updates - FIXED
        const handleKitchenNotesUpdated = (data) => {
            console.log('Kitchen notes updated via socket:', data);

            const orderExists = liveOrders.some(o => o._id === data.orderId);
            if (!orderExists) return;

            setLiveOrders(prevOrders => {
                const updatedOrders = prevOrders.map(order => {
                    if (order._id === data.orderId) {
                        return {
                            ...order,
                            kitchenNotes: data.notes,
                            updatedAt: data.timestamp || new Date().toISOString()
                        };
                    }
                    return order;
                });
                return updatedOrders;
            });
        };

        // Listen for new messages - FIXED
        const handleNewMessage = (data) => {
            console.log('New message:', data);
            addNotification({
                id: Date.now(),
                orderId: data.orderId,
                message: `${data.sender || 'Rider'}: ${data.message}`,
                type: 'rider_message',
                timestamp: new Date().toISOString()
            });
        };

        // Listen for broadcast updates (for users who might not be in the order room)
        const handleOrderUpdateBroadcast = (data) => {
            console.log('Order update broadcast received:', data);
            // Process the update similar to handleOrderStatusUpdate
            handleOrderStatusUpdate(data);
        };

        const handleOrderCancelledBroadcast = (data) => {
            console.log('Order cancellation broadcast received:', data);
            handleOrderCancelled(data);
        };

        const handleRiderAssignedBroadcast = (data) => {
            console.log('Rider assignment broadcast received:', data);
            handleRiderAssigned(data);
        };

        const handleKitchenNotesUpdatedBroadcast = (data) => {
            console.log('Kitchen notes broadcast received:', data);
            handleKitchenNotesUpdated(data);
        };

        // Register all event listeners
        socketInstance.on('order-status-updated', handleOrderStatusUpdate);
        socketInstance.on('order-cancelled', handleOrderCancelled);
        socketInstance.on('rider-assigned', handleRiderAssigned);
        socketInstance.on('kitchen-notes-updated', handleKitchenNotesUpdated);
        socketInstance.on('new-message', handleNewMessage);
        socketInstance.on('rider-message', handleNewMessage);

        // Register broadcast listeners
        socketInstance.on('order-update-broadcast', handleOrderUpdateBroadcast);
        socketInstance.on('order-cancelled-broadcast', handleOrderCancelledBroadcast);
        socketInstance.on('rider-assigned-broadcast', handleRiderAssignedBroadcast);
        socketInstance.on('kitchen-notes-updated-broadcast', handleKitchenNotesUpdatedBroadcast);

        // Cleanup
        return () => {
            socketInstance.off('order-status-updated', handleOrderStatusUpdate);
            socketInstance.off('order-cancelled', handleOrderCancelled);
            socketInstance.off('rider-assigned', handleRiderAssigned);
            socketInstance.off('kitchen-notes-updated', handleKitchenNotesUpdated);
            socketInstance.off('new-message', handleNewMessage);
            socketInstance.off('rider-message', handleNewMessage);
            socketInstance.off('order-update-broadcast', handleOrderUpdateBroadcast);
            socketInstance.off('order-cancelled-broadcast', handleOrderCancelledBroadcast);
            socketInstance.off('rider-assigned-broadcast', handleRiderAssignedBroadcast);
            socketInstance.off('kitchen-notes-updated-broadcast', handleKitchenNotesUpdatedBroadcast);
        };
    }, [orders, liveOrders, dispatch]);

    // ==================== ADD NOTIFICATION ====================
    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev].slice(0, 10));
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
    };

    // ==================== DISMISS NOTIFICATION ====================
    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // ==================== INITIAL DATA LOAD ====================
    useEffect(() => {
        dispatch(getMyOrders());
        dispatch(getProducts());
    }, [dispatch]);

    // ==================== SYNC ORDERS FROM REDUX ====================
    useEffect(() => {
        if (orders && orders.length > 0) {
            setLiveOrders(orders);
        }
    }, [orders]);

    // ==================== EXPAND ORDERS ON NAVIGATION ====================
    useEffect(() => {
        if (liveOrders && liveOrders.length > 0) {
            const orderFromState = location.state?.order;

            if (orderFromState) {
                setExpandedOrders({ [orderFromState._id]: true });
            } else {
                if (liveOrders.length > 0) {
                    setExpandedOrders({ [liveOrders[0]._id]: true });
                }
            }
        }
    }, [liveOrders, location.state]);

    // ==================== NAVBAR DARK ====================
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

    // ==================== FORMAT FUNCTIONS ====================
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return `₹${price?.toLocaleString('en-IN') || 0}`;
    };

    // ==================== ORDER STATUS DISPLAY ====================
    const getOrderStatusDisplay = (order) => {
        const status = order.orderStatus?.toLowerCase() || 'pending';
        const statusMap = {
            'pending': {
                label: 'Pending ⏳',
                icon: Clock,
                color: 'text-yellow-600',
                bg: 'bg-yellow-100/80',
                border: 'border-yellow-200',
                step: 0,
                description: 'Order placed, waiting for confirmation'
            },
            'confirmed': {
                label: 'Confirmed ✅',
                icon: CircleCheck,
                color: 'text-green-600',
                bg: 'bg-green-100/80',
                border: 'border-green-200',
                step: 1,
                description: 'Order has been confirmed'
            },
            'preparing': {
                label: 'Preparing 👨‍🍳',
                icon: ChefHat,
                color: 'text-orange-600',
                bg: 'bg-orange-100/80',
                border: 'border-orange-200',
                step: 2,
                description: 'Your order is being prepared'
            },
            'out_for_delivery': {
                label: 'Out for Delivery 🚚',
                icon: TruckIcon,
                color: 'text-purple-600',
                bg: 'bg-purple-100/80',
                border: 'border-purple-200',
                step: 3,
                description: 'Your order is on the way!'
            },
            'delivered': {
                label: 'Delivered ✅',
                icon: PackageCheck,
                color: 'text-green-700',
                bg: 'bg-green-100/80',
                border: 'border-green-300',
                step: 4,
                description: 'Order has been delivered successfully'
            },
            'cancelled': {
                label: 'Cancelled ❌',
                icon: AlertCircle,
                color: 'text-red-600',
                bg: 'bg-red-100/80',
                border: 'border-red-200',
                step: -1,
                description: 'Order has been cancelled'
            }
        };
        return statusMap[status] || statusMap['pending'];
    };

    // ==================== GET TRACKING STEPS ====================
    const getTrackingSteps = (order) => {
        const status = order.orderStatus?.toLowerCase() || 'pending';
        const isDelivery = order.orderType?.toLowerCase() === 'delivery';

        const deliverySteps = [
            { id: 'pending', label: 'Order Placed', icon: Clock, color: 'text-yellow-500' },
            { id: 'confirmed', label: 'Confirmed', icon: CircleCheck, color: 'text-green-500' },
            { id: 'preparing', label: 'Preparing', icon: ChefHat, color: 'text-orange-500' },
            { id: 'out_for_delivery', label: 'Out for Delivery', icon: TruckIcon, color: 'text-purple-500' },
            { id: 'delivered', label: 'Delivered', icon: PackageCheck, color: 'text-green-600' }
        ];

        const dineInSteps = [
            { id: 'pending', label: 'Order Placed', icon: Clock, color: 'text-yellow-500' },
            { id: 'confirmed', label: 'Confirmed', icon: CircleCheck, color: 'text-green-500' },
            { id: 'preparing', label: 'Preparing', icon: ChefHat, color: 'text-orange-500' },
            { id: 'delivered', label: 'Ready for Pickup', icon: Utensils, color: 'text-green-600' }
        ];

        const steps = isDelivery ? deliverySteps : dineInSteps;
        const currentStepIndex = steps.findIndex(s => s.id === status);

        if (status === 'cancelled') {
            return steps.map((step, index) => ({
                ...step,
                isCompleted: false,
                isCurrent: index === 0,
                isCancelled: true
            }));
        }

        return steps.map((step, index) => ({
            ...step,
            isCompleted: index <= currentStepIndex,
            isCurrent: index === currentStepIndex,
            isCancelled: false
        }));
    };

    // ==================== TOGGLE ORDER EXPANSION ====================
    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    // ==================== GET ORDER ITEMS ====================
    const getOrderItems = (order) => {
        if (!order || !products || products.length === 0) return [];

        return order.products.map((item) => {
            const productDetails = item.coffee || {};
            return {
                ...item,
                name: productDetails?.name || item.name || 'Unknown Item',
                image: productDetails?.image || 'https://placehold.co/100x100/e2e8f0/64748b?text=☕',
                description: productDetails?.description || '',
                price: item.price || 0,
                quantity: item.quantity || 1,
                subtotal: item.subtotal || (item.price * item.quantity) || 0
            };
        });
    };

    // ==================== FILTER ORDERS ====================
    const filteredOrders = liveOrders.filter(order => {
        if (filterType === 'all') return true;
        if (filterType === 'delivery') return order.orderType?.toLowerCase() === 'delivery';
        if (filterType === 'dine_in') return order.orderType?.toLowerCase() === 'dine_in';
        return true;
    });

    // ==================== GET COUNTS ====================
    const deliveryCount = liveOrders.filter(o => o.orderType?.toLowerCase() === 'delivery').length;
    const dineInCount = liveOrders.filter(o => o.orderType?.toLowerCase() === 'dine_in').length;

    // ==================== EXPAND/COLLAPSE ALL ====================
    const expandAllByType = (type) => {
        const ordersToExpand = liveOrders.filter(order => {
            if (type === 'all') return true;
            if (type === 'delivery') return order.orderType?.toLowerCase() === 'delivery';
            if (type === 'dine_in') return order.orderType?.toLowerCase() === 'dine_in';
            return true;
        });

        const newState = {};
        ordersToExpand.forEach(order => {
            newState[order._id] = true;
        });
        setExpandedOrders(newState);
    };

    const collapseAll = () => {
        setExpandedOrders({});
    };

    // ==================== MANUAL REFRESH ====================
    const handleRefresh = () => {
        dispatch(getMyOrders());
        if (socketRef.current && socketConnected) {
            socketRef.current.emit('request-order-update', {
                userId: localStorage.getItem('userId')
            });
        }
    };

    // ==================== LOADING STATE ====================
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#0D7C53] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // ==================== NO ORDERS STATE ====================
    if (!liveOrders || liveOrders.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] pt-20 sm:pt-24 px-3 sm:px-4 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center shadow-2xl shadow-black/5">
                        <div className="flex flex-col items-center justify-center py-8 sm:py-16">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-white/30">
                                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-[#0D7C53]" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                                No Orders Found
                            </h2>
                            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-6 sm:mb-8 px-2">
                                You haven't placed any orders yet. Start exploring our menu and place your first order!
                            </p>
                            <button
                                onClick={() => navigate('/menu')}
                                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
                            >
                                <Coffee size={18} className="sm:w-5 sm:h-5" />
                                Browse Menu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== MAIN RENDER ====================
    return (
        <>
            {/* ==================== NOTIFICATIONS ==================== */}
            {notifications.length > 0 && (
                <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`backdrop-blur-xl bg-white/95 border border-white/60 rounded-xl shadow-2xl p-3 sm:p-4 animate-slideInRight`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-medium text-gray-800">
                                        {notification.message}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        {formatDate(notification.timestamp)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => dismissNotification(notification.id)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                >
                                    <ArrowLeft size={14} className="rotate-45" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] pt-20 sm:pt-24 px-3 sm:px-4 pb-10 overflow-hidden">

                {/* Glass Background */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                    <div className="absolute top-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-amber-400/15 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-0 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-amber-700/10 rounded-full blur-[70px] sm:blur-[100px] animate-pulse-slow-delay" />
                    <div className="absolute inset-0 pointer-events-none opacity-10">
                        <div className="absolute top-20 left-10 text-4xl sm:text-6xl rotate-12 animate-float">🫘</div>
                        <div className="absolute bottom-32 right-20 text-4xl sm:text-6xl -rotate-12 animate-float-delay">☕</div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 mt-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-lg backdrop-blur-xl bg-white/30 border border-white/40 shadow-md hover:shadow-lg transition-all"
                            >
                                <ArrowLeft size={20} className="text-gray-700" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">
                                    My <span className="text-[#0D7C53]">Orders</span>
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {liveOrders.length} order{liveOrders.length > 1 ? 's' : ''} found
                                </p>
                            </div>
                        </div>

                        {/* Connection Status & Refresh */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 backdrop-blur-sm border border-white/40 rounded-lg">
                                {reconnecting ? (
                                    <>
                                        <Loader2 size={14} className="text-yellow-500 animate-spin" />
                                        <span className="text-xs text-gray-600">Reconnecting...</span>
                                    </>
                                ) : socketConnected ? (
                                    <>
                                        <Wifi size={14} className="text-green-500" />
                                        <span className="text-xs text-gray-600">Live</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff size={14} className="text-red-500" />
                                        <span className="text-xs text-gray-600">Offline</span>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={handleRefresh}
                                className="p-2 rounded-lg bg-white/40 backdrop-blur-sm border border-white/40 hover:bg-white/60 transition-all"
                                disabled={loading}
                            >
                                <RefreshCw size={18} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Filter Toggle Buttons */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <button
                            onClick={() => {
                                setFilterType('all');
                                collapseAll();
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${filterType === 'all'
                                    ? 'bg-gradient-to-r from-[#0D7C53] to-green-600 text-white shadow-lg shadow-[#0D7C53]/30'
                                    : 'bg-white/30 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/50'
                                }`}
                        >
                            <Filter size={16} />
                            All Orders
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${filterType === 'all'
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-200/50 text-gray-600'
                                }`}>
                                {liveOrders.length}
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                setFilterType('delivery');
                                expandAllByType('delivery');
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${filterType === 'delivery'
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-white/30 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/50'
                                }`}
                        >
                            <Truck size={16} />
                            Delivery
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${filterType === 'delivery'
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-200/50 text-gray-600'
                                }`}>
                                {deliveryCount}
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                setFilterType('dine_in');
                                expandAllByType('dine_in');
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${filterType === 'dine_in'
                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-white/30 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/50'
                                }`}
                        >
                            <Store size={16} />
                            Dine In
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${filterType === 'dine_in'
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-200/50 text-gray-600'
                                }`}>
                                {dineInCount}
                            </span>
                        </button>

                        <div className="ml-auto flex gap-2">
                            <button
                                onClick={() => {
                                    if (filterType === 'all') {
                                        const allExpanded = Object.values(expandedOrders).every(v => v === true);
                                        if (allExpanded) {
                                            collapseAll();
                                        } else {
                                            expandAllByType('all');
                                        }
                                    } else {
                                        expandAllByType(filterType);
                                    }
                                }}
                                className="px-3 py-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/50 transition-all flex items-center gap-2"
                            >
                                {Object.values(expandedOrders).some(v => v === true) ? (
                                    <>
                                        <ChevronUp size={16} />
                                        Collapse
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={16} />
                                        Expand
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-4 sm:space-y-6">
                        {filteredOrders.length === 0 ? (
                            <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl p-8 text-center">
                                <p className="text-gray-500">No {filterType === 'delivery' ? 'Delivery' : filterType === 'dine_in' ? 'Dine In' : ''} orders found</p>
                            </div>
                        ) : (
                            filteredOrders.map((order) => {
                                const orderItems = getOrderItems(order);
                                const totalItems = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
                                const isDeliveryOrder = order.orderType?.toLowerCase() === 'delivery';
                                const deliveryAddress = order.deliveryAddress;
                                const isExpanded = expandedOrders[order._id] || false;
                                const statusInfo = getOrderStatusDisplay(order);
                                const StatusIcon = statusInfo.icon;
                                const trackingSteps = getTrackingSteps(order);
                                const isCancelled = order.orderStatus?.toLowerCase() === 'cancelled';
                                const status = order.orderStatus?.toLowerCase() || 'pending';

                                const hasLiveUpdate = notifications.some(n => n.orderId === order._id);

                                return (
                                    <div
                                        key={order._id}
                                        className={`backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${isCancelled ? 'opacity-75' : ''
                                            } ${hasLiveUpdate ? 'ring-2 ring-[#0D7C53] ring-opacity-50' : ''}`}
                                    >
                                        {/* Order Header - Always Visible */}
                                        <div className="p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                                        <span className="font-mono text-xs sm:text-sm font-semibold text-gray-700 bg-white/50 px-2 py-1 rounded-lg">
                                                            #{order._id?.slice(-8)}
                                                        </span>

                                                        {hasLiveUpdate && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full text-[10px] text-green-600 animate-pulse">
                                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                                Live
                                                            </span>
                                                        )}

                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 backdrop-blur-sm border-2 rounded-full text-[10px] sm:text-xs font-bold shadow-sm ${isDeliveryOrder
                                                                ? 'bg-blue-500/90 border-blue-600 text-white'
                                                                : 'bg-purple-500/90 border-purple-600 text-white'
                                                            }`}>
                                                            {isDeliveryOrder ? <Truck size={12} /> : <Store size={12} />}
                                                            {isDeliveryOrder ? 'Delivery' : 'Dine In'}
                                                        </span>

                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-sm border-2 rounded-full text-xs font-bold shadow-lg ${isCancelled
                                                                ? 'bg-red-500/90 border-red-600 text-white'
                                                                : statusInfo.bg + ' ' + statusInfo.border + ' ' + statusInfo.color
                                                            }`}>
                                                            <StatusIcon size={14} className={
                                                                status === 'preparing' ? 'animate-spin' :
                                                                    status === 'out_for_delivery' ? 'animate-bounce-slow' : ''
                                                            } />
                                                            {statusInfo.label}
                                                        </span>

                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium ${order.paymentStatus === 'paid'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {order.paymentStatus === 'paid' ? '💳 Paid' : '💳 Pending'}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={14} className="text-gray-400" />
                                                            {formatDate(order.createdAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <ShoppingBag size={14} className="text-gray-400" />
                                                            {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                                        </span>
                                                        <span className="font-semibold text-[#0D7C53]">
                                                            {formatPrice(order.amount)}
                                                        </span>
                                                        {order.updatedAt && (
                                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                                <Clock size={12} />
                                                                Updated: {formatDate(order.updatedAt)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => toggleOrderExpansion(order._id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/50 rounded-lg hover:bg-white/60 transition-all duration-300 text-sm font-medium text-gray-700 flex-shrink-0"
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            <ChevronUp size={18} />
                                                            <span className="hidden sm:inline">Collapse</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown size={18} />
                                                            <span className="hidden sm:inline">Expand</span>
                                                        </>
                                                    )}
                                                    <span className="sm:hidden">
                                                        {isExpanded ? '▲' : '▼'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Order Details - Expandable */}
                                        {isExpanded && (
                                            <div className="border-t border-white/30 p-4 sm:p-6 bg-white/10 animate-fadeIn">
                                                {/* Order Status Timeline */}
                                                {!isCancelled && (
                                                    <div className={`backdrop-blur-xl border rounded-xl p-4 mb-4 ${isDeliveryOrder
                                                            ? 'bg-blue-50/40 border-blue-200/50'
                                                            : 'bg-purple-50/40 border-purple-200/50'
                                                        }`}>
                                                        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                            {isDeliveryOrder ? <TruckIcon size={18} className="text-blue-600" /> : <Utensils size={18} className="text-purple-600" />}
                                                            {isDeliveryOrder ? 'Delivery Tracking' : 'Order Progress'}
                                                            <span className="ml-auto text-xs font-normal text-gray-500">
                                                                Updated: {formatDate(order.updatedAt)}
                                                            </span>
                                                        </h4>

                                                        <div className="relative">
                                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                                                                {trackingSteps.map((step, index) => (
                                                                    <React.Fragment key={step.id}>
                                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                                            <div className="flex flex-col items-center">
                                                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step.isCompleted
                                                                                        ? 'bg-green-500 border-green-600 text-white shadow-lg shadow-green-500/30'
                                                                                        : step.isCurrent
                                                                                            ? 'bg-blue-500 border-blue-600 text-white shadow-lg shadow-blue-500/30 animate-pulse'
                                                                                            : 'bg-gray-200 border-gray-300 text-gray-400'
                                                                                    }`}>
                                                                                    <step.icon size={16} className={
                                                                                        step.isCurrent && step.id === 'preparing' ? 'animate-spin' :
                                                                                            step.isCurrent && step.id === 'out_for_delivery' ? 'animate-bounce-slow' : ''
                                                                                    } />
                                                                                </div>
                                                                                <span className={`text-[10px] font-medium mt-1 text-center ${step.isCompleted ? 'text-green-600' : step.isCurrent ? 'text-blue-600' : 'text-gray-400'
                                                                                    }`}>
                                                                                    {step.label}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        {index < trackingSteps.length - 1 && (
                                                                            <div className="flex-1 min-w-[20px] sm:min-w-[40px] h-0.5 mx-2">
                                                                                <div className={`h-full transition-all duration-500 ${step.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                                                                    }`}></div>
                                                                            </div>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {order.tracking && order.tracking.length > 0 && (
                                                            <div className="mt-4 pt-3 border-t border-blue-200/50">
                                                                <div className="flex flex-col gap-1">
                                                                    <p className="text-xs text-gray-500 flex items-center gap-2">
                                                                        <Clock size={12} />
                                                                        Latest update: {order.tracking[order.tracking.length - 1]?.message || 'Order placed'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 ml-6">
                                                                        {formatDate(order.tracking[order.tracking.length - 1]?.time)}
                                                                    </p>
                                                                    {order.tracking.length > 1 && (
                                                                        <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors ml-6">
                                                                            View all updates ({order.tracking.length})
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {isCancelled && (
                                                    <div className="backdrop-blur-xl bg-red-50/40 border border-red-200/50 rounded-xl p-4 mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-red-100/80 rounded-full flex items-center justify-center">
                                                                <AlertCircle size={20} className="text-red-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-red-700">
                                                                    Order Cancelled ❌
                                                                </p>
                                                                <p className="text-xs text-red-600">
                                                                    This order has been cancelled and will not be processed.
                                                                </p>
                                                                {order.cancelReason && (
                                                                    <p className="text-xs text-red-500 mt-1">
                                                                        Reason: {order.cancelReason}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                                                    {/* Left Section - Order Items & Delivery Info */}
                                                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                                                        {isDeliveryOrder && deliveryAddress && (
                                                            <div className="backdrop-blur-xl bg-blue-50/40 border border-blue-200/50 rounded-xl p-3 sm:p-4">
                                                                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                                                    <div className="p-1 bg-blue-100/60 rounded-lg">
                                                                        <Truck size={16} className="text-blue-600" />
                                                                    </div>
                                                                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                                                                        Delivery Address
                                                                    </h3>
                                                                </div>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                    <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Full Name</p>
                                                                        <p className="font-semibold text-sm text-gray-800">{deliveryAddress.fullName || 'N/A'}</p>
                                                                    </div>
                                                                    <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Phone</p>
                                                                        <p className="font-semibold text-sm text-gray-800">{deliveryAddress.phone || 'N/A'}</p>
                                                                    </div>
                                                                    <div className="sm:col-span-2 bg-white/20 rounded-lg p-2 sm:p-3">
                                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Address</p>
                                                                        <p className="font-semibold text-sm text-gray-800">
                                                                            {deliveryAddress.addressLine1}
                                                                            {deliveryAddress.addressLine2 && `, ${deliveryAddress.addressLine2}`}
                                                                        </p>
                                                                        <p className="text-xs text-gray-600 mt-0.5">
                                                                            {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {!isDeliveryOrder && (
                                                            <div className="backdrop-blur-xl bg-purple-50/40 border border-purple-200/50 rounded-xl p-3 sm:p-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1 bg-purple-100/60 rounded-lg">
                                                                        <Store size={16} className="text-purple-600" />
                                                                    </div>
                                                                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                                                                        Dine In Order
                                                                    </h3>
                                                                </div>
                                                                <p className="text-xs sm:text-sm text-gray-600 mt-1 ml-7">
                                                                    This order is for dine-in at our cafe.
                                                                </p>
                                                                {status === 'delivered' && (
                                                                    <p className="text-xs text-green-600 mt-1 ml-7 flex items-center gap-1">
                                                                        <CircleCheck size={14} />
                                                                        Ready for pickup!
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl p-3 sm:p-4">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <div className="p-1 bg-amber-100/60 rounded-lg">
                                                                    <ShoppingBag size={16} className="text-amber-600" />
                                                                </div>
                                                                <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                                                                    Items
                                                                </h3>
                                                                <span className="ml-auto text-xs text-gray-500">
                                                                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                                                </span>
                                                            </div>

                                                            <div className="space-y-2">
                                                                {orderItems.map((item, index) => (
                                                                    <div
                                                                        key={item._id || index}
                                                                        className="flex gap-3 bg-white/20 rounded-lg p-2 sm:p-3 hover:bg-white/30 transition-all"
                                                                    >
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                                            onError={(e) => {
                                                                                e.target.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=☕';
                                                                            }}
                                                                        />
                                                                        <div className="flex-1 min-w-0">
                                                                            <h4 className="font-semibold text-sm text-gray-800 truncate">
                                                                                {item.name}
                                                                            </h4>
                                                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                                                <span>Qty: {item.quantity}</span>
                                                                                <span>{formatPrice(item.price)} each</span>
                                                                            </div>
                                                                            <div className="font-bold text-[#0D7C53] text-sm mt-0.5">
                                                                                {formatPrice(item.subtotal || item.price * item.quantity)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right Section - Order Summary */}
                                                    <div className="lg:col-span-1">
                                                        <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl p-4">
                                                            <h3 className="text-lg font-bold text-gray-800 mb-3">
                                                                Order Summary
                                                            </h3>

                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Order Type</span>
                                                                    <span className={`font-semibold flex items-center gap-1 ${isDeliveryOrder ? 'text-blue-600' : 'text-purple-600'}`}>
                                                                        {isDeliveryOrder ? <Truck size={14} /> : <Store size={14} />}
                                                                        {isDeliveryOrder ? 'Delivery' : 'Dine In'}
                                                                    </span>
                                                                </div>

                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Total Items</span>
                                                                    <span className="font-medium text-gray-800">{totalItems}</span>
                                                                </div>

                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-gray-500">Order Status</span>
                                                                    <span className={`font-semibold flex items-center gap-1.5 ${isCancelled ? 'text-red-600' : statusInfo.color}`}>
                                                                        <StatusIcon size={14} className={
                                                                            status === 'preparing' ? 'animate-spin' :
                                                                                status === 'out_for_delivery' ? 'animate-bounce-slow' : ''
                                                                        } />
                                                                        {statusInfo.label}
                                                                    </span>
                                                                </div>

                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Payment</span>
                                                                    <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                                        {order.paymentStatus === 'paid' ? 'Paid ✅' : 'Pending ⏳'}
                                                                    </span>
                                                                </div>

                                                                {order.payment?._id && (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-500">Payment ID</span>
                                                                        <span className="text-xs text-gray-600 truncate max-w-[100px]">
                                                                            {order.payment._id.slice(-8)}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Status Info</span>
                                                                    <span className="text-sm text-gray-600 text-right max-w-[150px]">
                                                                        {statusInfo.description}
                                                                    </span>
                                                                </div>

                                                                <div className="border-t border-gray-200/50 pt-2 mt-2">
                                                                    <div className="flex justify-between text-lg font-bold">
                                                                        <span className="text-gray-800">Total</span>
                                                                        <span className="text-[#0D7C53]">
                                                                            {formatPrice(order.amount)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate('/menu');
                                                                }}
                                                                className="w-full mt-3 py-2 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                                                            >
                                                                <Coffee size={16} />
                                                                Order Again
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

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
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
                .animate-pulse-slow-delay { animation: pulse-slow-delay 10s ease-in-out infinite; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delay { animation: float-delay 7s ease-in-out infinite; }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                .animate-pulse { animation: pulse 2s ease-in-out infinite; }
                .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
                .animate-spin { animation: spin 2s linear infinite; }
                .animate-slideInRight { animation: slideInRight 0.5s ease-out; }
            `}</style>
        </>
    );
};

export default OrderDetailsPage;