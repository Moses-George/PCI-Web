import React, { useState } from "react";
import { useGetSectionsQuery } from "@/store/api/apiSlice";
import PCITrendChart from "@/components/analytics/PCITrendChart.tsx";
import DistressDistribution from "@/components/analytics/DistressDistribution";
import ConditionDistribution from "@/components/analytics/ConditionDistribution";
import ConditionHeatmap from "@/components/analytics/ConditionHeatmap";
import Spinner from "@/components/common/spinner";

const Analytics: React.FC = () => {
  const { data: sections, isLoading } = useGetSectionsQuery();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  // Default to first section if none selected
  const sectionId =
    selectedSection ||
    (sections && sections.length > 0 ? sections[0].id : null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-jakarta font-bold">Analytics Dashboard</h2>

      <div className="flex items-center gap-4">
        <label className="text-sm font-jakarta font-medium">Select Section:</label>
        <select
          value={sectionId || ""}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="px-4 py-2 font-jakarta border rounded-lg bg-white shadow-md"
        >
          {sections?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {sectionId && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PCITrendChart sectionId={sectionId} />
            <ConditionHeatmap />
          </div>

          <DistressDistribution sectionId={sectionId} />

          <ConditionDistribution />
        </>
      )}
    </div>
  );
};

export default Analytics;
