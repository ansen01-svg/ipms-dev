// components/Charts.tsx
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend as ChartJSLegend,
  Tooltip as ChartJSTooltip,
  LinearScale,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import {
  Bar as ChartBar,
  Line as ChartLine,
  Doughnut,
  Pie,
} from "react-chartjs-2";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
// Register Chart.js elements
ChartJS.register(
  ArcElement,
  ChartJSTooltip,
  ChartJSLegend,
  CategoryScale,
  BarElement,
  Title,
  LinearScale,
  PointElement,
  LineElement
);

// Project By Budget Type (Pie Chart)
export const ProjectByBudgetTypeChart = () => {
  <h4 style={{ fontSize: 14, marginBottom: 8 }}>Casualties by Month</h4>;
  const data = {
    labels: ["Roofing", "Building", "Fly Over", "Bridge", "Construction"],
    datasets: [
      {
        label: "Projects by Budget Type",
        data: [50000, 20000, 15000, 5000, 2000], // Dummy data
        backgroundColor: [
          "#3B82F6",
          "#22D3EE",
          "#9333EA",
          "#F472B6",
          "#F87171",
        ],
        borderColor: ["#2563EB", "#06B6D4", "#9333EA", "#F472B6", "#F87171"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h4 style={{ fontSize: 14, marginBottom: 8 }}>Projects by Budget Type</h4>
      <Pie data={data} />
    </div>
  );
};

// Projects by Month (Bar Chart)
const data = [
  { month: "Jun 2024", totalProjects: 1560, completed: 460 },
  { month: "Jul 2024", totalProjects: 1790, completed: 900 },
  { month: "Aug 2024", totalProjects: 1640, completed: 940 },
  { month: "Sep 2024", totalProjects: 1940, completed: 1200 },
  { month: "Oct 2024", totalProjects: 1320, completed: 600 },
  { month: "Nov 2024", totalProjects: 800, completed: 700 },
  { month: "Dec 2024", totalProjects: 1460, completed: 850 },
  { month: "Jan 2025", totalProjects: 1850, completed: 1530 },
  { month: "Feb 2025", totalProjects: 1530, completed: 1700 },
  { month: "Mar 2025", totalProjects: 1700, completed: 1210 },
  { month: "Apr 2025", totalProjects: 1210, completed: 1320 },
  { month: "May 2025", totalProjects: 1320, completed: 1320 },
  { month: "Jun 2025", totalProjects: 1320, completed: 1320 },
];

export const ProjectsByMonthChart = () => {
  return (
    <div className="bg-white dark:bg-white dark:text-black rounded-lg shadow px-2 sm:px-5 py-4 w-full">
      <h4 className="text-sm font-semibold mb-3">Projects by Month</h4>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: -30, bottom: 50, left: -30 }}
          barCategoryGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            angle={-30}
            textAnchor="end"
            height={50}
            interval={0}
            tick={{ fontSize: 8 }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tickFormatter={(value) =>
              value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value
            }
            tick={{ fontSize: 10 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) =>
              value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value
            }
            tick={{ fontSize: 10 }}
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar
            yAxisId="left"
            dataKey="totalProjects"
            name="Total Projects"
            fill="#a855f7"
            barSize={10}
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke="#14b8a6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
export const ProjectTrendsChart = () => {
  const data = {
    labels: [
      "Jun 2023",
      "Jul 2023",
      "Aug 2023",
      "Sep 2023",
      "Oct 2023",
      "Nov 2023",
      "Dec 2023",
      "Jan 2024",
      "Feb 2024",
      "Mar 2024",
      "Apr 2024",
      "May 2024",
    ], // X-axis: Time (months)

    datasets: [
      {
        label: "Project", // Actual Projects
        data: [
          2398, 8311, 8800, 7211, 7000, 8100, 9000, 3500, 7800, 8000, 8500,
          9200,
        ], // Y-axis: Project data
        fill: false,
        borderColor: "#2563EB", // Blue line for projects
        tension: 0.1,
        pointRadius: 5, // Show points at each data point
        pointBackgroundColor: "#2563EB", // Blue color for the points
      },
      {
        label: "Linear (Project Count)", // Linear Trend Line
        data: [
          7190, 7800, 8500, 8500, 8200, 8300, 8600, 8700, 8800, 8900, 9000,
          9500,
        ], // Linear trend data
        fill: false,
        borderColor: "#10B981", // Green dashed line for the trend
        borderDash: [5, 5], // Dashed line style
        tension: 0.1,
        pointRadius: 0, // No points on the trend line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Project Trends over Time (Last 1 Year)", // Title of the chart
        font: {
          size: 14, // Smaller font size for the title
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: import("chart.js").TooltipItem<"line">) =>
            `${tooltipItem.raw} projects`, // Show "projects" in tooltip
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true, // Start X-axis from zero
        ticks: {
          font: {
            size: 10, // Smaller font size for X-axis ticks (months)
          },
          autoSkip: false, // Display all labels on X-axis
        },
        grid: {
          display: false, // Hide grid lines for X-axis
        },
      },
      y: {
        beginAtZero: true, // Start Y-axis from zero
        ticks: {
          font: {
            size: 10, // Smaller font size for Y-axis ticks (project counts)
          },
          stepSize: 1000, // Set step size between ticks on the Y-axis (1000 project per tick)
        },
      },
    },
    // Optional: Adjust the chart size and bar width
    maintainAspectRatio: false, // Allow the chart to stretch according to container size
    barPercentage: 0.9, // Make the bars take up more space
  };

  return (
    <div style={{ height: "400px" }}>
      {" "}
      {/* Set height for the chart container */}
      <ChartLine data={data} options={options} />
    </div>
  );
};

export const ProjectTypesChart = () => {
  const data = {
    labels: [
      "Roofing",
      "Construction",
      "Building",
      "Bridges",
      "Road",
      "Snow Clearance",
      "Flyover",
      "Drainage System",
      "Inspection",
      "Concreting",
    ], // Y-axis: Project types

    datasets: [
      {
        label: "Number of Projects", // X-axis: Dataset (number of projects)
        data: [
          25000, 23000, 21000, 20000, 18000, 15000, 14000, 13000, 12000, 11000,
        ], // Data for the number of accidents
        backgroundColor: "#4CAF50", // Bar color (green)
        borderColor: "#388E3C", // Border color for bars (dark green)
        borderWidth: 1, // Border width
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Top 10 Project Types", // Title of the chart
        font: {
          size: 16, // Smaller font size for the title
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true, // Ensure X-axis starts from zero
        ticks: {
          stepSize: 5000, // Set step size between ticks on the X-axis (5000 accidents per tick)
          font: {
            size: 12, // Smaller font size for X-axis ticks
          },
        },
      },
      y: {
        beginAtZero: true, // Start Y-axis from zero
        ticks: {
          font: {
            size: 12, // Smaller font size for Y-axis ticks
          },
        },
      },
    },
    indexAxis: "y" as const, // Makes the chart horizontal by swapping axes
    maintainAspectRatio: false, // Allow the chart to stretch according to container size
    barPercentage: 0.85, // Bar width
    categoryPercentage: 0.8, // Control the width of the bars
  };

  return (
    <div className="w-full h-[350px]">
      {" "}
      {/* Set height for the chart container */}
      <ChartBar data={data} options={options} />
    </div>
  );
};

export const UserRatioChart = () => {
  const data = {
    labels: ["Active", "Not Active"],
    datasets: [
      {
        data: [60.41, 39.59], // User data (percentages)
        backgroundColor: ["#3B82F6", "#F87171"], // Blue for Active, Red for Not Active
        borderColor: ["#2563EB", "#F87171"], // Border color
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: import("chart.js").TooltipItem<"doughnut">) =>
            `${tooltipItem.raw}%`, // Show percentage in tooltip
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export const ProjectClassChart = () => {
  const data = {
    labels: ["Completed", "Not Completed"],
    datasets: [
      {
        data: [43.84, 56.16], // Project class data (percentages)
        backgroundColor: ["#EF4444", "#22D3EE"], // Red for Completed, Light Blue for Not Completed
        borderColor: ["#B91C1C", "#06B6D4"], // Border color
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: import("chart.js").TooltipItem<"doughnut">) =>
            `${tooltipItem.raw}%`, // Show percentage in tooltip
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};
