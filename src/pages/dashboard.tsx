/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import {
  useGetDashboardStatsQuery,
  useGetGlobalDistressDistributionQuery,
  useGetRecentSampleUnitsQuery,
} from "@/store/api/analyticsApi";

const Dashboard = () => {
  const { data: recentSampleUnits, isLoading: suIsLoading } =
    useGetRecentSampleUnitsQuery();
  console.log("recentSampleUnits", recentSampleUnits);

  const { data: distress_dist } = useGetGlobalDistressDistributionQuery();
  console.log("distress_dist", distress_dist);
  const distresses = distress_dist?.map((dist) =>
    dist.type.split("_").join(" "),
  );
  const distresses_count = distress_dist?.map((dist) => dist.count);

  const { data: all_stats, isLoading: statIsLoading } =
    useGetDashboardStatsQuery();
  console.log("all_stats", all_stats);
  // KPIs configuration

  const stats = [
    {
      label: "Total Networks",
      value: all_stats?.total_networks,
      icon: <Map size={20} />,
      color: "bg-blue-500",
    },
    {
      label: "Total Sections",
      value: all_stats?.total_sections,
      icon: <Grid size={20} />,
      color: "bg-green-500",
    },
    {
      label: "Avg PCI",
      value: all_stats?.avg_pci,
      icon: <TrendingUp size={20} />,
      color: "bg-purple-500",
    },
    {
      label: "Critical Sections",
      value: all_stats?.critical_sections,
      icon: <AlertTriangle size={20} />,
      color: "bg-red-500",
    },
    {
      label: "Sample Units",
      value: all_stats?.total_sample_units,
      icon: <Activity size={20} />,
      color: "bg-indigo-500",
    },
    {
      label: "Analyzed Sections",
      value: all_stats?.analyzed_sections,
      icon: <CheckCircle size={20} />,
      color: "bg-teal-500",
    },
  ];

  if (suIsLoading || statIsLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-8 font-jakarta max-w-5xl mx-auto ">
      <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-md">
        <div className="flex items-start gap-3">
          <span className="text-amber-500 text-xl">⚠️</span>
          <p className="text-[12px] text-gray-700 leading-relaxed">
            <span className="font-semibold">Disclaimer</span> — The Metadata
            predictions shown are estimates and are provided for informational
            and planning purposes only. They should not be used as official
            damage assessments or safety evaluations. Always verify results
            through physical inspection before making maintenance decisions. The
            authors and affiliated institutions assume no liability for reliance
            on these results.
          </p>
        </div>
      </div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Welcome back,</h2>
            <p className="text-blue-100 mt-1 text-[15px]">
              Here's your real‑time pavement condition overview.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[14px] text-blue-200">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-[14px] text-blue-200">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.slice(0, 4)?.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md"
          >
            <div className={`${stat.color} p-3 rounded-full text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-[14px] font-medium">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 -mt-4">
        {stats?.slice(4)?.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md"
          >
            <div className={`${stat.color} p-3 rounded-full text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-[14px] font-medium">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Charts & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* PCI Distribution */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"> */}
        <ConditionDistribution />
        {/* </div> */}
        {/* Condition Heatmap */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"> */}
        <ConditionHeatmap />
        {/* </div> */}
      </div>

      {/* Additional Row: Distress Pie + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distress Type Distribution (Pie) */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h4 className="font-semibold text-gray-700 mb-2 text-[16px]">
            Normalized Distress Type Distribution
          </h4>
          {!distress_dist || distress_dist?.length == 0 ? (
            <div className="my-auto pt-20 text-center text-gray-400">
              No data available
            </div>
          ) : (
            <Chart
              options={{
                chart: { type: "pie", height: 250 },
                labels: distresses,
                colors: ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#10b981"],
                legend: { position: "bottom" },
                dataLabels: {
                  enabled: true,
                  formatter: (val) => Number(val)?.toFixed(0) + "%",
                },
              }}
              series={distresses_count}
              type="pie"
              height={250}
            />
          )}
        </div>

        {/* Recent Sample Units */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-700 text-[16px]">
              Recent Sample Units
            </h4>
            <Link
              to="/sections"
              className="text-[14px] text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto h-68 [scrollbar-width:none] [-ms-overflow-style:none]">
            <table className="w-full text-[14px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Section name
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Section area (m²)
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              {recentSampleUnits && recentSampleUnits?.length > 0 && (
                <tbody>
                  {recentSampleUnits?.map((su) => (
                    <tr key={su.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{su.name}</td>
                      <td className="px-4 py-2">{su.section_name}</td>
                      <td className="px-4 py-2">{su.section_area}</td>
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
              )}
            </table>
            {!recentSampleUnits ||
              (recentSampleUnits?.length == 0 && (
                <div className="my-auto pt-20 text-center w-full col-span-full text-gray-400">
                  No data available
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h4 className="font-semibold text-gray-700 mb-3 text-[15px]">
          Quick Actions
        </h4>
        <div className="flex flex-wrap gap-3 text-[14px]">
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
          {all_stats?.latest_section_id && (
            <Link
              to={`/sections/${all_stats?.latest_section_id}`}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center gap-2"
            >
              <FileText size={16} /> Latest Section
            </Link>
          )}
          {/* <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center gap-2">
            <Activity size={16} /> Generate Report
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
