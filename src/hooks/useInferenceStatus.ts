import { VITE_ENDPOINT_URL } from "@/lib/variables";
import { useEffect, useRef, useState } from "react";

export type InferenceStep =
  | "started"
  | "detecting"
  | "analysing"
  | "uploading"
  | "saving"
  | "complete"
  | "error";

export interface InferenceEvent {
  status: "processing" | "done" | "failed";
  step: InferenceStep;
  detail?: string;
  detection_count?: number;
}

interface Options {
  onDone?: (detectionCount: number) => void;
  onFailed?: (detail: string) => void;
}

export function useInferenceStatus(
  sampleUnitId: string | null,
  options: Options = {}
) {
  const [event, setEvent] = useState<InferenceEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  // Stable ref for callbacks so they don't trigger re-runs
  const onDoneRef = useRef(options.onDone);
  const onFailedRef = useRef(options.onFailed);

  useEffect(() => {
    onDoneRef.current = options.onDone;
    onFailedRef.current = options.onFailed;
  });

  useEffect(() => {
    // Don't open if no ID or already have a terminal event
    if (!sampleUnitId) return;
    if (event?.status === "done" || event?.status === "failed") return;

    // Don't open a second connection if one already exists
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(
      `ws://${VITE_ENDPOINT_URL}/ws/inference/${sampleUnitId}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`WS connected for ${sampleUnitId}`);
    };

    ws.onmessage = (e) => {
      const data: InferenceEvent = JSON.parse(e.data);
      setEvent(data);

      if (data.status === "done") {
        onDoneRef.current?.(data.detection_count ?? 0);
        ws.close();
      }
      if (data.status === "failed") {
        onFailedRef.current?.(data.detail ?? "Unknown error");
        ws.close();
      }
    };

    ws.onerror = () => {
      setEvent({ status: "failed", step: "error", detail: "Connection failed" });
    };

    ws.onclose = () => {
      console.log(`WS closed for ${sampleUnitId}`);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  // Only re-run if sampleUnitId changes — NOT on every render
  }, [sampleUnitId]);

  return event;
}
