/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams } from "react-router-dom";
import Spinner from "@/components/common/spinner";
import MapPreview from "@/components/common/map-preview";
import { useRef, useState } from "react";
import { FileText, MapPin, Ruler, Calendar } from "lucide-react";
import MaintenanceRecommendations from "@/components/maintenance/MaintenanceRecommendations";
import CreateSampleUnitForm from "./create-sample-unit-form";
import GenerateReport from "./generate-report";
import {
  useGetSingleSectionQuery,
  useGetSingleSectionSampleUnitsQuery,
} from "@/store/api/sectionsApi";
import SampleUnits from "./sample-units";
import PCIScoreCard from "./PCI-Score-Card";

const SectionDetail = () => {
  const { sectionId } = useParams<{
    sectionId: string;
  }>();
  const { data: section, refetch: refetchSection } = useGetSingleSectionQuery(
    sectionId!,
  );
  const {
    data: sampleUnits,
    isLoading: isLoadingSU,
    refetch,
  } = useGetSingleSectionSampleUnitsQuery(sectionId!);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const firstSampleUnitRef = useRef<HTMLDivElement>(null);

  const scrollToFirst = () => {
    firstSampleUnitRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const distressTypes =
    sampleUnits?.flatMap((su) =>
      su?.detections?.length > 0
        ? su?.detections?.map((detection) => detection.distress_type)
        : su?.distress_type,
    ) || [];

  console.log("sec", section);

  const pci = section?.latest_pci;
  // const pci_rating = section?.latest_rating;

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
          {/* {sampleUnits?.length !== 0 && (
            <button
              onClick={handleCalculatePCI}
              disabled={pciLoading || section.is_calculated}
              className={`flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transform active:scale-75 transition-transform cursor-pointer ${section.is_calculated || pciLoading ? "hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed" : ""}`}
            >
              <Calculator size={18} />{" "}
              {pciLoading ? "Calculating..." : "Calculate PCI"}
            </button>
          )} */}
          {sampleUnits?.length !== 0 && (
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transform active:scale-75 transition-transform cursor-pointer"
            >
              <FileText size={18} /> Generate Report
            </button>
          )}
          <CreateSampleUnitForm
            section={section}
            sectionId={sectionId}
            refetch={refetch}
            onSuccess={scrollToFirst}
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h4 className="font-medium mb-2">Model Recommendation</h4>
        <div
          className={`p-3 rounded-lg border bg-red-100 text-red-800 border-red-300`}
        >
          <div className="flex">
            <div className="w-full">
              <p className="font-semibold">Segmentation Model:</p>
              <p className="text-[13px]">
                Longitudinal Crack, Transverse Crack, Pothole.
              </p>
              <p className="text-[13px]">
                Others: Alligator Crack (Not really recommended)
              </p>
            </div>
            <div className="w-full">
              <p className="font-semibold">Bounding Box Model:</p>
              <p className="text-[13px]">
                Pothole, Alligator Crack, Patching, Rutting, Edge Crack.
              </p>
              <p className="text-[13px]">
                Others: Longitudinal Crack, Transverse Crack (Not really
                recommended)
              </p>
            </div>
          </div>
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
              height="100%"
              className="rounded-b-md h-full"
            />
          </div>
        </div>
        <PCIScoreCard
          sectionId={sectionId}
          refetchSection={refetchSection}
          section={section}
        />
      </div>

      {/* List of Sample Units */}
      <SampleUnits
        isLoading={isLoadingSU}
        sampleUnits={sampleUnits}
        refetch={refetch}
        scrollToFirstRef={firstSampleUnitRef}
        refetchSection={refetchSection}
      />

      {section?.latest_pci && (
        <MaintenanceRecommendations
          sectionId={sectionId!}
          pci={pci!}
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
