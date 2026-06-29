import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaCoffee,
  FaBoxOpen,
  FaShoppingBag,
  FaUsers,
  FaTags,
  FaTimes,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const AdSidebar = ({ onClose }) => {
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
      name: "Ordered Items",
      path: "/admin/ordered-items",
      icon: <FaShoppingBag size={18} />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers size={18} />,
    },
  ];

  return (
    <aside className="w-72 min-h-screen border-r shadow-xl relative bg-white dark:bg-dark-bg border-[#E2E8F0] dark:border-dark-border">
      {/* Close Button - Mobile Only */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg transition-colors duration-200 z-10 text-[#64748B] dark:text-dark-text hover:bg-[#F8FAFC] dark:hover:bg-dark-card"
        aria-label="Close Sidebar"
      >
        <FaTimes className="text-xl" />
      </button>

      {/* Logo */}
      <div className="p-6 border-b border-[#E2E8F0] dark:border-dark-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#4F46E5] dark:bg-dark-primary">
            <FaCoffee className="text-xl text-white" />
          </div>
          <div>
            <Link
              to="/admin"
              className="text-xl font-bold text-[#0F172A] dark:text-dark-heading"
            >
              Coffee Admin
            </Link>
            <p className="text-xs text-[#64748B] dark:text-dark-text">
              Management Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "font-semibold shadow-lg bg-[#4F46E5] dark:bg-dark-primary text-white"
                  : "text-[#64748B] dark:text-dark-text hover:bg-[#F8FAFC] dark:hover:bg-dark-card"
              }`
            }
          >
            <span className="text-inherit">{item.icon}</span>
            <span className="text-inherit">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdSidebar;