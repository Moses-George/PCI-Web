/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams } from "react-router-dom";
import { useLazyCalculatePCIQuery } from "@/store/api/apiSlice";
import Spinner from "@/components/common/spinner";
import MapPreview from "@/components/common/map-preview";
import { useState, type SetStateAction } from "react";

import {
  Upload,
  Calculator,
  FileText,
  MapPin,
  Ruler,
  Calendar,
  Image,
  ChevronUp,
  ChevronDown,
  Delete,
  Edit,
} from "lucide-react";
import { toast } from "react-toastify";
import MaintenanceRecommendations from "@/components/maintenance/MaintenanceRecommendations";
import type { SampleUnit } from "@/types";
import CreateSampleUnitForm from "./create-sample-unit-form";
import GenerateReport from "./generate-report";
import { useGetSingleSectionQuery } from "@/store/api/sectionsApi";
// import { useGetSampleUnitsBySectionQuery } from "@/store/api/sampleUnitApi";

const SectionDetail = () => {
  const { sectionId } = useParams<{
    sectionId: string;
  }>();
  const {
    data: section,
    isLoading,
    refetch,
  } = useGetSingleSectionQuery(sectionId!);
  console.log("section", section);
  // const {
  //   data: sampleUnits,
  //   isLoading: unitsLoading,
  //   refetch,
  // } = useGetSampleUnitsBySectionQuery(sectionId!);
  const [triggerPCI, { data: pciResult, isLoading: pciLoading }] =
    useLazyCalculatePCIQuery();

  // console.log("sampleUnits", sampleUnits);
  const sampleUnits = section?.sample_units;

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [selectedSampleUnit, setSelectedSampleUnit] =
    useState<SampleUnit | null>(null);

  const toggleExplorer = (sample_unit: SampleUnit) => {
    if (sample_unit?.id === selectedSampleUnit?.id) {
      setSelectedSampleUnit(null);
    } else {
      setSelectedSampleUnit(sample_unit);
    }
  };

  const handleCalculatePCI = async () => {
    await triggerPCI(sectionId!).unwrap();
    toast.success("PCI calculated");
  };

  const distressTypes =
    sampleUnits?.flatMap((su) =>
      su?.detections?.map((detection) => detection.distress_type),
    ) || [];
  const pci = pciResult?.finalPci || 50;

  if (!section)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6 font-jakarta">
      {/* Header with actions */}
      <div className="flex flex-col gap-4 justify-between font-jakarta items-start">
        <div>
          <h2 className="text-2xl font-bold">{section.name}</h2>
          <p className="text-gray-500">{section.description}</p>
          <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Ruler size={14} /> Width: {section.width}m
            </span>
            <span className="flex items-center gap-1">
              <Ruler size={14} /> Length: {section.length}m
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> Chainage: {section.chainage_start}-
              {section.chainage_end}m
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> Created:{" "}
              {new Date(section.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          {sampleUnits?.length !== 0 && (
            <button
              onClick={handleCalculatePCI}
              disabled={pciLoading}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Calculator size={18} />{" "}
              {pciLoading ? "Calculating..." : "Calculate PCI"}
            </button>
          )}
          {sampleUnits?.length !== 0 && (
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <FileText size={18} /> Generate Report
            </button>
          )}
          <CreateSampleUnitForm
            section={section}
            sectionId={sectionId}
            refetch={refetch}
          />
        </div>
      </div>

      {/* Map and PCI result */}
      <div className="grid grid-cols-[6fr_4fr] gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <h4 className="font-medium p-4">Section Location</h4>
          <div className="h-80">
            <MapPreview
              center={section.coordinates}
              zoom={14}
              height="360px"
              className="rounded-b-md h-full"
            />
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
        {isLoading ? (
          <Spinner size={30} />
        ) : sampleUnits?.length === 0 ? (
          <div className="h-64 flex items-center justify-center w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <p className="text-gray-400">
              No sample units yet. Add one using the button above.
            </p>
          </div>
        ) : (
          sampleUnits?.map((su) => (
            <div
              key={su.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                // key={su.id}
                className="bg-white space-y-5 p-4 rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="pb-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{su.name}</h4>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>Distress: {su.distress_type}</span>
                      <span>Severity: {su.severity}</span>
                      {su.pothole_depth && (
                        <span>Depth: {su.pothole_depth}mm</span>
                      )}
                      <span>Pixel/mm: {su.pixel_to_mm_factor}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(su.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-jakarta">
                  <div className="font-bold text-sm">Actions:</div>
                  <button className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer">
                    <Delete size={24} color="red" />
                    <span className="text-sm">Delete</span>
                  </button>
                  <button className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer">
                    <Edit size={22} color="blue" />
                    <span className="text-sm">Edit</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Original Image
                    </p>
                    <img
                      src={su.original_image}
                      alt="Original"
                      className="w-full rounded-lg border border-gray-200 max-h-48 object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Predicted Image
                    </p>
                    {su.predicted_image ? (
                      <img
                        src={su.predicted_image}
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
                <button
                  onClick={() => toggleExplorer(su)}
                  className="w-full flex items-center justify-center gap-2 py-3 mb-4 border text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  {selectedSampleUnit?.id === su?.id ? (
                    <>
                      <ChevronUp size={14} />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} />
                      Show More Details
                    </>
                  )}
                </button>
                {su?.detections?.length > 0 &&
                  selectedSampleUnit?.id === su?.id && (
                    <div className="">
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
                              <th className="px-3 py-2 text-left">
                                Length (m)
                              </th>
                              <th className="px-3 py-2 text-left">Area (m²)</th>
                              <th className="px-3 py-2 text-left">
                                Perimeter (m)
                              </th>
                              <th className="px-3 py-2 text-left">
                                Confidence
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {su?.detections?.map((detection, idx) => (
                              <tr
                                key={idx}
                                className="border-b border-gray-100"
                              >
                                <td className="px-3 py-2">
                                  {detection?.distress_type}
                                </td>
                                <td className="px-3 py-2">
                                  {detection?.severity}
                                </td>
                                <td className="px-3 py-2">
                                  {detection?.averageWidth}
                                </td>
                                <td className="px-3 py-2">
                                  {detection?.length}
                                </td>
                                <td className="px-3 py-2">{detection?.area}</td>
                                <td className="px-3 py-2">
                                  {detection?.perimeter}
                                </td>
                                <td className="px-3 py-2">
                                  {(detection?.confidence * 100).toFixed(0)}%
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

      {sampleUnits?.length !== 0 && (
        <MaintenanceRecommendations
          sectionId={sectionId!}
          pci={pci}
          distressTypes={distressTypes}
        />
      )}
      <GenerateReport
        sectionId={sectionId}
        reportModalOpen={reportModalOpen}
        setReportModalOpen={setReportModalOpen}
      />
    </div>
  );
};

export default SectionDetail;
