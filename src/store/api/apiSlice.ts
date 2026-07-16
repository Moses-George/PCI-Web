import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Network, Section, SampleUnit} from "../../types";
import { VITE_ENDPOINT_URL } from "@/lib/variables";


const isDummy = true; // toggle to false when real backend is ready

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: VITE_ENDPOINT_URL }),
  tagTypes: ["Network", "Section", "SampleUnit", "PCI"],
  endpoints: (builder) => ({
    // Networks
    getNetworks: builder.query<Network[], void>({
      queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
        // if (!isDummy) {
        //   await new Promise((resolve) => setTimeout(resolve, 500));
        //   return { data: dummyNetworks };
        // }
        const result = await baseQuery({ url: "/networks" });
        if (result.error) return { error: result.error };
        return { data: result.data as Network[] };
      },
      providesTags: ["Network"],
    }),
    createNetwork: builder.mutation<Network, Partial<Network>>({
      queryFn: async (body, _api, _extraOptions, baseQuery) => {
        // if (!isDummy) {
        //   await new Promise((resolve) => setTimeout(resolve, 500));
        //   const newNetwork: Network = {
        //     id: `n${Date.now()}`,
        //     name: body.name || "New Network",
        //     description: body.description || "",
        //     coordinates: body.coordinates || [0, 0],
        //     total_sections: 0,
        //     created_at: new Date().toISOString(),
        //   };
        //   dummyNetworks.push(newNetwork);
        //   return { data: newNetwork };
        // }
        const result = await baseQuery({
          url: "/networks",
          method: "POST",
          body,
        });
        if (result.error) return { error: result.error };
        return { data: result.data as Network };
      },
      invalidatesTags: ["Network"],
    }),

    // Sections
    getSections: builder.query<Section[], void>({
      queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
        // if (isDummy) {
        //   await new Promise((resolve) => setTimeout(resolve, 500));
        //   return { data: dummySections };
        // }
        const result = await baseQuery({ url: "/sections" });
        if (result.error) return { error: result.error };
        return { data: result.data as Section[] };
      },
      providesTags: ["Section"],
    }),
    getSectionsByNetwork: builder.query<Section[], string>({
      queryFn: async (networkId, _api, _extraOptions, baseQuery) => {
        // if (!isDummy) {
        //   await new Promise((resolve) => setTimeout(resolve, 500));
        //   return {
        //     data: dummySections.filter((s) => s.networkId === networkId),
        //   };
        // }
        const result = await baseQuery({
          url: `/networks/${networkId}`,
        });
        if (result.error) return { error: result.error };
        return { data: result.data as Section[] };
      },
      providesTags: ["Section"],
    }),
    createSection: builder.mutation<
      Section,
      { networkId: string; data: Partial<Section> }
    >({
      queryFn: async ({ networkId, data }, _api, _extraOptions, baseQuery) => {
        // if (!isDummy) {
        //   await new Promise((resolve) => setTimeout(resolve, 500));
        //   const newSection: Section = {
        //     id: `s${Date.now()}`,
        //     networkId,
        //     name: data.name || "New Section",
        //     description: data.description || "",
        //     coordinates: data.coordinates || [0, 0],
        //     chainage_start: data.chainage_start || 0,
        //     chainage_end: data.chainage_end || 1,
        //     width: data.width || 10,
        //     length: data.length || 1,
        //     pixel_to_mm_factor: data.pixel_to_mm_factor || 0.5,
        //     area: (data.length || 1) * (data.width || 10) * 1000,
        //     sample_unit_count: 0,
        //     created_at: new Date().toISOString(),
        //   };
        //   dummySections.push(newSection);
        //   const network = dummyNetworks.find((n) => n.id === networkId);
        //   if (network) network.total_sections += 1;
        //   return { data: newSection };
        // }
        const result = await baseQuery({
          url: `/sections`,
          method: "POST",
          body: data,
          params: { network_id: networkId },
        });
        if (result.error) return { error: result.error };
        return { data: result.data as Section };
      },
      invalidatesTags: ["Section", "Network"],
    }),

    // Sample Units
    getSampleUnitsBySection: builder.query<SampleUnit[], string>({
      queryFn: async (sectionId, _api, _extraOptions, baseQuery) => {
        // if (isDummy) {
        //   await new Promise((resolve) => setTimeout(resolve, 500));
        //   return {
        //     data: dummySampleUnits.filter((su) => su.section_id === sectionId),
        //   };
        // }
        const result = await baseQuery({
          url: `/sections/${sectionId}/sample-units`,
        });
        if (result.error) return { error: result.error };
        return { data: result.data as SampleUnit[] };
      },
      providesTags: ["SampleUnit"],
    }),
    createSampleUnit: builder.mutation<
      SampleUnit,
      {
        sectionId: string;
        data: Partial<SampleUnit> & { imageFile: File; note: string };
      }
    >({
      queryFn: async ({ sectionId, data }, _api, _extraOptions, baseQuery) => {
        // if (isDummy) {
        //   await new Promise((resolve) => setTimeout(resolve, 500));
        //   const newUnit: SampleUnit = { 
        //     id: `su${Date.now()}`,
        //     section_id: sectionId,
        //     name: data.name || `SU-${dummySampleUnits.length + 1}`,
        //     original_image: URL.createObjectURL(data.imageFile),
        //     predicted_image: undefined,
        //     pixel_to_mm_factor: data.pixel_to_mm_factor || 0.5,
        //     distress_type: data.distress_type || "Unknown",
        //     severity: data.severity || "low",
        //     pothole_depth: data.pothole_depth,
        //     note: data.note || "",
        //     detections: [],
        //     images: [],
        //     inference_status: "done",
        //     created_at: new Date().toISOString(),
        //   };
        //   dummySampleUnits.push(newUnit);
        //   const section = dummySections.find((s) => s.id === sectionId);
        //   if (section) section.sample_unit_count += 1;
        //   return { data: newUnit };
        // }
        const formData = new FormData();
        Object.entries(data).forEach(([key, val]) => {
          if (key !== "imageFile") formData.append(key, String(val));
        });
        formData.append("image", data.imageFile);
        const result = await baseQuery({
          url: `/sections/${sectionId}/sample-units`,
          method: "POST",
          body: formData,
          // Do not set Content-Type; browser will set it with boundary
        });
        if (result.error) return { error: result.error };
        return { data: result.data as SampleUnit };
      },
      invalidatesTags: ["SampleUnit", "Section"],
    }),

    // PCI calculation (lazy query)
    calculatePCI: builder.query({
      queryFn: async (sectionId, _api, _extraOptions, baseQuery) => {
        if (isDummy) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const pci = Math.floor(Math.random() * 50 + 40);
          // eslint-disable-next-line no-useless-assignment
          let rating = "Good";
          if (pci < 40) rating = "Failed";
          else if (pci < 55) rating = "Very Poor";
          else if (pci < 70) rating = "Poor";
          else if (pci < 85) rating = "Satisfactory";
          else rating = "Good";
          return {
            data: {
              sectionId,
              finalPci: pci,
              rating,
              deductValues: [10, 8, 5, 3, 2],
              cdv: 18,
              calculatedAt: new Date().toISOString(),
            },
          };
        }
        const result = await baseQuery({
          url: `/sections/${sectionId}/calculate-pci`,
        });
        if (result.error) return { error: result.error };
        return { data: result.data  };
      },
      providesTags: ["PCI"],
    }),

    // Generate Report (mock)
    generateReport: builder.mutation<
      { message: string; reportId: string },
      { sectionId: string; reportName: string; options: string[] }
    >({
      queryFn: async (
        { sectionId, reportName, options },
        _api,
        _extraOptions,
        baseQuery,
      ) => {
        if (isDummy) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return {
            data: { message: "Report generated", reportId: `r${Date.now()}` },
          };
        }
        const result = await baseQuery({
          url: `/sections/${sectionId}/generate-report`,
          method: "POST",
          body: { reportName, options },
        });
        if (result.error) return { error: result.error };
        return { data: result.data as { message: string; reportId: string } };
      },
      invalidatesTags: ["PCI"],
    }),
  }),
});

export const {
  useGetNetworksQuery,
  useCreateNetworkMutation,
  useGetSectionsQuery,
  useGetSectionsByNetworkQuery,
  useCreateSectionMutation,
  useGetSampleUnitsBySectionQuery,
  useCreateSampleUnitMutation,
  useLazyCalculatePCIQuery,
  useGenerateReportMutation,
} = apiSlice;
