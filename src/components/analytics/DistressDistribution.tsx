import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useGetDistressDistributionQuery } from "@/store/api/analyticsApi";
import Spinner from "@/components/common/spinner";

const DistressDistribution: React.FC<{ sectionId: string }> = ({ sectionId }) => {
  const { data, isLoading } = useGetDistressDistributionQuery(sectionId);

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-center h-64 items-center">
        <Spinner size={25} />
      </div>
    );
  }

  if (!data || data?.type_distribution?.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center h-64">
        <p className="text-gray-400 font-jakarta text-sm">No distress data available.</p>
      </div>
    );
  }

  const labels = data.type_distribution.map((d) => d.distress_type);
  const counts = data.type_distribution.map((d) => d.count);

  const pieOptions: ApexOptions = {
    chart: { type: "pie" },
    labels,
    colors: ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"],
    legend: { position: "bottom" },
    title: { text: "Distress Type Distribution" },
  };

  const sevTypes = data.severity_distribution.map((d) => d.distress_type);
  const barOptions: ApexOptions = {
    chart: { type: "bar", stacked: true },
    xaxis: { categories: sevTypes, title: { text: "Distress Type" } },
    yaxis: { title: { text: "Count" } },
    colors: ["#22c55e", "#f59e0b", "#ef4444"],
    legend: { position: "top" },
    title: { text: "Distress Count by Severity" },
    plotOptions: { bar: { columnWidth: "60%" } },
  };

  const barSeries = [
    { name: "Low",    data: data.severity_distribution.map((d) => d.low) },
    { name: "Medium", data: data.severity_distribution.map((d) => d.medium) },
    { name: "High",   data: data.severity_distribution.map((d) => d.high) },
  ];

  return (
    <div className="bg-white font-jakarta p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-2 gap-4">
      <div>
        <Chart options={pieOptions} series={counts} type="pie" height={300} />
      </div>
      <div>
        <Chart options={barOptions} series={barSeries} type="bar" height={300} />
      </div>
    </div>
  );
};

export default DistressDistribution;