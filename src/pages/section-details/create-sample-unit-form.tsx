/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  //   SheetClose,
} from "@/components/ui/sheet";
import {
  useCreateSampleUnitMutation,
  useUpdateSampleUnitMutation,
} from "@/store/api/sampleUnitApi";
import type { Section } from "@/types";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { normalizeError } from "@/utils/helpers";
import {
  resetSelectedSUAction,
  setOpenForm,
  type ISampleUnitForm,
} from "@/store/slices/sampleUnitSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
// import { useEffect } from "react";

const CreateSampleUnitForm = ({
  section,
  sectionId,
  refetch,
  onSuccess,
}: {
  section: Section | undefined;
  sectionId: string | undefined;
  refetch: any;
  onSuccess?: () => void;
}) => {
  const dispatch = useDispatch();
  const {
    openForm,
    action,
    sample_unit_id: selected_su_id,
    sample_unit: selectedSampleUnit,
    // isScrollDown
  } = useSelector((state: RootState) => state.sampleUnit);
  const isEditing = Boolean(selectedSampleUnit && action === "edit");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    watch,
  } = useForm<ISampleUnitForm>({
    values: isEditing
      ? { ...selectedSampleUnit }
      : {
          name: "",
          pixel_to_mm_factor: section?.pixel_to_mm_factor || 0.5,
          distress_type: null,
          severity: null,
          pothole_depth: 0,
          note: "",
        },
  });
  const distressType = watch("distress_type", null);

  const [createSampleUnit, { isLoading: isCreating }] =
    useCreateSampleUnitMutation();
  const [updateSampleUnit, { isLoading: isUpdating }] =
    useUpdateSampleUnitMutation();

  const onSubmit = async (data: ISampleUnitForm) => {
    const formData = new FormData();
    formData.append("name", data.name!);
    formData.append("pixel_to_mm_factor", String(data.pixel_to_mm_factor));
    formData.append("pothole_depth", String(data.pothole_depth));
    formData.append("note", data.note!);

    // ✅ Only append distress_type and severity if they are selected
    if (data.distress_type && data.distress_type.trim()) {
      formData.append("distress_type", data.distress_type.trim());
      if (data.severity && data.severity.trim()) {
        formData.append("severity", data.severity.trim());
      }
    }

    // Append image only if a file is selected
    if (data.image_file && data.image_file.length > 0) {
      formData.append("image_file", data.image_file[0]);
    }

    // Now frontend validation: at least one of (image, distress_type) must be provided
    const hasImage = data.image_file && data.image_file.length > 0;
    const hasDistress = data.distress_type && data.distress_type.trim();
    if (!hasImage && !hasDistress) {
      toast.error(
        "Please either select an image or specify distress type and severity.",
      );
      return;
    }
    if (hasDistress && !data.severity?.trim()) {
      toast.error("Please select a severity level for the distress.");
      return;
    }

    console.log("data", data);
    const p = Object.fromEntries(formData);
    console.log("formData", p);

    try {
      if (isEditing) {
        await updateSampleUnit({
          sample_unit_id: selected_su_id,
          payload: formData,
        }).unwrap();
      } else {
        formData.append("section_id", sectionId!);
        await createSampleUnit(formData).unwrap();
      }
      reset();
      dispatch(setOpenForm(false));
      refetch();
      if (!isEditing) setTimeout(() => onSuccess?.(), 300);
      toast.success(`Sample unit ${isEditing ? "updated" : "added"}`);
    } catch (err) {
      const normalized = normalizeError(err);
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
    <Sheet open={openForm} onOpenChange={(open) => dispatch(setOpenForm(open))}>
      <SheetTrigger asChild>
        <button
          onClick={() => dispatch(resetSelectedSUAction())}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform active:scale-75 transition-transform cursor-pointer"
        >
          <Plus size={18} /> Add Sample Unit
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-full max-w-md overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>New Sample Unit</SheetTitle>
          <SheetDescription>
            Upload an image and provide distress details.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 space-y-4 font-jakarta"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit Name
            </label>
            <input
              {...register("name", { required: "Name required" })}
              className="mt-1 w-full px-3 py-2 border rounded-md"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pixel to mm Factor (override)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("pixel_to_mm_factor", {
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
              {...register("distress_type")}
              className="mt-1 w-full px-3 py-2 border rounded-md"
            >
              <option value="Pothole">Pothole</option>
              <option value="Alligator Crack">Alligator Crack</option>
              <option value="Longitudinal Crack">Longitudinal Crack</option>
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
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
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
                {...register("pothole_depth", { valueAsNumber: true })}
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
              {...register("image_file")}
              className="mt-1 w-full bg-gray-200 p-2 text-sm rounded-md cursor-pointer"
            />
          </div>
          <SheetFooter>
            <button
              type="button"
              onClick={() => dispatch(setOpenForm(false))}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transform active:scale-75 transition-transform cursor-pointer"
            >
              Cancel
            </button>
            {isEditing ? (
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transform active:scale-75 transition-transform cursor-pointer"
              >
                {isUpdating ? "Updating..." : "Update Sample Unit"}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transform active:scale-75 transition-transform cursor-pointer"
              >
                {isCreating ? "Adding..." : "Add Sample Unit"}
              </button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateSampleUnitForm;
