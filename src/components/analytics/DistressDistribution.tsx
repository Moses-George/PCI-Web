import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useGetSampleUnitsBySectionQuery } from '../../store/api/apiSlice';
// import type { DetectedDistress } from '../../types';

interface DistressDistributionProps {
  sectionId: string;
}

const DistressDistribution: React.FC<DistressDistributionProps> = ({ sectionId }) => {
  const { data: sampleUnits } = useGetSampleUnitsBySectionQuery(sectionId);
  if (!sampleUnits || sampleUnits.length === 0) {
    return <p className="text-gray-400">No sample units available.</p>;
  }

  // Aggregate distresses
  const distressCounts: Record<string, number> = {};
  sampleUnits.forEach(su => {
    su.detectedDistresses.forEach(d => {
      const key = d.type;
      distressCounts[key] = (distressCounts[key] || 0) + 1;
    });
  });

  const pieOptions: ApexOptions = {
    chart: { type: 'pie' },
    labels: Object.keys(distressCounts),
    colors: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'],
    legend: { position: 'bottom' },
    title: { text: 'Distress Type Distribution (Count)' },
  };
  const pieSeries = Object.values(distressCounts);

  // Stacked bar by severity
  const severityData: Record<string, { L: number; M: number; H: number }> = {};
  sampleUnits.forEach(su => {
    su.detectedDistresses.forEach(d => {
      if (!severityData[d.type]) severityData[d.type] = { L: 0, M: 0, H: 0 };
      severityData[d.type][d.severity] += 1;
    });
  });
  const types = Object.keys(severityData);
  const barOptions: ApexOptions = {
    chart: { type: 'bar', stacked: true },
    xaxis: { categories: types, title: { text: 'Distress Type' } },
    yaxis: { title: { text: 'Count' } },
    colors: ['#22c55e', '#f59e0b', '#ef4444'],
    legend: { position: 'top' },
    title: { text: 'Distress Count by Severity' },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '60%' },
    },
  };
  const barSeries = [
    { name: 'Low', data: types.map(t => severityData[t].L) },
    { name: 'Medium', data: types.map(t => severityData[t].M) },
    { name: 'High', data: types.map(t => severityData[t].H) },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-2 gap-4">
      <div>
        <Chart options={pieOptions} series={pieSeries} type="pie" height={300} />
      </div>
      <div>
        <Chart options={barOptions} series={barSeries} type="bar" height={300} />
      </div>
    </div>
  );
};

export default DistressDistribution;