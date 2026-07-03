/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  setOpenDeleModal,
  setOpenForm,
  setSelectedSUAction,
} from "@/store/slices/sampleUnitSlice";
import type { ActionType, SampleUnit } from "@/types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronUp, ChevronDown, Trash2, Edit } from "lucide-react";
import { useInferenceStatus } from "@/hooks/useInferenceStatus";
import { InferenceProgress } from "@/components/common/Inference-progress";
import type { RootState } from "@/store/store";
import SUImages from "./su-image";

const SampleUnitCard = ({
  sample_unit,
  refetch,
}: {
  sample_unit: SampleUnit;
  refetch: any;
}) => {
  const dispatch = useDispatch();
  const {
    action,
    sample_unit: selectedSampleUnit,
    // isScrollDown
  } = useSelector((state: RootState) => state.sampleUnit);
  const isEditing = Boolean(selectedSampleUnit && action === "edit");

  const [selectedSUExplorer, setSelectedSUExplorer] =
    useState<SampleUnit | null>(null);

  // Only open WS if inference isn't already terminal
  const isTerminal = ["done", "failed"].includes(sample_unit.inference_status);
  // const isTerminal =
  //   ["done", "failed"].includes(sample_unit.inference_status) && !isEditing;
  const event = useInferenceStatus(isTerminal ? null : sample_unit.id, {
    onDone: (detectionCount: number) => {
      refetch();
      // Re-fetch the sample unit from your store/API to get new detections
      // For now we just mark it done — wire this to your Redux refetch action
      console.log(`Inference done: ${detectionCount} detections`);
    },
  });

  const toggleExplorer = (sample_unit: SampleUnit) => {
    if (sample_unit?.id === selectedSUExplorer?.id) {
      setSelectedSUExplorer(null);
    } else {
      setSelectedSUExplorer(sample_unit);
    }
  };

  const handleAction = (sample_unit: SampleUnit, action: ActionType) => {
    dispatch(setSelectedSUAction({ action, ...sample_unit }));
    if (action === "edit") {
      dispatch(setOpenForm(true));
    }
    if (action === "delete") {
      dispatch(setOpenDeleModal(true));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow lg:max-w-6xl mx-auto">
      <div
        // key={su.id}
        className="bg-white space-y-5 p-4 rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="pb-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h4 className="font-semibold">{sample_unit.name}</h4>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span>Distress: {sample_unit.distress_type ?? "Null"}</span>
              <span>Severity: {sample_unit.severity ?? "Null"}</span>
              {/* {su.pothole_depth && (
                        <span>Depth: {su.pothole_depth}mm</span>
                      )} */}
              <span>Pixel/mm: {sample_unit.pixel_to_mm_factor ?? "Null"}</span>
            </div>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(sample_unit.created_at).toLocaleDateString()}
          </span>
        </div>
        <InferenceProgress
          sampleUnitId={sample_unit.id}
          initialStatus={sample_unit.inference_status}
          onDone={(count) => console.log(`${count} detections ready`)}
        />
        <div className="flex items-center gap-3 font-jakarta mt-3">
          <div className="font-bold text-sm">Actions:</div>
          <button
            onClick={() => handleAction(sample_unit, "delete")}
            className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer"
          >
            <Trash2 size={24} color="red" />
            <span className="text-sm">Delete</span>
          </button>
          <button
            onClick={() => handleAction(sample_unit, "edit")}
            className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer"
          >
            <Edit size={22} color="blue" />
            <span className="text-sm">Edit</span>
          </button>
        </div>
        <SUImages images={sample_unit?.images} event={event} />
        <button
          onClick={() => toggleExplorer(sample_unit)}
          className="w-full flex items-center justify-center gap-2 py-3 mb-4 border text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          {selectedSUExplorer?.id === sample_unit?.id ? (
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
        {sample_unit?.detections?.length > 0
          ? selectedSUExplorer?.id === sample_unit?.id && (
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
                        <th className="px-3 py-2 text-left">Avg Width (mm)</th>
                        <th className="px-3 py-2 text-left">Length (mm)</th>
                        <th className="px-3 py-2 text-left">Area (mm²)</th>
                        {/* <th className="px-3 py-2 text-left">Perimeter (mm)</th> */}
                        <th className="px-3 py-2 text-left">Confidence (%)</th>
                        <th className="px-3 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sample_unit?.detections?.map((detection, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="px-3 py-2">
                            {detection?.distress_type ?? "Null"}
                          </td>
                          <td className="px-3 py-2">
                            {detection?.severity ?? "Null"}
                          </td>
                          <td className="px-3 py-2">
                            {detection?.metrics.avg_width.toFixed(2) ?? "Null"}
                          </td>
                          <td className="px-3 py-2">
                            {detection?.metrics?.length ?? "Null"}
                          </td>
                          <td className="px-3 py-2">
                            {detection?.metrics?.area ?? "Null"}
                          </td>
                          <td className="px-3 py-2">
                            {(detection?.confidence * 100).toFixed(0)}%
                          </td>
                          <td className="px-3 py-2 flex items-center gap-3">
                            <button className="flex items-center gap-1 transform active:scale-75 transition-transform cursor-pointer">
                              <Edit size={12} color="blue" />
                              <span className="text-[12px] font-medium">
                                Edit
                              </span>
                            </button>
                            <button className="flex items-center gap-1 transform active:scale-75 transition-transform cursor-pointer">
                              <Trash2 size={12} color="red" />
                              <span className="text-[12px] font-medium">
                                Delete
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Note: {sample_unit.note}
                </p>
              </div>
            )
          : selectedSUExplorer?.id === sample_unit?.id && (
              <div className="p-4 text-center">
                <p className="text-gray-400 text-sm">
                  No Detections for this Sample Unit. Manual Data was used{" "}
                </p>
              </div>
            )}
      </div>
    </div>
  );
};

export default SampleUnitCard;
