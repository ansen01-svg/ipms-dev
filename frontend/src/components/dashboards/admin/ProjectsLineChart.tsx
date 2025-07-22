'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function ProjectsLineChart({
  data,
}: {
  data: { id: number; Pname: string; status: string }[]
}) {
  const labels = data.map((project) => project.Pname)
  const values = data.map((_, index) => index + 1) // Just a count of creation

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Projects Created Over Time',
        data: values,
        fill: false,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  }

  return <Line data={chartData} options={options} />
}
