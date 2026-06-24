import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const generateMockOrders = (days = 30) => {
  const arr = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push({
      date: d.toISOString().slice(0, 10),
      count: Math.round(Math.random() * 50),
    });
  }
  return arr;
};

const RevenueChart = ({ data }) => {
  // Treat incoming `data` as array of { date, count }
  const src = data && data.length ? data : generateMockOrders(30);

  const labels = src.map((s) => s.date);
  const dataset = src.map((s) => s.count ?? s.orders ?? 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Daily Orders",
        data: dataset,
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124,58,237,0.2)",
        fill: true,
        tension: 0.25,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Orders (last 30 days)" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white border shadow-sm rounded-xl">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default RevenueChart;
