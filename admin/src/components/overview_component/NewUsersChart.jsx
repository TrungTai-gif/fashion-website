import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const generateMockUsers = (days = 30) => {
  const arr = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push({
      date: d.toISOString().slice(0, 10),
      count: Math.round(Math.random() * 30),
    });
  }
  return arr;
};

const NewUsersChart = ({ data }) => {
  const src = data && data.length ? data : generateMockUsers(30);

  const labels = src.map((s) => s.date);
  const dataset = src.map((s) => s.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "New users",
        data: dataset,
        backgroundColor: "#10b981",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "New Users (last 30 days)" },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default NewUsersChart;
