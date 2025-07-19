'use client'

import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function TasksChart({
  data,
}: {
  data: { task: string; total: string }[]
}) {
  const labels = data.map((item) => item.task)
  const values = data.map((item) => parseInt(item.total))

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Task Distribution',
        data: values,
        backgroundColor: ['#10b981', '#facc15'],
        borderColor: ['#065f46', '#ca8a04'],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
  }

  return <Pie data={chartData} options={options} />
}
