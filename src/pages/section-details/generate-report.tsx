/* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { useGenerateReportMutation } from "@/store/api/apiSlice";
// import { useState, type Dispatch, type SetStateAction } from "react";
// import { toast } from "react-toastify";

// const GenerateReport = ({
//   //   reportName,
//   sectionId,
//   reportModalOpen,
//   setReportModalOpen,
// }: {
//   //   reportName: string;
//   sectionId: string | undefined;
//   reportModalOpen: boolean;
//   setReportModalOpen: Dispatch<SetStateAction<boolean>>;
// }) => {
//   const [reportName, setReportName] = useState("");
//   const [reportOptions, setReportOptions] = useState<string[]>([]);
//   const [generateReport, { isLoading: reportLoading }] =
//     useGenerateReportMutation();

//   const handleGenerateReport = async () => {
//     if (!reportName.trim()) {
//       toast.error("Please enter a report name");
//       return;
//     }
//     await generateReport({
//       sectionId: sectionId!,
//       reportName,
//       options: reportOptions,
//     }).unwrap();
//     setReportModalOpen(false);
//     toast.success("Report generation started");
//   };

//   return (
//     <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
//       <DialogContent className="font-jakarta">
//         <DialogHeader>
//           <DialogTitle>Generate Report</DialogTitle>
//           <DialogDescription>
//             Provide a name and select options to include in the report.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-4 py-4 z-[99999] font-jakarta">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Report Name
//             </label>
//             <input
//               value={reportName}
//               onChange={(e) => setReportName(e.target.value)}
//               placeholder="e.g., PCI_Report_2024"
//               className="mt-1 w-full px-3 py-2 border rounded-md"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Include Options
//             </label>
//             <div className="mt-2 space-y-2">
//               {[
//                 "PCI Score",
//                 "Distress Summary",
//                 "Sample Unit Details",
//                 "Map Preview",
//                 "Recommendations",
//               ].map((opt) => (
//                 <label key={opt} className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={reportOptions.includes(opt)}
//                     onChange={(e) => {
//                       if (e.target.checked)
//                         setReportOptions([...reportOptions, opt]);
//                       else
//                         setReportOptions(
//                           reportOptions.filter((o) => o !== opt),
//                         );
//                     }}
//                   />
//                   {opt}
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>
//         <DialogFooter>
//           <button
//             type="button"
//             onClick={() => setReportModalOpen(false)}
//             className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleGenerateReport}
//             disabled={reportLoading}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
//           >
//             {reportLoading ? "Generating..." : "Generate Report"}
//           </button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default GenerateReport;

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Section } from "@/types";
import { VITE_ENDPOINT_URL } from "@/lib/variables";

const REPORT_OPTIONS = [
  "PCI Score",
  "Distress Summary",
  "Sample Unit Details",
  "Recommendations",
  // "Detection Images",
  // "Map Preview",
];

const GenerateReport = ({
  section,
  sectionId,
  reportModalOpen,
  setReportModalOpen,
}: {
  section: Section;
  sectionId: string | undefined;
  reportModalOpen: boolean;
  setReportModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const section_name = section?.name?.split(" ")?.join("_");
  const [reportName, setReportName] = useState(section_name);
  const [reportOptions, setReportOptions] = useState<string[]>([
    "PCI Score",
    "Distress Summary",
    "Recommendations",
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  const toggleOption = (opt: string) => {
    setReportOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    );
  };

  const handleGenerateReport = async () => {
    if (!reportName.trim()) {
      toast.error("Please enter a report name");
      return;
    }
    if (reportOptions.length === 0) {
      toast.error("Please select at least one option");
      return;
    }
    if (!sectionId) {
      toast.error("No section selected");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${VITE_ENDPOINT_URL}/sections/${sectionId}/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            report_name: reportName,
            include_options: reportOptions,
          }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail ?? "Report generation failed");
      }

      // Stream PDF blob and trigger download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setReportModalOpen(false);
      setReportName("");
      toast.success("Report downloaded successfully");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
      <DialogContent className="font-jakarta z-[10000]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Provide a name and select options to include in the report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 font-jakarta">
          {/* Report name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Report Name
            </label>
            <input
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="e.g., PCI_Report_2024"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Include in Report
            </label>
            <div className="mt-2 space-y-2">
              {REPORT_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-3 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={reportOptions.includes(opt)}
                    onChange={() => toggleOption(opt)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Selection count hint */}
          <p className="text-xs text-gray-400">
            {reportOptions.length} option{reportOptions.length !== 1 ? "s" : ""}{" "}
            selected
          </p>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => setReportModalOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transform active:scale-75 transition-transform cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={
              isLoading || !reportName.trim() || reportOptions.length === 0
            }
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-75 transition-transform cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Report"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReport;
