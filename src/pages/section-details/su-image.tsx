/* eslint-disable @typescript-eslint/no-unused-vars */
import type { InferenceEvent } from "@/hooks/useInferenceStatus";
import type { Image } from "@/types";
import { useState } from "react";

const SUImages = ({
  images,
  event,
}: {
  images: Image[];
  event: InferenceEvent | null;
}) => {
  // Track annotated image — may arrive after initial render via WS
  const [annotatedUrl, _setAnnotatedUrl] = useState<string | null>(
    images?.find((img) => img.is_annotated)?.public_url ?? null,
  );

  const original_image = images?.find((img) => img.is_original);
  const predicted_image =
    images?.find((img) => img.is_annotated) ??
    (annotatedUrl ? { public_url: annotatedUrl } : null);

  if (images?.length === 0) {
    return (
      <div className="text-center w-full py-5  border-gray-300">
        <span className="text-gray-400">
          No Image is available for this sample unit
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="relative">
        <p className="text-[14px] font-medium text-gray-600 mb-1">Original Image</p>
        {original_image ? (
          <img
            src={original_image?.public_url}
            alt="Original"
            className="w-full rounded-lg border border-gray-200 h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 px-4 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            No Image was selected for this sample unit. Click Edit to add an
            image. Note: Sample units without images have no predictions. Manual
            values selected by user is used during computation
          </div>
        )}
      </div>
      <div>
        <p className="text-[14px] font-medium text-gray-600 mb-1">
          Predicted Image
        </p>
        {predicted_image ? (
          <img
            src={predicted_image?.public_url}
            alt="Predicted"
            className="w-full rounded-lg border border-gray-200 h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            {event?.status === "processing" ? (
              <div className="flex flex-col items-center gap-2 text-blue-400">
                <span className="animate-spin text-2xl">⏳</span>
                {/* <GridLoader size={15} /> */}
                <span className="text-xs">
                  {event.detail ?? "Analysing..."}
                </span>
              </div>
            ) : original_image ? (
              "No Detection from BBOX Model"
            ) : (
              "Not processed yet"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SUImages;
