import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDistrictAnalytics } from "@/hooks/useDashboardData";
import { AlertTriangle, Filter, MapPin } from "lucide-react";
import React, { useMemo, useState } from "react";

interface DistrictAnalyticsBarChartProps {
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

const DistrictAnalyticsBarChart: React.FC<
  DistrictAnalyticsBarChartProps
> = () => {
  const { data, isLoading, error } = useDistrictAnalytics();
  const [hoveredBar, setHoveredBar] = useState<{
    districtName: string;
    completedProjects: number;
    ongoingProjects: number;
    totalProjects: number;
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

  // Chart configuration with responsive sizing
  const baseChartWidth = 800;
  const minBarWidth = 40;
  const maxBarWidth = 60;
  const chartHeight = 400;
  const padding = { top: 40, right: 40, bottom: 120, left: 80 };

  // Calculate optimal bar width and chart width
  const districtCount = sortedDistricts.length;
  const optimalBarWidth = Math.min(
    maxBarWidth,
    Math.max(minBarWidth, (baseChartWidth / districtCount) * 0.6)
  );
  const barSpacing = optimalBarWidth * 0.3;
  const totalBarsWidth =
    districtCount * optimalBarWidth + (districtCount - 1) * barSpacing;
  const chartWidth = Math.max(
    baseChartWidth,
    totalBarsWidth + padding.left + padding.right
  );

  const chartAreaWidth = chartWidth - padding.left - padding.right;
  const chartAreaHeight = chartHeight - padding.top - padding.bottom;

  // Calculate maximum total projects for Y-axis scaling
  const maxTotalProjects = Math.max(
    ...sortedDistricts.map((d) => d.completedProjects + d.ongoingProjects),
    10
  );
  const yAxisMax = Math.ceil(maxTotalProjects * 1.1); // Add 10% padding

  // Y-axis label formatting
  const formatYAxisLabel = (value: number) => {
    if (value >= 1000) return `${Math.round(value / 1000)}k`;
    return value.toString();
  };

  // Generate bar data with positions
  const barData = sortedDistricts.map((district, index) => {
    const totalProjects = district.completedProjects + district.ongoingProjects;
    const barX = padding.left + index * (optimalBarWidth + barSpacing);

    // Calculate heights based on values
    const completedHeight =
      (district.completedProjects / yAxisMax) * chartAreaHeight;
    const ongoingHeight =
      (district.ongoingProjects / yAxisMax) * chartAreaHeight;

    // Positions for stacked bars
    const completedY = padding.top + chartAreaHeight - completedHeight;
    const ongoingY = completedY - ongoingHeight;

    return {
      district,
      totalProjects,
      barX,
      completedHeight,
      ongoingHeight,
      completedY,
      ongoingY,
    };
  });

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
        <div className="relative overflow-x-auto">
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="overflow-visible"
            style={{ minWidth: chartWidth }}
          >
            {/* Define gradients for the bars - CHANGE BAR COLORS HERE */}
            <defs>
              <linearGradient
                id="completedGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0f766e" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient
                id="ongoingGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#5eead4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.8" />
              </linearGradient>
              <filter id="barDropShadow">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="3"
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
              Total Projects
            </text>

            {/* Y-axis grid lines and labels - MORE SUBTLE DOTTED LINES */}
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
                    stroke="#e2e8f0"
                    strokeWidth={0.8}
                    strokeDasharray="3,3"
                    opacity={0.6}
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
            {barData.map((bar) => {
              const labelX = bar.barX + optimalBarWidth / 2;

              return (
                <text
                  key={bar.district.districtName}
                  x={labelX}
                  y={chartHeight - 25}
                  textAnchor="start"
                  className="fill-gray-500 text-sm"
                  transform={`rotate(-45, ${labelX}, ${chartHeight - 25})`}
                >
                  {bar.district.districtName}
                </text>
              );
            })}

            {/* Stacked bars with rounded top corners only */}
            {barData.map((bar) => {
              // Create path for rounded top corners only
              const borderRadius = 6;
              const topBarPath = `
                M ${bar.barX} ${bar.ongoingY + borderRadius}
                Q ${bar.barX} ${bar.ongoingY} ${bar.barX + borderRadius} ${
                bar.ongoingY
              }
                L ${bar.barX + optimalBarWidth - borderRadius} ${bar.ongoingY}
                Q ${bar.barX + optimalBarWidth} ${bar.ongoingY} ${
                bar.barX + optimalBarWidth
              } ${bar.ongoingY + borderRadius}
                L ${bar.barX + optimalBarWidth} ${
                bar.ongoingY + bar.ongoingHeight
              }
                L ${bar.barX} ${bar.ongoingY + bar.ongoingHeight}
                Z
              `;

              return (
                <g key={bar.district.districtName}>
                  {/* Completed projects bar (bottom) - square corners */}
                  <rect
                    x={bar.barX}
                    y={bar.completedY}
                    width={optimalBarWidth}
                    height={bar.completedHeight}
                    fill="url(#completedGradient)"
                    filter="url(#barDropShadow)"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onMouseEnter={() => {
                      setHoveredBar({
                        districtName: bar.district.districtName,
                        completedProjects: bar.district.completedProjects,
                        ongoingProjects: bar.district.ongoingProjects,
                        totalProjects: bar.totalProjects,
                        x: bar.barX + optimalBarWidth / 2,
                        y: bar.ongoingY,
                      });
                    }}
                    onMouseLeave={() => setHoveredBar(null)}
                  />

                  {/* Ongoing projects bar (top) - rounded top corners only */}
                  <path
                    d={topBarPath}
                    fill="url(#ongoingGradient)"
                    filter="url(#barDropShadow)"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onMouseEnter={() => {
                      setHoveredBar({
                        districtName: bar.district.districtName,
                        completedProjects: bar.district.completedProjects,
                        ongoingProjects: bar.district.ongoingProjects,
                        totalProjects: bar.totalProjects,
                        x: bar.barX + optimalBarWidth / 2,
                        y: bar.ongoingY,
                      });
                    }}
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                </g>
              );
            })}

            {/* Hover tooltip */}
            {hoveredBar && (
              <g>
                <rect
                  x={hoveredBar.x - 85}
                  y={hoveredBar.y - 80}
                  width={170}
                  height={70}
                  fill="rgba(0, 0, 0, 0.85)"
                  rx={6}
                />
                <text
                  x={hoveredBar.x}
                  y={hoveredBar.y - 60}
                  textAnchor="middle"
                  className="fill-white text-sm font-semibold"
                >
                  {hoveredBar.districtName}
                </text>
                <text
                  x={hoveredBar.x}
                  y={hoveredBar.y - 45}
                  textAnchor="middle"
                  className="fill-white text-xs"
                >
                  Total: {hoveredBar.totalProjects} projects
                </text>
                <text
                  x={hoveredBar.x}
                  y={hoveredBar.y - 30}
                  textAnchor="middle"
                  className="fill-teal-300 text-xs"
                >
                  Completed: {hoveredBar.completedProjects}
                </text>
                <text
                  x={hoveredBar.x}
                  y={hoveredBar.y - 15}
                  textAnchor="middle"
                  className="fill-teal-200 text-xs"
                >
                  Ongoing: {hoveredBar.ongoingProjects}
                </text>
                {/* Tooltip pointer */}
                <polygon
                  points={`${hoveredBar.x},${hoveredBar.y - 10} ${
                    hoveredBar.x - 6
                  },${hoveredBar.y} ${hoveredBar.x + 6},${hoveredBar.y}`}
                  fill="rgba(0, 0, 0, 0.85)"
                />
              </g>
            )}

            {/* Legend */}
            <g transform={`translate(${chartWidth - 200}, ${padding.top})`}>
              <rect
                x={0}
                y={0}
                width={12}
                height={12}
                fill="url(#completedGradient)"
                rx={2}
              />
              <text x={18} y={9} className="fill-gray-600 text-xs">
                Completed Projects
              </text>
              <rect
                x={0}
                y={20}
                width={12}
                height={12}
                fill="url(#ongoingGradient)"
                rx={2}
              />
              <text x={18} y={29} className="fill-gray-600 text-xs">
                Ongoing Projects
              </text>
            </g>

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
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistrictAnalyticsBarChart;
