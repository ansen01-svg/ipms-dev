import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDistrictAnalytics } from "@/hooks/useDashboardData";
import { AlertTriangle, Filter, MapPin } from "lucide-react";
import React, { useMemo, useState } from "react";

interface DistrictAnalyticsAreaChartProps {
  filters?: {
    status?: string;
    fund?: string;
    timeRange?: string;
    contractorName?: string;
  };
}

interface District {
  districtName: string;
  projectCount: number;
  completedProjects: number;
  ongoingProjects: number;
  contractorCount: number;
  uniqueContractors: string[];
  totalEstimatedCost: number;
  physicalCompletionRate: number;
  financialCompletionRate: number;
  avgPhysicalProgress: number;
  avgFinancialProgress: number;
}

const DistrictAnalyticsAreaChart: React.FC<
  DistrictAnalyticsAreaChartProps
> = () => {
  const { data, isLoading, error } = useDistrictAnalytics();
  const [hoveredPoint, setHoveredPoint] = useState<{
    districtName: string;
    completedProjects: number;
    ongoingProjects: number;
    x: number;
    y: number;
  } | null>(null);

  const districts: District[] = useMemo(() => {
    const originalDistricts = data?.data?.districts || [];

    // Generate wavy dummy data that creates peaks and valleys
    if (originalDistricts.length > 0) {
      interface WavyDistrict extends District {
        completedProjects: number;
        ongoingProjects: number;
        projectCount: number;
      }

      return originalDistricts.map(
        (district: District, index: number): WavyDistrict => {
          // Create wavy pattern using sine waves with different phases
          const baseWave: number =
            Math.sin((index / originalDistricts.length) * Math.PI * 3) * 0.5 +
            0.5;
          const secondaryWave: number =
            Math.sin(
              (index / originalDistricts.length) * Math.PI * 5 + Math.PI / 3
            ) *
              0.3 +
            0.5;
          const tertiaryWave: number =
            Math.sin(
              (index / originalDistricts.length) * Math.PI * 7 + Math.PI / 2
            ) *
              0.2 +
            0.5;

          // Combine waves and add randomness for organic feel
          const waveValue: number =
            (baseWave + secondaryWave + tertiaryWave) / 3;
          const randomFactor: number = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 multiplier

          const completedProjects: number = Math.max(
            1,
            Math.round(waveValue * randomFactor * 18 + 2)
          );
          const ongoingBase: number =
            Math.sin(
              (index / originalDistricts.length) * Math.PI * 4 + Math.PI
            ) *
              0.4 +
            0.6;
          const ongoingProjects: number = Math.max(
            1,
            Math.round(ongoingBase * randomFactor * 12 + 3)
          );

          return {
            ...district,
            completedProjects,
            ongoingProjects,
            projectCount:
              completedProjects +
              ongoingProjects +
              Math.floor(Math.random() * 5),
          };
        }
      );
    }

    return originalDistricts;
  }, [data?.data?.districts]);

  const appliedFilters = useMemo(() => data?.filters || {}, [data?.filters]);

  // Sort districts by name for consistent ordering
  const sortedDistricts = useMemo(() => {
    return [...districts].sort((a, b) =>
      a.districtName.localeCompare(b.districtName)
    );
  }, [districts]);

  if (isLoading) {
    return (
      <Card className="lg:col-span-6 border-0 shadow-sm rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              District Project Completion
            </CardTitle>
            {Object.values(appliedFilters).some((f) => f) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                Filtered
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || sortedDistricts.length === 0) {
    return (
      <Card className="lg:col-span-6 border-0 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load district analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Chart configuration
  const chartWidth = 800;
  const chartHeight = 340; // Increased height
  const padding = { top: 40, right: 40, bottom: 100, left: 80 }; // More bottom padding for slanted text
  const chartAreaWidth = chartWidth - padding.left - padding.right;
  const chartAreaHeight = chartHeight - padding.top - padding.bottom;

  const maxCompletedProjects = Math.max(
    ...sortedDistricts.map((d) => d.completedProjects),
    10
  );
  const yAxisMax = Math.ceil(maxCompletedProjects * 1.1); // Add 10% padding

  // Generate wavy smooth path with enhanced curves
  const generateWavyPath = (districts: District[]) => {
    if (districts.length === 0) return "";

    const points = districts.map((district, index) => {
      const x =
        padding.left + (index / (districts.length - 1)) * chartAreaWidth;
      const y =
        padding.top +
        chartAreaHeight -
        (district.completedProjects / yAxisMax) * chartAreaHeight;
      return { x, y, district };
    });

    if (points.length < 2) return `M ${points[0]?.x || 0} ${points[0]?.y || 0}`;

    // Create very smooth wavy curves using cubic Bezier curves
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const currentPoint = points[i];
      const previousPoint = points[i - 1];

      // Calculate control points for smooth wavy curves
      const cp1x = previousPoint.x + (currentPoint.x - previousPoint.x) * 0.5;
      const cp1y = previousPoint.y;

      const cp2x = currentPoint.x - (currentPoint.x - previousPoint.x) * 0.5;
      const cp2y = currentPoint.y;

      // Add some wave distortion for more organic feel
      const waveOffset = Math.sin(i * 0.8) * 5;

      path += ` C ${cp1x} ${cp1y + waveOffset} ${cp2x} ${cp2y - waveOffset} ${
        currentPoint.x
      } ${currentPoint.y}`;
    }

    return path;
  };

  // Generate area path (same as line but closed to bottom)
  const generateWavyAreaPath = (districts: District[]) => {
    const linePath = generateWavyPath(districts);
    if (!linePath || districts.length === 0) return "";

    const lastPointX = padding.left + chartAreaWidth;
    const bottomY = padding.top + chartAreaHeight;
    const firstPointX = padding.left;

    return `${linePath} L ${lastPointX} ${bottomY} L ${firstPointX} ${bottomY} Z`;
  };

  const areaPath = generateWavyAreaPath(sortedDistricts);
  const linePath = generateWavyPath(sortedDistricts);

  // Generate interactive points
  const interactivePoints = sortedDistricts.map((district, index) => {
    const x =
      padding.left + (index / (sortedDistricts.length - 1)) * chartAreaWidth;
    const y =
      padding.top +
      chartAreaHeight -
      (district.completedProjects / yAxisMax) * chartAreaHeight;
    return { x, y, district };
  });

  // Y-axis label formatting
  const formatYAxisLabel = (value: number) => {
    if (value >= 1000) return `${Math.round(value / 1000)}k`;
    return value.toString();
  };

  return (
    <Card className="lg:col-span-6 border-0 shadow-sm rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              District Wise Projects Distribution
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-4">
        <div className="relative">
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="overflow-visible"
          >
            {/* Define gradient matching the screenshot */}
            <defs>
              <linearGradient
                id="wavyAreaGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#67e8f9" stopOpacity="0.7" />
                <stop offset="60%" stopColor="#5eead4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.4" />
              </linearGradient>
              <filter id="wavyDropShadow">
                <feDropShadow
                  dx="0"
                  dy="1"
                  stdDeviation="2"
                  floodOpacity="0.15"
                />
              </filter>
            </defs>

            {/* Y-axis title */}
            <text
              x={25}
              y={padding.top + chartAreaHeight / 2}
              textAnchor="middle"
              className="fill-gray-500 text-lg font-semibold"
              transform={`rotate(-90, 25, ${
                padding.top + chartAreaHeight / 2
              })`}
            >
              Completed Projects
            </text>

            {/* Y-axis grid lines and labels */}
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio) => {
              const value = Math.round(ratio * yAxisMax);
              const y = padding.top + chartAreaHeight - ratio * chartAreaHeight;
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + chartAreaWidth}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth={0.5}
                  />
                  <text
                    x={padding.left - 15}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-gray-400 text-xs"
                  >
                    {formatYAxisLabel(value)}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {sortedDistricts.map((district, index) => {
              const x =
                padding.left +
                (index / (sortedDistricts.length - 1)) * chartAreaWidth;

              return (
                <text
                  key={district.districtName}
                  x={x}
                  y={chartHeight - 25}
                  textAnchor="start"
                  className="fill-gray-500 text-base"
                  transform={`rotate(-45, ${x}, ${chartHeight - 25})`}
                >
                  {district.districtName}
                </text>
              );
            })}

            {/* Wavy area fill */}
            <path
              d={areaPath}
              fill="url(#wavyAreaGradient)"
              filter="url(#wavyDropShadow)"
            />

            {/* Main wavy line */}
            <path
              d={linePath}
              stroke="#0891b2"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive points */}
            {interactivePoints.map((point) => (
              <circle
                key={point.district.districtName}
                cx={point.x}
                cy={point.y}
                r={4}
                fill="#0891b2"
                stroke="white"
                strokeWidth={2}
                className="cursor-pointer hover:r-6 transition-all"
                onMouseEnter={() =>
                  setHoveredPoint({
                    districtName: point.district.districtName,
                    completedProjects: point.district.completedProjects,
                    ongoingProjects: point.district.ongoingProjects,
                    x: point.x,
                    y: point.y,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}

            {/* Hover tooltip with black rounded background like screenshot */}
            {hoveredPoint && (
              <g>
                <rect
                  x={hoveredPoint.x - 75}
                  y={hoveredPoint.y - 60}
                  width={150}
                  height={50}
                  fill="rgba(0, 0, 0, 0.85)"
                  rx={6}
                />
                <text
                  x={hoveredPoint.x}
                  y={hoveredPoint.y - 45}
                  textAnchor="middle"
                  className="fill-white text-sm font-semibold"
                >
                  Ongoing Projects - {hoveredPoint.ongoingProjects}
                </text>
                <text
                  x={hoveredPoint.x}
                  y={hoveredPoint.y - 30}
                  textAnchor="middle"
                  className="fill-white text-sm"
                >
                  {hoveredPoint.districtName}
                </text>
                {/* Tooltip pointer */}
                <polygon
                  points={`${hoveredPoint.x},${hoveredPoint.y - 25} ${
                    hoveredPoint.x - 4
                  },${hoveredPoint.y - 15} ${hoveredPoint.x + 4},${
                    hoveredPoint.y - 15
                  }`}
                  fill="rgba(0, 0, 0, 0.85)"
                />
              </g>
            )}

            {/* Top right update timestamp */}
            <text
              x={chartWidth - 40}
              y={25}
              textAnchor="end"
              className="fill-gray-400 text-xs"
            >
              Updates:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
              })}
            </text>

            {/* Peak indicators similar to screenshot */}
            {(() => {
              const peaks = interactivePoints
                .map((point, index) => ({ ...point, index }))
                .filter((point, index, arr) => {
                  const prev = arr[index - 1];
                  const next = arr[index + 1];
                  return (
                    (!prev ||
                      point.district.completedProjects >
                        prev.district.completedProjects) &&
                    (!next ||
                      point.district.completedProjects >
                        next.district.completedProjects) &&
                    point.district.completedProjects >
                      maxCompletedProjects * 0.7
                  );
                })
                .slice(0, 2); // Show top 2 peaks

              return peaks.map((peak, i) => (
                <g key={i}>
                  <circle
                    cx={peak.x}
                    cy={peak.y}
                    r={6}
                    fill={i === 0 ? "#059669" : "#0891b2"}
                    stroke="white"
                    strokeWidth={2}
                  />
                  <text
                    x={peak.x}
                    y={peak.y - 12}
                    textAnchor="middle"
                    className="fill-gray-700 text-xs font-semibold"
                  >
                    {i === 0 ? "MAX" : "HIGH"}
                  </text>
                </g>
              ));
            })()}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistrictAnalyticsAreaChart;
