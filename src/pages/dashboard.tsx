// import { useGetNetworksQuery, useGetSectionsQuery } from '../store/api/apiSlice';
// import Spinner from '../components/common/spinner';
// import { Map, Grid, AlertTriangle, CheckCircle } from 'lucide-react';
// // import { FiMap, FiGrid, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

// const Dashboard = () => {
//   const { data: networks, isLoading: netLoading } = useGetNetworksQuery();
//   const { data: sections, isLoading: secLoading } = useGetSectionsQuery();

//   if (netLoading || secLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

//   const stats = [
//     { label: 'Total Networks', value: networks?.length || 0, icon: <Map />, color: 'bg-blue-500' },
//     { label: 'Total Sections', value: sections?.length || 0, icon: <Grid />, color: 'bg-green-500' },
//     { label: 'Sections with Issues', value: sections?.filter(s => s.sampleUnitCount > 0).length || 0, icon: <AlertTriangle />, color: 'bg-yellow-500' },
//     { label: 'Analyzed Sections', value: sections?.filter(s => s.sampleUnitCount > 2).length || 0, icon: <CheckCircle />, color: 'bg-teal-500' },
//   ];

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold font-jakarta">Dashboard Overview</h2>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {stats.map((stat) => (
//           <div key={stat.label} className="bg-white rounded-xl shadow-sm py-4 px-3 border border-gray-100 flex items-center gap-4">
//             <div className={`${stat.color} p-2 rounded-full text-white`}>{stat.icon}</div>
//             <div>
//               <p className="text-gray-500 font-jakarta text-sm">{stat.label}</p>
//               <p className="text-2xl font-jakarta font-bold">{stat.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="grid grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
//           🗺️ Global Map (Coming Soon)
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
//           📊 PCI Distribution (Coming Soon)
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import {
  useGetNetworksQuery,
  useGetSectionsQuery,
} from "../store/api/apiSlice";
import Spinner from "../components/common/spinner";
import {
  Map,
  Grid,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  FileText,
} from "lucide-react";
import ConditionDistribution from "../components/analytics/ConditionDistribution";
import ConditionHeatmap from "@/components/analytics/ConditionHeatmap";
import { useMemo } from "react";
import { Link } from "react-router-dom";
// import { dummySections } from '../constants/dummy';
// import { ApexOptions } from 'apexcharts';
import Chart from "react-apexcharts";

const Dashboard = () => {
  const { data: networks, isLoading: netLoading } = useGetNetworksQuery();
  const { data: sections, isLoading: secLoading } = useGetSectionsQuery();

  // For demonstration, we calculate average PCI from dummy data (or from real if available)
  // In real app, you'd have a PCI field per section. We'll mock with random values.
  // const rnd = Math.random()
  const avgPci = useMemo(() => {
    if (!sections) return 0;
    const sum = sections.reduce((acc) => acc + Math.floor(9 * 50 + 40), 0);
    return Math.round(sum / sections.length);
  }, [sections]);

  const criticalSections = useMemo(() => {
    if (!sections) return 0;
    // assume PCI < 55 is critical
    return sections.filter(() => 9 > 0.7).length; // mock
  }, [sections]);

  const totalSampleUnits = useMemo(() => {
    if (!sections) return 0;
    return sections.reduce((acc, s) => acc + s.sampleUnitCount, 0);
  }, [sections]);

  const recentSampleUnits = [
    {
      id: "su1",
      name: "SU-01",
      section: "Section A",
      date: "2024-06-18",
      status: "Processed",
    },
    {
      id: "su2",
      name: "SU-02",
      section: "Section B",
      date: "2024-06-17",
      status: "Pending",
    },
    {
      id: "su3",
      name: "SU-03",
      section: "Section C",
      date: "2024-06-16",
      status: "Processing",
    },
  ];

  if (netLoading || secLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  // KPIs configuration
  const stats = [
    {
      label: "Total Networks",
      value: networks?.length || 0,
      icon: <Map size={20} />,
      color: "bg-blue-500",
    },
    {
      label: "Total Sections",
      value: sections?.length || 0,
      icon: <Grid size={20} />,
      color: "bg-green-500",
    },
    {
      label: "Avg PCI",
      value: avgPci,
      icon: <TrendingUp size={20} />,
      color: "bg-purple-500",
    },
    {
      label: "Critical Sections",
      value: criticalSections,
      icon: <AlertTriangle size={20} />,
      color: "bg-red-500",
    },
    {
      label: "Sample Units",
      value: totalSampleUnits,
      icon: <Activity size={20} />,
      color: "bg-indigo-500",
    },
    {
      label: "Analyzed Sections",
      value: sections?.filter((s) => s.sampleUnitCount > 2).length || 0,
      icon: <CheckCircle size={20} />,
      color: "bg-teal-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              Welcome back, Pavement Manager
            </h2>
            <p className="text-blue-100 mt-1">
              Here's your real‑time pavement condition overview.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-blue-200">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.slice(0, 4).map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md"
          >
            <div className={`${stat.color} p-3 rounded-full text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.slice(4).map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md"
          >
            <div className={`${stat.color} p-3 rounded-full text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Charts & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PCI Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <ConditionDistribution />
        </div>
        {/* Condition Heatmap */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <ConditionHeatmap />
        </div>
      </div>

      {/* Additional Row: Distress Pie + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distress Type Distribution (Pie) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:col-span-1">
          <h4 className="font-semibold text-gray-700 mb-2">Distress Types</h4>
          <Chart
            options={{
              chart: { type: "pie", height: 250 },
              labels: [
                "Pothole",
                "Alligator Crack",
                "Longitudinal Crack",
                "Transverse Crack",
                "Rutting",
              ],
              colors: ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#10b981"],
              legend: { position: "bottom" },
              dataLabels: {
                enabled: true,
                formatter: (val) => Number(val).toFixed(0) + "%",
              },
            }}
            series={[25, 30, 20, 15, 10]}
            type="pie"
            height={250}
          />
        </div>

        {/* Recent Sample Units */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-700">Recent Sample Units</h4>
            <Link
              to="/sections"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Section
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentSampleUnits.map((su) => (
                  <tr key={su.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{su.name}</td>
                    <td className="px-4 py-2">{su.section}</td>
                    <td className="px-4 py-2">
                      {new Date(su.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          su.status === "Processed"
                            ? "bg-green-100 text-green-700"
                            : su.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {su.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h4 className="font-semibold text-gray-700 mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/networks"
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center gap-2"
          >
            <Map size={16} /> View Networks
          </Link>
          <Link
            to="/analytics"
            className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 flex items-center gap-2"
          >
            <TrendingUp size={16} /> Analytics
          </Link>
          <Link
            to="/budget-planner"
            className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center gap-2"
          >
            <FileText size={16} /> Budget Planner
          </Link>
          <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center gap-2">
            <Activity size={16} /> Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
