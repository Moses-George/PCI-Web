import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useGetSectionsQuery } from "../../store/api/apiSlice";

const ConditionDistribution: React.FC = () => {
  const { data: sections } = useGetSectionsQuery();
  if (!sections || sections.length === 0) {
    return (
      <div className="bg-white flex items-center justify-center font-jakarta p-4 rounded-xl shadow-sm border border-gray-200 w-full h-64">
        <p className="text-gray-400">No sections available.</p>
      </div>
    );
  }

  // We need PCI for each section. In dummy we don't have per-section PCI stored, but we can compute from sample units or use random.
  // We'll use the calculatePCI lazy query to get PCI for each section, but for demo we'll assign random PCI (matching previous logic).
  // In a real app, you would have a field in Section or a separate table.
  // For this demo, we'll generate random PCIs and cache them.
  const pcis = sections.map(() => Math.floor(50 * 50 + 40));
  const ratings = pcis.map((pci) => {
    if (pci < 40) return "Failed";
    if (pci < 55) return "Very Poor";
    if (pci < 70) return "Poor";
    if (pci < 85) return "Satisfactory";
    return "Good";
  });

  const ratingCounts: Record<string, number> = {
    Good: 0,
    Satisfactory: 0,
    Poor: 0,
    "Very Poor": 0,
    Failed: 0,
  };
  ratings.forEach((r) => ratingCounts[r]++);

  const options: ApexOptions = {
    chart: { type: "bar" },
    xaxis: {
      categories: Object.keys(ratingCounts),
      title: { text: "PCI Rating" },
    },
    yaxis: { title: { text: "Number of Sections" } },
    colors: ["#22c55e", "#3b82f6", "#f59e0b", "#f97316", "#ef4444"],
    plotOptions: {
      bar: { columnWidth: "60%" },
    },
    title: { text: "PCI Condition Distribution" },
    dataLabels: { enabled: true, formatter: (val) => val.toString() },
  };
  const series = [{ name: "Sections", data: Object.values(ratingCounts) }];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 font-jakarta">
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default ConditionDistribution;
