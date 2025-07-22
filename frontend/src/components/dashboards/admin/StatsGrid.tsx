import React from "react";
import CircularStat from "./CircularStat";

type Stat = {
  label: string;
  value: number;
  color: string;
};
const column1: Stat[] = [
  { label: "Total Projects created", value: 7, color: "bg-cyan-600" },
  { label: "Projects completed", value: 2, color: "bg-cyan-600" },
  { label: "Projects ongoing", value: 4, color: "bg-cyan-600" },
  { label: "Projects delayed", value: 2, color: "bg-cyan-600" },
  { label: "Projects revoked", value: 1, color: "bg-cyan-600" },
];

const column2: Stat[] = [
  { label: "Total users created", value: 23, color: "bg-purple-600" },
  { label: "Total senior engineers", value: 7, color: "bg-purple-600" },
  { label: "Total junior engineers", value: 8, color: "bg-purple-600" },
  { label: "Total data entry personnel", value: 8, color: "bg-purple-600" },
  { label: "Tasks created", value: 56, color: "bg-orange-400" },
];

const column3: Stat[] = [
  { label: "Tasks completed", value: 29, color: "bg-blue-500" },
  { label: "Tasks assigned", value: 41, color: "bg-orange-400" },
  { label: "Tasks unassigned", value: 15, color: "bg-orange-400" },
  { label: "Tasks delayed", value: 27, color: "bg-blue-500" },
  { label: "Tasks ongoing", value: 12, color: "bg-blue-500" },
];

const column4: Stat[] = [
  { label: "Total measurement books created", value: 7, color: "bg-orange-400" },
  { label: "Total development image uploads", value: 37, color: "bg-green-600" },
  { label: "Total ongoing statewide development", value: 16, color: "bg-blue-500" },
];


const renderStats = (stats: Stat[]) =>
  stats.map((stat, idx) => (
    <div key={idx} className="flex justify-between items-center gap-2 p-2">
      <span className="text-xs font-medium text-gray-700 w-2/3">{stat.label}</span>
      <CircularStat value={stat.value} color={stat.color} />
    </div>
  ));

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <div className="bg-white rounded shadow p-2">{renderStats(column1)}</div>
      <div className="bg-white rounded shadow p-2">{renderStats(column2)}</div>
      <div className="bg-white rounded shadow p-2">{renderStats(column3)}</div>
      <div className="bg-white rounded shadow p-2">{renderStats(column4)}</div>
    </div>
  );
}
