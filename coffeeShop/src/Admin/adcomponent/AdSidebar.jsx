import { NavLink } from "react-router-dom";
import {
  FaCoffee,
  FaBoxOpen,
  FaShoppingBag,
  FaUsers,
  FaTags,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const AdSidebar = () => {
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
    <aside className="w-72 min-h-screen bg-zinc-950 text-white border-r border-zinc-800 shadow-xl">

      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-3 rounded-xl">
            <FaCoffee className="text-black text-xl" />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              Coffee Admin
            </h1>
            <p className="text-xs text-zinc-400">
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
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                ? "bg-amber-500 text-black font-semibold shadow-lg"
                : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
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