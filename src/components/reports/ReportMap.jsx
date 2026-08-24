import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";

function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 15);
  }, [position, map]);

  return null;
}

export default function ReportMap({ report }) {
  const latitude = Number(report?.latitude);
  const longitude = Number(report?.longitude);

  const hasValidCoordinates =
    Number.isFinite(latitude) && Number.isFinite(longitude);

  const position = hasValidCoordinates
    ? [latitude, longitude]
    : [-1.286389, 36.817223];

  return (
    <MapContainer
      center={position}
      zoom={15}
      className="map"
    >
      <MapUpdater position={position} />

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>
          {report?.title || report?.description || "Reported incident"}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
 
