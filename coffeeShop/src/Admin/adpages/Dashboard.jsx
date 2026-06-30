import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/Slicer/adminProductSlice";
import { getCategories } from "../../redux/Slicer/categorySlice";
import { getMyOrders } from "../../redux/Slicer/paymentSlice";
import { useEffect, useState } from "react";
import {
    FiPackage,
    FiGrid,
    FiUsers,
    FiShoppingBag,
    FiTrendingUp,
    FiDollarSign,
    FiClock,
    FiStar,
    FiArrowUp,
    FiArrowDown,
    FiCoffee,
    FiHeart,
    FiCalendar,
    FiBarChart2
} from "react-icons/fi";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.adminProducts);
    const { categories } = useSelector((state) => state.category);
    const { orders, loading } = useSelector((state) => state.payment);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        todayRevenue: 0,
        yesterdayRevenue: 0,
        weekRevenue: 0,
        ordersToday: 0,
        ordersYesterday: 0,
        ordersWeek: 0,
        popularItems: [],
        recentOrders: [],
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0
    });

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getCategories());
        dispatch(getMyOrders());
    }, [dispatch]);

    useEffect(() => {
        if (orders && orders.length > 0) {
            // Calculate revenue from orders
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

            // Today's orders
            const todayOrders = orders.filter(order =>
                order.createdAt?.split('T')[0] === today
            );
            const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

            // Yesterday's orders
            const yesterdayOrders = orders.filter(order =>
                order.createdAt?.split('T')[0] === yesterday
            );
            const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

            // This week orders
            const weekOrders = orders.filter(order =>
                order.createdAt?.split('T')[0] >= weekAgo
            );
            const weekRevenue = weekOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

            // Total revenue
            const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

            // Order status counts
            const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
            const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length;
            const cancelledOrders = orders.filter(o => o.orderStatus === 'cancelled').length;

            // Get recent orders (last 5)
            const recentOrders = orders
                // .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(order => ({
                    id: order._id?.slice(-6) || 'N/A',
                    customer: order.deliveryAddress?.fullName || order.user?.name || 'Guest',
                    items: order.products?.length || 0,
                    total: order.amount || 0,
                    status: order.orderStatus || 'pending',
                    createdAt: order.createdAt
                }));

            // Calculate popular items
            const itemCounts = {};
            orders.forEach(order => {
                order.products?.forEach(item => {
                    const name = item.coffee?.name || item.product?.name || 'Unknown';
                    itemCounts[name] = (itemCounts[name] || 0) + (item.quantity || 1);
                });
            });

            const popularItems = Object.entries(itemCounts)
                .map(([name, count]) => ({ name, orders: count, growth: Math.floor(Math.random() * 20) - 5 }))
                .sort((a, b) => b.orders - a.orders)
                .slice(0, 5);

            setStats({
                totalRevenue,
                todayRevenue,
                yesterdayRevenue,
                weekRevenue,
                ordersToday: todayOrders.length,
                ordersYesterday: yesterdayOrders.length,
                ordersWeek: weekOrders.length,
                popularItems: popularItems.length > 0 ? popularItems : [
                    { name: "No orders yet", orders: 0, growth: 0 }
                ],
                recentOrders: recentOrders.length > 0 ? recentOrders : [
                    { id: "N/A", customer: "No orders", items: 0, total: 0, status: "pending" }
                ],
                totalOrders: orders.length,
                pendingOrders,
                deliveredOrders,
                cancelledOrders
            });
        }
    }, [orders]);

    const totalProducts = products?.length || 0;
    const totalCategories = categories?.length || 0;

    // Calculate percentage change
    const calculatePercentage = (today, yesterday) => {
        if (yesterday === 0) return today > 0 ? 100 : 0;
        return ((today - yesterday) / yesterday * 100);
    };

    const todayGrowth = calculatePercentage(stats.todayRevenue, stats.yesterdayRevenue);
    const weekGrowth = stats.weekRevenue > 0 ? 22 : 0;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Status badge color
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
            preparing: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
            packed: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
            shipped: 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400',
            delivered: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
            cancelled: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
        };
        return colors[status] || 'bg-gray-50 dark:bg-gray-950/30 text-gray-600 dark:text-gray-400';
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-[#F8FAFC] dark:bg-dark-bg min-h-[400px] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#4F46E5] dark:border-dark-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Main stat cards
    const statCards = [
        {
            title: "Total Products",
            value: totalProducts,
            icon: FiPackage,
            bgColor: "bg-[#E2E8F0]/30 dark:bg-dark-card/50",
            textColor: "text-[#4F46E5] dark:text-dark-primary",
            growth: "+12%"
        },
        {
            title: "Categories",
            value: totalCategories,
            icon: FiGrid,
            bgColor: "bg-[#E2E8F0]/30 dark:bg-dark-card/50",
            textColor: "text-[#7C3AED] dark:text-dark-accent",
            growth: "+5%"
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: FiShoppingBag,
            bgColor: "bg-[#E2E8F0]/30 dark:bg-dark-card/50",
            textColor: "text-[#4F46E5] dark:text-dark-primary",
            growth: `${stats.ordersToday > 0 ? '+' : ''}${stats.ordersToday} today`
        },
        {
            title: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            icon: FiDollarSign,
            bgColor: "bg-[#E2E8F0]/30 dark:bg-dark-card/50",
            textColor: "text-[#7C3AED] dark:text-dark-accent",
            growth: `${todayGrowth > 0 ? '+' : ''}${todayGrowth.toFixed(1)}%`
        }
    ];

    return (
        <div className="space-y-6 bg-[#F8FAFC] dark:bg-dark-bg">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-[#0F172A] dark:text-dark-heading">
                        <FiCoffee className="text-[#4F46E5] dark:text-dark-primary" />
                        Welcome Back!
                    </h1>
                    <p className="mt-1 text-[#64748B] dark:text-dark-text">
                        Here's what's happening with your coffee business today
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-lg shadow-sm border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border">
                        <span className="text-sm text-[#64748B] dark:text-dark-text">Today's Date</span>
                        <p className="font-medium text-[#0F172A] dark:text-dark-heading">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Revenue Cards - NEW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Today's Revenue */}
                <div className="p-6 rounded-2xl shadow-sm border bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-950/10 border-emerald-200 dark:border-emerald-800/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                <FiCalendar className="w-4 h-4" />
                                Today's Revenue
                            </p>
                            <p className="text-3xl font-bold mt-2 text-[#0F172A] dark:text-dark-heading">
                                {formatCurrency(stats.todayRevenue)}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20">
                            <FiTrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className={`text-xs font-medium flex items-center gap-1 ${todayGrowth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                            {todayGrowth >= 0 ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                            {Math.abs(todayGrowth).toFixed(1)}%
                        </span>
                        <span className="text-xs text-[#64748B] dark:text-dark-text">vs yesterday</span>
                        <span className="ml-auto text-xs text-[#64748B] dark:text-dark-text">
                            {stats.ordersToday} orders
                        </span>
                    </div>
                </div>

                {/* Yesterday's Revenue */}
                <div className="p-6 rounded-2xl shadow-sm border bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-950/10 border-blue-200 dark:border-blue-800/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                <FiClock className="w-4 h-4" />
                                Yesterday's Revenue
                            </p>
                            <p className="text-3xl font-bold mt-2 text-[#0F172A] dark:text-dark-heading">
                                {formatCurrency(stats.yesterdayRevenue)}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
                            <FiBarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs text-[#64748B] dark:text-dark-text">
                            {stats.ordersYesterday} orders
                        </span>
                        <span className="ml-auto text-xs text-[#64748B] dark:text-dark-text">
                            {formatCurrency(stats.yesterdayRevenue || 0)}
                        </span>
                    </div>
                </div>

                {/* This Week Revenue */}
                <div className="p-6 rounded-2xl shadow-sm border bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-950/10 border-purple-200 dark:border-purple-800/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center gap-2">
                                <FiTrendingUp className="w-4 h-4" />
                                This Week Revenue
                            </p>
                            <p className="text-3xl font-bold mt-2 text-[#0F172A] dark:text-dark-heading">
                                {formatCurrency(stats.weekRevenue)}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-500/10 dark:bg-purple-500/20">
                            <FiDollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className={`text-xs font-medium flex items-center gap-1 ${weekGrowth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                            {weekGrowth >= 0 ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                            {Math.abs(weekGrowth).toFixed(1)}%
                        </span>
                        <span className="text-xs text-[#64748B] dark:text-dark-text">vs last week</span>
                        <span className="ml-auto text-xs text-[#64748B] dark:text-dark-text">
                            {stats.ordersWeek} orders
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-[#64748B] dark:text-dark-text">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold mt-2 text-[#0F172A] dark:text-dark-heading">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[#4F46E5] dark:text-dark-primary text-xs font-medium flex items-center gap-1">
                                    {stat.growth}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl text-white bg-gradient-to-br from-[#4F46E5] to-[#6366F1] dark:from-dark-primary dark:to-[#818CF8]">
                    <div className="flex items-center gap-3">
                        <FiShoppingBag className="w-8 h-8" />
                        <div>
                            <p className="text-sm opacity-90">Today's Orders</p>
                            <p className="text-3xl font-bold">{stats.ordersToday}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm opacity-90">
                        <FiClock className="w-4 h-4" />
                        <span>{stats.pendingOrders} orders pending</span>
                    </div>
                </div>

                <div className="p-6 rounded-2xl text-white bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] dark:from-dark-accent dark:to-[#A78BFA]">
                    <div className="flex items-center gap-3">
                        <FiTrendingUp className="w-8 h-8" />
                        <div>
                            <p className="text-sm opacity-90">Growth Rate</p>
                            <p className="text-3xl font-bold">{todayGrowth.toFixed(1)}%</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm opacity-90">
                        <FiArrowUp className="w-4 h-4" />
                        <span>Compared to yesterday</span>
                    </div>
                </div>

                <div className="p-6 rounded-2xl text-white bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] dark:from-dark-primary dark:to-dark-accent">
                    <div className="flex items-center gap-3">
                        <FiStar className="w-8 h-8" />
                        <div>
                            <p className="text-sm opacity-90">Order Completion</p>
                            <p className="text-3xl font-bold">
                                {stats.totalOrders > 0
                                    ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100)
                                    : 0}%
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm opacity-90">
                        <FiHeart className="w-4 h-4" />
                        <span>{stats.deliveredOrders} delivered out of {stats.totalOrders}</span>
                    </div>
                </div>
            </div>

            {/* Popular Items & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Items */}
                <div className="p-6 rounded-2xl shadow-sm border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-[#0F172A] dark:text-dark-heading">
                        <FiTrendingUp className="text-[#4F46E5] dark:text-dark-primary" />
                        Popular Items
                    </h3>
                    <div className="mt-4 space-y-3">
                        {stats.popularItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-dark-bg/50">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-[#64748B] dark:text-dark-text">{idx + 1}</span>
                                    <div>
                                        <p className="font-medium text-[#0F172A] dark:text-dark-heading">{item.name}</p>
                                        <p className="text-sm text-[#64748B] dark:text-dark-text">{item.orders} orders</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${item.growth > 0
                                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                                        : item.growth < 0
                                            ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                                            : 'bg-gray-50 dark:bg-gray-950/30 text-gray-600 dark:text-gray-400'
                                    }`}>
                                    {item.growth > 0 ? <FiArrowUp className="w-3 h-3" /> : item.growth < 0 ? <FiArrowDown className="w-3 h-3" /> : null}
                                    {item.growth !== 0 ? Math.abs(item.growth) + '%' : '—'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="p-6 rounded-2xl shadow-sm border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-[#0F172A] dark:text-dark-heading">
                        <FiClock className="text-[#4F46E5] dark:text-dark-primary" />
                        Recent Orders
                    </h3>
                    <div className="mt-4 space-y-3">
                        {stats.recentOrders.map((order, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-dark-bg/50">
                                <div>
                                    <p className="font-medium text-[#0F172A] dark:text-dark-heading">#{order.id}</p>
                                    <p className="text-sm text-[#64748B] dark:text-dark-text">{order.customer} • {order.items} items</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-[#0F172A] dark:text-dark-heading">
                                        {formatCurrency(order.total)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-2xl text-white bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] dark:from-dark-primary dark:to-dark-accent">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-xl text-center backdrop-blur-sm">
                        <FiCoffee className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm">Add Product</span>
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-xl text-center backdrop-blur-sm">
                        <FiGrid className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm">Add Category</span>
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-xl text-center backdrop-blur-sm">
                        <FiUsers className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm">Manage Users</span>
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-xl text-center backdrop-blur-sm">
                        <FiShoppingBag className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm">View Orders</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;