/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useParams } from 'react-router-dom';
// import { useGetSectionsByNetworkQuery, useCreateSectionMutation } from '../store/api/apiSlice';
// import Spinner from '../components/common/spinner';
// import { useState } from 'react';
// import { FiPlus } from 'react-icons/fi';
// import { Link } from 'react-router-dom';

// const Sections = () => {
//   const { networkId } = useParams<{ networkId: string }>();
//   const { data: sections, isLoading } = useGetSectionsByNetworkQuery(networkId!);
//   const [createSection] = useCreateSectionMutation();
//   const [form, setForm] = useState({ name: '', widthM: 6, startChainage: 0, endChainage: 100 });

//   const handleCreate = async () => {
//     await createSection({
//       networkId: networkId!,
//       data: { ...form, areaSqm: (form.endChainage - form.startChainage) * form.widthM },
//     });
//     setForm({ name: '', widthM: 6, startChainage: 0, endChainage: 100 });
//   };

//   if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Sections in Network</h2>
//         <div className="flex gap-3 flex-wrap">
//           <input
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             placeholder="Section name"
//             className="px-3 py-2 border rounded-lg"
//           />
//           <input
//             type="number"
//             value={form.widthM}
//             onChange={(e) => setForm({ ...form, widthM: parseFloat(e.target.value) })}
//             placeholder="Width"
//             className="px-3 py-2 border rounded-lg w-20"
//           />
//           <button
//             onClick={handleCreate}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <FiPlus /> Add Section
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {sections?.map((sec) => (
//           <Link
//             key={sec.id}
//             to={`/sections/${sec.id}/sample-units`}
//             className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md"
//           >
//             <h3 className="font-semibold">{sec.name}</h3>
//             <p className="text-sm text-gray-500">Area: {sec.areaSqm} m² | Width: {sec.widthM}m</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sections;

import { useGetSectionsQuery } from "../store/api/apiSlice";
import Spinner from "@/components/common/spinner";
import MapPreview from "@/components/common/map-preview";
import { Link } from "react-router-dom";
import { MapPin, Ruler, Grid, Calendar } from "lucide-react";

const Sections = () => {
  const { data: sections, isLoading } = useGetSectionsQuery();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">All Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections?.map((sec) => (
          <div
            key={sec.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md"
          >
            <div className="h-48">
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
                  <Grid size={14} /> {sec.sampleUnitCount} sample units
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />{" "}
                  {new Date(sec.createdAt).toLocaleDateString()}
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
