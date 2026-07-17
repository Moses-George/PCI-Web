// export interface Network {
//   id: string;
//   name: string;
//   location: string;
//   totalLengthKm: number;
//   createdAt: string;
// }

// export interface Section {
//   id: string;
//   networkId: string;
//   name: string;
//   startChainage: number;
//   endChainage: number;
//   widthM: number;
//   areaSqm: number;
// }

export interface DistressInput {
  distressType: string; // e.g., "Alligator", "Pothole"
  severity: "L" | "M" | "H";
  quantity: number; // Count or area
}

// export interface SampleUnit {
//   id: string;
//   sectionId: string;
//   unitNumber: string;
//   area: number;
//   isRandom: boolean;
//   distressInputs: DistressInput[]; // The "n input fields"
//   gpsCoords?: string;
// }

// export interface DetectionResult {
//   id: string;
//   imageId: string;
//   distressType: string;
//   severity: 'L' | 'M' | 'H';
//   quantity: number;
//   confidence: number;
// }

// export interface PCIResult {
//   sectionId: string;
//   finalPci: number;
//   rating: 'Good' | 'Satisfactory' | 'Poor' | 'Very Poor' | 'Failed';
//   deductValues: number[];
//   cdv: number;
//   calculatedAt: string;
// }

export interface Network {
  id: string;
  name: string;
  description: string;
  start_coordinates: [number, number]; // [lat, lng]
  end_coordinates: [number, number]; // [lat, lng]
  total_sections: number;
  created_at: string;
}

export interface NetworkWithSections extends Network {
  sections: Section[];
}

export interface Section {
  id: string;
  network_id: string;
  name: string;
  description: string;
  start_coordinates: [number, number]; // [lat, lng]
  end_coordinates: [number, number]; // [lat, lng]
  width: number;
  length: number;
  pixel_to_mm_factor: number;
  area: number;
  sample_unit_count: number;
  latest_pci: number | null;
  latest_rating: string | null;
  is_calculated: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SectionWithSampleUnits extends Section {
  sample_units: SampleUnit[];
}

export interface SampleUnit {
  id: string;
  section_id: string;
  name: string;
  original_image: string; // original
  predicted_image?: string; // overlay
  pixel_to_mm_factor: number; // overrides section
  distress_type: string;
  severity: "low" | "medium" | "high";
  pothole_depth?: number;
  note: string;
  inference_status: string;
  detections: DetectedDistress[];
  images: Image[];
  created_at: string;
}

export interface DetectedDistress {
  id: string;
  distress_type: string;
  severity: "low" | "medium" | "high";
  normalized_class?: string;
  severity_label?: string;
  metrics: {
    avg_width?: number;
    length?: number;
    area?: number;
    perimeter?: number;
    astm_quantity?: number;
    astm_unit?: string;
    pothole_equiv_diameter_mm?: number;
    pothole_depth_est_mm?: number;
    pothole_count?: number;

    crack_category_confidence?: number;
    orientation_deg?: number;
    bbox_area_mm2?: number;
    branch_density?: number;
    loop_count?: number;
    shape_complexity?: number;

    texture_cv?: number;
    // severity_metrics:
  };
  confidence: number;
  edited: boolean;
}

export interface Image {
  id: string;
  sample_unit_id: string;
  public_url: string;
  cloudinary_public_id: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  format: string | null;
  is_original: boolean;
  is_annotated: boolean;
}

// types/index.ts
export interface PCIObservation {
  distress_type: string;
  severity: string;
  density: number;
  count: number;
  deduct_value: number;
}

export interface PCIHistoryResponse {
  id: string;
  section_id: string;
  final_pci: number;
  condition_rating: string;
  max_cdv: number;
  tdv_start: number;
  deduct_values: number[];
  observations: PCIObservation[];
  all_cdvs: number[];
  all_tdvs: number[];
  created_at: string;
  updated_at: string | null;
}

// Dummy data types
export type DummyNetwork = Network;
export type DummySection = Section;
export type DummySampleUnit = SampleUnit;

export type ActionType = "delete" | "edit" | null;
