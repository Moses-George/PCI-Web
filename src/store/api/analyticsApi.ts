import type {
  DashboardStats,
  DistressDistributionItem,
  GeoJSONResponse,
  PCIDistributionItem,
  RecentSampleUnit,
} from "@/types/dashboard";
import { baseQueryWithAuth } from "./base";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface PCITrendPoint {
  date: string;
  pci: number;
  condition_rating: string;
  max_cdv: number;
}

export interface DistressTypeCount {
  distress_type: string;
  count: number;
}

export interface SeverityBreakdown {
  distress_type: string;
  low: number;
  medium: number;
  high: number;
}

export interface DistressDistributionResponse {
  type_distribution: DistressTypeCount[];
  severity_distribution: SeverityBreakdown[];
}

export interface ConditionRatingCount {
  rating: string;
  count: number;
}

export interface NetworkSummary {
  total_networks: number;
  total_sections: number;
  total_sample_units: number;
  average_pci: number | null;
  sections_assessed: number;
}

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    getPCITrend: builder.query<PCITrendPoint[], string>({
      query(sectionId) {
        return {
          url: `/analytics/pci-trend/${sectionId}`,
          method: "GET",
          //   params: param,
        };
      },
      providesTags: [{ type: "Analytics", id: "LIST" }],
    }),
    getDistressDistribution: builder.query<
      DistressDistributionResponse,
      string
    >({
      query(sectionId) {
        return {
          url: `/analytics/distress-distribution/${sectionId}`,
          method: "GET",
          //   params: param,
        };
      },
      providesTags: [{ type: "Analytics", id: "LIST" }],
    }),
    // getPCIConditionDistribution: builder.query<ConditionRatingCount[], void>({
    //   query(param) {
    //     return {
    //       url: "/analytics/pci-condition-distribution",
    //       method: "GET",
    //       params: param,
    //     };
    //   },
    //   providesTags: [{ type: "Analytics", id: "LIST" }],
    // }),
    getNetworkSummary: builder.query<NetworkSummary, void>({
      query() {
        return {
          url: "/analytics/network-summary",
          method: "GET",
          // params: param,
        };
      },
      providesTags: [{ type: "Analytics", id: "LIST" }],
    }),

    // /////////////////////////////////////////////////////////////
    getDashboardStats: builder.query<DashboardStats, void>({
      query(param) {
        return {
          url: "/analytics/stats",
          method: "GET",
          params: param,
        };
      },
      providesTags: [{ type: "Analytics", id: "LIST" }],
    }),
    getPCIDistribution: builder.query<PCIDistributionItem[], void>({
      query(param) {
        return {
          url: "/analytics/pci-distribution",
          method: "GET",
          params: param,
        };
      },
      providesTags: [{ type: "Analytics", id: "LIST" }],
    }),
    getGlobalDistressDistribution: builder.query<
      DistressDistributionItem[],
      void
    >({
      query(param) {
        return {
          url: "/analytics/distress-distribution",
          method: "GET",
          params: param,
        };
      },
      providesTags: [{ type: "Analytics", id: "LIST" }],
    }),
    getRecentSampleUnits: builder.query<RecentSampleUnit[], void>({
      query(param) {
        return {
          url: "/analytics/recent-sample-units",
          method: "GET",
          params: param,
        };
      },
      providesTags: [{ type: "Analytics", id: "LIST" }],
    }),
    getGeoJSON: builder.query<GeoJSONResponse, void>({
      query(param) {
        return {
          url: "/analytics/geojson",
          method: "GET",
          params: param,
        };
      },
      providesTags: [{ type: "Analytics", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPCITrendQuery,
  // useGetPCIConditionDistributionQuery,
  useGetNetworkSummaryQuery,
  useGetDistressDistributionQuery,

  // //////////////////////////////

  useGetDashboardStatsQuery,
  useGetPCIDistributionQuery,
  useGetGlobalDistressDistributionQuery,
  useGetRecentSampleUnitsQuery,
  useGetGeoJSONQuery,
} = analyticsApi;
