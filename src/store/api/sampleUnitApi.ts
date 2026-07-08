// sampleUnitApi

// import type { SampleUnitForm } from "@/pages/section-details/create-sample-unit-form";
import type { SampleUnit } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./base";

export const sampleUnitApi = createApi({
  reducerPath: "sampleUnitApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["SampleUnit"],
  endpoints: (builder) => ({
    createSampleUnit: builder.mutation<SampleUnit, FormData>({
      query(payload) {
        return {
          url: `sample-units`,
          method: "POST",
          // credentials: "include",
          body: payload,
        };
      },
      invalidatesTags: ["SampleUnit"],
    }),
    getSampleUnitsBySection: builder.query<SampleUnit[], string>({
      query(sectionId) {
        return {
          url: `sample-units/section/${sectionId}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "SampleUnit", id: "LIST" }],
    }),
    updateSampleUnit: builder.mutation({
      query({ sample_unit_id, payload }) {
        return {
          url: `sample-units/${sample_unit_id}`,
          method: "PATCH",
          // credentials: "include",
          body: payload,
        };
      },
      invalidatesTags: ["SampleUnit"],
    }),
    deleteSampleUnit: builder.mutation({
      query(sample_unit_id) {
        return {
          url: `sample-units/${sample_unit_id}`,
          method: "DELETE",
          // credentials: "include",
        };
      },
      invalidatesTags: ["SampleUnit"],
    }),
  }),
});

export const {
  useCreateSampleUnitMutation,
  useGetSampleUnitsBySectionQuery,
  useUpdateSampleUnitMutation,
  useDeleteSampleUnitMutation,
} = sampleUnitApi;
