/**
 * Destination point given start [lat, lng], bearing (degrees), distance (metres).
 * Uses the haversine approximation — accurate enough for road segments.
 */
export function destinationPoint(
  lat: number,
  lng: number,
  bearingDeg: number,
  distanceM: number
): [number, number] {
  const R = 6_371_000; // Earth radius in metres
  const δ = distanceM / R;
  const θ = (bearingDeg * Math.PI) / 180;
  const φ1 = (lat * Math.PI) / 180;
  const λ1 = (lng * Math.PI) / 180;

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
    );

  return [(φ2 * 180) / Math.PI, (λ2 * 180) / Math.PI];
}