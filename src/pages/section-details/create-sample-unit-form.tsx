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
import { useCreateSampleUnitMutation } from "@/store/api/sampleUnitApi";
import { useState } from "react";
import type { Section } from "@/types";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";

export interface SampleUnitForm {
  name: string;
  pixel_to_mm_factor: number;
  distress_type: string;
  severity: "low" | "medium" | "high";
  pothole_depth?: number;
  note: string;
  image_file: FileList;
}

const CreateSampleUnitForm = ({
  section,
  sectionId,
  refetch,
}: {
  section: Section | undefined;
  sectionId: string | undefined;
  refetch: any;
}) => {
  const [createSampleUnit, { isLoading: isCreating }] =
    useCreateSampleUnitMutation();

  const [openSheet, setOpenSheet] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<SampleUnitForm>({
    defaultValues: {
      name: "",
      pixel_to_mm_factor: section?.pixel_to_mm_factor || 0.5,
      distress_type: "Pothole",
      severity: "low",
      pothole_depth: undefined,
      note: "",
    },
  });

  const distressType = watch("distress_type");

  const onSubmit = async (data: SampleUnitForm) => {
    if (!data.image_file || data.image_file.length === 0) {
      toast.error("Please select an image");
      return;
    }
    const formData = new FormData();
    formData.append("section_id", sectionId!);
    formData.append("name", data.name);
    formData.append("pixel_to_mm_factor", String(data.pixel_to_mm_factor));
    formData.append("distress_type", data.distress_type);
    formData.append("severity", data.severity);
    formData.append("pothole_depth", String(data.pothole_depth));
    formData.append("note", data.note);
    formData.append("image_file", data.image_file[0]);
    await createSampleUnit(formData).unwrap();
    // await createSampleUnit({
    //   section_id: sectionId!,
    //   name: data.name,
    //   pixel_to_mm_factor: data.pixel_to_mm_factor,
    //   distress_type: data.distress_type,
    //   severity: data.severity,
    //   pothole_depth: data.pothole_depth,
    //   note: data.note,
    //   image_file: data.image_file[0],
    // }).unwrap();
    reset();
    setOpenSheet(false);
    refetch();
    toast.success("Sample unit added");
  };

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={18} /> Add Sample Unit
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
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
              onClick={() => setOpenSheet(false)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? "Adding..." : "Add Sample Unit"}
            </button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateSampleUnitForm;
