// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useParams } from "react-router-dom";
// import {
//   useGetSampleUnitsBySectionQuery,
//   useCreateSampleUnitMutation,
//   useUpdateSampleUnitDistressMutation,
//   useLazyCalculatePCIQuery,
//   useUploadImagesMutation,
// } from "../store/api/apiSlice";
// import Spinner from "../components/common/spinner";
// import DistressDynamicInput from "../components/forms/distress-dynamic-Input";
// import { useForm, useFieldArray } from "react-hook-form";
// import { useState } from "react";
// import { FiUpload, FiRefreshCw } from "react-icons/fi";
// import { toast } from "react-toastify"; // You can add react-hot-toast or just alert

// interface FormValues {
//   unitNumber: string;
//   area: number;
//   isRandom: boolean;
//   distressInputs: {
//     distressType: string;
//     severity: "L" | "M" | "H";
//     quantity: number;
//   }[];
// }

// const SampleUnitDetail = () => {
//   const { sectionId } = useParams<{ sectionId: string }>();
//   const {
//     data: sampleUnits,
//     isLoading,
//     refetch,
//   } = useGetSampleUnitsBySectionQuery(sectionId!);
//   const [createSampleUnit] = useCreateSampleUnitMutation();
//   const [updateDistress] = useUpdateSampleUnitDistressMutation();
//   const [triggerPCI] = useLazyCalculatePCIQuery();
//   const [uploadImages] = useUploadImagesMutation();

//   const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
//   const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);

//   const {
//     register,
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: {
//       unitNumber: "",
//       area: 0,
//       isRandom: true,
//       distressInputs: [],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "distressInputs",
//   });

//   // --- Handlers ---
//   const onSubmit = async (data: FormValues) => {
//     try {
//       await createSampleUnit({
//         sectionId: sectionId!,
//         data: {
//           unitNumber: data.unitNumber,
//           area: data.area,
//           isRandom: data.isRandom,
//           distressInputs: data.distressInputs,
//         },
//       }).unwrap();
//       reset();
//       refetch();
//       toast.success("Sample Unit created with n distress inputs!");
//     } catch (error: any) {
//       toast.error("Failed to create");
//       console.log(error);
//     }
//   };

//   const handleUpdateDistress = async (
//     unitId: string,
//     distressInputs: any[],
//   ) => {
//     await updateDistress({ sampleUnitId: unitId, distressInputs }).unwrap();
//     refetch();
//     toast.success("Distress inputs updated!");
//   };

//   const handleCalculatePCI = async (sectionId: string) => {
//     const result = await triggerPCI(sectionId).unwrap();
//     toast.success(`PCI Calculated: ${result.finalPci} (${result.rating})`);
//   };

//   const handleUpload = async (sampleUnitId: string) => {
//     if (!uploadFiles) return toast.error("Select files first");
//     await uploadImages({
//       sampleUnitId,
//       files: Array.from(uploadFiles),
//     }).unwrap();
//     toast.success("Images uploaded, YOLO processing started!");
//     setUploadFiles(null);
//   };

//   if (isLoading)
//     return (
//       <div className="flex justify-center py-20">
//         <Spinner />
//       </div>
//     );

//   const selectedUnit = sampleUnits?.find((u) => u.id === selectedUnitId);

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold">Sample Units (PCI per Section)</h2>

//       {/* Create Form with Dynamic Fields */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//         <h3 className="font-semibold mb-4">➕ Add New Sample Unit</h3>
//         <form onSubmit={() => handleSubmit(onSubmit)} className="space-y-4">
//           <div className="grid grid-cols-3 gap-4">
//             <input
//               {...register("unitNumber", { required: true })}
//               placeholder="Unit Number"
//               className="px-3 py-2 border rounded-lg"
//             />
//             <input
//               type="number"
//               {...register("area", { required: true, min: 1 })}
//               placeholder="Area (sqm)"
//               className="px-3 py-2 border rounded-lg"
//             />
//             <label className="flex items-center gap-2">
//               <input type="checkbox" {...register("isRandom")} />
//               Random Sample
//             </label>
//           </div>

//           {/* THE "N INPUT FIELDS" */}
//           <DistressDynamicInput
//             fields={fields}
//             append={append}
//             remove={remove}
//             register={register}
//             errors={errors}
//             control={control}
//           />

//           <button
//             type="submit"
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Create Sample Unit
//           </button>
//         </form>
//       </div>

//       {/* List of Sample Units */}
//       <div className="space-y-4">
//         <h3 className="font-semibold">Existing Sample Units</h3>
//         {sampleUnits?.map((unit) => (
//           <div
//             key={unit.id}
//             className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
//           >
//             <div className="flex justify-between items-center">
//               <div>
//                 <span className="font-bold text-lg">#{unit.unitNumber}</span>
//                 <span className="ml-4 text-sm text-gray-500">
//                   Area: {unit.area} m²
//                 </span>
//                 <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
//                   {unit.isRandom ? "Random" : "Fixed"}
//                 </span>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setSelectedUnitId(unit.id)}
//                   className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
//                 >
//                   Edit Distress
//                 </button>
//                 <button
//                   onClick={() => handleCalculatePCI(sectionId!)}
//                   className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center gap-1"
//                 >
//                   <FiRefreshCw /> Calc PCI
//                 </button>
//               </div>
//             </div>

//             {/* Display current distress inputs */}
//             {unit.distressInputs.length > 0 && (
//               <div className="mt-3 bg-gray-50 p-3 rounded-lg">
//                 <p className="text-xs text-gray-500 font-medium">
//                   Current Distress Inputs:
//                 </p>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {unit.distressInputs.map((d, i) => (
//                     <span
//                       key={i}
//                       className="bg-white px-2 py-1 text-xs border rounded shadow-sm"
//                     >
//                       {d.distressType} ({d.severity}) = {d.quantity}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Image Upload Section */}
//             <div className="mt-4 flex items-center gap-4 border-t pt-4">
//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={(e) => setUploadFiles(e.target.files)}
//                 className="text-sm"
//               />
//               <button
//                 onClick={() => handleUpload(unit.id)}
//                 className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
//               >
//                 <FiUpload /> Upload & Run YOLO
//               </button>
//               <span className="text-xs text-gray-400">
//                 (Processes in background)
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Edit Distress Modal (Simulated inline) */}
//       {selectedUnit && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
//             <h3 className="text-xl font-bold mb-4">
//               Edit Distress Inputs for #{selectedUnit.unitNumber}
//             </h3>
//             {/* We reuse the dynamic form, but it needs to be properly initialized. For brevity, we just show a reset button */}
//             <p className="text-gray-600 mb-4">
//               Currently {selectedUnit.distressInputs.length} distress entries.
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={async () => {
//                   // For demo, just copying existing array to update
//                   await handleUpdateDistress(
//                     selectedUnit.id,
//                     selectedUnit.distressInputs,
//                   );
//                   setSelectedUnitId(null);
//                 }}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg"
//               >
//                 Save Changes (Mock)
//               </button>
//               <button
//                 onClick={() => setSelectedUnitId(null)}
//                 className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
//               >
//                 Close
//               </button>
//             </div>
//             <div className="mt-4 text-sm text-gray-400">
//               * Full edit would populate the DynamicForm with existing values
//               using React Hook Form's reset().
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SampleUnitDetail;
