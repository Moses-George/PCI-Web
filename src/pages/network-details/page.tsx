/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams, Link } from "react-router-dom";
import Spinner from "../../components/common/spinner";
import MapPreview from "../../components/common/map-preview";
import CreateSectionForm from "./create-section-form";
import { ArrowRight, Delete, Edit } from "lucide-react";
import { useGetSingleNetworkQuery } from "@/store/api/networksApi";
import type { Section } from "@/types";

const NetworkDetail = () => {
  const { networkId } = useParams<{ networkId: string }>();
  const {
    data: network,
    isLoading,
    refetch,
  } = useGetSingleNetworkQuery(networkId!);

  console.log("network", network);
  const sections = network?.sections;

  if (isLoading || !network)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6 font-jakarta">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">{network.name}</h2>
          <p className="text-gray-500 max-w-xl">{network.description}</p>
        </div>
        <CreateSectionForm
          network={network}
          networkId={networkId}
          refetch={refetch}
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
                <button className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer">
                  <Delete size={24} color="red" />
                  <span className="text-sm">Delete</span>
                </button>
                <button className="flex items-center gap-2 transform active:scale-75 transition-transform cursor-pointer">
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
  );
};

export default NetworkDetail;
