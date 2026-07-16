/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// // import { useEffect } from 'react';

// // Fix marker icon issue
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// interface MapPreviewProps {
//   center: [number, number];
//   zoom?: number;
//   markers?: { lat: number; lng: number; label?: string }[];
//   height?: string;
//   className?: string;
// }

// const MapPreview = ({
//   center,
//   zoom = 13,
//   markers = [],
//   height = "300px",
//   className,
// }: MapPreviewProps) => {
//   return (
//     <MapContainer
//       center={center}
//       zoom={zoom}
//       style={{ height, width: "100%" }}
//       className={`${className} z-[10]`}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//       />
//       {markers.map((m, idx) => (
//         <Marker key={idx} position={[m.lat, m.lng]}>
//           {m.label && <Popup>{m.label}</Popup>}
//         </Marker>
//       ))}
//       {/* If no markers, put a marker at center */}
//       {markers.length === 0 && (
//         <Marker position={center}>
//           <Popup>Network/Section Location</Popup>
//         </Marker>
//       )}
//     </MapContainer>
//   );
// };

// export default MapPreview;


import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  // useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Maximize2, Minimize2, Satellite, Map, Search, X, } from "lucide-react";

// Fix marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ── Tile layers ───────────────────────────────────────────────────────────────
const TILES = {
  map: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    maxZoom: 19,
  },
};

// ── Geocode search via Nominatim ─────────────────────────────────────────────
async function geocode(query: string): Promise<{ lat: number; lng: number; label: string } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    if (data.length === 0) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      label: data[0].display_name,
    };
  } catch {
    return null;
  }
}

// ── Internal: fly-to helper component ────────────────────────────────────────
function FlyTo({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
  }, [target, map]);
  return null;
}

// ── Internal: invalidate map size when container resizes (fullscreen toggle) ─
function SizeInvalidator({ trigger }: { trigger: boolean }) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 120);
  }, [trigger, map]);
  return null;
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface MapPreviewProps {
  center: [number, number];
  zoom?: number;
  markers?: { lat: number; lng: number; label?: string }[];
  height?: string;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
const MapPreview = ({
  center,
  zoom = 13,
  markers = [],
  height = "300px",
  className,
}: MapPreviewProps) => {
  const [layer, setLayer]         = useState<"map" | "satellite">("map");
  const [fullscreen, setFullscreen] = useState(false);
  const [search, setSearch]       = useState("");
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when search panel opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  // Close fullscreen on Escape
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

    // Try parsing as lat,lng first
    const coordMatch = search.match(/^(-?\d+\.?\d*)\s*[,\s]\s*(-?\d+\.?\d*)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      setFlyTarget({ lat, lng });
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
      setSearchErr("Location not found. Try a place name or lat, lng coordinates.");
    }
  };

  const allMarkers = markers.length > 0 ? markers : [{ lat: center[0], lng: center[1], label: "Location" }];

  const tile = TILES[layer];

  // ── Shared map content ──────────────────────────────────────────────────────
  const mapContent = (isFullscreen: boolean) => (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
      zoomControl={false}
    >
      <TileLayer url={tile.url} attribution={tile.attribution} maxZoom={tile.maxZoom} />

      {allMarkers.map((m, idx) => (
        <Marker key={idx} position={[m.lat, m.lng]}>
          {m.label && <Popup><span className="text-sm font-medium">{m.label}</span></Popup>}
        </Marker>
      ))}

      <FlyTo target={flyTarget} />
      <SizeInvalidator trigger={isFullscreen} />

      {/* Zoom controls — bottom right */}
      <div className="leaflet-control-zoom leaflet-bar leaflet-control" style={{ position: "absolute", bottom: 24, right: 12, zIndex: 1000 }}>
        <a className="leaflet-control-zoom-in" href="#" title="Zoom in"
           onClick={e => { e.preventDefault(); }}>+</a>
        <a className="leaflet-control-zoom-out" href="#" title="Zoom out"
           onClick={e => { e.preventDefault(); }}>−</a>
      </div>
    </MapContainer>
  );

  // ── Controls overlay (shared between normal + fullscreen) ───────────────────
  const controls = (isFullscreen: boolean) => (
    <>
      {/* Layer toggle — top left */}
      <div className="absolute top-3 left-3 z-[10] flex gap-1 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <button
          onClick={() => setLayer("map")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
            layer === "map" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Map size={12} /> Map
        </button>
        <button
          onClick={() => setLayer("satellite")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
            layer === "satellite" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Satellite size={12} /> Satellite
        </button>
      </div>

      {/* Search + fullscreen — top right */}
      <div className="absolute top-3 right-3 z-[10] flex items-center gap-1.5">
        {/* Search panel */}
        {searchOpen && (
          <div className="flex items-center gap-1 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden pr-1">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                ref={inputRef}
                value={search}
                onChange={e => { setSearch(e.target.value); setSearchErr(""); }}
                placeholder="Place name or lat, lng…"
                className="text-xs px-3 py-1.5 outline-none w-52"
              />
              <button
                type="submit"
                disabled={searching}
                className="p-1.5 text-gray-500 hover:text-gray-800 disabled:opacity-40"
              >
                {searching
                  ? <span className="animate-spin inline-block w-3 h-3 border border-gray-400 border-t-gray-800 rounded-full" />
                  : <Search size={13} />
                }
              </button>
            </form>
            <button onClick={() => { setSearchOpen(false); setSearch(""); setSearchErr(""); }}
                    className="p-1 text-gray-400 hover:text-gray-600">
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
          onClick={() => setFullscreen(f => !f)}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
          title={isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {/* Search error */}
      {searchErr && (
        <div className="absolute top-14 right-3 z-[10] bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg shadow max-w-xs">
          {searchErr}
        </div>
      )}

      {/* Coordinate readout — bottom left */}
      <div className="absolute bottom-3 left-3 z-[10] bg-white/90 backdrop-blur-sm text-xs text-gray-500 px-2 py-1 rounded shadow border border-gray-100 font-mono">
        {center[0].toFixed(5)}, {center[1].toFixed(5)}
      </div>
    </>
  );

  return (
    <>
      {/* ── Normal (inline) map ─────────────────────────────────────────────── */}
      <div
        className={`relative rounded-xl overflow-hidden border border-gray-200 shadow-sm ${className}`}
        style={{ height }}
      >
        {mapContent(false)}
        {controls(false)}
      </div>

      {/* ── Fullscreen overlay ──────────────────────────────────────────────── */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[9999] bg-black"
          style={{ contain: "strict" }}
        >
          <div className="relative w-full h-full">
            {mapContent(true)}
            {controls(true)}

            {/* Fullscreen label */}
            <div className="absolute bottom-3 right-3 z-[1000] bg-black/50 text-white text-xs px-2 py-1 rounded">
              Press <kbd className="bg-white/20 px-1 rounded">Esc</kbd> to exit
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MapPreview;