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
  coordinates: [number, number]; // [lat, lng]
  total_sections: number;
  created_at: string;
}

export interface Section {
  id: string;
  networkId: string;
  name: string;
  description: string;
  coordinates: [number, number];
  chainage_start: number;
  chainage_end: number;
  width: number;
  length: number;
  pixel_to_mm_factor: number;
  area: number;
  sample_unit_count: number;
  created_at: string;
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
  distress_type: string;
  severity: "low" | "medium" | "high";
  metrics: {
    avg_width: number;
    length: number;
    area: number;
    perimeter: number;
  };
  confidence: number;
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

export interface PCIResult {
  sectionId: string;
  finalPci: number;
  rating: "Good" | "Satisfactory" | "Poor" | "Very Poor" | "Failed";
  deductValues: number[];
  cdv: number;
  calculatedAt: string;
}

// Dummy data types
export type DummyNetwork = Network;
export type DummySection = Section;
export type DummySampleUnit = SampleUnit;

export type ActionType = "delete" | "edit" | null;
