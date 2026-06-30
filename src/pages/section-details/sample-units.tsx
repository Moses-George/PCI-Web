/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { SampleUnit } from "@/types";
import { Image } from "lucide-react";
import Spinner from "@/components/common/spinner";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDeleModal } from "@/store/slices/sampleUnitSlice";
import type { RootState } from "@/store/store";
import ConfirmDeletion from "@/components/common/confirm-deletion";
import { useDeleteSampleUnitMutation } from "@/store/api/sampleUnitApi";
import { toast } from "react-toastify";
import SampleUnitCard from "./sample-unit-card";
// import { useGetSingleSectionSampleUnitsQuery } from "@/store/api/sectionsApi";
import type { SampleUnit } from "@/types";

const SampleUnits = ({
  isLoading,
  sampleUnits,
  refetch,
  scrollToFirstRef,
}: {
  isLoading: boolean;
  refetch: any;
  sampleUnits: SampleUnit[] | undefined;
  scrollToFirstRef?: React.RefObject<HTMLDivElement | null>;
}) => {
  const dispatch = useDispatch();

  const {
    // openForm,
    openDeleModal,
    sample_unit_id: selected_su_id,
    sample_unit: selectedSampleUnit,
  } = useSelector((state: RootState) => state.sampleUnit);

  const [deleteSampleUnit, { isLoading: isDeleting }] =
    useDeleteSampleUnitMutation();

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
          sampleUnits?.map((su, index) => (
            <div key={su.id} ref={index === 0 ? scrollToFirstRef : undefined}>
              <SampleUnitCard sample_unit={su} refetch={refetch} />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default SampleUnits;
