// pages/admin/DeliveryDetailsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../redux/Slicer/adminOrder';
import { updateOrderStatus } from '../../redux/Slicer/orderSlice';
import {
  FaArrowLeft,
  FaTruck,
  FaUser,
  FaRupeeSign,
  FaClock,
  FaSpinner,
  FaHourglassHalf,
  FaTimesCircle,
  FaPrint,
  FaDownload,
  FaBan,
  FaEdit,
  FaSave,
  FaTimes,
  FaReceipt,
  FaHistory,
  FaUsers,
  FaMobileAlt,
  FaCreditCard,
  FaWallet,
  FaInfoCircle,
  FaCheckCircle,
  FaCoffee,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaMotorcycle,
  FaIdCard,
  FaCar,
  FaRoad,
  FaRuler,
  FaTag,
  FaPercent,
  FaGift,
  FaHeadset,
  FaUserCircle,
  FaStar,
  FaSearch,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import {
  MdDeliveryDining,
  MdPayment,
  MdNotes,
  MdCheckCircleOutline,
  MdOutlineCheckCircle,
  MdOutlineReceipt,
  MdPersonAdd,
  MdSwapHoriz,
  MdLocationOn,
  MdStore,
  MdLocalShipping
} from 'react-icons/md';
import { GiKnifeFork, GiKitchenKnives } from 'react-icons/gi';
import { BsThreeDotsVertical } from 'react-icons/bs';

const DeliveryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ==================== A) REDUX STATE ====================
  const { orders, loading } = useSelector((state) => state.adminOrder);
  
  // ==================== B) CURRENT ORDER ====================
  const order = orders.find(o => o._id === id);
  
  // ==================== CURRENT STATUS ====================
  const currentStatus = order?.orderStatus || 'pending';

  // ==================== LOCAL STATE ====================
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showRiderDropdown, setShowRiderDropdown] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [riderSearch, setRiderSearch] = useState('');
  const notesRef = useRef(null);

  // Mock riders data
  const availableRiders = [
    {
      id: '1',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      email: 'rahul@delivery.com',
      photo: 'https://i.pravatar.cc/150?img=1',
      vehicleType: 'Bike',
      vehicleNumber: 'DL-01-AB-1234',
      status: 'available',
      currentDeliveries: 0,
      rating: 4.8,
      totalDeliveries: 1250,
      experience: '2 years'
    },
    {
      id: '2',
      name: 'Priya Patel',
      phone: '+91 98765 43211',
      email: 'priya@delivery.com',
      photo: 'https://i.pravatar.cc/150?img=2',
      vehicleType: 'Scooter',
      vehicleNumber: 'DL-02-CD-5678',
      status: 'available',
      currentDeliveries: 1,
      rating: 4.9,
      totalDeliveries: 980,
      experience: '1.5 years'
    },
    {
      id: '3',
      name: 'Amit Kumar',
      phone: '+91 98765 43212',
      email: 'amit@delivery.com',
      photo: 'https://i.pravatar.cc/150?img=3',
      vehicleType: 'Bike',
      vehicleNumber: 'DL-03-EF-9012',
      status: 'busy',
      currentDeliveries: 2,
      rating: 4.7,
      totalDeliveries: 750,
      experience: '1 year'
    },
  ];

  // ==================== FETCH ORDERS ====================
  useEffect(() => {
    if (orders.length === 0) {
      dispatch(getAllOrders());
    }
  }, [dispatch, orders.length]);

  // ==================== SET ORDER DATA ====================
  useEffect(() => {
    if (order) {
      setKitchenNotes(order.kitchenNotes || '');
    }
  }, [order]);

  // ==================== D) UPDATE STATUS HANDLER ====================
  const handleUpdateStatus = (newStatus) => {
    dispatch(updateOrderStatus({
      orderId: id,
      orderStatus: newStatus
    }));
  };

  // ==================== STATUS CONFIGURATION ====================
  const statusConfig = {
    pending: {
      icon: <FaHourglassHalf className="text-yellow-500" />,
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
      label: 'Pending',
      canCancel: true
    },
    confirmed: {
      icon: <FaCheckCircle className="text-blue-500" />,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      label: 'Confirmed',
      canCancel: true
    },
    preparing: {
      icon: <FaSpinner className="text-indigo-500 animate-spin" />,
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      borderColor: 'border-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
      label: 'Preparing',
      canCancel: true
    },
    out_for_delivery: {
      icon: <FaMotorcycle className="text-orange-500 animate-pulse" />,
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      label: 'Out for Delivery',
      canCancel: false
    },
    delivered: {
      icon: <FaCheckCircle className="text-emerald-500" />,
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      label: 'Delivered',
      canCancel: false
    },
    cancelled: {
      icon: <FaTimesCircle className="text-red-500" />,
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      label: 'Cancelled',
      canCancel: false
    }
  };

  // ==================== C) GET ACTION BUTTONS ====================
  const getActionButtons = () => {
    const status = order?.orderStatus || 'pending';

    const actionsMap = {
      pending: [
        {
          label: 'Confirm Order',
          icon: <MdCheckCircleOutline />,
          color: 'bg-blue-500 hover:bg-blue-600',
          action: () => handleUpdateStatus('confirmed')
        }
      ],
      confirmed: [
        {
          label: 'Start Preparing',
          icon: <GiKitchenKnives />,
          color: 'bg-indigo-500 hover:bg-indigo-600',
          action: () => handleUpdateStatus('preparing')
        }
      ],
      preparing: [
        {
          label: 'Out for Delivery',
          icon: <FaMotorcycle />,
          color: 'bg-orange-500 hover:bg-orange-600',
          action: () => handleUpdateStatus('out_for_delivery')
        }
      ],
      out_for_delivery: [
        {
          label: 'Mark Delivered',
          icon: <FaCheckCircle />,
          color: 'bg-green-500 hover:bg-green-600',
          action: () => handleUpdateStatus('delivered')
        }
      ]
    };

    return actionsMap[status] || [];
  };

  // ==================== E) GET TIMELINE ====================
  const getTimeline = () => {
    const timeline = [];

    timeline.push({
      status: 'Order Placed',
      time: order?.createdAt,
      icon: <FaClock />,
      color: 'text-blue-500'
    });

    if (order?.tracking) {
      order.tracking.forEach((track) => {
        const status = track.status;
        const config = statusConfig[status];
        if (config) {
          timeline.push({
            status: config.label,
            time: track.time,
            icon: config.icon,
            color: config.color.split(' ')[0].replace('bg-', 'text-'),
            message: track.message
          });
        }
      });
    }

    return timeline;
  };

  // ==================== PAYMENT ICON ====================
  const getPaymentIcon = (method) => {
    const icons = {
      card: <FaCreditCard />,
      upi: <FaMobileAlt />,
      cash: <FaWallet />,
      online: <FaCreditCard />
    };
    return icons[method?.toLowerCase()] || <FaWallet />;
  };

  // ==================== HANDLE SAVE NOTES ====================
  const handleSaveNotes = async () => {
    try {
      // await API.put(`/orders/${id}/notes`, { kitchenNotes });
      setIsEditingNotes(false);
      dispatch(getAllOrders());
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  // ==================== HANDLE CANCEL ORDER ====================
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }
    try {
      // await API.put(`/orders/${id}/cancel`, { reason: cancelReason });
      setShowCancelModal(false);
      setCancelReason('');
      handleUpdateStatus('cancelled');
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  // ==================== HANDLE RIDER ASSIGNMENT ====================
  const handleAssignRider = (rider) => {
    setSelectedRider(rider);
    setShowRiderDropdown(false);
    // await API.put(`/orders/${id}/assign-rider`, { riderId: rider.id });
    handleUpdateStatus('out_for_delivery');
  };

  // ==================== GET FILTERED RIDERS ====================
  const filteredRiders = availableRiders.filter(rider =>
    rider.name.toLowerCase().includes(riderSearch.toLowerCase()) ||
    rider.vehicleNumber.toLowerCase().includes(riderSearch.toLowerCase())
  );

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#4F46E5] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-[#64748B] dark:text-[#94A3B8]">Loading order details...</p>
        </div>
      </div>
    );
  }

  // ==================== ORDER NOT FOUND ====================
  if (!order) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="text-4xl text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">Order Not Found</h3>
          <p className="text-[#64748B] dark:text-[#94A3B8] mb-4">The order you're looking for doesn't exist</p>
          <button
            onClick={() => navigate('/admin/orders/delivery')}
            className="px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // ==================== RENDER VARIABLES ====================
  const status = order.orderStatus || 'pending';
  const statusInfo = statusConfig[status] || statusConfig.pending;
  const timeline = getTimeline();
  const isRiderReady = status === 'ready' || status === 'out_for_delivery' || status === 'delivered';
  const isDeliveryStage = ['out_for_delivery', 'delivered'].includes(status);

  // ==================== MAIN RENDER ====================
  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders/delivery')}
            className="p-2.5 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-[#2D3748] transition-all hover:scale-105"
          >
            <FaArrowLeft className="text-[#64748B] dark:text-[#94A3B8]" />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white">
                Order #{order._id?.slice(-8)}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusInfo.color}`}>
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </div>
            <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1">
              <FaClock className="inline mr-1.5" />
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#2D3748] transition-colors flex items-center gap-2">
            <FaPrint />
            Print
          </button>
          <button className="px-4 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#2D3748] transition-colors flex items-center gap-2">
            <FaDownload />
            Download
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* ORDER INFO CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B]">
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Customer</p>
              <p className="text-lg font-bold text-[#0F172A] dark:text-white mt-1 truncate">
                <FaUser className="inline mr-1.5 text-[#4F46E5]" />
                {order.user?.name || 'Guest'}
              </p>
            </div>
            <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B]">
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Phone</p>
              <p className="text-lg font-bold text-[#0F172A] dark:text-white mt-1">
                <FaPhone className="inline mr-1.5 text-[#4F46E5]" />
                {order.deliveryAddress?.phone || 'N/A'}
              </p>
            </div>
            <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B]">
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Payment</p>
              <p className="text-lg font-bold text-[#0F172A] dark:text-white mt-1">
                {getPaymentIcon(order.payment?.method)}
                <span className="ml-1.5">{order.payment?.method || 'N/A'}</span>
              </p>
            </div>
            <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B]">
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Type</p>
              <p className="text-lg font-bold text-[#0F172A] dark:text-white mt-1">
                <MdDeliveryDining className="inline mr-1.5 text-[#4F46E5]" />
                Delivery
              </p>
            </div>
          </div>

          {/* DELIVERY ADDRESS */}
          {order.deliveryAddress && (
            <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
              <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
                <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#4F46E5]" />
                  Delivery Address
                </h3>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-lg">
                    <MdLocationOn className="text-2xl text-[#4F46E5]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#0F172A] dark:text-white">
                      {order.deliveryAddress.fullName || 'Customer'}
                    </p>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
                      {order.deliveryAddress.addressLine1}
                      {order.deliveryAddress.addressLine2 && `, ${order.deliveryAddress.addressLine2}`}
                    </p>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                      {order.deliveryAddress.city && `${order.deliveryAddress.city}, `}
                      {order.deliveryAddress.state && `${order.deliveryAddress.state} `}
                      {order.deliveryAddress.pincode && `- ${order.deliveryAddress.pincode}`}
                    </p>
                    {order.deliveryAddress.phone && (
                      <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1 flex items-center gap-1">
                        <FaPhone className="text-[#4F46E5] text-xs" />
                        {order.deliveryAddress.phone}
                      </p>
                    )}
                    {order.deliveryAddress.type && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-[#F1F5F9] dark:bg-[#0F172A] rounded-full text-xs text-[#64748B] dark:text-[#94A3B8] capitalize">
                        {order.deliveryAddress.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERED ITEMS */}
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <FaCoffee className="text-[#4F46E5]" />
                  Ordered Items ({order.products?.length || 0})
                </h3>
                <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                  {order.products?.length || 0} items
                </span>
              </div>
            </div>
            <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
              {order.products?.map((item, index) => (
                <div key={index} className="p-4 hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#F1F5F9] dark:bg-[#0F172A]">
                      {item.coffee?.image ? (
                        <img
                          src={item.coffee.image}
                          alt={item.coffee.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaCoffee className="text-2xl text-[#94A3B8]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-[#0F172A] dark:text-white">
                            {item.coffee?.name || 'Product'}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
                            <span>Qty: {item.quantity || 1}</span>
                            <span className="w-1 h-1 rounded-full bg-[#E2E8F0] dark:bg-[#1E293B]"></span>
                            <span>₹{item.price || 0} each</span>
                          </div>
                          {item.specialInstructions && (
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 italic">
                              📝 {item.specialInstructions}
                            </p>
                          )}
                        </div>
                        <p className="text-lg font-bold text-[#4F46E5] flex-shrink-0">
                          ₹{item.subtotal || (item.price * (item.quantity || 1))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ==================== KITCHEN OPERATIONS ==================== */}
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
              <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                <GiKitchenKnives className="text-[#4F46E5]" />
                Kitchen Operations
              </h3>
            </div>
            <div className="p-4">
              {/* STATUS PROGRESS - E) Source: Redux state */}
              <div className="flex items-center justify-between mb-6">
                {['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'].map((s, index) => {
                  const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
                  const currentIndex = steps.indexOf(status);
                  const isActive = status === s;
                  const isCompleted = index <= currentIndex;
                  const config = statusConfig[s];

                  return (
                    <React.Fragment key={s}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? config.bgColor + ' ring-2 ring-[#4F46E5] ring-offset-2 dark:ring-offset-[#0F172A]'
                            : isCompleted
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-500'
                              : 'bg-[#F1F5F9] dark:bg-[#0F172A] text-[#94A3B8]'
                        }`}>
                          {isCompleted && s !== status ? <FaCheckCircle /> : config.icon}
                        </div>
                        <span className={`text-[10px] font-medium ${
                          isActive
                            ? 'text-[#0F172A] dark:text-white'
                            : 'text-[#64748B] dark:text-[#94A3B8]'
                        }`}>
                          {config.label.split(' ')[0]}
                        </span>
                      </div>
                      {index < 4 && (
                        <div className={`flex-1 h-0.5 ${
                          index < currentIndex ? 'bg-[#4F46E5]' : 'bg-[#E2E8F0] dark:bg-[#1E293B]'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* ACTION BUTTONS - C) getActionButtons call + D) dispatch */}
              <div className="flex flex-wrap gap-3">
                {getActionButtons().map((btn, index) => (
                  <button
                    key={index}
                    onClick={btn.action}
                    className={`px-6 py-2.5 text-white rounded-lg font-medium flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg ${btn.color}`}
                  >
                    {btn.icon}
                    {btn.label}
                  </button>
                ))}
                {statusInfo.canCancel && status !== 'cancelled' && status !== 'delivered' && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg"
                  >
                    <FaBan />
                    Cancel Order
                  </button>
                )}
                {status === 'delivered' && (
                  <div className="text-emerald-500 text-sm flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 rounded-lg">
                    <FaCheckCircle />
                    Order has been delivered successfully
                  </div>
                )}
                {status === 'cancelled' && (
                  <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-950/20 px-4 py-2 rounded-lg">
                    <FaTimesCircle />
                    Order has been cancelled
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIDER ASSIGNMENT SECTION */}
          {isRiderReady && status !== 'delivered' && status !== 'cancelled' && (
            <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
              <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
                <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <FaMotorcycle className="text-[#4F46E5]" />
                  {selectedRider ? 'Rider Assigned' : 'Assign Rider'}
                </h3>
              </div>
              <div className="p-4">
                {selectedRider ? (
                  <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedRider.photo}
                        alt={selectedRider.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#4F46E5]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-[#0F172A] dark:text-white">
                              {selectedRider.name}
                            </h4>
                            <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                              {selectedRider.vehicleType} - {selectedRider.vehicleNumber}
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            selectedRider.status === 'available'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {selectedRider.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                          <span className="flex items-center gap-1">
                            <FaPhone className="text-[#4F46E5]" />
                            {selectedRider.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaStar className="text-yellow-500" />
                            {selectedRider.rating}
                          </span>
                          <span>
                            {selectedRider.currentDeliveries} active deliveries
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1.5 bg-[#4F46E5] text-white text-sm rounded-lg hover:bg-[#4338CA] transition-colors flex items-center gap-1">
                        <FaPhone /> Contact
                      </button>
                      <button
                        onClick={() => setSelectedRider(null)}
                        className="px-3 py-1.5 bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] text-sm rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] transition-colors flex items-center gap-1"
                      >
                        <MdSwapHoriz /> Change Rider
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 relative">
                          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                          <input
                            type="text"
                            placeholder="Search available riders..."
                            value={riderSearch}
                            onChange={(e) => setRiderSearch(e.target.value)}
                            onFocus={() => setShowRiderDropdown(true)}
                            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                      {showRiderDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {filteredRiders.length > 0 ? (
                            filteredRiders.map((rider) => (
                              <button
                                key={rider.id}
                                onClick={() => handleAssignRider(rider)}
                                className="w-full px-4 py-3 text-left hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] transition-colors flex items-center gap-3 border-b border-[#E2E8F0] dark:border-[#1E293B] last:border-0"
                              >
                                <img
                                  src={rider.photo}
                                  alt={rider.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-[#0F172A] dark:text-white">
                                    {rider.name}
                                  </p>
                                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                                    {rider.vehicleType} • {rider.vehicleNumber}
                                  </p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  rider.status === 'available'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                  {rider.status}
                                </span>
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-[#64748B] dark:text-[#94A3B8]">
                              No riders available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* KITCHEN NOTES */}
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <MdNotes className="text-[#4F46E5]" />
                  Kitchen Notes
                </h3>
                {isEditingNotes ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingNotes(false)}
                      className="px-3 py-1 text-sm text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] rounded-lg transition-colors"
                    >
                      <FaTimes />
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 py-1 bg-[#4F46E5] text-white text-sm rounded-lg hover:bg-[#4338CA] transition-colors flex items-center gap-1.5"
                    >
                      <FaSave />
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="px-3 py-1 text-sm text-[#4F46E5] hover:bg-[#4F46E5]/10 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <FaEdit />
                    Edit
                  </button>
                )}
              </div>
            </div>
            <div className="p-4">
              {isEditingNotes ? (
                <textarea
                  ref={notesRef}
                  value={kitchenNotes}
                  onChange={(e) => setKitchenNotes(e.target.value)}
                  placeholder="Add internal notes for kitchen staff..."
                  className="w-full p-3 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all min-h-[100px]"
                />
              ) : (
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-lg min-h-[60px]">
                  {kitchenNotes ? (
                    <p className="text-[#0F172A] dark:text-white text-sm whitespace-pre-wrap">
                      {kitchenNotes}
                    </p>
                  ) : (
                    <p className="text-[#94A3B8] text-sm italic">No kitchen notes added</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="space-y-6">
          {/* ORDER SUMMARY */}
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden sticky top-6">
            <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
              <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                <FaReceipt className="text-[#4F46E5]" />
                Order Summary
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Subtotal</span>
                <span className="text-[#0F172A] dark:text-white font-medium">
                  ₹{order.amount || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Tax (5%)</span>
                <span className="text-[#0F172A] dark:text-white font-medium">
                  ₹{Math.round((order.amount || 0) * 0.05)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Delivery Charge</span>
                <span className="text-[#0F172A] dark:text-white font-medium">
                  ₹{order.deliveryCharge || 40}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Discount</span>
                <span className="text-green-500 font-medium">-₹{order.discount || 0}</span>
              </div>
              {order.couponDiscount && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                    <FaGift className="text-[#4F46E5]" /> Coupon
                  </span>
                  <span className="text-green-500 font-medium">-₹{order.couponDiscount}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#0F172A] dark:text-white">Grand Total</span>
                  <span className="text-xl font-bold text-[#4F46E5]">
                    ₹{Math.round(((order.amount || 0) * 1.05) + (order.deliveryCharge || 40) - (order.discount || 0) - (order.couponDiscount || 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT DETAILS */}
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
              <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                <MdPayment className="text-[#4F46E5]" />
                Payment Details
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Method</span>
                <span className="text-sm text-[#0F172A] dark:text-white font-medium flex items-center gap-1.5">
                  {getPaymentIcon(order.payment?.method)}
                  {order.payment?.method || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Status</span>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                  order.payment?.status === 'paid'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {order.payment?.status || 'Pending'}
                </span>
              </div>
              {order.payment?.transactionId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Transaction ID</span>
                  <span className="text-sm text-[#0F172A] dark:text-white font-mono">
                    {order.payment.transactionId}
                  </span>
                </div>
              )}
              {order.payment?.razorpayPaymentId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Razorpay ID</span>
                  <span className="text-sm text-[#0F172A] dark:text-white font-mono">
                    {order.payment.razorpayPaymentId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ORDER TIMELINE - E) Source: Redux state */}
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
              <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                <FaHistory className="text-[#4F46E5]" />
                Order Timeline
              </h3>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color} bg-opacity-10`}>
                        {item.icon}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 flex-1 bg-[#E2E8F0] dark:bg-[#1E293B] mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-medium text-[#0F172A] dark:text-white">
                        {item.status}
                      </p>
                      {item.message && (
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{item.message}</p>
                      )}
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                        {new Date(item.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CANCEL ORDER MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-xl max-w-md w-full p-6 border border-[#E2E8F0] dark:border-[#1E293B]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white">Cancel Order</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1.5 hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] rounded-lg transition-colors"
              >
                <FaTimes className="text-[#64748B] dark:text-[#94A3B8]" />
              </button>
            </div>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="text-sm font-medium text-[#0F172A] dark:text-white block mb-1.5">
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason..."
                className="w-full p-3 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all min-h-[80px]"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDetailsPage;