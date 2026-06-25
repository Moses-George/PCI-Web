/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams, Link } from "react-router-dom";
import Spinner from "../../components/common/spinner";
import MapPreview from "../../components/common/map-preview";
import CreateSectionForm from "./create-section-form";
import { ArrowRight, Delete, Edit } from "lucide-react";
import { useGetSingleNetworkQuery } from "@/store/api/networksApi";
import type { Section } from "@/types";
import { useState } from "react";
import ConfirmDeletion from "@/components/common/confirm-deletion";
import { toast } from "react-toastify";
import { useDeleteSectionMutation } from "@/store/api/sectionsApi";

interface ISectionForm {
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

type ActionType = "delete" | "edit" | null;

export interface ISelectedSection {
  action: ActionType;
  sectionId: string | null;
  section: ISectionForm | null;
}

const NetworkDetail = () => {
  const { networkId } = useParams<{ networkId: string }>();
  const [selectedSection, setSelectedSection] = useState<ISelectedSection>({
    action: null,
    sectionId: null,
    section: null,
  });
  const [openDeleteModal, setOpenDeleModal] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const {
    data: network,
    isLoading,
    refetch,
  } = useGetSingleNetworkQuery(networkId!);
  // console.log("network", network);
  const sections = network?.sections;

  const [deleteSection, { isLoading: isDeleting }] = useDeleteSectionMutation();

  const isEditing = Boolean(
    selectedSection.section && selectedSection.action === "edit",
  );

  const handleAction = (section: Section, action: ActionType) => {
    setSelectedSection({
      action,
      sectionId: network.id,
      section: {
        name: section.name,
        description: section.description,
        lat: section.coordinates[0],
        lng: section.coordinates[1],
        chainageStart: section.chainage_start,
        chainageEnd: section.chainage_end,
        width: section.width,
        length: section.length,
        pixelToMmFactor: section.pixel_to_mm_factor,
      },
    });
    if (action === "edit") {
      setOpenForm(true);
    }
    if (action === "delete") {
      setOpenDeleModal(true);
    }
  };

  const deleteSelectedSection = async () => {
    if (selectedSection.sectionId) {
      await deleteSection(selectedSection.sectionId).unwrap();
      refetch();
      setOpenDeleModal(false);
    } else {
      toast.warning("No Network Selected. Please Reselect desired Network", {
        hideProgressBar: true,
        autoClose: 3000,
      });
    }
  };

  if (isLoading || !network)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <>
      {openDeleteModal && (
        <ConfirmDeletion
          confirmAction={deleteSelectedSection}
          closeModal={() => setOpenDeleModal(false)}
          loading={isDeleting}
          header={"You're About to Delete a Section"}
          message={`Are you sure you want to delete ${selectedSection.section?.name} Section ? Please note that all sample units in this section will also be deleted permanently. This action cannot be undone`}
        />
      )}
      <div className="space-y-6 font-jakarta">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{network.name}</h2>
            <p className="text-gray-500 max-w-xl">{network.description}</p>
          </div>
          <CreateSectionForm
            network={network}
            networkId={networkId}
            refetchNetwork={refetch}
            isEditing={isEditing}
            openForm={openForm}
            setOpenForm={setOpenForm}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />
        </div>

        {/* Network Map & Analytics */}
        <div className="grid grid-cols-[6fr_4fr] gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <h4 className="font-medium p-4">Network Location</h4>
            <div className="h-80">
              <MapPreview
                center={network.coordinates}
                zoom={11}
                height="360px"
                className="rounded-b-md h-full"
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h4 className="font-medium mb-2">Analytics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Total Sections</p>
                <p className="text-2xl font-bold">{network.total_sections}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Sample Units</p>
                <p className="text-2xl font-bold">
                  {sections?.reduce(
                    (acc: number, s: Section) => acc + s.sample_unit_count,
                    0,
                  ) || 0}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Avg. Width</p>
                <p className="text-2xl font-bold">
                  {sections?.length
                    ? (
                        sections.reduce(
                          (acc: number, s: Section) => acc + s.width,
                          0,
                        ) / sections.length
                      ).toFixed(1)
                    : 0}{" "}
                  m
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Total Length</p>
                <p className="text-2xl font-bold">
                  {sections
                    ?.reduce((acc: number, s: Section) => acc + s.length, 0)
                    .toFixed(1) || 0}{" "}
                  m
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* List of Sections */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Sections in this Network</h3>
          {sections?.length === 0 && (
            <div className="w-full h-64 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
              <p className="text-gray-400">No sections yet. Add one above.</p>
            </div>
          )}
          {sections?.map((sec: Section) => (
            <div
              key={sec.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200  flex items-center gap-6 hover:shadow-md transition-shadow"
            >
              <div className="h-80 flex-1 flex-shrink-0 overflow-hidden rounded-tl-lg rounded-bl-lg ">
                <MapPreview
                  center={sec.coordinates}
                  zoom={14}
                  height="100%"
                  className="rounded-tl-lg rounded-bl-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{sec.name}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {sec.description}
                    </p>
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                  <span>Width: {sec.width}m</span>
                  <span>Length: {sec.length}m</span>
                  <span>
                    Chainage: {sec.chainage_start}-{sec.chainage_end}m
                  </span>
                  <span>Sample Units: {sec.sample_unit_count}</span>
                </div>
                <div className="flex items-center gap-3 font-jakarta mt-5">
                  <div className="font-bold text-sm">Actions:</div>
                  <button
                    onClick={() => handleAction(sec, "delete")}
                    className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer"
                  >
                    <Delete size={24} color="red" />
                    <span className="text-sm">Delete</span>
                  </button>
                  <button
                    onClick={() => handleAction(sec, "edit")}
                    className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer"
                  >
                    <Edit size={22} color="blue" />
                    <span className="text-sm">Edit</span>
                  </button>
                </div>
                <Link
                  to={`/networks/${networkId}/sections/${sec.id}`}
                  className="text-blue-600 hover:underline text-sm mt-4 font-medium flex items-center gap-1"
                >
                  View <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NetworkDetail;
