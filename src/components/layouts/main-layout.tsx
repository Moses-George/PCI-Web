// import { Outlet } from 'react-router-dom';
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Sidebar from "./sidebar";
import Header from "./header";
import LoadingOverlay from "../common/loading-overlay";
import type { PropsWithChildren } from "react";
import SidebarIcons from "./sidebar-icons";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const globalLoading = useSelector(
    (state: RootState) => state.ui.globalLoading,
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen ? <Sidebar /> : <SidebarIcons />}
      {/* <Sidebar /> */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? "ml-60" : "ml-28"}`}>
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* {children} */}
          <LoadingOverlay loading={globalLoading}>
            {children}
            {/* <Outlet /> */}
          </LoadingOverlay>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
