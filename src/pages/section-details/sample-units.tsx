/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ActionType, SampleUnit } from "@/types";
import { useState } from "react";
import { Image, ChevronUp, ChevronDown, Delete, Edit } from "lucide-react";
import Spinner from "@/components/common/spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  setOpenDeleModal,
  setOpenForm,
  setSelectedSUAction,
} from "@/store/slices/sampleUnitSlice";
import type { RootState } from "@/store/store";
import ConfirmDeletion from "@/components/common/confirm-deletion";
import { useDeleteSampleUnitMutation } from "@/store/api/sampleUnitApi";
import { toast } from "react-toastify";

const SampleUnits = ({
  isLoading,
  sampleUnits,
  refetch,
}: {
  isLoading: boolean;
  sampleUnits: SampleUnit[] | undefined;
  refetch: any;
}) => {
  const dispatch = useDispatch();

  const {
    // openForm,
    openDeleModal,
    sample_unit_id: selected_su_id,
    sample_unit: selectedSampleUnit,
  } = useSelector((state: RootState) => state.sampleUnit);

  const [selectedSUExplorer, setSelectedSUExplorer] =
    useState<SampleUnit | null>(null);

  const [deleteSampleUnit, { isLoading: isDeleting }] =
    useDeleteSampleUnitMutation();

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

  const deleteSelectedSU = async () => {
    if (selected_su_id) {
      await deleteSampleUnit(selected_su_id).unwrap();
      refetch();
      dispatch(setOpenDeleModal(false));
    } else {
      toast.warning(
        "No Sample Unit Selected. Please Reselect desired Network",
        {
          hideProgressBar: true,
          autoClose: 3000,
        },
      );
    }
  };

  console.log("sampleUnits", sampleUnits);

  return (
    <>
      {openDeleModal && (
        <ConfirmDeletion
          confirmAction={deleteSelectedSU}
          closeModal={() => dispatch(setOpenDeleModal(false))}
          loading={isDeleting}
          header={"You're About to Delete a Sample Unit"}
          message={`Are you sure you want to delete (${selectedSampleUnit?.name}) Sample Unit ? Please note that all model detections will also be deleted permanently. This action cannot be undone`}
        />
      )}
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
                      <span>Distress: {su.distress_type ?? "Null"}</span>
                      <span>Severity: {su.severity ?? "Null"}</span>
                      {/* {su.pothole_depth && (
                        <span>Depth: {su.pothole_depth}mm</span>
                      )} */}
                      <span>Pixel/mm: {su.pixel_to_mm_factor ?? "Null"}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(su.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-jakarta">
                  <div className="font-bold text-sm">Actions:</div>
                  <button
                    onClick={() => handleAction(su, "delete")}
                    className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer"
                  >
                    <Delete size={24} color="red" />
                    <span className="text-sm">Delete</span>
                  </button>
                  <button
                    onClick={() => handleAction(su, "edit")}
                    className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer"
                  >
                    <Edit size={22} color="blue" />
                    <span className="text-sm">Edit</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Original Image
                    </p>
                    {su.original_image ? (
                      <img
                        src={su.original_image}
                        alt="Original"
                        className="w-full rounded-lg border border-gray-200 max-h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 px-4 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        No Image was selected for this sample unit. Click Edit
                        to add an image. Note: Sample units without images have
                        no predictions. Manual values selected by user is used
                        during computation
                      </div>
                    )}
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
                  {selectedSUExplorer?.id === su?.id ? (
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
                {su?.detections?.length > 0
                  ? selectedSUExplorer?.id === su?.id && (
                      <div className="">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Detected Distresses
                        </p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs border-collapse">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left">Type</th>
                                <th className="px-3 py-2 text-left">
                                  Severity
                                </th>
                                <th className="px-3 py-2 text-left">
                                  Avg Width (m)
                                </th>
                                <th className="px-3 py-2 text-left">
                                  Length (m)
                                </th>
                                <th className="px-3 py-2 text-left">
                                  Area (m²)
                                </th>
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
                                    {detection?.distress_type ?? "Null"}
                                  </td>
                                  <td className="px-3 py-2">
                                    {detection?.severity ?? "Null"}
                                  </td>
                                  <td className="px-3 py-2">
                                    {detection?.metrics.avg_width ?? "Null"}
                                  </td>
                                  <td className="px-3 py-2">
                                    {detection?.metrics?.length ?? "Null"}
                                  </td>
                                  <td className="px-3 py-2">
                                    {detection?.metrics?.area ?? "Null"}
                                  </td>
                                  <td className="px-3 py-2">
                                    {detection?.metrics?.perimeter ?? "Null"}
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
                    )
                  : selectedSUExplorer?.id === su?.id && (
                      <div className="p-4 text-center">
                        <p className="text-gray-400 text-sm">
                          No Detections for this Sample Unit. Manual Data was
                          used{" "}
                        </p>
                      </div>
                    )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default SampleUnits;
