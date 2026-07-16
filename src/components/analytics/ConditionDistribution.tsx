// import React from "react";
// import Chart from "react-apexcharts";
// import type { ApexOptions } from "apexcharts";
// // import { useGetSectionsQuery } from "../../store/api/apiSlice";
// import { useGetPciDistributionQuery } from "@/store/api/dashboardApi";
// import Spinner from "../common/spinner";

// const ConditionDistribution: React.FC = () => {
//   const { data: pci_dist, isLoading: pciDistIsLoading } =
//     useGetPciDistributionQuery();
//   console.log("pci_dist", pci_dist);

//   const categories = pci_dist?.map((dist) => dist?.rating);
//   const ratingCounts = pci_dist?.map((dist) => dist?.count);

//   const options: ApexOptions = {
//     chart: { type: "bar" },
//     xaxis: {
//       categories,
//       title: { text: "PCI Rating" },
//     },
//     yaxis: { title: { text: "Number of Sections" } },
//     colors: ["#22c55e", "#3b82f6", "#f59e0b", "#f97316", "#ef4444"],
//     plotOptions: {
//       bar: { columnWidth: "60%" },
//     },
//     title: { text: "PCI Condition Distribution" },
//     dataLabels: { enabled: true, formatter: (val) => val.toString() },
//   };
//   const series = [{ name: "Sections", data: ratingCounts! }];

//   return (
//     <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 font-jakarta">
//       {pciDistIsLoading ? (
//         <div className="flex justify-center py-20">
//           <Spinner size={25} />
//         </div>
//       ) : (
//         <Chart options={options} series={series} type="bar" height={300} />
//       )}
//     </div>
//   );
// };

// export default ConditionDistribution;


import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useGetPCIDistributionQuery } from "@/store/api/analyticsApi"; 
import Spinner from "@/components/common/spinner";

const RATING_COLORS: Record<string, string> = {
  Good:         "#22c55e",
  Satisfactory: "#3b82f6",
  Fair:         "#f59e0b",
  Poor:         "#f97316",
  "Very Poor":  "#ef4444",
  Serious:      "#c0392b",
  Failed:       "#7b241c",
};

const ConditionDistribution: React.FC = () => {
  const { data, isLoading } = useGetPCIDistributionQuery(); 
  console.log("pc dist", data)

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-center items-center h-64">
        <Spinner size={25} />
      </div>
    );
  }

  if (!data || data?.length === 0) {
    return (
      <div className="bg-white h-full p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
        <p className="text-gray-400 font-jakarta text-sm">
          No PCI data yet. Calculate PCI for your sections first.
        </p>
      </div>
    );
  }

  const categories = data?.map((d) => d.rating);
  const counts = data?.map((d) => d.count);
  const barColors = categories?.map((r) => RATING_COLORS[r] ?? "#6b7280");

  const options: ApexOptions = {
    chart: { type: "bar" },
    xaxis: { categories, title: { text: "PCI Rating" } },
    yaxis: { title: { text: "Number of Sections" }, min: 0 },
    colors: barColors,
    plotOptions: {
      bar: {
        columnWidth: "60%",
        distributed: true, // each bar its own colour
      },
    },
    legend: { show: false },
    title: { text: "PCI Condition Distribution" },
    dataLabels: { enabled: true, formatter: (val) => String(val) },
    tooltip: { y: { formatter: (v) => `${v} section${v !== 1 ? "s" : ""}` } },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 font-jakarta">
      <Chart
        options={options}
        series={[{ name: "Sections", data: counts }]}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default ConditionDistribution;
