// sampleUnitApi

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./base";

export const detectionApi = createApi({
  reducerPath: "detectionApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Detection"],
  endpoints: (builder) => ({
    updateDetection: builder.mutation({
      query({ detection_id, payload }) {
        return {
          url: `/detections/${detection_id}`,
          method: "PATCH",
          // credentials: "include",
          body: payload,
        };
      },
      invalidatesTags: ["Detection"],
    }),
    deleteDetection: builder.mutation({
      query(detections_id) {
        return {
          url: `/detections/${detections_id}`,
          method: "DELETE",
          // credentials: "include",
        };
      },
      invalidatesTags: ["Detection"],
    }),
  }),
});

export const { useUpdateDetectionMutation, useDeleteDetectionMutation } =
  detectionApi;
