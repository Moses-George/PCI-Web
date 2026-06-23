/* eslint-disable @typescript-eslint/no-unused-vars */
import { useGetAllSectionsQuery } from "../store/api/sectionsApi";
import Spinner from "@/components/common/spinner";
import MapPreview from "@/components/common/map-preview";
import { Link } from "react-router-dom";
import { MapPin, Ruler, Grid, Calendar } from "lucide-react";
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
    <div className="space-y-6 font-jakarta">
      <h2 className="text-2xl font-bold">All Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections?.map((sec: Section) => (
          <div
            key={sec.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md"
          >
            <div className="h-64">
              <MapPreview
                center={sec.coordinates}
                zoom={13}
                markers={[{ lat: sec.coordinates[0], lng: sec.coordinates[1] }]}
                height="100%"
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
                  <Ruler size={14} /> Length: {sec.length}km
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
        ))}
      </div>
    </div>
  );
};

export default Sections;
