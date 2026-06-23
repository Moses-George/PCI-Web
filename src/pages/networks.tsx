/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from 'react';
// import { useGetNetworksQuery, useCreateNetworkMutation } from '../store/api/apiSlice';
// import Spinner from '../components/common/spinner';
// import { FiPlus } from 'react-icons/fi';
// import { Link } from 'react-router-dom';

// const Networks = () => {
//   const { data: networks, isLoading } = useGetNetworksQuery();
//   const [createNetwork] = useCreateNetworkMutation();
//   const [newName, setNewName] = useState('');

//   const handleCreate = async () => {
//     if (!newName.trim()) return;
//     await createNetwork({ name: newName, location: 'Unknown', totalLengthKm: 0 });
//     setNewName('');
//   };

//   if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Road Networks</h2>
//         <div className="flex gap-3">
//           <input
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//             placeholder="Network name..."
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//           />
//           <button
//             onClick={handleCreate}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <FiPlus /> Create
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {networks?.map((net) => (
//           <Link
//             key={net.id}
//             to={`/networks/${net.id}/sections`}
//             className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
//           >
//             <h3 className="font-semibold text-lg">{net.name}</h3>
//             <p className="text-gray-500 text-sm">{net.location}</p>
//             <p className="text-gray-500 text-sm">{net.totalLengthKm} km</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Networks;

import { useState } from "react";
import {
  useGetAllNetworksQuery,
  useCreateNetworkMutation,
} from "@/store/api/networksApi";
import Spinner from "@/components/common/spinner";
import MapPreview from "@/components/common/map-preview";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "../components/ui/sheet";
import {
  Plus,
  MapPin,
  Calendar,
  Network as NetworkIcon,
  Delete,
  Edit,
} from "lucide-react";
import { useForm } from "react-hook-form";
import type { Network } from "@/types";

interface NetworkForm {
  name: string;
  description: string;
  lat: number;
  lng: number;
}

const Networks = () => {
  const { data: networks, isLoading, refetch } = useGetAllNetworksQuery({});
  const [createNetwork, { isLoading: isCreating }] = useCreateNetworkMutation();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NetworkForm>({
    defaultValues: { name: "", description: "", lat: 37.7749, lng: -122.4194 },
  });

  const onSubmit = async (data: NetworkForm) => {
    await createNetwork({
      name: data.name,
      description: data.description,
      coordinates: [data.lat, data.lng],
    }).unwrap();
    reset();
    setOpen(false);
    refetch();
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-jakarta">Road Networks</h2>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 font-jakarta bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform active:scale-75 transition-transform cursor-pointer">
              <Plus size={18} /> Add Network
            </button>
          </SheetTrigger>
          <SheetContent side="right">
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
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transform active:scale-75 transition-transform cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transform active:scale-75 transition-transform cursor-pointer"
                >
                  {isCreating ? "Creating..." : "Create Network"}
                </button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Analytics summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-jakarta text-gray-500">Total Networks</p>
          <p className="text-2xl font-jakarta font-bold">
            {networks?.length || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-jakarta text-gray-500">Total Sections</p>
          <p className="text-2xl font-jakarta font-bold">
            {networks?.reduce(
              (acc: number, n: Network) => acc + n.total_sections,
              0,
            ) || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-jakarta text-gray-500">
            Networks Analyzed
          </p>
          <p className="text-2xl font-jakarta font-bold">
            {networks?.filter((n: Network) => n.total_sections > 0).length || 0}
          </p>
        </div>
      </div>

      {/* Network Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {networks?.map((net: Network) => (
          <div
            key={net.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-44">
              <MapPreview
                center={net.coordinates}
                zoom={12}
                markers={[{ lat: net.coordinates[0], lng: net.coordinates[1] }]}
                height="100%"
              />
            </div>
            <div className="p-4 space-y-4">
              <h3 className="font-semibold font-jakarta text-lg">{net.name}</h3>
              <p className="text-sm font-jakarta text-gray-500 line-clamp-2">
                {net.description}
              </p>
              <div className="mt-2 font-jakarta flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {net.coordinates[0].toFixed(2)},{" "}
                  {net.coordinates[1].toFixed(2)}
                </span>
                <span className="flex items-center gap-1">
                  <NetworkIcon size={14} /> {net.total_sections} sections
                </span>
              </div>
              <div className="mt-3 font-jakarta flex justify-between items-center">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={12} />{" "}
                  {new Date(net.created_at).toLocaleDateString()}
                </span>
                <a
                  href={`/networks/${net.id}`}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  View Details →
                </a>
              </div>
              <div className="flex items-center gap-3 font-jakarta">
                <div className="font-bold text-sm">Actions:</div>
                <button className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer">
                  <Delete size={24} color="red" />
                  <span className="text-sm">Delete</span>
                </button>
                <button className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer">
                  <Edit size={22} color="blue" />
                  <span className="text-sm">Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Networks;
