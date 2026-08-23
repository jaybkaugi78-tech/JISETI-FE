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
  Number.isFinite(latitude) &&
  Number.isFinite(longitude);