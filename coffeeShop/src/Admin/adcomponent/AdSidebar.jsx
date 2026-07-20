import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { FaChair } from "react-icons/fa";
import { FaMotorcycle } from "react-icons/fa6";
import { FiPackage } from "react-icons/fi";
import {
  FaCoffee,
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
  FaUsers,
} from "react-icons/fa";  // ✅ FaUsers added
import { MdDashboard } from "react-icons/md";
import { GiKnifeFork } from "react-icons/gi";
import { FaTruck } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/Slicer/authSlice";

const AdSidebar = ({ onClose, isDarkMode, toggleDarkMode }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const buttonRef = useRef(null);

  // Role-based menu configuration
  // Inside AdSidebar component, the useMemo for menuItems:
  const menuItems = useMemo(() => {
    const allMenus = [
      {
        name: "Dashboard",
        path: "/admin",
        icon: <MdDashboard size={20} />,
        roles: ["admin"],
        exact: true,
      },
      {
        name: "Products",
        path: "/admin/products",
        icon: <FaCoffee size={20} />,
        roles: ["admin"],
      },
      {
        name: "Category",
        path: "/admin/category",
        icon: <FaTags size={20} />,
        roles: ["admin"],
      },
      {
        name: "Tables",
        path: "/admin/tables",
        icon: <FaChair size={20} />,
        roles: ["admin"],
      },
      {
        name: "Dine In Orders",
        path: "/admin/orders/dine-in",
        icon: <GiKnifeFork size={20} />,
        roles: ["admin"],
      },
      {
        name: "Delivery Orders",
        path: "/admin/orders/delivery",
        icon: <FaTruck size={20} />,
        roles: ["admin"],   // ✅ rider added here
      },
      {
        name: "All Orders",
        path: "/admin/orders",
        icon: <FiPackage size={20} />,
        roles: ["admin"],
        exact: true,
      },
      {
        name: "Rider",
        path: "/admin/riders",
        icon: <FaMotorcycle size={20} />,
        roles: ["admin"],
      },
      {
        name: "Users",
        path: "/admin/users",
        icon: <FaUsers size={20} />,
        roles: ["admin"],
      },
      {
        name: "RiderOrder",
        path: "/admin/riderassigned",
        icon: <FaUsers size={20} />,
        roles: ["rider"],
      },
    ];
    return allMenus.filter((item) => item.roles.includes(user?.role));
  }, [user]);

  // Profile dropdown items
  const profileItems = useMemo(() => {
    const items = [
      {
        name: "My Profile",
        path: "/admin/profile",
        icon: <FaUser className="text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#3B82F6] dark:group-hover:text-[#60A5FA]" />,
        roles: ["admin", "rider", "user"],
      },
      {
        name: "Settings",
        path: "",
        icon: <FaCog className="text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#3B82F6] dark:group-hover:text-[#60A5FA]" />,
        roles: ["admin", "rider", "user"],
      },
      {
        name: "Notifications",
        path: "",
        icon: <FaBell className="text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#3B82F6] dark:group-hover:text-[#60A5FA]" />,
        roles: ["admin", "rider", "user"],
        badge: 3,
      },
    ];
    return items.filter((item) => item.roles.includes(user?.role || "user"));
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-72 h-screen flex flex-col bg-white dark:bg-[#0F172A] border-r border-[#E2E8F0] dark:border-[#1E293B] shadow-xl relative transition-colors duration-300">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#3B82F6] opacity-80" />

      {/* Close button (mobile) */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors z-10 text-[#64748B] dark:text-[#94A3B8]"
      >
        <FaTimes className="text-xl" />
      </button>

      {/* Logo Section */}
      <div className="p-6 border-b border-[#E2E8F0] dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#3B82F6] dark:bg-[#3B82F6] shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10">
            <FaCoffee className="text-xl text-white" />
          </div>
          <div>
            <Link
              to="/admin"
              className="text-xl font-bold text-[#0F172A] dark:text-white"
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
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems?.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact || false} // ✅ exact match only for Dashboard and All Orders
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? "bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10"
                : "text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={
                    isActive
                      ? "text-white"
                      : "text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:group-hover:text-white"
                  }
                >
                  {item.icon}
                </span>
                <span className="flex-1 text-lg font-medium">{item.name}</span>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-base font-bold rounded-full ${isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 text-[#3B82F6] dark:text-[#60A5FA]"
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[#E2E8F0] dark:border-[#233f6b] p-4 space-y-3">

        {/* Profile Section */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center justify-between rounded-xl hover:bg-[#c4d5e6] dark:hover:bg-[#1E293B] p-3 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaUserCircle className="text-4xl text-[#3B82F6] dark:text-[#60A5FA]" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0F172A] rounded-full" />
              </div>
              <div className="text-left">
                <p className="text-lg font-medium text-[#0F172A] dark:text-white truncate max-w-[100px]">
                  {user?.name || "Admin"}
                </p>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] capitalize">
                  {user?.role || "admin"}
                </p>
              </div>
            </div>
            <FaChevronUp
              className={`text-[#64748B] dark:text-[#94A3B8] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""
                }`}
              size={14}
            />
          </button>

          {profileOpen && (
            <div
              ref={profileRef}
              className="absolute bottom-full left-0 right-0 mb-2 rounded-xl shadow-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] overflow-hidden animate-slideUp"
            >
              <div className="p-1.5 space-y-0.5">
                {profileItems?.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setProfileOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors text-[#0F172A] dark:text-white group"
                  >
                    {item.icon}
                    <span className="text-base font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}

                <div className="border-t border-[#E2E8F0] dark:border-[#1E293B] my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-red-500 group"
                >
                  <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                  <span className="text-base font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom scrollbar */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.15s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 9999px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #1E293B;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </aside>
  );
};

export default AdSidebar;