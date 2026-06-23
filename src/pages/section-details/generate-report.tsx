import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGenerateReportMutation } from "@/store/api/apiSlice";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";

const GenerateReport = ({
  //   reportName,
  sectionId,
  reportModalOpen,
  setReportModalOpen,
}: {
  //   reportName: string;
  sectionId: string | undefined;
  reportModalOpen: boolean;
  setReportModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const [reportName, setReportName] = useState("");
  const [reportOptions, setReportOptions] = useState<string[]>([]);
  const [generateReport, { isLoading: reportLoading }] =
    useGenerateReportMutation();

  const handleGenerateReport = async () => {
    if (!reportName.trim()) {
      toast.error("Please enter a report name");
      return;
    }
    await generateReport({
      sectionId: sectionId!,
      reportName,
      options: reportOptions,
    }).unwrap();
    setReportModalOpen(false);
    toast.success("Report generation started");
  };

  return (
    <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
      <DialogContent className="font-jakarta">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Provide a name and select options to include in the report.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 z-[99999] font-jakarta">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Report Name
            </label>
            <input
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="e.g., PCI_Report_2024"
              className="mt-1 w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Include Options
            </label>
            <div className="mt-2 space-y-2">
              {[
                "PCI Score",
                "Distress Summary",
                "Sample Unit Details",
                "Map Preview",
                "Recommendations",
              ].map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reportOptions.includes(opt)}
                    onChange={(e) => {
                      if (e.target.checked)
                        setReportOptions([...reportOptions, opt]);
                      else
                        setReportOptions(
                          reportOptions.filter((o) => o !== opt),
                        );
                    }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <button
            type="button"
            onClick={() => setReportModalOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={reportLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {reportLoading ? "Generating..." : "Generate Report"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReport;
