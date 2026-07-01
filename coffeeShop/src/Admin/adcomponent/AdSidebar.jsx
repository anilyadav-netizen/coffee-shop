import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaMotorcycle,
} from "react-icons/fa6";
import {
  FaCoffee,
  FaShoppingBag,
  FaUsers,
  FaTags,
  FaTimes,
  FaUserCircle,
  FaChevronUp,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { GiKnifeFork } from "react-icons/gi"; // For Dine In icon
import { FaTruck } from "react-icons/fa"; // For Delivery icon

const AdSidebar = ({ onClose, isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const profileRef = useRef(null);
  const buttonRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <MdDashboard size={20} />,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: <FaCoffee size={18} />,
  },
  {
    name: "Category",
    path: "/admin/category",
    icon: <FaTags size={18} />,
  },
  {
    name: "Dine In Orders",
    path: "/admin/orders/dine-in",
    icon: <GiKnifeFork size={18} />,
  },
  {
    name: "Delivery Orders",
    path: "/admin/orders/delivery",
    icon: <FaTruck size={18} />,
  },
  {
    name: "Rider",
    path: "/admin/riders",
    icon: <FaUserCircle size={18} />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <FaUsers size={18} />,
  },
];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-72 h-screen flex flex-col border-r shadow-2xl bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#1E293B] relative transition-colors duration-300">
      {/* Decorative gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#4F46E5] opacity-80" />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2.5 rounded-xl transition-all duration-200 z-10 text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:scale-110 active:scale-95"
      >
        <FaTimes className="text-xl" />
      </button>

      {/* Logo Section */}
      <div className="p-6 border-b border-[#E2E8F0] dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] shadow-lg shadow-[#4F46E5]/20 dark:shadow-[#4F46E5]/10">
            <FaCoffee className="text-xl text-white" />
          </div>

          <div>
            <Link
              to="/admin"
              className="text-xl font-bold bg-gradient-to-r from-[#0F172A] to-[#4F46E5] dark:from-white dark:to-[#818CF8] bg-clip-text text-transparent"
            >
              Coffee Admin
            </Link>

            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium tracking-wide">
              Management Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-[#E2E8F0] dark:scrollbar-thumb-[#1E293B] scrollbar-track-transparent">
        {menuItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            onClick={onClose}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                ? "font-semibold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-[#4F46E5]/25 dark:shadow-[#4F46E5]/30"
                : "text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative z-10 flex items-center gap-3 w-full">
                  <span className={isActive ? "text-white" : "text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:group-hover:text-white transition-colors"}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-xl">{item.name}</span>
                  {item.badge && (
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 text-[#4F46E5] dark:text-[#818CF8]"
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </span>
                {/* Hover background effect */}
                <span className={`absolute inset-0 rounded-2xl transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0"
                  }`} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[#E2E8F0] dark:border-[#1E293B] p-4 space-y-3">
        {/* Profile Section */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center justify-between rounded-2xl hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] p-3 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaUserCircle className="text-5xl text-[#4F46E5] dark:text-[#818CF8]" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0F172A] rounded-full" />
              </div>

              <div className="text-left">
                <h3 className="font-semibold text-[#0F172A] dark:text-white text-xl">
                  Admin User
                </h3>

                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                  admin@coffee.com
                </p>
              </div>
            </div>

            <FaChevronUp
              className={`text-[#64748B] dark:text-[#94A3B8] transition-all duration-300 ${profileOpen ? "rotate-180" : ""
                } group-hover:text-[#0F172A] dark:group-hover:text-white`}
            />
          </button>

          {profileOpen && (
            <div
              ref={profileRef}
              className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] overflow-hidden animate-slideUp"
            >
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    navigate("/admin/profile");
                    setProfileOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-all duration-200 text-[#0F172A] dark:text-white group"
                >
                  <FaUser className="text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8]" />
                  <span className="text-base font-medium">My Profile</span>
                </button>

                <button
                  onClick={() => {
                    navigate("/admin/settings");
                    setProfileOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-all duration-200 text-[#0F172A] dark:text-white group"
                >
                  <FaCog className="text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8]" />
                  <span className="text-base font-medium">Settings</span>
                </button>

                <button
                  onClick={() => {
                    navigate("/admin/notifications");
                    setProfileOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-all duration-200 text-[#0F172A] dark:text-white group"
                >
                  <FaBell className="text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8]" />
                  <span className="text-base font-medium">Notifications</span>
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                    3
                  </span>
                </button>

                <div className="border-t border-[#E2E8F0] dark:border-[#1E293B] my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 group"
                >
                  <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                  <span className="text-base font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.2s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          border-radius: 9999px;
        }
      `}</style>
    </aside>
  );
};

export default AdSidebar;