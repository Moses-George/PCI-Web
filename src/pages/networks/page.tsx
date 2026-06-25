import Spinner from "@/components/common/spinner";
import MapPreview from "@/components/common/map-preview";
import {
  MapPin,
  Calendar,
  Network as NetworkIcon,
  Delete,
  Edit,
} from "lucide-react";
import type { Network } from "@/types";
import {
  useDeleteNetworkMutation,
  useGetAllNetworksQuery,
} from "@/store/api/networksApi";
// import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmDeletion from "@/components/common/confirm-deletion";
import { useState } from "react";
import NetworkForm from "./network-form";
import { toast } from "react-toastify";

export interface INetworkForm {
  name: string;
  description: string;
  lat: number;
  lng: number;
}

type ActionType = "delete" | "edit" | null;

export interface ISelectedNetwork {
  action: ActionType;
  networkId: string | null;
  network: INetworkForm | null;
}

const Networks = () => {
  const [openDeleteModal, setOpenDeleModal] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<ISelectedNetwork>({
    action: null,
    networkId: null,
    network: null,
  });

  const { data: networks, isLoading, refetch } = useGetAllNetworksQuery({});
  const [deleteNetwork, { isLoading: isDeleting }] = useDeleteNetworkMutation();

  // const isDeleting = Boolean(
  //   selectedNetwork.network && selectedNetwork.action === "delete",
  // );
  const isEditing = Boolean(
    selectedNetwork.network && selectedNetwork.action === "edit",
  );

  const handleAction = (network: Network, action: ActionType) => {
    setSelectedNetwork({
      action,
      networkId: network.id,
      network: {
        name: network.name,
        description: network.description,
        lat: network.coordinates[0],
        lng: network.coordinates[1],
      },
    });
    if (action === "edit") {
      setOpenForm(true);
    }
    if (action === "delete") {
      setOpenDeleModal(true);
    }
  };

  const deleteRoadNetwork = async () => {
    if (selectedNetwork.networkId) {
      await deleteNetwork(selectedNetwork.networkId).unwrap();
      refetch();
      setOpenDeleModal(false);
    } else {
      toast.warning("No Network Selected. Please Reselect desired Network", {
        hideProgressBar: true,
        autoClose: 3000,
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <>
      {openDeleteModal && (
        <ConfirmDeletion
          confirmAction={deleteRoadNetwork}
          closeModal={() => setOpenDeleModal(false)}
          loading={isDeleting}
          header={"You're About to Delete a Network"}
          message={`Are you sure you want to delete ${selectedNetwork.network?.name} Network ? Please note that all sections in this network and sample units in each sections will also be deleted permanently. This action cannot be undone`}
        />
      )}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold font-jakarta">Road Networks</h2>
          <NetworkForm
            refetchNetworks={refetch}
            isEditing={isEditing}
            openForm={openForm}
            setOpenForm={setOpenForm}
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
          />
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
              {networks?.filter((n: Network) => n.total_sections > 0).length ||
                0}
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
                  markers={[
                    { lat: net.coordinates[0], lng: net.coordinates[1] },
                  ]}
                  height="100%"
                />
              </div>
              <div className="p-4 space-y-4">
                <h3 className="font-semibold font-jakarta text-lg">
                  {net.name}
                </h3>
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
                  <button
                    onClick={() => handleAction(net, "delete")}
                    className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer"
                  >
                    <Delete size={24} color="red" />
                    <span className="text-sm">Delete</span>
                  </button>
                  <button
                    onClick={() => handleAction(net, "edit")}
                    className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer"
                  >
                    <Edit size={22} color="blue" />
                    <span className="text-sm">Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Networks;
