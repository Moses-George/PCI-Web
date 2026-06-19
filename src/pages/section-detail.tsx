/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams } from "react-router-dom";
import {
  useGetSectionsQuery,
  useGetSampleUnitsBySectionQuery,
  useCreateSampleUnitMutation,
  useLazyCalculatePCIQuery,
  useGenerateReportMutation,
} from "../store/api/apiSlice";
import Spinner from "../components/common/spinner";
import MapPreview from "../components/common/map-preview";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "../components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // we'll create a simple dialog too
import {
  Plus,
  Upload,
  Calculator,
  FileText,
  MapPin,
  Ruler,
  Calendar,
  Image,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify"; // you can install or just use alert
import MaintenanceRecommendations from "@/components/maintenance/MaintenanceRecommendations";
// import SampleUnitExplorerModal from "../../components/sampleUnit/SampleUnitExplorerModal";
import type { SampleUnit } from "@/types";
// import { useState } from "react";

// Simple dialog component (shadcn-like)
// const DialogSimple = Dialog; // we'll export from ui/dialog

interface SampleUnitForm {
  name: string;
  pixelToMmFactor: number;
  distressType: string;
  severity: "L" | "M" | "H";
  potholeDepth?: number;
  note: string;
  imageFile: FileList;
}

const SectionDetail = () => {
  const { networkId, id: sectionId } = useParams<{
    networkId: string;
    id: string;
  }>();
  const { data: sections } = useGetSectionsQuery();
  const section = sections?.find((s) => s.id === sectionId);
  const {
    data: sampleUnits,
    isLoading: unitsLoading,
    refetch,
  } = useGetSampleUnitsBySectionQuery(sectionId!);
  const [createSampleUnit, { isLoading: isCreating }] =
    useCreateSampleUnitMutation();
  const [triggerPCI, { data: pciResult, isLoading: pciLoading }] =
    useLazyCalculatePCIQuery();
  const [generateReport, { isLoading: reportLoading }] =
    useGenerateReportMutation();

  const [openSheet, setOpenSheet] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportOptions, setReportOptions] = useState<string[]>([]);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [selectedSampleUnit, setSelectedSampleUnit] =
    useState<SampleUnit | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<SampleUnitForm>({
    defaultValues: {
      name: "",
      pixelToMmFactor: section?.pixelToMmFactor || 0.5,
      distressType: "Pothole",
      severity: "L",
      potholeDepth: undefined,
      note: "",
    },
  });

  const distressType = watch("distressType");

  const onSubmit = async (data: SampleUnitForm) => {
    if (!data.imageFile || data.imageFile.length === 0) {
      toast.error("Please select an image");
      return;
    }
    await createSampleUnit({
      sectionId: sectionId!,
      data: {
        name: data.name,
        pixelToMmFactor: data.pixelToMmFactor,
        distressType: data.distressType,
        severity: data.severity,
        potholeDepth: data.potholeDepth,
        note: data.note,
        imageFile: data.imageFile[0],
      },
    }).unwrap();
    reset();
    setOpenSheet(false);
    refetch();
    toast.success("Sample unit added");
  };

  const handleCalculatePCI = async () => {
    await triggerPCI(sectionId!).unwrap();
    toast.success("PCI calculated");
  };

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

  const distressTypes =
    sampleUnits?.flatMap((su) => su.detectedDistresses.map((d) => d.type)) ||
    [];
  const pci = pciResult?.finalPci || 50;

  if (!section)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{section.name}</h2>
          <p className="text-gray-500">{section.description}</p>
          <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Ruler size={14} /> Width: {section.width}m
            </span>
            <span className="flex items-center gap-1">
              <Ruler size={14} /> Length: {section.length}km
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> Chainage: {section.chainageStart}-
              {section.chainageEnd}km
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> Created:{" "}
              {new Date(section.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCalculatePCI}
            disabled={pciLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Calculator size={18} />{" "}
            {pciLoading ? "Calculating..." : "Calculate PCI"}
          </button>
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FileText size={18} /> Generate Report
          </button>
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus size={18} /> Add Sample Unit
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-md overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle>New Sample Unit</SheetTitle>
                <SheetDescription>
                  Upload an image and provide distress details.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unit Name
                  </label>
                  <input
                    {...register("name", { required: "Name required" })}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pixel to mm Factor (override)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("pixelToMmFactor", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Distress Type
                  </label>
                  <select
                    {...register("distressType")}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Pothole">Pothole</option>
                    <option value="Alligator Crack">Alligator Crack</option>
                    <option value="Longitudinal Crack">
                      Longitudinal Crack
                    </option>
                    <option value="Transverse Crack">Transverse Crack</option>
                    <option value="Rutting">Rutting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Severity
                  </label>
                  <select
                    {...register("severity")}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  >
                    <option value="L">Low</option>
                    <option value="M">Medium</option>
                    <option value="H">High</option>
                  </select>
                </div>
                {distressType === "Pothole" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pothole Depth (mm)
                    </label>
                    <input
                      type="number"
                      step="1"
                      {...register("potholeDepth", { valueAsNumber: true })}
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Note
                  </label>
                  <textarea
                    {...register("note")}
                    rows={2}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("imageFile")}
                    className="mt-1 w-full"
                  />
                </div>
                <SheetFooter>
                  <button
                    type="button"
                    onClick={() => setOpenSheet(false)}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isCreating ? "Adding..." : "Add Sample Unit"}
                  </button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Map and PCI result */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h4 className="font-medium mb-2">Section Location</h4>
          <div className="h-64">
            <MapPreview center={section.coordinates} zoom={14} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center items-center">
          {pciResult ? (
            <div className="text-center">
              <p className="text-sm text-gray-500">PCI Score</p>
              <p className="text-5xl font-bold text-blue-600">
                {pciResult.finalPci}
              </p>
              <p
                className={`text-lg font-semibold mt-1 ${
                  pciResult.rating === "Good"
                    ? "text-green-600"
                    : pciResult.rating === "Satisfactory"
                      ? "text-blue-600"
                      : pciResult.rating === "Poor"
                        ? "text-yellow-600"
                        : pciResult.rating === "Very Poor"
                          ? "text-orange-600"
                          : "text-red-600"
                }`}
              >
                {pciResult.rating}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Calculated: {new Date(pciResult.calculatedAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="text-gray-400 text-center">
              <Calculator size={48} className="mx-auto mb-2" />
              <p>Click "Calculate PCI" to get the section rating.</p>
            </div>
          )}
        </div>
      </div>

      {/* List of Sample Units */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Image size={20} /> Sample Units ({sampleUnits?.length || 0})
        </h3>
        {unitsLoading ? (
          <Spinner size={30} />
        ) : sampleUnits?.length === 0 ? (
          <p className="text-gray-400">
            No sample units yet. Add one using the button above.
          </p>
        ) : (
          sampleUnits?.map((su) => (
            <div
              key={su.id}
              onClick={() => {
                setSelectedSampleUnit(su);
                setExplorerOpen(true);
              }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <div
                // key={su.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{su.name}</h4>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>Distress: {su.distressType}</span>
                      <span>Severity: {su.severity}</span>
                      {su.potholeDepth && (
                        <span>Depth: {su.potholeDepth}mm</span>
                      )}
                      <span>Pixel/mm: {su.pixelToMmFactor}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(su.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Original Image
                    </p>
                    <img
                      src={su.imageUrl}
                      alt="Original"
                      className="w-full rounded-lg border border-gray-200 max-h-48 object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Predicted Image
                    </p>
                    {su.predictedImageUrl ? (
                      <img
                        src={su.predictedImageUrl}
                        alt="Predicted"
                        className="w-full rounded-lg border border-gray-200 max-h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        Not processed yet
                      </div>
                    )}
                  </div>
                </div>
                {su.detectedDistresses.length > 0 && (
                  <div className="px-4 pb-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Detected Distresses
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs border-collapse">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left">Type</th>
                            <th className="px-3 py-2 text-left">Severity</th>
                            <th className="px-3 py-2 text-left">
                              Avg Width (m)
                            </th>
                            <th className="px-3 py-2 text-left">Length (m)</th>
                            <th className="px-3 py-2 text-left">Area (m²)</th>
                            <th className="px-3 py-2 text-left">
                              Perimeter (m)
                            </th>
                            <th className="px-3 py-2 text-left">Confidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {su.detectedDistresses.map((d, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
                              <td className="px-3 py-2">{d.type}</td>
                              <td className="px-3 py-2">{d.severity}</td>
                              <td className="px-3 py-2">
                                {d.averageWidth.toFixed(2)}
                              </td>
                              <td className="px-3 py-2">
                                {d.length.toFixed(2)}
                              </td>
                              <td className="px-3 py-2">{d.area.toFixed(2)}</td>
                              <td className="px-3 py-2">
                                {d.perimeter.toFixed(2)}
                              </td>
                              <td className="px-3 py-2">
                                {(d.confidence * 100).toFixed(0)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Note: {su.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <MaintenanceRecommendations
        sectionId={sectionId!}
        pci={pci}
        distressTypes={distressTypes}
      />

      {/* Report Generation Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              Provide a name and select options to include in the report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
    </div>
  );
};

export default SectionDetail;
