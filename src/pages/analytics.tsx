// import React, { useState } from "react";
// import { useGetSectionsQuery } from "@/store/api/apiSlice";
// import PCITrendChart from "@/components/analytics/PCITrendChart.tsx";
// import DistressDistribution from "@/components/analytics/DistressDistribution";
// import ConditionDistribution from "@/components/analytics/ConditionDistribution";
// import ConditionHeatmap from "@/components/analytics/ConditionHeatmap";
// import Spinner from "@/components/common/spinner";

// const Analytics: React.FC = () => {
//   const { data: sections, isLoading } = useGetSectionsQuery();
//   const [selectedSection, setSelectedSection] = useState<string | null>(null);

//   if (isLoading)
//     return (
//       <div className="flex justify-center py-20">
//         <Spinner />
//       </div>
//     );

//   // Default to first section if none selected
//   const sectionId =
//     selectedSection ||
//     (sections && sections.length > 0 ? sections[0].id : null);

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-jakarta font-bold">Analytics Dashboard</h2>

//       <div className="flex items-center gap-4">
//         <label className="text-sm font-jakarta font-medium">Select Section:</label>
//         <select
//           value={sectionId || ""}
//           onChange={(e) => setSelectedSection(e.target.value)}
//           className="px-4 py-2 font-jakarta border rounded-lg bg-white shadow-md"
//         >
//           {sections?.map((s) => (
//             <option key={s.id} value={s.id}>
//               {s.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {sectionId && (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <PCITrendChart sectionId={sectionId} />
//             <ConditionHeatmap />
//           </div>

//           <DistressDistribution sectionId={sectionId} />

//           <ConditionDistribution />
//         </>
//       )}
//     </div>
//   );
// };

// export default Analytics;

import React, { useState } from "react";
import PCITrendChart from "@/components/analytics/PCITrendChart.tsx";
import DistressDistribution from "@/components/analytics/DistressDistribution";
import ConditionHeatmap from "@/components/analytics/ConditionHeatmap"; 
import Spinner from "@/components/common/spinner";
import { useGetNetworkSummaryQuery } from "@/store/api/analyticsApi";
import { useGetAllSectionsQuery } from "@/store/api/sectionsApi";

const Analytics: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { data: sections, isLoading } = useGetAllSectionsQuery({});
  const { data: summary } = useGetNetworkSummaryQuery();
  console.log(summary)

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const sectionId = selectedSection ?? sections?.[0]?.id ?? null;

  return (
    <div className="space-y-6 font-jakarta max-w-[63rem] mx-auto">
      <h2 className="text-xl font-jakarta font-bold">Analytics Dashboard</h2>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Networks", value: summary.total_networks },
            { label: "Sections", value: summary.total_sections },
            { label: "Sample Units", value: summary.total_sample_units },
            {
              label: "Average PCI",
              value:
                summary.average_pci != null
                  ? summary.average_pci.toFixed(1)
                  : "N/A",
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center"
            >
              <p className="text-xl font-bold text-blue-600">{value}</p>
              <p className="text-[14px] text-gray-500 font-jakarta">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Section selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-jakarta font-medium">
          Select Section:
        </label>
        <select
          value={sectionId || ""}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="px-4 py-2 font-jakarta text-[14px] border rounded-lg bg-white shadow-md min-w-[90px]"
        >
          {sections?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {sectionId ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PCITrendChart sectionId={sectionId} />
            <ConditionHeatmap />
          </div>
          <DistressDistribution sectionId={sectionId} />
          {/* <ConditionDistribution /> */}
        </>
      ) : (
        <div className="bg-white w-full h-[30rem] font-jakarta border rounded-lg shadow-md mx-auto">
          <p className="text-gray-400 text-xl text-center pt-20">Nothing to see here</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
