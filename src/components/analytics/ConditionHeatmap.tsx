/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useGetSectionsQuery } from "../../store/api/apiSlice";
import { useLazyCalculatePCIQuery } from "../../store/api/apiSlice";
import { useEffect, useState } from "react";

// Fix marker icons (if needed)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Dummy GeoJSON for sections (we'll create simple polygons around coordinates)
// In real app, you would have proper geometries stored.
// For demo, we'll create a small circle or rectangle around the section's coordinates.
const createGeoJSON = (sections: any[], pciMap: Record<string, number>) => {
  return {
    type: "FeatureCollection",
    features: sections.map((s) => {
      const pci = pciMap[s.id] || 0;
      let color = "#22c55e"; // Good
      if (pci < 40) color = "#ef4444";
      else if (pci < 55) color = "#f97316";
      else if (pci < 70) color = "#f59e0b";
      else if (pci < 85) color = "#3b82f6";
      // Create a small polygon around coordinates (approximate)
      const lat = s.coordinates[0];
      const lng = s.coordinates[1];
      const radius = 0.001; // ~100m
      const points = [
        [lat - radius, lng - radius],
        [lat - radius, lng + radius],
        [lat + radius, lng + radius],
        [lat + radius, lng - radius],
        [lat - radius, lng - radius],
      ];
      return {
        type: "Feature",
        properties: {
          name: s.name,
          pci: pci,
          fill: color,
          stroke: "#fff",
          "stroke-width": 1,
        },
        geometry: {
          type: "Polygon",
          coordinates: [points],
        },
      };
    }),
  };
};

const ConditionHeatmap: React.FC = () => {
  // const { data: geoJson } = useGetGeoJSONQuery();
  // console.log(geoJson)
  const { data: sections } = useGetSectionsQuery();
  const [triggerPCI] = useLazyCalculatePCIQuery();
  const [pciMap, setPciMap] = useState<Record<string, number>>({});
  const [geoJson, setGeoJson] = useState<any>(null);

  useEffect(() => {
    if (!sections) return;
    const fetchPci = async () => {
      const map: Record<string, number> = {};
      for (const s of sections) {
        const result = await triggerPCI(s.id).unwrap();
        map[s.id] = result.finalPci;
      }
      setPciMap(map);
      const gj = createGeoJSON(sections, map);
      setGeoJson(gj);
    };
    fetchPci();
  }, [sections]);

  if (!geoJson)
    return (
      <div className="h-full bg-white flex items-center justify-center text-gray-400 shadow-sm border border-gray-200">
        Loading heatmap...
      </div>
    );

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    layer.bindPopup(`<b>${props.name}</b><br/>PCI: ${props.pci}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <h4 className="font-medium font-jakarta p-4">PCI Condition Heatmap</h4>
      <MapContainer
        center={[37.78, -122.41]}
        zoom={11}
        style={{ height: "400px", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <GeoJSON data={geoJson} onEachFeature={onEachFeature} />
        <div className="leaflet-bottom leaflet-right" style={{ zIndex: 1000 }}>
          <div className="bg-white p-2 rounded shadow-md text-xs">
            <div>
              <span className="inline-block w-3 h-3 bg-green-500 mr-1"></span>{" "}
              Good (85-100)
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-blue-500 mr-1"></span>{" "}
              Satisfactory (70-84)
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-yellow-500 mr-1"></span>{" "}
              Poor (55-69)
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-orange-500 mr-1"></span>{" "}
              Very Poor (40-54)
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-red-500 mr-1"></span>{" "}
              Failed (0-39)
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default ConditionHeatmap;
