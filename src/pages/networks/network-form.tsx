/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Dispatch, type SetStateAction } from "react";
import {
  useCreateNetworkMutation,
  useUpdateNetworkMutation,
} from "@/store/api/networksApi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import type { INetworkForm, ISelectedNetwork } from "./page";
import { createPortal } from "react-dom";
import Backdrop from "@/components/common/backdrop";

const NetworkForm = ({
  refetchNetworks,
  openForm,
  setOpenForm,
  isEditing,
  selectedNetwork,
  setSelectedNetwork,
}: {
  refetchNetworks: any;
  isEditing: boolean;
  openForm: boolean;
  setOpenForm: Dispatch<SetStateAction<boolean>>;
  selectedNetwork: ISelectedNetwork;
  setSelectedNetwork: Dispatch<SetStateAction<ISelectedNetwork>>;
}) => {
  console.log("isEditing", isEditing);
  const [createNetwork, { isLoading: isCreating }] = useCreateNetworkMutation();
  const [updateNetwork, { isLoading: isUpdating }] = useUpdateNetworkMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<INetworkForm>({
    values: isEditing
      ? {
          ...selectedNetwork.network!,
        }
      : { name: "", description: "", lat: 37.7749, lng: -122.4194 },
  });

  const onSubmit = async (data: INetworkForm) => {
    const payload = {
      name: data.name,
      description: data.description,
      coordinates: [data.lat, data.lng],
    };
    if (isEditing) {
      await updateNetwork({
        network_id: selectedNetwork.networkId,
        payload,
      }).unwrap();
    } else {
      await createNetwork(payload).unwrap();
    }
    reset();
    setOpenForm(false);
    refetchNetworks();
  };

  return (
    <>
      {openForm && createPortal(<Backdrop />, document.body)}
      <Sheet modal={false} open={openForm} onOpenChange={setOpenForm}>
        <SheetTrigger asChild>
          <button
            onClick={() => {
              setSelectedNetwork({
                action: null,
                networkId: null,
                network: null,
              });
            }}
            className="flex items-center gap-2 px-4 py-2 font-jakarta bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform active:scale-75 transition-transform cursor-pointer"
          >
            <Plus size={18} /> Add Network
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="overflow-y-auto z-[99999]">
          <SheetHeader>
            <SheetTitle>New Road Network</SheetTitle>
            <SheetDescription>
              Fill in the details to create a new network.
            </SheetDescription>
          </SheetHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 space-y-4 font-jakarta"
          >
            <div>
              <label className="block text-sm font-medium font-jakarta text-gray-700">
                Network Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className="mt-1 w-full font-jakarta px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 font-jakarta text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-jakarta font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="mt-1 w-full px-3 py-2 font-jakarta border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <SheetFooter>
              <button
                type="button"
                onClick={() => setOpenForm(false)}
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
                  {isUpdating ? "Updating..." : "Update Network"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transform active:scale-75 transition-transform cursor-pointer"
                >
                  {isCreating ? "Creating..." : "Create Network"}
                </button>
              )}
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NetworkForm;
