/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUpdateDetectionMutation } from "@/store/api/detectionApi";
import { normalizeDistress, normalizeError } from "@/utils/helpers";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import type {
  IDetectionForm,
  ISelectedDetection,
} from "./detection-action-btns";
import type { Dispatch, SetStateAction } from "react";

const EditDetection = ({
  selectedDetection,
  setOpenForm,
  refetch,
  refetchSection,
}: {
  selectedDetection: ISelectedDetection;
  setOpenForm: Dispatch<SetStateAction<boolean>>;
  refetch: any;
  refetchSection: any;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    // formState: { errors },
  } = useForm<IDetectionForm>({
    values: !selectedDetection.detection
      ? { distress_type: "", severity: "high" }
      : {
          distress_type: normalizeDistress(
            selectedDetection?.detection?.distress_type,
          )!,
          severity: selectedDetection?.detection.severity,
        },
  });

  const [updateDetection, { isLoading }] = useUpdateDetectionMutation();

  const onSubmit = async (data: IDetectionForm) => {
    try {
      if (selectedDetection.detectionId) {
        await updateDetection({
          detection_id: selectedDetection.detectionId,
          payload: data,
        }).unwrap();
        reset();
        await refetch();
        await refetchSection();
        setOpenForm(false);
      } else {
        toast.warning(
          "No Distress Selected. Please Reselect desired Distress",
          {
            hideProgressBar: true,
            autoClose: 3000,
          },
        );
      }
    } catch (error) {
      const normalized = normalizeError(error);
      // Show a toast with the main error message
      toast.error(normalized.message);
      // If there are field‑specific errors, set them in React Hook Form
      if (
        normalized.fieldErrors &&
        Object.keys(normalized.fieldErrors).length > 0
      ) {
        for (const [field, message] of Object.entries(normalized.fieldErrors)) {
          setError(field as any, { type: "server", message });
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center fixed h-full inset-0 bg-[#7180967A] backdrop-blur-[1.5px] z-[9999]">
      <div className="bg-white px-8 py-6 rounded shadow-md md:w-[550px] z-[9999] space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="lg:text-xl text-lg text-gray-800 font-semibold">
              Edit Model's Distress Prediction
            </h1>
            {selectedDetection?.detection?.edited && (
              <span className="bg-red-50 text-red-600 px-2 py-1">Edited</span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Only distres type and severity are editable, since they are the only
            parameters needed for PCI Estimation. Please do not fully rely on
            model's prediction. adjust where necessary
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Distress Type
            </label>
            <select
              {...register("distress_type")}
              className="mt-1 w-full px-3 py-2 border rounded-md"
            >
              <option value="Pothole">Pothole</option>
              <option value="Alligator Crack">Alligator Crack</option>
              <option value="Longitudinal Crack">Longitudinal Crack</option>
              <option value="Transverse Crack">Transverse Crack</option>
              {/* <option value="Rutting">Rutting</option> */}
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
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setOpenForm(false)}
              className="text-sm bg-slate-800 py-2 px-6 shadow-md rounded-md text-white hover:opacity-75 transform active:scale-75 transition-transform cursor-pointer"
            >
              cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 py-2.5 px-6 text-sm shadow-md rounded-md text-white hover:opacity-75 transform active:scale-75 transition-transform cursor-pointer"
            >
              {isLoading && <ClipLoader color="white" size={18} />}
              <span className="">{isLoading ? "Updating..." : "Continue"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDetection;
