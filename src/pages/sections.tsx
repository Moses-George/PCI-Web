import { useGetAllSectionsQuery } from "../store/api/sectionsApi";
import Spinner from "@/components/common/spinner";
import MapPreview from "@/components/common/map-preview";
import { Link } from "react-router-dom";
import { Ruler, Grid, Calendar } from "lucide-react";
import type { Section } from "@/types";

const Sections = () => {
  const { data: sections, isLoading } = useGetAllSectionsQuery({});
  console.log(sections);

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6 font-jakarta max-w-[62rem] mx-auto">
      <h2 className="text-2xl font-bold">All Sections</h2>
      {!sections || sections?.length == 0 ? (
        <div className="font-jakarta font-medium text-center text-gray-400 py-20">
          No Section Added
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections?.map((sec: Section) => {
            const start_coord: [number, number] = [
              sec.start_coordinates[0],
              sec.start_coordinates[1],
            ];
            const end_coord: [number, number] = [
              sec.end_coordinates[0],
              sec.end_coordinates[1],
            ];
            return (
              <div
                key={sec.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md"
              >
                <div className="h-64">
                  <MapPreview
                    center={sec.start_coordinates}
                    zoom={19}
                    height="100%"
                    className="rounded-tl-lg rounded-bl-lg"
                    sections={[
                      {
                        id: sec.id,
                        name: sec.name,
                        start: start_coord,
                        end: end_coord,
                        length: sec.length,
                        pci: sec.latest_pci ?? 0,
                        condition: sec.latest_rating,
                      },
                    ]}
                    markers={[
                      {
                        lat: sec.start_coordinates[0],
                        lng: sec.start_coordinates[1],
                      },
                      {
                        lat: sec.end_coordinates[0],
                        lng: sec.end_coordinates[1],
                      },
                    ]}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{sec.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {sec.description}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Ruler size={14} /> Width: {sec.width}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Ruler size={14} /> Length: {sec.length}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Grid size={14} /> {sec.sample_unit_count} sample units
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />{" "}
                      {new Date(sec.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Link
                      to={`/networks/${sec.networkId}/sections/${sec.id}`}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View Section →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sections;
