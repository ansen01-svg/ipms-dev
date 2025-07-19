'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function UsersBarChart({
  data,
}: {
  data: { user: string; active: string }[]
}) {
  const labels = data.map((item) => item.user)
  const values = data.map((item) => parseInt(item.active))

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Active Users',
        data: values,
        backgroundColor: '#3b82f6',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return <Bar data={chartData} options={options} />
}
