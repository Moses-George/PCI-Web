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
  severity: 'L' | 'M' | 'H';
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
  totalSections: number;
  createdAt: string;
}

export interface Section {
  id: string;
  networkId: string;
  name: string;
  description: string;
  coordinates: [number, number];
  chainageStart: number;
  chainageEnd: number;
  width: number;
  length: number;
  pixelToMmFactor: number;
  area: number;
  sampleUnitCount: number;
  createdAt: string;
}

export interface SampleUnit {
  id: string;
  sectionId: string;
  name: string;
  imageUrl: string; // original
  predictedImageUrl?: string; // overlay
  pixelToMmFactor: number; // overrides section
  distressType: string;
  severity: 'L' | 'M' | 'H';
  potholeDepth?: number;
  note: string;
  detectedDistresses: DetectedDistress[];
  createdAt: string;
}

export interface DetectedDistress {
  type: string;
  severity: 'L' | 'M' | 'H';
  averageWidth: number;
  length: number;
  area: number;
  perimeter: number;
  confidence: number;
}

export interface PCIResult {
  sectionId: string;
  finalPci: number;
  rating: 'Good' | 'Satisfactory' | 'Poor' | 'Very Poor' | 'Failed';
  deductValues: number[];
  cdv: number;
  calculatedAt: string;
}

// Dummy data types
export type DummyNetwork = Network;
export type DummySection = Section;
export type DummySampleUnit = SampleUnit;