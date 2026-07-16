import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";

const SidebarIcons = () => {

  return (
    <aside className="w-28 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-lg z-40">
      <div className="p-6 font-jakarta font-bold text-xl border-b border-gray-700 flex items-center gap-2">
        <span className="text-blue-400 text-4xl">🛣️</span> 
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 font-jakarta px-4 py-3 text-md w-fit rounded-lg transition-all duration-200 transform active:scale-75 transition-transform cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.icon}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarIcons;