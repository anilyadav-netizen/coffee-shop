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
      name: "Orders",
      path: "/admin/orders",
      icon: <FaShoppingBag size={18} />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers size={18} />,
    },
  ];

  return (
    <aside className="w-72 min-h-screen bg-[#F5EDE3] dark:bg-[#1A0F0A] text-[#2C1810] dark:text-[#F5EDE3] border-r border-[#D4A574] dark:border-[rgba(245,237,227,0.08)] shadow-xl relative">

      {/* Close Button - Mobile Only */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-[#D4A574] dark:hover:bg-[#3D2317] transition-colors duration-200 z-10"
        aria-label="Close Sidebar"
      >
        <FaTimes className="text-[#2C1810] dark:text-[#F5EDE3] text-xl" />
      </button>

      {/* Logo */}
      <div className="p-6 border-b border-[#D4A574] dark:border-[rgba(245,237,227,0.08)]">
        <div className="flex items-center gap-3">
          <div className="bg-[#6F4E37] dark:bg-[#C68E5C] p-3 rounded-xl">
            <FaCoffee className="text-[#F5EDE3] dark:text-[#1A0F0A] text-xl" />
          </div>
          <div>
            <Link to ="/admin" lassName="text-xl font-bold text-[#2C1810] dark:text-[#F5EDE3]">
              Coffee Admin
            </Link>
            <p className="text-xs text-[#5C4033] dark:text-[#C4A882]">
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
            onClick={onClose} // 👈 Mobile pe link click karne par bhi close ho jaye
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-[#6F4E37] dark:bg-[#C68E5C] text-[#F5EDE3] dark:text-[#1A0F0A] font-semibold shadow-lg"
                  : "text-[#5C4033] dark:text-[#C4A882] hover:bg-[#D4A574] dark:hover:bg-[#3D2317] hover:text-[#2C1810] dark:hover:text-[#F5EDE3]"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdSidebar;