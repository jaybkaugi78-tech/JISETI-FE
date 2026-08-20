import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
export default function ReportMap({ report }) {
}
const position = [
  report?.latitude || -1.286389,
  report?.longitude || 36.817223,
];return (
  <MapContainer center={position} zoom={12} className="map">
  </MapContainer>
);

