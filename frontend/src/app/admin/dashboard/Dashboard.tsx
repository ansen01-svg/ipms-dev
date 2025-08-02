"use client";

import type { FeatureCollection } from "geojson";
import React, { useEffect, useState } from "react";
import {
  ProjectByBudgetTypeChart,
  ProjectClassChart,
  ProjectsByMonthChart,
  ProjectTrendsChart,
  ProjectTypesChart,
  UserRatioChart,
} from "./Charts";
import AssamMap from "./Map";

interface DashboardProps {
  searchTerm?: string;
}
const Dashboard: React.FC<DashboardProps> = () => {
  // const [selectedFilter, setSelectedFilter] = useState("All");
  const [districtsGeoJson, setDistrictsGeoJson] =
    useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch("/assets/maps/assam-districts.json")
      .then((response) => response.json())
      .then((data) => setDistrictsGeoJson(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  return (
    <div className="container mx-auto p-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      </header>

      {/* Layout: First Column with Two Rows, Second and Third Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="grid grid-cols-1 gap-6 col-span-1">
          {/* Dropdown and Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Dropdown */}
            {/* <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-6">
              <select
                onChange={(e) => setSelectedFilter(e.target.value)}
                value={selectedFilter}
                className="
    w-full               // Mobile: full width
    sm:w-56 sm:h-10               // ≥640px: 14rem (224px)
    md:w-48 md:h-10            // ≥768px: 12rem (192px)
    lg:w-40              // ≥1024px: 10rem (160px)
    xl:w-36              // ≥1280px: 9rem (144px)
    px-2 py-1
    text-sm md:text-base
    border rounded-md
    bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white
  "
              >
                <option value="All">All Projects</option>
                <option value="Speeding">Roofing</option>
                <option value="Alcohol">Building</option>
                <option value="Distraction">Flyover</option>
                <option value="FailureToYield">Road</option>
              </select>
            </div> */}

            {/* Total Users */}
            <div className="bg-blue-200 dark:bg-blue-800 px-3 py-2 rounded-md shadow text-center text-sm">
              <h2 className="font-semibold">Total Users</h2>
              <p className="text-base font-bold">82,133</p>
            </div>

            {/* Total Projects */}
            <div className="bg-red-200 dark:bg-red-800 px-3 py-2 rounded-md shadow text-center text-sm">
              <h2 className="font-semibold">Total Projects</h2>
              <p className="text-base font-bold">18,177</p>
            </div>
          </div>

          {/* Second Row */}
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full">
            <h2 className="font-semibold mb-4">User Project Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <UserRatioChart />
              </div>
              <div className="text-center">
                <ProjectClassChart />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white text-black p-6 rounded-lg shadow-lg col-span-1 w-full">
          <ProjectByBudgetTypeChart />
        </div>

        <div className="bg-white text-black p-6 rounded-lg shadow-lg col-span-1 w-full">
          <ProjectsByMonthChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full">
          <ProjectTrendsChart />
        </div>
        <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full">
          <ProjectTypesChart />
        </div>
        <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full">
          {districtsGeoJson ? (
            <AssamMap geoJsonData={districtsGeoJson} />
          ) : (
            <p>Loading map...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
