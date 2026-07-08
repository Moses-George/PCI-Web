/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmDeletion from "@/components/common/confirm-deletion";
import type { ActionType, DetectedDistress } from "@/types";
import { ArrowRight, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import EditDetection from "./edit-detection";
import { useDeleteDetectionMutation } from "@/store/api/detectionApi";
import { toast } from "react-toastify";
import ViewDetectionDetails from "./view-detection-details";

export interface IDetectionForm {
  distress_type: string;
  severity: "low" | "medium" | "high";
}

export interface ISelectedDetection {
  action: ActionType;
  detectionId: string | null;
  detection: DetectedDistress | null;
}

const DetectionActionBtns = ({
  detection,
  refetch,
  refetchSection,
}: {
  detection: DetectedDistress;
  refetch: any;
  refetchSection: any;
}) => {
  const [openDeleteModal, setOpenDeleModal] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [selectedDetection, setSelectedDetection] =
    useState<ISelectedDetection>({
      action: null,
      detectionId: null,
      detection: null,
    });

  const [deleteDetection, { isLoading: isDeleting }] =
    useDeleteDetectionMutation();

  const handleAction = (detection: DetectedDistress, action: ActionType) => {
    setSelectedDetection({
      action,
      detectionId: detection.id,
      detection,
    });
    if (action === "edit") {
      setOpenForm(true);
    }
    if (action === "delete") {
      setOpenDeleModal(true);
    }
  };

  const deleteDetectedDistress = async () => {
    if (selectedDetection.detectionId) {
      await deleteDetection(selectedDetection.detectionId).unwrap();
      await refetch();
      await refetchSection();
      setOpenDeleModal(false);
    } else {
      toast.warning("No Distress Selected. Please Reselect desired Distress", {
        hideProgressBar: true,
        autoClose: 3000,
      });
    }
  };
  return (
    <>
      {openDeleteModal && (
        <ConfirmDeletion
          confirmAction={deleteDetectedDistress}
          closeModal={() => setOpenDeleModal(false)}
          loading={isDeleting}
          header={"Delete Model's Distress Prediction"}
          message={`Are you sure you want to delete this prediction ? This action cannot be undone`}
        />
      )}
      {openForm && (
        <EditDetection
          selectedDetection={selectedDetection}
          setOpenForm={setOpenForm}
          refetch={refetch}
          refetchSection={refetchSection}
        />
      )}
      {viewMore && (
        <ViewDetectionDetails detection={detection} setViewMore={setViewMore} />
      )}
      <button
        onClick={() => handleAction(detection, "edit")}
        className="flex items-center gap-1 transform active:scale-75 transition-transform cursor-pointer"
      >
        <Edit size={12} color="blue" />
        <span className="text-[12px] font-medium">Edit</span>
      </button>
      <button
        onClick={() => handleAction(detection, "delete")}
        className="flex items-center gap-1 transform active:scale-75 transition-transform cursor-pointer"
      >
        <Trash2 size={12} color="red" />
        <span className="text-[12px] font-medium">Delete</span>
      </button>
      <button
        onClick={() => setViewMore(true)}
        className="flex items-center gap-1 transform active:scale-75 transition-transform cursor-pointer"
      >
        <span className="text-[12px] font-medium">View</span>
        <ArrowRight size={12} color="red" />
      </button>
    </>
  );
};

export default DetectionActionBtns;
