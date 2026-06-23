import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { historicalPCI } from "../../constants/dummy";

interface PCITrendChartProps {
  sectionId: string;
  forecastYears?: number;
}

const PCITrendChart: React.FC<PCITrendChartProps> = ({
  sectionId,
  forecastYears = 2,
}) => {
  const data = historicalPCI[sectionId] || [];
  if (!data.length)
    return (
      <div className="flex items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-400">No historical data for this section.</p>
      </div>
    );

  // Prepare series
  const dates = data.map((d) => new Date(d.date).toLocaleDateString());
  const pcis = data.map((d) => +d.pci.toFixed(2));
  // console.log(pcis)

  // Simple linear regression for forecast
  const x = pcis.map((_, i) => i);
  const y = pcis;
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (+sumY - slope * sumX) / n;
  // forecast next N years
  const lastIndex = x.length - 1;
  const forecastPoints = [];
  for (let i = 1; i <= forecastYears * 12; i++) {
    const newX = lastIndex + i;
    forecastPoints.push({ x: newX, y: Math.max(0, slope * newX + intercept) });
  }

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: true },
      animations: { enabled: true },
    },
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 4 },
    xaxis: {
      categories: [...dates, ...forecastPoints.map((_, i) => `+${i + 1}m`)],
      title: { text: "Time" },
    },
    yaxis: {
      title: { text: "PCI Score" },
      min: 0,
      max: 100,
      labels: {
        formatter: (val) => val.toFixed(2),
      },
    },
    colors: ["#3b82f6", "#ef4444"],
    legend: { position: "top" },
    tooltip: {
      y: { formatter: (val) => val.toFixed(2) },
    },
    annotations: {
      yaxis: [
        {
          y: 60,
          borderColor: "#f59e0b",
          label: { text: "Threshold (60)", style: { color: "#f59e0b" } },
        },
      ],
    },
  };

  const series = [
    { name: "Historical PCI", data: pcis },
    {
      name: "Forecast",
      data: [
        ...Array(pcis.length).fill(null),
        ...forecastPoints.map((p) => p.y),
      ],
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
