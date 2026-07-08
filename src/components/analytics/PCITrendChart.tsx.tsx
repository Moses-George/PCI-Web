import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useGetPCITrendQuery } from "@/store/api/analyticsApi";
import Spinner from "@/components/common/spinner";

interface Props {
  sectionId: string;
  forecastYears?: number;
}

const PCITrendChart: React.FC<Props> = ({ sectionId, forecastYears = 1 }) => {
  const { data, isLoading } = useGetPCITrendQuery(sectionId);

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center h-64">
        <Spinner size={25} />
      </div>
    );
  }

  if (!data || data?.length === 0) {
    return (
      <div className="bg-white h-full p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center h-64">
        <p className="text-gray-400 font-jakarta text-sm">
          No PCI history yet. Calculate PCI to see trend data.
        </p>
      </div>
    );
  }

  const dates = data.map((d) => new Date(d.date).toLocaleDateString());
  const pcis = data.map((d) => +d.pci.toFixed(2));

  // Linear regression forecast
  const n = pcis?.length;
  const x = pcis.map((_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = pcis.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, _, i) => a + i * pcis[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const forecastMonths = forecastYears * 12;
  const forecastDates = Array.from({ length: forecastMonths }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i + 1);
    return d.toLocaleDateString();
  });
  const forecastValues = Array.from({ length: forecastMonths }, (_, i) =>
    +Math.max(0, slope * (n + i) + intercept).toFixed(2)
  );

  const options: ApexOptions = {
    chart: { type: "line", toolbar: { show: true }, animations: { enabled: true } },
    stroke: { curve: "smooth", width: [3, 2], dashArray: [0, 6] },
    markers: { size: [4, 0] },
    xaxis: {
      categories: [...dates, ...forecastDates],
      title: { text: "Date" },
      tickAmount: 8,
    },
    yaxis: {
      title: { text: "PCI Score" },
      min: 0,
      max: 100,
    },
    colors: ["#3b82f6", "#ef4444"],
    legend: { position: "top" },
    annotations: {
      yaxis: [
        {
          y: 60,
          borderColor: "#f59e0b",
          label: { text: "Threshold (60)", style: { color: "#f59e0b" } },
        },
      ],
    },
    tooltip: { y: { formatter: (v) => v.toFixed(1) } },
  };

  const series = [
    { name: "Historical PCI", data: pcis },
    {
      name: "Forecast",
      data: [...Array(pcis?.length).fill(null), ...forecastValues],
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h4 className="font-medium font-jakarta mb-2">PCI Trend & Forecast</h4>
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default PCITrendChart;