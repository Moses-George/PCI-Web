import React, { type PropsWithChildren } from "react";
import Spinner from "./spinner";
// import type { Props } from 'react-apexcharts';

interface LoadingOverlayProps extends PropsWithChildren {
  loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  children,
}: LoadingOverlayProps) => {
  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70  backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <Spinner size={60} />
        </div>
      )}
      {children}
    </div>
  );
};

export default LoadingOverlay;
