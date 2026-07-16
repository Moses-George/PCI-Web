/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useCreateSectionMutation,
  useUpdateSectionMutation,
} from "@/store/api/sectionsApi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, type Dispatch, type SetStateAction } from "react";
// import type { Network } from "@/types";
import type { ISelectedSection } from "./page";
import type { NetworkWithSections } from "@/types";
import { createPortal } from "react-dom";
import Backdrop from "@/components/common/backdrop";
import { destinationPoint } from "@/utils/geo_helper";

interface SectionForm {
  name: string;
  description: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  width: number;
  length: number;
  pixelToMmFactor: number;
}

const CreateSectionForm = ({
  network,
  networkId,
  refetchNetwork,
  isEditing,
  openForm,
  setOpenForm,
  selectedSection,
  setSelectedSection,
}: {
  network: NetworkWithSections;
  networkId: string | undefined;
  refetchNetwork: any;
  isEditing: boolean;
  openForm: boolean;
  setOpenForm: Dispatch<SetStateAction<boolean>>;
  selectedSection: ISelectedSection;
  setSelectedSection: Dispatch<SetStateAction<ISelectedSection>>;
}) => {
  const [createSection, { isLoading: isCreating }] = useCreateSectionMutation();
  const [updateSection, { isLoading: isUpdating }] = useUpdateSectionMutation();
  const num_sections = network?.sections?.length;
  const has_sections = num_sections > 0;
  const last_section = network?.sections[num_sections - 1];
  const last_section_end_coords = last_section?.end_coordinates;

  // const new_end_coords = destinationPoint(last_section_end_coords[0], last_section_end_coords[1], 0,  9)

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SectionForm>({
    values: isEditing
      ? { ...selectedSection.section! }
      : {
          name: "",
          description: "",
          start_lat: has_sections
            ? last_section_end_coords[0]
            : network?.start_coordinates[0],
          start_lng: has_sections
            ? last_section_end_coords[1]
            : network?.start_coordinates[1],
          end_lat: network?.end_coordinates[0],
          end_lng: network?.end_coordinates[1],
          width: 9,
          length: 18,
          pixelToMmFactor: 0.5,
        },
  });

  useEffect(() => {
    if (has_sections) {
      const { length, start_lat, start_lng } = getValues();
      const new_end_coords = destinationPoint(start_lat, start_lng, 90, length);
      setValue("end_lat", +new_end_coords[0].toFixed(6));
      setValue("end_lng", +new_end_coords[1].toFixed(6));
    }
  }, [getValues, has_sections, setValue]);

  const onSubmit = async (data: SectionForm) => {
    console.log("formData", data);

    const payload = {
      name: data.name,
      description: data.description,
      start_coordinates: [data.start_lat, data.start_lng],
      end_coordinates: [data.end_lat, data.end_lng],
      width: +data.width.toFixed(2),
      length: +data.length.toFixed(2),
      pixel_to_mm_factor: +data.pixelToMmFactor.toFixed(2),
    };
    if (isEditing) {
      await updateSection({
        section_id: selectedSection.sectionId,
        payload,
      }).unwrap();
    } else {
      console.log("networkId", networkId);
      await createSection({
        network_id: networkId!,
        payload,
      }).unwrap();
    }
    reset();
    setOpenForm(false);
    refetchNetwork();
  };

  return (
    <>
      {openForm && createPortal(<Backdrop />, document.body)}
      <Sheet modal={false} open={openForm} onOpenChange={setOpenForm}>
        <SheetTrigger asChild>
          <button
            onClick={() => {
              setSelectedSection({
                action: null,
                sectionId: null,
                section: null,
              });
            }}
            className="flex items-center gap-2 font-jakarta px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform active:scale-75 transition-transform cursor-pointer"
          >
            <Plus size={18} /> Add Section
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-full max-w-md overflow-y-auto z-[99999] font-jakarta"
        >
          <SheetHeader>
            <SheetTitle>
              {isEditing
                ? `Edit ${selectedSection?.section?.name} Section in ${network?.name}`
                : `New Section in ${network?.name}`}
            </SheetTitle>
            <SheetDescription>
              Enter section details. Coordinates default to network location.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Section Name
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
                Description
              </label>
              <textarea
                {...register("description")}
                rows={2}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Width (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("width", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Length (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("length", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="space-y-1">
              <p className="block text-sm font-medium text-gray-700">
                Start Coordinates
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-medium text-gray-700">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register("start_lat", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-gray-700">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register("start_lng", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="block text-sm font-medium text-gray-700">
                End Coordinates
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-medium text-gray-700">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register("end_lat", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-gray-700">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register("end_lng", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pixel/mm Factor
              </label>
              <input
                type="number"
                step="0.01"
                {...register("pixelToMmFactor", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              />
            </div>
            <SheetFooter>
              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              {/* <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Section"}
            </button> */}
              {isEditing ? (
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transform active:scale-75 transition-transform cursor-pointer"
                >
                  {isCreating ? "Updating..." : "Update Section"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transform active:scale-75 transition-transform cursor-pointer"
                >
                  {isCreating ? "Creating..." : "Create Section"}
                </button>
              )}
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreateSectionForm;
