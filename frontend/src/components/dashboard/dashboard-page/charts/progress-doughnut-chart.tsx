// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ChevronDown } from "lucide-react";
// import React from "react";

// interface GaugeProgressChartProps {
//   data: {
//     completed: number;
//     inProgress: number;
//     overdue: number;
//     total: number;
//   };
//   title?: string;
//   showDropdown?: boolean;
//   maxCapacity?: number; // Optional max capacity, defaults to next multiple of 10 above total
// }

// export const GaugeProgressChart: React.FC<GaugeProgressChartProps> = ({
//   data,
//   title = "Overall Progress",
//   showDropdown = true,
//   maxCapacity,
// }) => {
//   const { total, completed, inProgress, overdue } = data;

//   if (total === 0) {
//     return (
//       <Card className="lg:col-span-4 border-0 shadow-sm rounded-xl">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-lg font-medium text-gray-900">
//             {title}
//           </CardTitle>
//           {showDropdown && (
//             <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
//               All <ChevronDown className="h-4 w-4" />
//             </button>
//           )}
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center justify-center h-64">
//             <p className="text-gray-500">No data available</p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Determine the maximum scale for the gauge
//   const gaugeMax = maxCapacity || Math.ceil(total / 10) * 10;

//   // Calculate used vs unused capacity
//   const unusedCapacity = gaugeMax - total;

//   // Chart configuration
//   const size = 300;
//   const centerX = size / 2;
//   const centerY = size / 2 + 20;
//   const radius = 140;
//   const strokeWidth = 15;

//   // Create the gauge path (semi-circle from -180° to 0°)
//   const startAngle = -180 * (Math.PI / 180);
//   const endAngle = 0 * (Math.PI / 180);
//   const totalAngle = endAngle - startAngle;

//   // Calculate angles for each segment based on actual counts
//   const completedAngle = (completed / gaugeMax) * totalAngle;
//   const delayedAngle = (overdue / gaugeMax) * totalAngle;
//   const inProgressAngle = (inProgress / gaugeMax) * totalAngle;
//   const unusedAngle = (unusedCapacity / gaugeMax) * totalAngle;

//   // Generate tick marks (every 5 units, labels every 10 units)
//   const generateTickMarks = () => {
//     const ticks = [];
//     const totalTicks = Math.floor(gaugeMax / 5) + 1; // Tick every 5 units

//     for (let i = 0; i < totalTicks; i++) {
//       const tickValue = i * 5;
//       if (tickValue > gaugeMax) break;

//       const tickAngle = startAngle + (tickValue / gaugeMax) * totalAngle;
//       const tickRadius = radius + 15;
//       const tickEndRadius = radius + 25;

//       const x1 = centerX + tickRadius * Math.cos(tickAngle);
//       const y1 = centerY + tickRadius * Math.sin(tickAngle);
//       const x2 = centerX + tickEndRadius * Math.cos(tickAngle);
//       const y2 = centerY + tickEndRadius * Math.sin(tickAngle);

//       ticks.push(
//         <line
//           key={`tick-${i}`}
//           x1={x1}
//           y1={y1}
//           x2={x2}
//           y2={y2}
//           stroke="#e5e7eb"
//           strokeWidth={2}
//           strokeLinecap="round"
//         />
//       );

//       // Add tick labels every 10 units
//       if (tickValue % 10 === 0) {
//         const labelRadius = radius + 35;
//         const labelX = centerX + labelRadius * Math.cos(tickAngle);
//         const labelY = centerY + labelRadius * Math.sin(tickAngle);

//         ticks.push(
//           <text
//             key={`tick-label-${i}`}
//             x={labelX}
//             y={labelY}
//             textAnchor="middle"
//             dominantBaseline="middle"
//             className="fill-gray-400 text-xs"
//           >
//             {tickValue}
//           </text>
//         );
//       }
//     }

//     return ticks;
//   };

//   // Create arc path
//   const createArcPath = (
//     startAngle: number,
//     endAngle: number,
//     radius: number
//   ) => {
//     const start = {
//       x: centerX + radius * Math.cos(startAngle),
//       y: centerY + radius * Math.sin(startAngle),
//     };
//     const end = {
//       x: centerX + radius * Math.cos(endAngle),
//       y: centerY + radius * Math.sin(endAngle),
//     };

//     const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

//     return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
//   };

//   // Calculate segment paths (left to right)
//   let currentAngle = startAngle;

//   // Completed segment (green) - starts from left
//   const completedPath =
//     completedAngle > 0
//       ? createArcPath(currentAngle, currentAngle + completedAngle, radius)
//       : "";
//   currentAngle += completedAngle;

//   // Delayed segment (yellow)
//   const delayedPath =
//     delayedAngle > 0
//       ? createArcPath(currentAngle, currentAngle + delayedAngle, radius)
//       : "";
//   currentAngle += delayedAngle;

//   // In Progress segment (red)
//   const inProgressPath =
//     inProgressAngle > 0
//       ? createArcPath(currentAngle, currentAngle + inProgressAngle, radius)
//       : "";
//   currentAngle += inProgressAngle;

//   // Unused capacity segment (light gray) - represents the gap between total and max capacity
//   const unusedPath =
//     unusedAngle > 0
//       ? createArcPath(currentAngle, currentAngle + unusedAngle, radius)
//       : "";

//   // Calculate completion percentage based on total projects
//   const completionPercentage =
//     total > 0 ? Math.round((completed / total) * 100) : 0;

//   return (
//     <Card className="lg:col-span-4 space-y-8 border-0 shadow-sm rounded-xl">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-lg font-medium text-gray-900">
//           {title}
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-col items-center justify-center">
//           {/* SVG Gauge */}
//           <div className="relative">
//             <svg width={size} height={size - 120} className="overflow-visible">
//               {/* Background arc */}
//               <path
//                 d={createArcPath(startAngle, endAngle, radius)}
//                 stroke="#f3f4f6"
//                 strokeWidth={strokeWidth}
//                 fill="none"
//                 strokeLinecap="round"
//               />

//               {/* Completed segment (green) */}
//               {completed > 0 && (
//                 <path
//                   d={completedPath}
//                   stroke="#10b981"
//                   strokeWidth={strokeWidth}
//                   fill="none"
//                   strokeLinecap="round"
//                 />
//               )}

//               {/* Delayed segment (yellow) */}
//               {overdue > 0 && (
//                 <path
//                   d={delayedPath}
//                   stroke="#f59e0b"
//                   strokeWidth={strokeWidth}
//                   fill="none"
//                   strokeLinecap="round"
//                 />
//               )}

//               {/* In Progress segment (red) */}
//               {inProgress > 0 && (
//                 <path
//                   d={inProgressPath}
//                   stroke="#ef4444"
//                   strokeWidth={strokeWidth}
//                   fill="none"
//                   strokeLinecap="round"
//                 />
//               )}

//               {/* Unused capacity segment (light gray) */}
//               {unusedCapacity > 0 && (
//                 <path
//                   d={unusedPath}
//                   stroke="#d1d5db"
//                   strokeWidth={strokeWidth}
//                   fill="none"
//                   strokeLinecap="round"
//                 />
//               )}

//               {/* Tick marks and labels */}
//               {generateTickMarks()}

//               {/* Center content */}
//               <text
//                 x={centerX}
//                 y={centerY - 15}
//                 textAnchor="middle"
//                 className="fill-gray-900 text-4xl font-semibold"
//               >
//                 {completionPercentage}%
//               </text>
//               <text
//                 x={centerX}
//                 y={centerY + 5}
//                 textAnchor="middle"
//                 className="fill-gray-500 text-sm"
//               >
//                 Completed
//               </text>
//             </svg>
//           </div>

//           {/* Bottom Stats */}
//           <div className="grid grid-cols-4 gap-8 mt-6 w-full max-w-sm">
//             <div className="text-center">
//               <div className="text-xl font-semibold text-gray-900">{total}</div>
//               <div className="text-xs text-gray-500">Total projects</div>
//             </div>
//             <div className="text-center">
//               <div className="text-xl font-semibold text-green-600">
//                 {completed}
//               </div>
//               <div className="text-xs text-gray-500">Completed</div>
//             </div>
//             <div className="text-center">
//               <div className="text-xl font-semibold text-yellow-600">
//                 {overdue}
//               </div>
//               <div className="text-xs text-gray-500">Overdue</div>
//             </div>
//             <div className="text-center">
//               <div className="text-xl font-semibold text-red-500">
//                 {inProgress}
//               </div>
//               <div className="text-xs text-gray-500">Ongoing</div>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import React from "react";

interface GaugeProgressChartProps {
  data: {
    completed: number;
    inProgress: number;
    overdue: number;
    total: number;
  };
  title?: string;
  showDropdown?: boolean;
  maxCapacity?: number; // Optional max capacity, defaults to next multiple of 10 above total
}

export const GaugeProgressChart: React.FC<GaugeProgressChartProps> = ({
  data,
  title = "Overall Progress",
  showDropdown = true,
  maxCapacity,
}) => {
  const { total, completed, inProgress, overdue } = data;

  if (total === 0) {
    return (
      <Card className="lg:col-span-4 space-y-8 border-0 shadow-sm rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-medium text-gray-900">
            {title}
          </CardTitle>
          {showDropdown && (
            <button className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 hover:text-gray-900">
              All <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          )}
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="flex items-center justify-center h-48 sm:h-64">
            <p className="text-sm sm:text-base text-gray-500">
              No data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine the maximum scale for the gauge
  const gaugeMax = maxCapacity || Math.ceil(total / 10) * 10;

  // Calculate used vs unused capacity
  const unusedCapacity = gaugeMax - total;

  // Responsive chart configuration
  const getResponsiveSize = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640)
        return { size: 250, radius: 100, strokeWidth: 12 }; // Mobile
      if (window.innerWidth < 768)
        return { size: 280, radius: 120, strokeWidth: 14 }; // Tablet
      return { size: 300, radius: 140, strokeWidth: 15 }; // Desktop
    }
    return { size: 300, radius: 140, strokeWidth: 15 }; // Default
  };

  const { size, radius, strokeWidth } = getResponsiveSize();
  const centerX = size / 2;
  const centerY = size / 2 + 20;

  // Create the gauge path (semi-circle from -180° to 0°)
  const startAngle = -180 * (Math.PI / 180);
  const endAngle = 0 * (Math.PI / 180);
  const totalAngle = endAngle - startAngle;

  // Calculate angles for each segment based on actual counts
  const completedAngle = (completed / gaugeMax) * totalAngle;
  const delayedAngle = (overdue / gaugeMax) * totalAngle;
  const inProgressAngle = (inProgress / gaugeMax) * totalAngle;
  const unusedAngle = (unusedCapacity / gaugeMax) * totalAngle;

  // Generate tick marks (every 5 units, labels every 10 units)
  const generateTickMarks = () => {
    const ticks = [];
    const totalTicks = Math.floor(gaugeMax / 5) + 1; // Tick every 5 units
    const tickLength = size < 280 ? 8 : 10; // Responsive tick length
    const labelOffset = size < 280 ? 25 : 35; // Responsive label offset

    for (let i = 0; i < totalTicks; i++) {
      const tickValue = i * 5;
      if (tickValue > gaugeMax) break;

      const tickAngle = startAngle + (tickValue / gaugeMax) * totalAngle;
      const tickRadius = radius + 15;
      const tickEndRadius = radius + 15 + tickLength;

      const x1 = centerX + tickRadius * Math.cos(tickAngle);
      const y1 = centerY + tickRadius * Math.sin(tickAngle);
      const x2 = centerX + tickEndRadius * Math.cos(tickAngle);
      const y2 = centerY + tickEndRadius * Math.sin(tickAngle);

      ticks.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#e5e7eb"
          strokeWidth={2}
          strokeLinecap="round"
        />
      );

      // Add tick labels every 10 units
      if (tickValue % 10 === 0) {
        const labelRadius = radius + labelOffset;
        const labelX = centerX + labelRadius * Math.cos(tickAngle);
        const labelY = centerY + labelRadius * Math.sin(tickAngle);

        ticks.push(
          <text
            key={`tick-label-${i}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-400 text-xs sm:text-sm"
          >
            {tickValue}
          </text>
        );
      }
    }

    return ticks;
  };

  // Create arc path
  const createArcPath = (
    startAngle: number,
    endAngle: number,
    radius: number
  ) => {
    const start = {
      x: centerX + radius * Math.cos(startAngle),
      y: centerY + radius * Math.sin(startAngle),
    };
    const end = {
      x: centerX + radius * Math.cos(endAngle),
      y: centerY + radius * Math.sin(endAngle),
    };

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  // Calculate segment paths (left to right)
  let currentAngle = startAngle;

  // Completed segment (green) - starts from left
  const completedPath =
    completedAngle > 0
      ? createArcPath(currentAngle, currentAngle + completedAngle, radius)
      : "";
  currentAngle += completedAngle;

  // Delayed segment (yellow)
  const delayedPath =
    delayedAngle > 0
      ? createArcPath(currentAngle, currentAngle + delayedAngle, radius)
      : "";
  currentAngle += delayedAngle;

  // In Progress segment (red)
  const inProgressPath =
    inProgressAngle > 0
      ? createArcPath(currentAngle, currentAngle + inProgressAngle, radius)
      : "";
  currentAngle += inProgressAngle;

  // Unused capacity segment (light gray) - represents the gap between total and max capacity
  const unusedPath =
    unusedAngle > 0
      ? createArcPath(currentAngle, currentAngle + unusedAngle, radius)
      : "";

  // Calculate completion percentage based on total projects
  const completionPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="lg:col-span-4 space-y-8 border-0 shadow-sm rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg font-medium text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center">
          {/* SVG Gauge */}
          <div className="relative w-full flex justify-center">
            <svg
              width={size}
              height={size - 120}
              className="overflow-visible max-w-full h-auto"
              viewBox={`0 0 ${size} ${size - 120}`}
            >
              {/* Background arc */}
              <path
                d={createArcPath(startAngle, endAngle, radius)}
                stroke="#f3f4f6"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
              />

              {/* Completed segment (green) */}
              {completed > 0 && (
                <path
                  d={completedPath}
                  stroke="#10b981"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              )}

              {/* Delayed segment (yellow) */}
              {overdue > 0 && (
                <path
                  d={delayedPath}
                  stroke="#f59e0b"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              )}

              {/* In Progress segment (red) */}
              {inProgress > 0 && (
                <path
                  d={inProgressPath}
                  stroke="#ef4444"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              )}

              {/* Unused capacity segment (light gray) */}
              {unusedCapacity > 0 && (
                <path
                  d={unusedPath}
                  stroke="#d1d5db"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              )}

              {/* Tick marks and labels */}
              {generateTickMarks()}

              {/* Center content */}
              <text
                x={centerX}
                y={centerY - 15}
                textAnchor="middle"
                className="fill-gray-900 text-2xl sm:text-3xl lg:text-4xl font-semibold"
              >
                {completionPercentage}%
              </text>
              <text
                x={centerX}
                y={centerY + 5}
                textAnchor="middle"
                className="fill-gray-500 text-xs sm:text-sm"
              >
                Completed
              </text>
            </svg>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6 w-full max-w-sm sm:max-w-lg">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-semibold text-gray-900">
                {total}
              </div>
              <div className="text-xs sm:text-xs text-gray-500">
                Total projects
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-semibold text-green-600">
                {completed}
              </div>
              <div className="text-xs sm:text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-semibold text-yellow-600">
                {overdue}
              </div>
              <div className="text-xs sm:text-xs text-gray-500">Overdue</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-semibold text-red-500">
                {inProgress}
              </div>
              <div className="text-xs sm:text-xs text-gray-500">Ongoing</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
