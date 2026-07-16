import { useRoutes } from "react-router-dom";
import MainLayout from "./components/layouts/main-layout";
import Dashboard from "./pages/dashboard";
import Networks from "./pages/networks/page";
import Sections from "./pages/sections";
import "./App.css";
import SectionDetail from "./pages/section-details/page";
import NetworkDetail from "./pages/network-details/page";
import Analytics from "./pages/analytics";
import BudgetPlanner from "./pages/budgetplanner";
import Auth from "./components/common/auth";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import useIsMobile from "./hooks/useMobile";
import MobileBlock from "./components/common/mobile-block";


function App() {
  const isMobile = useIsMobile();

  const elements = useRoutes([
    { path: "/", element: <Dashboard /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/networks", element: <Networks /> },
    { path: "/networks/:networkId", element: <NetworkDetail /> },
    { path: "/sections", element: <Sections /> },
    { path: "/sections/:sectionId", element: <SectionDetail /> },
    {
      path: "/networks/:networkId/sections/:sectionId",
      element: <SectionDetail />,
    },
    { path: "/analytics", element: <Analytics /> },
    { path: "/budget-planner", element: <BudgetPlanner /> },
  ]);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Block mobile before anything else — including auth
  if (isMobile) return <MobileBlock />;

  if (!isAuthenticated) return <Auth />;

  return <MainLayout>{elements}</MainLayout>;
}

export default App;
