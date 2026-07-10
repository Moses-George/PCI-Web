import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./base";
import type { NetworkWithSections } from "@/types";

export const networksApi = createApi({
  reducerPath: "networksApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Network"],
  endpoints: (builder) => ({
    createNetwork: builder.mutation({
      query(payload) {
        return {
          url: "/networks",
          method: "POST",
          // credentials: "include",
          body: payload,
        };
      },
      invalidatesTags: ["Network"],
    }),
    getAllNetworks: builder.query<NetworkWithSections[], void>({
      query(param) {
        return {
          url: "/networks",
          method: "GET",
          params: param,
        };
      },
      providesTags: [{ type: "Network", id: "LIST" }],
    }),
    getSingleNetwork: builder.query<NetworkWithSections, string | undefined>({
      query(network_id) {
        return {
          url: `/networks/${network_id}`,
          method: "GET",
          // params: param,
        };
      },
      // providesTags: [{ type: "Network", id: "LIST" }],
    }),
    updateNetwork: builder.mutation({
      query({ network_id, payload }) {
        return {
          url: `/networks/${network_id}`,
          method: "PATCH",
          // credentials: "include",
          body: payload,
        };
      },
      invalidatesTags: ["Network"],
    }),
    deleteNetwork: builder.mutation({
      query(network_id) {
        return {
          url: `/networks/${network_id}`,
          method: "DELETE",
          // credentials: "include",
        };
      },
      invalidatesTags: ["Network"],
    }),
  }),
});

export const {
  useCreateNetworkMutation,
  useGetAllNetworksQuery,
  useGetSingleNetworkQuery,
  useUpdateNetworkMutation,
  useDeleteNetworkMutation,
} = networksApi;
