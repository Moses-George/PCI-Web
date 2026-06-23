import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const networksApi = createApi({
  reducerPath: "networksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:8000/`,
  }),
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
    getAllNetworks: builder.query({
      query(param) {
        return {
          url: "/networks",
          method: "GET",
          params: param,
        };
      },
      providesTags: [{ type: "Network", id: "LIST" }],
    }),
    getSingleNetwork: builder.query({
      query(network_id) {
        return {
          url: `/networks/${network_id}`,
          method: "GET",
          // params: param,
        };
      },
      // providesTags: [{ type: "Network", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateNetworkMutation,
  useGetAllNetworksQuery,
  useGetSingleNetworkQuery,
} = networksApi;
