import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/Slicer/adminProductSlice";
import { getCategories } from "../../redux/Slicer/categorySlice";
import { getAllOrders } from "../../redux/Slicer/adminOrder";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    FiBarChart2,
    FiPlus,
    FiMoreHorizontal,
    FiAward,
    FiChevronRight
} from "react-icons/fi";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.adminProducts);
    const { categories } = useSelector((state) => state.category);
    const { orders, loading } = useSelector((state) => state.adminOrder);
    const navigate = useNavigate();
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
        dispatch(getAllOrders());
    }, [dispatch]);

    useEffect(() => {
        if (orders && orders.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

            const todayOrders = orders.filter(order =>
                order.createdAt?.split('T')[0] === today
            );
            const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

            const yesterdayOrders = orders.filter(order =>
                order.createdAt?.split('T')[0] === yesterday
            );
            const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

            const weekOrders = orders.filter(order =>
                order.createdAt?.split('T')[0] >= weekAgo
            );
            const weekRevenue = weekOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

            const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

            const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
            const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length;
            const cancelledOrders = orders.filter(o => o.orderStatus === 'cancelled').length;

            const recentOrders = orders
                .slice(0, 5)
                .map(order => ({
                    id: order._id?.slice(-6) || 'N/A',
                    customer: order.deliveryAddress?.fullName || order.user?.name || 'Guest',
                    items: order.products?.length || 0,
                    total: order.amount || 0,
                    status: order.orderStatus || 'pending',
                    createdAt: order.createdAt
                }));

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

    const calculatePercentage = (today, yesterday) => {
        if (yesterday === 0) return today > 0 ? 100 : 0;
        return ((today - yesterday) / yesterday * 100);
    };

    const todayGrowth = calculatePercentage(stats.todayRevenue, stats.yesterdayRevenue);
    const weekGrowth = stats.weekRevenue > 0 ? 22 : 0;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

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

    if (loading) {
        return (
            <div className="bg-[#F8FAFC] dark:bg-dark-bg min-h-[400px] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Products",
            value: totalProducts,
            icon: FiPackage,
            iconColor: "text-[#3B82F6]",
            bgColor: "bg-[#3B82F6]/10",
            growth: "+12%",
            path: "/admin/products"
        },
        {
            title: "Categories",
            value: totalCategories,
            icon: FiGrid,
            iconColor: "text-[#8B5CF6]",
            bgColor: "bg-[#8B5CF6]/10",
            growth: "+5%",
            path: "/admin/category"
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: FiShoppingBag,
            iconColor: "text-[#F59E0B]",
            bgColor: "bg-[#F59E0B]/10",
            growth: `${stats.ordersToday > 0 ? '+' : ''}${stats.ordersToday} today`
        },
        {
            title: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            icon: FiDollarSign,
            iconColor: "text-[#10B981]",
            bgColor: "bg-[#10B981]/10",
            growth: `${todayGrowth > 0 ? '+' : ''}${todayGrowth.toFixed(1)}%`
        }
    ];

    return (
        <div className="space-y-6 bg-[#F8FAFC] dark:bg-dark-bg">
            {/* Classic Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-[#0F172A] dark:text-dark-heading">
                        <FiCoffee className="text-[#3B82F6] dark:text-[#60A5FA]" />
                        Dashboard
                    </h1>
                    <p className="mt-1 text-[#64748B] dark:text-dark-text">
                        Welcome back! Here's your business overview
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-lg border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border">
                        <span className="text-sm text-[#64748B] dark:text-dark-text">Today</span>
                        <p className="font-medium text-[#0F172A] dark:text-dark-heading">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                    <button className="p-2 rounded-lg border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border text-[#64748B] dark:text-dark-text hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors">
                        <FiMoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Revenue Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Today's Revenue */}
                <div className="p-6 rounded-xl border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-[#64748B] dark:text-dark-text flex items-center gap-2">
                                <FiCalendar className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA]" />
                                Today's Revenue
                            </p>
                            <p className="text-2xl font-bold mt-2 text-[#0F172A] dark:text-dark-heading">
                                {formatCurrency(stats.todayRevenue)}
                            </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20">
                            <FiTrendingUp className="w-5 h-5 text-[#3B82F6] dark:text-[#60A5FA]" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
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
                <div className="p-6 rounded-xl border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-[#64748B] dark:text-dark-text flex items-center gap-2">
                                <FiClock className="w-4 h-4 text-[#64748B] dark:text-dark-text" />
                                Yesterday's Revenue
                            </p>
                            <p className="text-2xl font-bold mt-2 text-[#0F172A] dark:text-dark-heading">
                                {formatCurrency(stats.yesterdayRevenue)}
                            </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#64748B]/10 dark:bg-[#64748B]/20">
                            <FiBarChart2 className="w-5 h-5 text-[#64748B] dark:text-dark-text" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-[#64748B] dark:text-dark-text">
                            {stats.ordersYesterday} orders
                        </span>
                        <span className="ml-auto text-xs text-[#64748B] dark:text-dark-text">
                            {formatCurrency(stats.yesterdayRevenue || 0)}
                        </span>
                    </div>
                </div>

                {/* This Week Revenue */}
                <div className="p-6 rounded-xl border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-[#64748B] dark:text-dark-text flex items-center gap-2">
                                <FiTrendingUp className="w-4 h-4 text-[#8B5CF6] dark:text-[#A78BFA]" />
                                This Week Revenue
                            </p>
                            <p className="text-2xl font-bold mt-2 text-[#0F172A] dark:text-dark-heading">
                                {formatCurrency(stats.weekRevenue)}
                            </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20">
                            <FiDollarSign className="w-5 h-5 text-[#8B5CF6] dark:text-[#A78BFA]" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
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
                            onClick={() => stat.path && navigate(stat.path)}
                            className={`p-6 rounded-xl border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border shadow-sm hover:shadow-md transition-all ${stat.path ? "cursor-pointer hover:-translate-y-0.5" : ""
                                }`}
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
                                <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-[#3B82F6] dark:text-[#60A5FA] text-xs font-medium">
                                    {stat.growth}
                                </span>
                                <span className="text-xs text-[#64748B] dark:text-dark-text">this month</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-xl border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20">
                            <FiShoppingBag className="w-6 h-6 text-[#3B82F6] dark:text-[#60A5FA]" />
                        </div>
                        <div>
                            <p className="text-sm text-[#64748B] dark:text-dark-text">Today's Orders</p>
                            <p className="text-2xl font-bold text-[#0F172A] dark:text-dark-heading">{stats.ordersToday}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-[#64748B] dark:text-dark-text">
                        <span>{stats.pendingOrders} pending</span>
                        <span className="w-px h-3 bg-[#E2E8F0] dark:bg-dark-border"></span>
                        <span>{stats.deliveredOrders} delivered</span>
                    </div>
                </div>

                <div className="p-6 rounded-xl border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20">
                            <FiTrendingUp className="w-6 h-6 text-[#8B5CF6] dark:text-[#A78BFA]" />
                        </div>
                        <div>
                            <p className="text-sm text-[#64748B] dark:text-dark-text">Growth Rate</p>
                            <p className="text-2xl font-bold text-[#0F172A] dark:text-dark-heading">{todayGrowth.toFixed(1)}%</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-[#64748B] dark:text-dark-text">
                        <FiArrowUp className="w-3 h-3" />
                        <span>Compared to yesterday</span>
                    </div>
                </div>

                <div className="p-6 rounded-xl border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20">
                            <FiStar className="w-6 h-6 text-[#F59E0B] dark:text-[#FBBF24]" />
                        </div>
                        <div>
                            <p className="text-sm text-[#64748B] dark:text-dark-text">Order Completion</p>
                            <p className="text-2xl font-bold text-[#0F172A] dark:text-dark-heading">
                                {stats.totalOrders > 0
                                    ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100)
                                    : 0}%
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-[#64748B] dark:text-dark-text">
                        <FiHeart className="w-3 h-3" />
                        <span>{stats.deliveredOrders} delivered out of {stats.totalOrders}</span>
                    </div>
                </div>
            </div>

            {/* Popular Items & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Items */}
                <div className="p-6 rounded-xl border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-[#0F172A] dark:text-dark-heading flex items-center gap-2">
                            <FiTrendingUp className="text-[#3B82F6] dark:text-[#60A5FA]" />
                            Popular Items
                        </h3>
                        <span className="text-xs text-[#64748B] dark:text-dark-text">Best sellers</span>
                    </div>
                    <div className="space-y-2">
                        {stats.popularItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${idx === 0 ? 'bg-[#3B82F6] text-white' :
                                        'bg-[#F1F5F9] dark:bg-dark-border text-[#64748B] dark:text-dark-text'
                                        }`}>
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <p className="font-medium text-[#0F172A] dark:text-dark-heading">{item.name}</p>
                                        <p className="text-xs text-[#64748B] dark:text-dark-text">{item.orders} orders</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${item.growth > 0
                                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                                    : item.growth < 0
                                        ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
                                        : 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30'
                                    }`}>
                                    {item.growth > 0 ? <FiArrowUp className="w-3 h-3" /> : item.growth < 0 ? <FiArrowDown className="w-3 h-3" /> : null}
                                    {item.growth !== 0 ? Math.abs(item.growth) + '%' : '—'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="p-6 rounded-xl border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-[#0F172A] dark:text-dark-heading flex items-center gap-2">
                            <FiClock className="text-[#3B82F6] dark:text-[#60A5FA]" />
                            Recent Orders
                        </h3>
                        <button className="text-xs text-[#3B82F6] dark:text-[#60A5FA] font-medium hover:underline flex items-center gap-1">
                            View All <FiChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {stats.recentOrders.map((order, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors">
                                <div>
                                    <p className="font-medium text-[#0F172A] dark:text-dark-heading">#{order.id}</p>
                                    <p className="text-xs text-[#64748B] dark:text-dark-text">{order.customer} • {order.items} items</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-[#0F172A] dark:text-dark-heading">
                                        {formatCurrency(order.total)}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-xl border bg-white dark:bg-dark-card border-[#E2E8F0] dark:border-dark-border shadow-sm">
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-dark-heading mb-4 flex items-center gap-2">
                    <FiPlus className="text-[#3B82F6] dark:text-[#60A5FA]" />
                    Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button onClick={() => navigate('/admin/products/add')} className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-all hover:border-[#3B82F6] group">
                        <div className="p-2 rounded-lg bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 group-hover:bg-[#3B82F6]/20 transition-colors">
                            <FiCoffee className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA]" />
                        </div>
                        <span className="text-sm font-medium text-[#0F172A] dark:text-dark-heading">Add Product</span>
                    </button>
                    <button onClick={() => navigate('/admin/category/add')} className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-all hover:border-[#8B5CF6] group">
                        <div className="p-2 rounded-lg bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 group-hover:bg-[#8B5CF6]/20 transition-colors">
                            <FiGrid className="w-4 h-4 text-[#8B5CF6] dark:text-[#A78BFA]" />
                        </div>
                        <span className="text-sm font-medium text-[#0F172A] dark:text-dark-heading">Add Category</span>
                    </button>
                    <button onClick={() => navigate('/admin/users')} className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-all hover:border-[#F59E0B] group">
                        <div className="p-2 rounded-lg bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 group-hover:bg-[#F59E0B]/20 transition-colors">
                            <FiUsers className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />
                        </div>
                        <span className="text-sm font-medium text-[#0F172A] dark:text-dark-heading">Manage Users</span>
                    </button>
                    <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-all hover:border-[#10B981] group">
                        <div className="p-2 rounded-lg bg-[#10B981]/10 dark:bg-[#10B981]/20 group-hover:bg-[#10B981]/20 transition-colors">
                            <FiShoppingBag className="w-4 h-4 text-[#10B981] dark:text-[#34D399]" />
                        </div>
                        <span className="text-sm font-medium text-[#0F172A] dark:text-dark-heading">View Orders</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;