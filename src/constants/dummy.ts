
// Historical PCI data per section (for trend)
export const historicalPCI: Record<string, { date: string; pci: number }[]> = {
  s1: [
    { date: "2024-01-20", pci: 78 },
    { date: "2024-02-20", pci: 72 },
    { date: "2024-03-20", pci: 65 },
    { date: "2024-04-20", pci: 58 },
  ],
  s2: [
    { date: "2024-01-25", pci: 85 },
    { date: "2024-02-25", pci: 82 },
    { date: "2024-03-25", pci: 79 },
  ],
  // add more as needed
};

// Unit costs for maintenance actions (per m² or per meter)
export const unitCosts = {
  "Crack Sealing": { unit: "meter", cost: 5 },
  "Pothole Patching": { unit: "sqm", cost: 30 },
  "Thin Overlay": { unit: "sqm", cost: 45 },
  "Full Reconstruction": { unit: "sqm", cost: 120 },
  "Rutting Repair": { unit: "sqm", cost: 50 },
};

// Maintenance rules: based on PCI and distress types
export const maintenanceRules = [
  { minPci: 0, maxPci: 40, action: "Full Reconstruction", priority: "High" },
  { minPci: 41, maxPci: 55, action: "Thin Overlay", priority: "High" },
  {
    minPci: 56,
    maxPci: 70,
    action: "Pothole Patching / Crack Sealing",
    priority: "Medium",
  },
  {
    minPci: 71,
    maxPci: 85,
    action: "Preventive Maintenance (Crack Sealing)",
    priority: "Low",
  },
  { minPci: 86, maxPci: 100, action: "Routine Maintenance", priority: "Low" },
];
