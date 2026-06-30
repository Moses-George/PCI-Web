import { useInferenceStatus } from "@/hooks/useInferenceStatus";

const STEP_LABELS: Record<string, string> = {
  started:   "Starting...",
  detecting: "Running YOLO detection...",
  analysing: "Measuring distress severity...",
  uploading: "Saving annotated image...",
  saving:    "Saving to database...",
  complete:  "Complete",
  error:     "Failed",
};

interface Props {
  sampleUnitId: string;
  initialStatus: string;
  onDone?: (count: number) => void;
}

export function InferenceProgress({ sampleUnitId, initialStatus, onDone }: Props) {
  const isTerminal = ["done", "failed"].includes(initialStatus);
  const event = useInferenceStatus(isTerminal ? null : sampleUnitId, { onDone });

  if (initialStatus === "done") {
    return <Badge color="green">Complete</Badge>;
  }
  if (initialStatus === "failed") {
    return <Badge color="red">Failed</Badge>;
  }
  if (!event) {
    return <Badge color="gray" pulse>Queued...</Badge>;
  }
  if (event.status === "failed") {
    return <Badge color="red">Failed: {event.detail}</Badge>;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-blue-600">
      <span className="animate-spin">⏳</span>
      <span>{STEP_LABELS[event.step] ?? event.detail ?? "Processing..."}</span>
    </div>
  );
}

function Badge({
  color,
  pulse,
  children,
}: {
  color: string;
  pulse?: boolean;
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    red:   "bg-red-100 text-red-600",
    gray:  "bg-gray-100 text-gray-600",
    blue:  "bg-blue-100 text-blue-600",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[color]} ${
        pulse ? "animate-pulse" : ""
      }`}
    >
      {children}
    </span>
  );
}