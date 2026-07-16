import { FiHome, FiMap, FiGrid, FiFileText } from "react-icons/fi";
import { TrendingUp, DollarSign } from "lucide-react";

export const navItems = [
  { path: "/", label: "Dashboard", icon: <FiHome size={23} /> },
  { path: "/networks", label: "Road Networks", icon: <FiMap size={23} /> },
  { path: "/sections", label: "Sections", icon: <FiGrid size={23} /> },
  { path: "/reports", label: "Reports", icon: <FiFileText size={23} /> },
  { path: "/analytics", label: "Analytics", icon: <TrendingUp size={23} /> },
  {
    path: "/budget-planner",
    label: "Budget Planner",
    icon: <DollarSign size={23} />,
  },
];