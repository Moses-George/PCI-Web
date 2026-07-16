/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Maximize2, Minimize2, Satellite, Map, Search, X } from "lucide-react";
import { destinationPoint } from "@/utils/geo_helper";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SectionOverlay {
  id: string;
  name: string;
  /** Start coordinate [lat, lng] */
  start: [number, number];
  /**
   * End coordinate [lat, lng] — if omitted, length + bearing are used
   * to compute it from start.
   */
  end?: [number, number];
  /** Section length in metres — used only when end is omitted */
  length?: number;
  /** Compass bearing in degrees (0 = North) — used only when end is omitted */
  bearing?: number;
  pci: number;
  condition: string | null;
}

// ── PCI colour scale (ASTM D6433) ────────────────────────────────────────────

function pciColor(pci: number): string {
  if (!pci) return "#0000000";

  if (86 <= pci && pci < 100) return "#006400"; // Good — green
  if (71 <= pci && pci < 86) return "#90ee90"; // Satisfactory — light green
  if (56 <= pci && pci < 71) return "#ffff00"; // Fair — yellow
  if (41 <= pci && pci < 56) return "#ff7f7f"; // Poor — light red
  if (26 <= pci && pci < 41) return "#ff0000"; // Very Poor — medium red
  if (11 <= pci && pci < 26) return "#8b0000"; // Serious — dark red
  if (0 <= pci && pci < 11) return "#363737"; // Failed — very dark grey

  if (pci >= 100) return "Good";
  if (pci <= 0) return "Failed";

  return "#0000000";
}

function pciWeight(pci: number): number {
  // Thicker line = worse condition (draws attention)
  if (pci >= 70) return 10;
  if (pci >= 40) return 12;
  return 14;
}

// ── Tile layers ───────────────────────────────────────────────────────────────

const TILES = {
  map: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    maxZoom: 19,
  },
};

// ── Geocode ───────────────────────────────────────────────────────────────────

async function geocode(query: string) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } },
    );
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function FlyTo({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
  }, [target, map]);
  return null;
}

function SizeInvalidator({ trigger }: { trigger: boolean }) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 120);
  }, [trigger, map]);
  return null;
}

// ── PCI Legend ────────────────────────────────────────────────────────────────

const LEGEND = [
  { label: "Good (86-100)", color: "#006400" },
  { label: "Satisfactory (71-86)", color: "#90ee90" },
  { label: "Fair (56-71)", color: "#ffff00" },
  { label: "Poor (41-56)", color: "#ff7f7f" },
  { label: "Very Poor (26-41)", color: "#ff0000" },
  { label: "Serious (11-26)", color: "#8b0000" },
  { label: "Failed (0-11)", color: "#363737" },
];

function Legend() {
  return (
    <div className="absolute bottom-8 left-3 z-[10] bg-white/95 backdrop-blur-sm rounded-lg shadow border border-gray-200 px-3 py-2 text-xs space-y-1">
      <p className="font-semibold text-gray-700 mb-1.5 text-[14px]">
        PCI Rating
      </p>
      {LEGEND.map(({ label, color }) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className="inline-block w-5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: color }}
          />
          <span className="text-gray-600 text-[11px]">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface MapPreviewProps {
  center: [number, number];
  zoom?: number;
  markers?: { lat: number; lng: number; label?: string }[];
  sections?: SectionOverlay[];
  height?: string;
  className?: string;
  showLegend?: boolean;
}

// ── Main component ────────────────────────────────────────────────────────────

const MapPreview = ({
  center,
  zoom = 14,
  markers = [],
  sections = [],
  height = "300px",
  className,
  showLegend = true,
}: MapPreviewProps) => {
  const [layer, setLayer] = useState<"map" | "satellite">("map");
  const [fullscreen, setFullscreen] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");
  const [flyTarget, setFlyTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  // const [showLegendPanel, setShowLegendPanel] = useState(showLegend);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreen) setFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    const coordMatch = search.match(/^(-?\d+\.?\d*)\s*[,\s]\s*(-?\d+\.?\d*)$/);
    if (coordMatch) {
      setFlyTarget({
        lat: parseFloat(coordMatch[1]),
        lng: parseFloat(coordMatch[2]),
      });
      setSearchErr("");
      return;
    }
    setSearching(true);
    setSearchErr("");
    const result = await geocode(search);
    setSearching(false);
    if (result) {
      setFlyTarget(result);
    } else {
      setSearchErr("Location not found. Try a place name or lat, lng.");
    }
  };

  // Compute polyline endpoints for each section
  const sectionLines = sections.map((s) => {
    const end: [number, number] =
      s.end ??
      destinationPoint(
        s?.start[0],
        s.start[1],
        s.bearing ?? 0,
        s.length ?? 100,
      );
    return { ...s, end };
  });

  const allMarkers =
    markers.length > 0
      ? markers
      : sections.length === 0
        ? [{ lat: center[0], lng: center[1], label: "Location" }]
        : [];

  const tile = TILES[layer];

  const has_atleast_one_pci = sections?.some(
    (section) => section.pci || section.pci > 0,
  );

  // ── Map content ─────────────────────────────────────────────────────────────
  const mapContent = (isFullscreen: boolean) => (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
      zoomControl={false}
    >
      <TileLayer
        url={tile.url}
        attribution={tile.attribution}
        maxZoom={tile.maxZoom}
      />

      {/* Section polylines */}
      {sectionLines.map((s) => (
        <Polyline
          key={s.id}
          positions={[s.start, s.end]}
          pathOptions={{
            color: pciColor(s.pci),
            weight: pciWeight(s.pci),
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round",
          }}
        >
          <Tooltip sticky direction="top" offset={[0, -4]}>
            <div className="text-xs space-y-0.5 min-w-[140px]">
              <p className="font-semibold text-gray-800">{s.name}</p>
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: pciColor(s.pci) }}
                />
                <span
                  style={{ color: pciColor(s.pci) }}
                  className="font-medium"
                >
                  {s.condition}
                </span>
              </div>
              <p className="text-gray-600">
                PCI: <b>{s.pci.toFixed(1)}</b>
              </p>
              {s.length && (
                <p className="text-gray-500">Length: {s.length.toFixed(0)} m</p>
              )}
            </div>
          </Tooltip>
        </Polyline>
      ))}

      {/* Section start markers */}
      {sectionLines.map((s) => (
        <Marker key={`m-${s.id}`} position={s.start}>
          <Popup>
            <div className="text-xs space-y-1">
              <p className="font-semibold">{s.name}</p>
              <p>
                PCI:{" "}
                <b style={{ color: pciColor(s.pci) }}>{s.pci.toFixed(1)}</b>
              </p>
              <p>
                Condition:{" "}
                <span style={{ color: pciColor(s.pci) }}>{s.condition}</span>
              </p>
              {s.length && <p>Length: {s.length.toFixed(0)} m</p>}
              <p className="text-gray-400 font-mono">
                {s.start[0].toFixed(5)}, {s.start[1].toFixed(5)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Plain markers (no sections) */}
      {allMarkers.map((m, idx) => (
        <Marker key={idx} position={[m.lat, m.lng]}>
          {m.label && (
            <Popup>
              <span className="text-sm font-medium">{m.label}</span>
            </Popup>
          )}
        </Marker>
      ))}

      <FlyTo target={flyTarget} />
      <SizeInvalidator trigger={isFullscreen} />
    </MapContainer>
  );

  // ── Controls ─────────────────────────────────────────────────────────────────
  const controls = (isFullscreen: boolean) => (
    <>
      {/* Layer toggle — top left */}
      <div className="absolute top-3 left-3 z-[10] flex gap-1 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <button
          onClick={() => setLayer("map")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
            layer === "map"
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Map size={12} /> Map
        </button>
        <button
          onClick={() => setLayer("satellite")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
            layer === "satellite"
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Satellite size={12} /> Satellite
        </button>
      </div>

      {/* Search + fullscreen — top right */}
      <div className="absolute top-3 right-3 z-[10] flex items-center gap-1.5">
        {searchOpen && (
          <div className="flex items-center gap-1 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden pr-1">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchErr("");
                }}
                placeholder="Place name or lat, lng…"
                className="text-xs px-3 py-1.5 outline-none w-52"
              />
              <button
                type="submit"
                disabled={searching}
                className="p-1.5 text-gray-500 hover:text-gray-800 disabled:opacity-40"
              >
                {searching ? (
                  <span className="animate-spin inline-block w-3 h-3 border border-gray-400 border-t-gray-800 rounded-full" />
                ) : (
                  <Search size={13} />
                )}
              </button>
            </form>
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearch("");
                setSearchErr("");
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={12} />
            </button>
          </div>
        )}
        {!searchOpen && (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
            title="Search location"
          >
            <Search size={14} />
          </button>
        )}
        <button
          onClick={() => setFullscreen((f) => !f)}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
          title={isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {searchErr && (
        <div className="absolute top-14 right-3 z-[10] bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg shadow max-w-xs">
          {searchErr}
        </div>
      )}

      {/* Coordinate readout — bottom left (above legend) */}
      <div className="absolute bottom-3 left-3 z-[10] bg-white/90 backdrop-blur-sm text-xs text-gray-500 px-2 py-1 rounded shadow border border-gray-100 font-mono">
        {center[0].toFixed(5)}, {center[1].toFixed(5)}
      </div>

      {/* Legend */}
      {sections.length > 0 && has_atleast_one_pci && showLegend && (
        <Legend />
      )}

      {/* Fullscreen hint */}
      {isFullscreen && (
        <div className="absolute bottom-3 right-3 z-[10] bg-black/50 text-white text-xs px-2 py-1 rounded">
          Press <kbd className="bg-white/20 px-1 rounded">Esc</kbd> to exit
        </div>
      )}
    </>
  );

  return (
    <>
      <div
        className={`relative rounded-xl overflow-hidden border border-gray-200 shadow-sm ${className}`}
        style={{ height }}
      >
        {mapContent(false)}
        {controls(false)}
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-[9999] bg-black"
          style={{ contain: "strict" }}
        >
          <div className="relative w-full h-full">
            {mapContent(true)}
            {controls(true)}
          </div>
        </div>
      )}
    </>
  );
};

export default MapPreview;
