import type { SampleUnit } from "@/types";
import { useState } from "react";
import { Image, ChevronUp, ChevronDown, Delete, Edit } from "lucide-react";
import Spinner from "@/components/common/spinner";


const SampleUnits = ({
  isLoading,
  sampleUnits,
}: {
  isLoading: boolean;
  sampleUnits: SampleUnit[]| undefined;
}) => {
  const [selectedSampleUnit, setSelectedSampleUnit] =
    useState<SampleUnit | null>(null);

  const toggleExplorer = (sample_unit: SampleUnit) => {
    if (sample_unit?.id === selectedSampleUnit?.id) {
      setSelectedSampleUnit(null);
    } else {
      setSelectedSampleUnit(sample_unit);
    }
  };

  return (
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
                className="w-full flex items-center justify-center gap-2 py-3 mb-4 border text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
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
                            <th className="px-3 py-2 text-left">Length (m)</th>
                            <th className="px-3 py-2 text-left">Area (m²)</th>
                            <th className="px-3 py-2 text-left">
                              Perimeter (m)
                            </th>
                            <th className="px-3 py-2 text-left">Confidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {su?.detections?.map((detection, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
                              <td className="px-3 py-2">
                                {detection?.distress_type}
                              </td>
                              <td className="px-3 py-2">
                                {detection?.severity}
                              </td>
                              <td className="px-3 py-2">
                                {detection?.averageWidth}
                              </td>
                              <td className="px-3 py-2">{detection?.length}</td>
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
  );
};

export default SampleUnits;
