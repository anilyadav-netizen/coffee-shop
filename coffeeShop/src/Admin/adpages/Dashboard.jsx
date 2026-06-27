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
        // Simulate fetching additional stats
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

    // Calculate total products and categories
    const totalProducts = products?.length || 0;
    const totalCategories = categories?.length || 0;

    // Stats cards data
    const statCards = [
        {
            title: "Total Products",
            value: totalProducts,
            icon: FiPackage,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            textColor: "text-blue-600 dark:text-blue-400"
        },
        {
            title: "Categories",
            value: totalCategories,
            icon: FiGrid,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            textColor: "text-green-600 dark:text-green-400"
        },
        {
            title: "Total Users",
            value: "0",
            icon: FiUsers,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            textColor: "text-purple-600 dark:text-purple-400"
        },
        {
            title: "Revenue Today",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: FiDollarSign,
            color: "from-yellow-500 to-yellow-600",
            bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
            textColor: "text-yellow-600 dark:text-yellow-400"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] dark:text-[#F5EDE3] flex items-center gap-3">
                        <FiCoffee className="text-[#8B7355]" />
                        Welcome Back!
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Here's what's happening with your food business today
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-[#261810] px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Today's Date</span>
                        <p className="font-medium text-gray-800 dark:text-white">
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
                            className="bg-white dark:bg-[#261810] p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-green-500 text-xs font-medium flex items-center gap-1">
                                    <FiArrowUp className="w-3 h-3" />
                                    12.5%
                                </span>
                                <span className="text-gray-400 text-xs">vs last week</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl text-white">
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

                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl text-white">
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

                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-6 rounded-2xl text-white">
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
                <div className="bg-white dark:bg-[#261810] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <FiTrendingUp className="text-orange-500" />
                        Popular Items
                    </h3>
                    <div className="mt-4 space-y-3">
                        {stats.popularItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-400">{idx + 1}</span>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.orders} orders</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    item.growth > 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                    {item.growth > 0 ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                                    {Math.abs(item.growth)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-[#261810] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <FiClock className="text-blue-500" />
                        Recent Orders
                    </h3>
                    <div className="mt-4 space-y-3">
                        {stats.recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">{order.id}</p>
                                    <p className="text-sm text-gray-500">{order.customer} • {order.items} items</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-800 dark:text-white">${order.total}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        order.status === 'Completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                        order.status === 'Processing' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
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
            <div className="bg-gradient-to-br from-[#2C1810] to-[#4A2C1A] dark:from-[#1A0F0A] dark:to-[#2C1810] p-6 rounded-2xl text-white">
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