import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
  );
}
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
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);

  return null;
}

export default function ReportMap({ report }) {
  const latitude = Number(report?.latitude);
  const longitude = Number(report?.longitude);

  const hasCoordinates =
    report?.latitude !== "" &&
    report?.latitude !== null &&
    report?.latitude !== undefined &&
    report?.longitude !== "" &&
    report?.longitude !== null &&
    report?.longitude !== undefined &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const position = hasCoordinates
    ? [latitude, longitude]
    : null;

  const defaultCenter = [
    -1.286389,
    36.817223,
  ];

  return (
    <MapContainer
      center={position || defaultCenter}
      zoom={position ? 15 : 11}
      className="map"
    >
      {position && (
        <MapUpdater position={position} />
      )}

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {position && (
        <Marker position={position}>
          <Popup>
            {report?.location_name ||
              report?.title ||
              "Report location"}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
