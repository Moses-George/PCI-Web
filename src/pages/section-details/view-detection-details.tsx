import type { DetectedDistress } from "@/types";
import { X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

const Data = ({
  heading,
  paragraph,
}: {
  heading: string;
  paragraph: number | string | undefined;
}) => {
  return (
    <div className="space-y-2">
      <h2 className="font-jakarta font-semibold"> {heading}</h2>
      <p className="font-jakarta font-regular max-w-[11rem]">
        {" "}
        {paragraph ?? "Null"}
      </p>
    </div>
  );
};

const DistressSpecificData = ({
  detection,
}: {
  detection: DetectedDistress;
}) => {
  switch (detection.normalized_class) {
    case "pothole":
      return (
        <>
          <Data
            heading="Pothole Depth Est (mm)"
            paragraph={detection?.metrics?.pothole_depth_est_mm?.toFixed(2)}
          />
          <Data
            heading="Pothole Equiv Diameter (mm)"
            paragraph={detection?.metrics?.pothole_equiv_diameter_mm?.toFixed(
              2,
            )}
          />
          <Data
            heading="Pothole Count"
            paragraph={detection?.metrics?.pothole_count}
          />
          <Data
            heading="Box Area (mm²)"
            paragraph={detection?.metrics?.bbox_area_mm2}
          />
        </>
      );

    case "linear":
      return (
        <>
          <Data
            heading="Width (mm)"
            paragraph={detection?.metrics?.avg_width?.toFixed(2)}
          />
          <Data heading="Length (mm)" paragraph={detection?.metrics?.length} />
          <Data
            heading="Crack Category Confidence"
            paragraph={detection?.metrics?.crack_category_confidence}
          />
          <Data
            heading="Orientation Deg"
            paragraph={detection?.metrics?.orientation_deg?.toFixed(2) + "°"}
          />
        </>
      );

    case "alligator":
      return (
        <>
          <Data
            heading="Box Area (mm²)"
            paragraph={detection?.metrics?.bbox_area_mm2}
          />
          <Data
            heading="Crack Category Confidence (%)"
            paragraph={detection?.metrics?.crack_category_confidence}
          />
          <Data
            heading="Branch Density"
            paragraph={detection?.metrics?.branch_density?.toFixed(5)}
          />
          <Data
            heading="Loop Count"
            paragraph={detection?.metrics?.loop_count}
          />
          <Data
            heading="Shape Complexity"
            paragraph={detection?.metrics?.shape_complexity?.toFixed(5)}
          />
        </>
      );

    case "patching":
      return (
        <>
          <Data
            heading="Area (mm²)"
            paragraph={detection?.metrics?.bbox_area_mm2}
          />
          <Data
            heading="Texture cv"
            paragraph={detection?.metrics?.texture_cv}
          />
        </>
      );

    default:
      break;
  }
};

const ViewDetectionDetails = ({
  detection,
  setViewMore,
}: {
  detection: DetectedDistress;
  setViewMore: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex justify-center items-center fixed h-full inset-0 bg-[#7180967A] backdrop-blur-[1.5px] z-[9999]">
      <div className="bg-white px-8 py-6 rounded shadow-md md:w-[800px] z-[9999] space-y-8">
        <div className="flex items-center justify-between w-full">
          <h1 className="lg:text-xl text-lg text-gray-800 font-semibold">
            Detection Result Metadata
          </h1>
          <button
            onClick={() => setViewMore(false)}
            className="flex items-center gap-1 bg-red-500 px-3 py-2 transform active:scale-75 transition-transform cursor-pointer"
          >
            <X size={16} color="white" />
            <span className="text-white">Close</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Data heading="Distress Type" paragraph={detection.distress_type} />
          <Data heading="Severity" paragraph={detection.severity} />
          <Data
            heading="Normalized Distress Type"
            paragraph={detection?.normalized_class}
          />
          <Data heading="Severity Label" paragraph={detection.severity_label} />
          <Data
            heading="Confidence Score"
            paragraph={(detection.confidence * 100).toFixed(0) + "%"}
          />
          <Data
            heading="Astm Quantity"
            paragraph={Number(detection?.metrics?.astm_quantity?.toFixed(5))}
          />
          <Data heading="Astm Unit" paragraph={detection?.metrics?.astm_unit} />
          <Data heading="Area (mm²)" paragraph={detection?.metrics?.area} />
          <DistressSpecificData detection={detection} />
        </div>
      </div>
    </div>
  );
};

export default ViewDetectionDetails;
