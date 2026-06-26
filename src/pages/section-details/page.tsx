/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams } from "react-router-dom";
import { useLazyCalculatePCIQuery } from "@/store/api/apiSlice";
import Spinner from "@/components/common/spinner";
import MapPreview from "@/components/common/map-preview";
import { useState } from "react";
import { Calculator, FileText, MapPin, Ruler, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import MaintenanceRecommendations from "@/components/maintenance/MaintenanceRecommendations";
import CreateSampleUnitForm from "./create-sample-unit-form";
import GenerateReport from "./generate-report";
import { useGetSingleSectionQuery } from "@/store/api/sectionsApi";
import SampleUnits from "./sample-units";

const SectionDetail = () => {
  const { sectionId } = useParams<{
    sectionId: string;
  }>();
  const {
    data: section,
    isLoading,
    refetch,
  } = useGetSingleSectionQuery(sectionId!);
  const [triggerPCI, { data: pciResult, isLoading: pciLoading }] =
    useLazyCalculatePCIQuery();

  const sampleUnits = section?.sample_units;

  const [reportModalOpen, setReportModalOpen] = useState(false);

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
      <SampleUnits
        isLoading={isLoading}
        sampleUnits={sampleUnits}
        refetch={refetch}
      />

      {sampleUnits?.length !== 0 && (
        <MaintenanceRecommendations
          sectionId={sectionId!}
          pci={pci}
          distressTypes={distressTypes}
        />
      )}
      {sampleUnits?.length !== 0 && (
        <GenerateReport
          sectionId={sectionId}
          reportModalOpen={reportModalOpen}
          setReportModalOpen={setReportModalOpen}
        />
      )}
    </div>
  );
};

export default SectionDetail;
