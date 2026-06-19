// import { useGetNetworksQuery } from '../store/api/apiSlice';
// import Spinner from '../components/common/spinner';
// import { FiMap, FiGrid, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

// const Dashboard = () => {
//   const { data: networks, isLoading } = useGetNetworksQuery();

//   if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

//   const stats = [
//     { label: 'Total Networks', value: networks?.length || 0, icon: <FiMap />, color: 'bg-blue-500' },
//     { label: 'Total Sections', value: 24, icon: <FiGrid />, color: 'bg-green-500' },
//     { label: 'Poor Condition', value: 5, icon: <FiAlertTriangle />, color: 'bg-red-500' },
//     { label: 'Good Condition', value: 12, icon: <FiCheckCircle />, color: 'bg-teal-500' },
//   ];

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold">Dashboard Overview</h2>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {stats.map((stat) => (
//           <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
//             <div className={`${stat.color} p-3 rounded-full text-white text-xl`}>{stat.icon}</div>
//             <div>
//               <p className="text-gray-500 text-sm">{stat.label}</p>
//               <p className="text-2xl font-bold">{stat.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="grid grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
//           🗺️ Map View (Coming Soon)
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
//           📊 PCI Distribution Chart (Coming Soon)
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useGetNetworksQuery, useGetSectionsQuery } from '../store/api/apiSlice';
import Spinner from '../components/common/spinner';
import { Map, Grid, AlertTriangle, CheckCircle } from 'lucide-react';
// import { FiMap, FiGrid, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const Dashboard = () => {
  const { data: networks, isLoading: netLoading } = useGetNetworksQuery();
  const { data: sections, isLoading: secLoading } = useGetSectionsQuery();

  if (netLoading || secLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const stats = [
    { label: 'Total Networks', value: networks?.length || 0, icon: <Map />, color: 'bg-blue-500' },
    { label: 'Total Sections', value: sections?.length || 0, icon: <Grid />, color: 'bg-green-500' },
    { label: 'Sections with Issues', value: sections?.filter(s => s.sampleUnitCount > 0).length || 0, icon: <AlertTriangle />, color: 'bg-yellow-500' },
    { label: 'Analyzed Sections', value: sections?.filter(s => s.sampleUnitCount > 2).length || 0, icon: <CheckCircle />, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-full text-white`}>{stat.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
          🗺️ Global Map (Coming Soon)
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
          📊 PCI Distribution (Coming Soon)
        </div>
      </div>
    </div>
  );
};

export default Dashboard;