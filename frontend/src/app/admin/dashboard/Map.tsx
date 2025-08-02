import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";

const dummyProjects = [
  {
    district: "Kamrup",
    name: "Water Supply Upgrade",
    lat: 26.1445,
    lng: 91.7362,
    year: 2023,
  },
  {
    district: "Kamrup",
    name: "School Renovation",
    lat: 26.15,
    lng: 91.73,
    year: 2024,
  },
  {
    district: "Dibrugarh",
    name: "Solar Plant",
    lat: 27.4728,
    lng: 94.9111,
    year: 2023,
  },
  {
    district: "Barpeta",
    name: "Bridge Project",
    lat: 26.32,
    lng: 91.01,
    year: 2022,
  },
  {
    district: "Jorhat",
    name: "Road Improvement",
    lat: 26.75,
    lng: 94.22,
    year: 2024,
  },
  {
    district: "Nagaon",
    name: "Digital Classroom",
    lat: 26.35,
    lng: 92.68,
    year: 2023,
  },
  {
    district: "Cachar",
    name: "Healthcare Facility",
    lat: 24.8333,
    lng: 92.7789,
    year: 2022,
  },
];

interface AssamMapProps {
  geoJsonData?: GeoJSON.FeatureCollection;
}

const AssamMap: React.FC<AssamMapProps> = () => {
  const [year, setYear] = useState(2023);
  const [isClient, setIsClient] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Ensure we're on the client side before loading map
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (!isClient || typeof window === "undefined") return;

    let map: import("leaflet").Map | null = null;
    let geoLayer: import("leaflet").GeoJSON | null = null;

    const initializeMap = async () => {
      try {
        // Dynamically import Leaflet only on client side
        const L = await import("leaflet");

        // Create map with container bounds
        map = L.default
          .map("map", {
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            dragging: true,
            touchZoom: true,
          })
          .setView([26.2, 92.9], 6);

        // Ensure map was created successfully
        if (!map) {
          throw new Error("Failed to create map instance");
        }

        L.default
          .tileLayer(
            "https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=k9E8DTXZfqFvaFWB2LXh",
            {
              attribution: "&copy; MapTiler &copy; OpenStreetMap contributors",
              maxZoom: 18,
            }
          )
          .addTo(map);

        const redPinIcon = L.default.icon({
          iconUrl: "/assets/images/location_marker.png",
          iconSize: [30, 45],
          iconAnchor: [15, 45],
          popupAnchor: [0, -40],
        });

        // Load GeoJSON data
        const response = await fetch("/assets/maps/assam-districts.json");
        const districtData: GeoJSON.FeatureCollection = await response.json();

        const filteredProjects = dummyProjects.filter((p) => p.year === year);
        const projectCount: Record<string, number> = {};

        // Add markers - map is guaranteed to exist here
        filteredProjects.forEach((p) => {
          if (map) {
            L.default
              .marker([p.lat, p.lng], { icon: redPinIcon })
              .addTo(map)
              .bindPopup(
                `<strong>${p.name}</strong><br/>District: ${p.district}<br/>Year: ${p.year}`
              );
          }

          projectCount[p.district] = (projectCount[p.district] || 0) + 1;
        });

        // Add GeoJSON layer
        geoLayer = L.default.geoJSON(
          districtData as GeoJSON.FeatureCollection<
            GeoJSON.Geometry,
            { DISTRICT?: string }
          >,
          {
            style: (feature) => {
              if (!feature) return {};
              const districtName = feature.properties?.DISTRICT || "";
              const count = projectCount[districtName] || 0;

              return {
                color: "#0000cc",
                weight: 1.2,
                fillColor: count > 0 ? "#a8dadc" : "#eeeeee",
                fillOpacity: 0.4,
              };
            },
            onEachFeature: (feature, layer) => {
              if (!feature) return;
              const districtName = feature.properties?.DISTRICT || "";
              const count = projectCount[districtName] || 0;

              layer.bindTooltip(
                `<strong>${districtName}</strong><br/>Projects: ${count}`,
                { sticky: true, direction: "top" }
              );
            },
          }
        );

        // Add geoLayer to map with null check
        if (map && geoLayer) {
          geoLayer.addTo(map);
          map.fitBounds(geoLayer.getBounds(), { padding: [10, 10] });

          // Force map to invalidate size after loading
          setTimeout(() => {
            if (map) {
              map.invalidateSize();
            }
          }, 100);
        }

        setMapLoaded(true);
      } catch (err) {
        console.error("Failed to load map:", err);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [year, isClient]);

  // Show loading state during SSR and initial client load
  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center mb-4">
        <label className="inline-flex items-center gap-2">
          <span className="text-sm font-medium">Select Year:</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2022, 2023, 2024].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="relative w-full h-96 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <div
          id="map"
          className="absolute inset-0 w-full h-full"
          style={{
            minHeight: "100%",
            minWidth: "100%",
          }}
        >
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="text-gray-500">Initializing map...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssamMap;
