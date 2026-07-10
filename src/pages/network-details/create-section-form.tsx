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
import { type Dispatch, type SetStateAction } from "react";
// import type { Network } from "@/types";
import type { ISelectedSection } from "./page";
import type { Network } from "@/types";
import { createPortal } from "react-dom";
import Backdrop from "@/components/common/backdrop";

interface SectionForm {
  name: string;
  description: string;
  lat: number;
  lng: number;
  chainageStart: number;
  chainageEnd: number;
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
  network: Network;
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
  // const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionForm>({
    values: isEditing
      ? { ...selectedSection.section! }
      : {
          name: "",
          description: "",
          lat: network?.coordinates[0] || 37.7749,
          lng: network?.coordinates[1] || -122.4194,
          chainageStart: 0,
          chainageEnd: 1,
          width: 10,
          length: 1,
          pixelToMmFactor: 0.5,
        },
  });

  const onSubmit = async (data: SectionForm) => {
    // const p = Object.fromEntries(formData);
    console.log("formData", data);
    // await createSection({
    //   networkId: networkId!,
    //   data: {
    //     name: data.name,
    //     description: data.description,
    //     coordinates: [data.lat, data.lng],
    //     chainage_start: +data.chainageStart.toFixed(2),
    //     chainage_end: +data.chainageEnd.toFixed(2),
    //     width: +data.width.toFixed(2),
    //     length: +data.length.toFixed(2),
    //     pixel_to_mm_factor: +data.pixelToMmFactor.toFixed(2),
    //   },
    // }).unwrap();
    // reset();
    // setOpenForm(false);
    // refetchNetwork();

    const payload = {
      name: data.name,
      description: data.description,
      coordinates: [data.lat, data.lng],
      chainage_start: +data.chainageStart.toFixed(2),
      chainage_end: +data.chainageEnd.toFixed(2),
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
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("lat", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("lng", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chainage Start (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("chainageStart", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chainage End (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("chainageEnd", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>
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
