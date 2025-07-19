"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";

// GeoJSON path (place your file in `public/maps/`)
const geoUrl = "/assets/maps/assam-districts.json";

// Example user data
const userByDistrict: Record<string, number> = {
  kamrup: 100,
  jorhat: 60,
  dibrugarh: 85,
  cachar: 45,
  barpeta: 25,
  // Add more districts if needed
};

const AssamDistrictMap = () => {
  return (
    <div className="w-full h-[500px] relative">
      <ComposableMap
        projection="geoMercator"
        width={800}
        height={500}
        projectionConfig={{
          center: [93.5, 26.2],
          scale: 4000,
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo) => {
              const rawName =
                geo.properties.district ||
                geo.properties.DISTRICT ||
                geo.properties.NAME_2 ||
                "Unknown";

              const districtKey = rawName
                .toLowerCase()
                .replace(/(metropolitan|metro|rural|district)/g, "")
                .replace(/\s+/g, " ")
                .trim();

              const users = userByDistrict[districtKey] ?? 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  stroke="#fff"
                  strokeWidth={0.5}
                  data-tooltip-id="district-tooltip"
                  data-tooltip-content={`${rawName}: ${users} users`}
                  style={{
                    default: {
                      fill: "#1f77b4", // base blue
                      outline: "none",
                      transition: "fill 0.2s ease-in-out",
                    },
                    hover: {
                      fill: "#FFD700", // yellow on hover
                      outline: "none",
                      transition: "fill 0.2s ease-in-out",
                    },
                    pressed: {
                      fill: "#FFD700",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <Tooltip id="district-tooltip" />
    </div>
  );
};

export default AssamDistrictMap;

