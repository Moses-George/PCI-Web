/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-assignment */
import React, { useState } from 'react';
import { useGetSectionsQuery, useLazyCalculatePCIQuery } from '../store/api/apiSlice';
// import { useGetSampleUnitsBySectionQuery } from '../store/api/apiSlice';
import Spinner from '../components/common/spinner';
// import { unitCosts } from '../constants/dummyExtended';
// import { saveAs } from 'file-saver'; // you may need to install file-saver
// import * as XLSX from 'xlsx'; // you may need to install xlsx

const BudgetPlanner: React.FC = () => {
  const { data: sections, isLoading: sectionsLoading } = useGetSectionsQuery();
  const [triggerPCI] = useLazyCalculatePCIQuery();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [pciMap, setPciMap] = useState<Record<string, number>>({});
  const [loadingPci, setLoadingPci] = useState(false);

  // Load PCI for all sections (on mount)
  React.useEffect(() => {
    if (!sections) return;
    const loadPci = async () => {
      setLoadingPci(true);
      const map: Record<string, number> = {};
      for (const s of sections) {
        const result = await triggerPCI(s.id).unwrap();
        map[s.id] = result.finalPci;
      }
      setPciMap(map);
      setLoadingPci(false);
    };
    loadPci();
  }, [sections, triggerPCI]);

  if (sectionsLoading || loadingPci) return <div className="flex justify-center py-20"><Spinner /></div>;

  const toggleSelect = (id: string) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAll = () => {
    if (!sections) return;
    const all = sections.reduce((acc, s) => ({ ...acc, [s.id]: true }), {});
    setSelected(all);
  };

  const deselectAll = () => {
    setSelected({});
  };

  // Compute costs for selected sections
  const computeCost = (sectionId: string) => {
    const pci = pciMap[sectionId] || 50;
    // Simple cost estimation based on PCI and distress (dummy)
    let cost = 0;
    if (pci < 40) cost = 100000;
    else if (pci < 55) cost = 60000;
    else if (pci < 70) cost = 30000;
    else if (pci < 85) cost = 10000;
    else cost = 2000;
    return cost;
  };

  const totalCost = sections?.reduce((sum, s) => selected[s.id] ? sum + computeCost(s.id) : sum, 0) || 0;

  const exportCSV = () => {
    if (!sections) return;
    const data = sections
      .filter(s => selected[s.id])
      .map(s => ({
        Name: s.name,
        PCI: pciMap[s.id] || 'N/A',
        'Estimated Cost ($)': computeCost(s.id),
      }));
    // const ws = XLSX.utils.json_to_sheet(data);
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Budget');
    // const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([buf], { type: 'application/octet-stream' });
    // saveAs(blob, 'budget_plan.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budget Planner</h2>
        <div className="flex gap-3">
          <button onClick={selectAll} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Select All</button>
          <button onClick={deselectAll} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Deselect All</button>
          <button onClick={exportCSV} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
            <span>💾</span> Export Selected
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">Select sections to include in budget plan.</p>
          <p className="text-lg font-bold">Total Estimated Cost: ${totalCost.toLocaleString()}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Select</th>
                <th className="px-4 py-2 text-left">Section Name</th>
                <th className="px-4 py-2 text-left">PCI</th>
                <th className="px-4 py-2 text-left">Estimated Cost ($)</th>
              </tr>
            </thead>
            <tbody>
              {sections?.map(s => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={!!selected[s.id]}
                      onChange={() => toggleSelect(s.id)}
                    />
                  </td>
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{pciMap[s.id] || 'N/A'}</td>
                  <td className="px-4 py-2">${computeCost(s.id).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;