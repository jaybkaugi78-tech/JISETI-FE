import { API_BASE_URL } from "../../services/api";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons when using Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Moves map to the user's actual location
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return null;
}

export default function NearbyIssuesMap() {
  const [position, setPosition] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location services.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (location) => {
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        setPosition([latitude, longitude]);

        try {
          const response = await fetch(
            `${API_BASE_URL}/api/public/reports/nearby?lat=${latitude}&lng=${longitude}&radius=10`
          );

          if (!response.ok) {
            throw new Error("Could not load nearby reports.");
          }

          const data = await response.json();

          setReports(data.reports || []);
        } catch (err) {
          console.error(err);
          setError("Could not load nearby issues.");
        } finally {
          setLoading(false);
        }
      },

      (locationError) => {
        console.error(locationError);

        setError(
          "Location permission is required to show issues near you."
        );

        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  if (loading) {
    return (
      <section className="nearby-issues">
        <h2>Issues Near You</h2>
        <p>Getting your location...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="nearby-issues">
        <h2>Issues Near You</h2>
        <p>{error}</p>
      </section>
    );
  }

  if (!position) {
    return null;
  }

  return (
    <section className="nearby-issues">
      <div className="section-head">
        <div>
          <span className="eyebrow">YOUR COMMUNITY</span>
          <h2>Issues Near You</h2>
          <p>
            Reports within approximately 10 km of your current location.
          </p>
        </div>
      </div>

      <div
        style={{
          height: "450px",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={position}
          zoom={13}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <RecenterMap position={position} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User location */}
          <Marker position={position}>
            <Popup>
              <strong>You are here</strong>
            </Popup>
          </Marker>

          {/* 10 km search area */}
          <Circle
            center={position}
            radius={10000}
            pathOptions={{
              fillOpacity: 0.05,
            }}
          />

          {/* Nearby reports */}
          {reports.map((report) => {
            const latitude = Number(report.latitude);
            const longitude = Number(report.longitude);

            if (
              !Number.isFinite(latitude) ||
              !Number.isFinite(longitude)
            ) {
              return null;
            }

            return (
              <Marker
                key={report.id}
                position={[latitude, longitude]}
              >
                <Popup>
                  <strong>{report.title}</strong>

                  <br />

                  {report.location_name && (
                    <>
                      📍 {report.location_name}
                      <br />
                    </>
                  )}

                  Status:{" "}
                  {report.status?.replaceAll("_", " ")}

                  {report.distance_km !== undefined && (
                    <>
                      <br />
                      Distance: {Number(report.distance_km).toFixed(1)} km
                    </>
                  )}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <p style={{ marginTop: "12px" }}>
        {reports.length === 0
          ? "No public issues were reported within 10 km of you."
          : `${reports.length} nearby issue${
              reports.length === 1 ? "" : "s"
            } found.`}
      </p>
    </section>
  );
}