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

function App() {
  const elements = useRoutes([
    { path: "/", element: <Dashboard /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/networks", element: <Networks /> },
    { path: "/networks/:networkId", element: <NetworkDetail /> },
    { path: "/sections", element: <Sections /> },
    {
      path: "/networks/:networkId/sections/:sectionId",
      element: <SectionDetail />,
    },
    { path: "/analytics", element: <Analytics /> },
    { path: "/budget-planner", element: <BudgetPlanner /> },
  ]);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) return <Auth />;

  return <MainLayout>{elements}</MainLayout>;

  // return (
  //   <Routes>
  //     <Route path="/" element={<MainLayout />}>
  //       <Route index element={<Dashboard />} />
  //       <Route path="networks" element={<Networks />} />
  //       <Route path="networks/:networkId/sections" element={<Sections />} />
  //       <Route
  //         path="sections/:sectionId/sample-units"
  //         element={<SampleUnitDetail />}
  //       />
  //     </Route>
  //   </Routes>
  // );
}

export default App;
