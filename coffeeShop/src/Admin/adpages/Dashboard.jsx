import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/Slicer/adminProductSlice";
import { getCategories } from "../../redux/Slicer/categorySlice";
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
    FiHeart
} from "react-icons/fi";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.adminProducts);
    const { categories } = useSelector((state) => state.category);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        ordersToday: 0,
        popularItems: [],
        recentOrders: []
    });

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getCategories());
        setStats({
            totalRevenue: 45280,
            ordersToday: 24,
            popularItems: [
                { name: "Margherita Pizza", orders: 45, growth: 12 },
                { name: "Chicken Burger", orders: 38, growth: 8 },
                { name: "Pasta Alfredo", orders: 32, growth: -3 }
            ],
            recentOrders: [
                { id: "#ORD-001", customer: "John Doe", items: 3, total: 45.99, status: "Completed" },
                { id: "#ORD-002", customer: "Sarah Smith", items: 2, total: 32.50, status: "Processing" },
                { id: "#ORD-003", customer: "Mike Johnson", items: 4, total: 67.80, status: "Pending" }
            ]
        });
    }, [dispatch]);

    const totalProducts = products?.length || 0;
    const totalCategories = categories?.length || 0;

    const statCards = [
        {
            title: "Total Products",
            value: totalProducts,
            icon: FiPackage,
            bgColor: "bg-[#E2E8F0]/30 dark:bg-dark-card/50",
            textColor: "text-[#4F46E5] dark:text-dark-primary"
        },
        {
            title: "Categories",
            value: totalCategories,
            icon: FiGrid,
            bgColor: "bg-[#E2E8F0]/30 dark:bg-dark-card/50",
            textColor: "text-[#7C3AED] dark:text-dark-accent"
        },
        {
            title: "Total Users",
            value: "0",
            icon: FiUsers,
            bgColor: "bg-[#E2E8F0]/30 dark:bg-dark-card/50",
            textColor: "text-[#4F46E5] dark:text-dark-primary"
        },
        {
            title: "Revenue Today",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: FiDollarSign,
            bgColor: "bg-[#E2E8F0]/30 dark:bg-dark-card/50",
            textColor: "text-[#7C3AED] dark:text-dark-accent"
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
                        Here's what's happening with your food business today
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
                                    <FiArrowUp className="w-3 h-3" />
                                    12.5%
                                </span>
                                <span className="text-xs text-[#64748B] dark:text-dark-text">vs last week</span>
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
                        <span>5 orders pending</span>
                    </div>
                </div>

                <div className="p-6 rounded-2xl text-white bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] dark:from-dark-accent dark:to-[#A78BFA]">
                    <div className="flex items-center gap-3">
                        <FiTrendingUp className="w-8 h-8" />
                        <div>
                            <p className="text-sm opacity-90">Growth Rate</p>
                            <p className="text-3xl font-bold">+23.5%</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm opacity-90">
                        <FiArrowUp className="w-4 h-4" />
                        <span>Compared to last month</span>
                    </div>
                </div>

                <div className="p-6 rounded-2xl text-white bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] dark:from-dark-primary dark:to-dark-accent">
                    <div className="flex items-center gap-3">
                        <FiStar className="w-8 h-8" />
                        <div>
                            <p className="text-sm opacity-90">Top Rating</p>
                            <p className="text-3xl font-bold">4.8 ⭐</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm opacity-90">
                        <FiHeart className="w-4 h-4" />
                        <span>From 245 reviews</span>
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
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    item.growth > 0 
                                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
                                        : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                                }`}>
                                    {item.growth > 0 ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                                    {Math.abs(item.growth)}%
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
                        {stats.recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-dark-bg/50">
                                <div>
                                    <p className="font-medium text-[#0F172A] dark:text-dark-heading">{order.id}</p>
                                    <p className="text-sm text-[#64748B] dark:text-dark-text">{order.customer} • {order.items} items</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-[#0F172A] dark:text-dark-heading">${order.total}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        order.status === 'Completed' 
                                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                                            : order.status === 'Processing' 
                                            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                                            : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                                    }`}>
                                        {order.status}
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