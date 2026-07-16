/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DashboardStats {
  total_networks: number;
  total_sections: number;
  total_sample_units: number;
  avg_pci: number;
  critical_sections: number;
  analyzed_sections: number;
  latest_section_id: string | null
}

export interface PCIDistributionItem {
  rating: string;
  count: number;
}

export interface DistressDistributionItem {
  type: string;
  count: number;
}

export interface RecentSampleUnit {
  id: string;
  name: string;
  section_name: string;
  section_area: string;
  date: Date;
  status: string; // Processed, Pending, Processing
}

export interface GeoJSONFeature {
  type: string;
  geometry: any;
  properties: any;
}

export interface GeoJSONResponse {
  type: string;
  features: GeoJSONFeature[];
}
