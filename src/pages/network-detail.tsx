/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams, Link } from "react-router-dom";
import {
  useGetNetworksQuery,
  useGetSectionsByNetworkQuery,
  useCreateSectionMutation,
} from "../store/api/apiSlice";
import Spinner from "../components/common/spinner";
import MapPreview from "../components/common/map-preview";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "../components/ui/sheet";
import { Plus, MapPin, Ruler, Calendar, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

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

const NetworkDetail = () => {
  const { networkId } = useParams<{ networkId: string }>();
  const { data: networks } = useGetNetworksQuery();
  const network = networks?.find((n) => n.id === networkId);
  const {
    data: sections,
    isLoading,
    refetch,
  } = useGetSectionsByNetworkQuery(networkId!);
  const [createSection, { isLoading: isCreating }] = useCreateSectionMutation();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionForm>({
    defaultValues: {
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
    await createSection({
      networkId: networkId!,
      data: {
        name: data.name,
        description: data.description,
        coordinates: [data.lat, data.lng],
        chainageStart: data.chainageStart,
        chainageEnd: data.chainageEnd,
        width: data.width,
        length: data.length,
        pixelToMmFactor: data.pixelToMmFactor,
      },
    }).unwrap();
    reset();
    setOpen(false);
    refetch();
  };

  if (isLoading || !network)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{network.name}</h2>
          <p className="text-gray-500">{network.description}</p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={18} /> Add Section
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-md overflow-y-auto"
          >
            <SheetHeader>
              <SheetTitle>New Section in {network.name}</SheetTitle>
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
                    Chainage Start (km)
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
                    Chainage End (km)
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
              <div className="grid grid-cols-3 gap-4">
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
                    Length (km)
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
              </div>
              <SheetFooter>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create Section"}
                </button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Network Map & Analytics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h4 className="font-medium mb-2">Network Location</h4>
          <div className="h-64">
            <MapPreview center={network.coordinates} zoom={11} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h4 className="font-medium mb-2">Analytics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Total Sections</p>
              <p className="text-2xl font-bold">{network.totalSections}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Sample Units</p>
              <p className="text-2xl font-bold">
                {sections?.reduce((acc, s) => acc + s.sampleUnitCount, 0) || 0}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Avg. Width</p>
              <p className="text-2xl font-bold">
                {sections?.length
                  ? (
                      sections.reduce((acc, s) => acc + s.width, 0) /
                      sections.length
                    ).toFixed(1)
                  : 0}{" "}
                m
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Total Length</p>
              <p className="text-2xl font-bold">
                {sections?.reduce((acc, s) => acc + s.length, 0).toFixed(1) ||
                  0}{" "}
                km
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* List of Sections */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Sections in this Network</h3>
        {sections?.length === 0 && (
          <p className="text-gray-400">No sections yet. Add one above.</p>
        )}
        {sections?.map((sec) => (
          <div
            key={sec.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-6 hover:shadow-md transition-shadow"
          >
            <div className="w-40 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <MapPreview center={sec.coordinates} zoom={14} height="100%" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{sec.name}</h4>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {sec.description}
                  </p>
                </div>
                <Link
                  to={`/networks/${networkId}/sections/${sec.id}`}
                  className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
                >
                  View <ArrowRight size={16} />
                </Link>
              </div>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                <span>Width: {sec.width}m</span>
                <span>Length: {sec.length}km</span>
                <span>
                  Chainage: {sec.chainageStart}-{sec.chainageEnd}km
                </span>
                <span>Sample Units: {sec.sampleUnitCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkDetail;
