import { MonitorSmartphone } from "lucide-react";

export default function MobileBlock() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white px-8 text-center">
      <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-50">
        <MonitorSmartphone size={40} className="text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Desktop only</h1>
      <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
        PCI Management System is designed for desktop use. Please open this
        application on a laptop or desktop computer for the best experience.
      </p>
      <div className="mt-8 px-4 py-2 bg-gray-100 rounded-lg text-xs text-gray-400 font-mono">
        Minimum screen width: 1024 px
      </div>
    </div>
  );
}
