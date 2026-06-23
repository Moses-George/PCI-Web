// sampleUnitApi

// import type { SampleUnitForm } from "@/pages/section-details/create-sample-unit-form";
import type { SampleUnit } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sampleUnitApi = createApi({
  reducerPath: "sampleUnitApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:8000/`,
  }),
  tagTypes: ["SampleUnit"],
  endpoints: (builder) => ({
    createSampleUnit: builder.mutation<SampleUnit, FormData>({
      query(payload) {
        return {
          url: `sample-units`,
          method: "POST",
          // credentials: "include",
          body: payload,
        //   headers: {
        //     // Remove the default Content-Type so the browser adds the correct multipart boundary
        //     "Content-Type": undefined,
        //   },
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
  }),
});

export const { useCreateSampleUnitMutation, useGetSampleUnitsBySectionQuery } =
  sampleUnitApi;
