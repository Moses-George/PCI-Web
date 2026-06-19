import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Network, Section, SampleUnit, PCIResult, DistressInput } from '../../types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
  tagTypes: ['Network', 'Section', 'SampleUnit', 'PCI'],
  endpoints: (builder) => ({
    // Networks
    getNetworks: builder.query<Network[], void>({
      query: () => '/networks',
      providesTags: ['Network'],
    }),
    createNetwork: builder.mutation<Network, Partial<Network>>({
      query: (body) => ({
        url: '/networks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Network'],
    }),

    // Sections
    getSectionsByNetwork: builder.query<Section[], string>({
      query: (networkId) => `/networks/${networkId}/sections`,
      providesTags: ['Section'],
    }),
    createSection: builder.mutation<Section, { networkId: string; data: Partial<Section> }>({
      query: ({ networkId, data }) => ({
        url: `/networks/${networkId}/sections`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Section'],
    }),

    // Sample Units
    getSampleUnitsBySection: builder.query<SampleUnit[], string>({
      query: (sectionId) => `/sections/${sectionId}/sample-units`,
      providesTags: ['SampleUnit'],
    }),
    createSampleUnit: builder.mutation<
      SampleUnit,
      { sectionId: string; data: Partial<SampleUnit> & { distressInputs: DistressInput[] } }
    >({
      query: ({ sectionId, data }) => ({
        url: `/sections/${sectionId}/sample-units`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SampleUnit'],
    }),
    updateSampleUnitDistress: builder.mutation<
      SampleUnit,
      { sampleUnitId: string; distressInputs: DistressInput[] }
    >({
      query: ({ sampleUnitId, distressInputs }) => ({
        url: `/sample-units/${sampleUnitId}`,
        method: 'PATCH',
        body: { distressInputs },
      }),
      invalidatesTags: ['SampleUnit'],
    }),

    // PCI
    calculatePCI: builder.query<PCIResult, string>({
      query: (sectionId) => `/sections/${sectionId}/calculate-pci`,
      providesTags: ['PCI'],
    }),

    // Image Upload (Trigger YOLO)
    uploadImages: builder.mutation<
      { message: string; taskId: string },
      { sampleUnitId: string; files: File[] }
    >({
      query: ({ sampleUnitId, files }) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        return {
          url: `/sample-units/${sampleUnitId}/upload-images`,
          method: 'POST',
          body: formData,
          // No need to set content-type; FormData handles it
        };
      },
    }),
  }),
});

export const {
  useGetNetworksQuery,
  useCreateNetworkMutation,
  useGetSectionsByNetworkQuery,
  useCreateSectionMutation,
  useGetSampleUnitsBySectionQuery,
  useCreateSampleUnitMutation,
  useUpdateSampleUnitDistressMutation,
  useLazyCalculatePCIQuery,
  useUploadImagesMutation,
} = apiSlice;