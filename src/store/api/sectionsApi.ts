/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SampleUnit, Section, SectionWithSampleUnits } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sectionsApi = createApi({
  reducerPath: "sectionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:8000/`,
  }),
  tagTypes: ["Section"],
  endpoints: (builder) => ({
    createSection: builder.mutation({
      query(payload) {
        return {
          url: "/sections",
          method: "POST",
          // credentials: "include",
          body: payload,
        };
      },
      invalidatesTags: ["Section"],
    }),
    getAllSections: builder.query<Section[], Record<string, any>>({
      query(param) {
        return {
          url: "/sections",
          method: "GET",
          params: param,
        };
      },
      providesTags: [{ type: "Section", id: "LIST" }],
    }),
    getSingleSection: builder.query<SectionWithSampleUnits, string>({
      query(section_id) {
        return {
          url: `/sections/${section_id}`,
          method: "GET",
          // params: param,
        };
      },
      // invalidatesTags: [{ type: "Transactions", id: "LIST" }],
    }),
    getSingleSectionSampleUnits: builder.query<SampleUnit[], string>({
      query(section_id) {
        return {
          url: `/sections/${section_id}/sample-units`,
          method: "GET",
          // params: param,
        };
      },
      // invalidatesTags: [{ type: "Transactions", id: "LIST" }],
    }),
    updateSection: builder.mutation({
      query({ section_id, payload }) {
        return {
          url: `/sections/${section_id}`,
          method: "PATCH",
          // credentials: "include",
          body: payload,
        };
      },
      invalidatesTags: ["Section"],
    }),
    deleteSection: builder.mutation({
      query(section_id) {
        return {
          url: `/sections/${section_id}`,
          method: "DELETE",
          // credentials: "include",
        };
      },
      invalidatesTags: ["Section"],
    }),
  }),
});

// update-display-pic

export const {
  useCreateSectionMutation,
  useGetAllSectionsQuery,
  useGetSingleSectionQuery,
  useGetSingleSectionSampleUnitsQuery,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = sectionsApi;
