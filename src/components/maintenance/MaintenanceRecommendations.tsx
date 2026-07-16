/* eslint-disable no-useless-assignment */
import React from "react";
import { maintenanceRules, unitCosts } from "../../constants/dummy";

interface MaintenanceRecommendationsProps {
  sectionId: string;
  pci: number;
  distressTypes: string[]; // list of detected distress types
}

const MaintenanceRecommendations: React.FC<MaintenanceRecommendationsProps> = ({
  sectionId,
  pci,
  distressTypes,
}) => {
  console.log(sectionId)
  // Find matching rule
  const rule = maintenanceRules.find((r) => pci >= r.minPci && pci <= r.maxPci);
  if (!rule)
    return <p className="text-gray-400">No recommendation available.</p>;

  // Estimate cost based on distress types and area (dummy)
  const estimatedArea = 1000; // assume 1000 m² for demo
  let totalCost = 0;
  if (rule.action.includes("Crack Sealing")) {
    const costPerMeter = unitCosts["Crack Sealing"].cost;
    totalCost = 500 * costPerMeter; // assume 500 meters
  } else if (rule.action.includes("Pothole Patching")) {
    const costPerSqm = unitCosts["Pothole Patching"].cost;
    totalCost = 50 * costPerSqm; // assume 50 sqm
  } else if (rule.action.includes("Thin Overlay")) {
    const costPerSqm = unitCosts["Thin Overlay"].cost;
    totalCost = estimatedArea * costPerSqm;
  } else if (rule.action.includes("Full Reconstruction")) {
    const costPerSqm = unitCosts["Full Reconstruction"].cost;
    totalCost = estimatedArea * costPerSqm;
  } else {
    totalCost = 500; // routine
  }

  const priorityColors: Record<string, string> = {
    High: "bg-red-100 text-red-800 border-red-300",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Low: "bg-green-100 text-green-800 border-green-300",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h4 className="font-medium mb-2">🛠️ Recommended Maintenance Actions</h4>
      <div className={`p-3 rounded-lg border ${priorityColors[rule.priority]}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">{rule.action}</p>
            <p className="text-sm">Priority: {rule.priority}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">Estimated Cost</p>
            <p className="text-lg font-bold">${totalCost.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Based on PCI = {pci} and detected distresses:{" "}
          {distressTypes.join(", ") || "None"}
        </p>
      </div>
    </div>
  );
};

export default MaintenanceRecommendations;
