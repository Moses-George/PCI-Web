import { NavLink } from "react-router-dom";
import { FiHome, FiMap, FiGrid, FiFileText } from "react-icons/fi";
import { TrendingUp, DollarSign } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: <FiHome size={20} /> },
    { path: "/networks", label: "Road Networks", icon: <FiMap size={20} /> },
    { path: "/sections", label: "Sections", icon: <FiGrid size={20} /> },
    { path: "/reports", label: "Reports", icon: <FiFileText size={20} /> },
    { path: "/analytics", label: "Analytics", icon: <TrendingUp size={20} /> },
    {
      path: "/budget-planner",
      label: "Budget Planner",
      icon: <DollarSign size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-lg z-40">
      <div className="p-6 font-jakarta font-bold text-2xl border-b border-gray-700 flex items-center gap-2">
        <span className="text-blue-400">🛣️</span> PavementIQ
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 font-jakarta px-4 py-3 rounded-lg transition-all duration-200 transform active:scale-75 transition-transform cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400 font-jakarta font-medium">
        <p className="">v1.0.0 • YOLO-seg</p>
        <p className="">George Moses | All Rights Reserved</p>
      </div>
    </aside>
  );
};

export default Sidebar;
