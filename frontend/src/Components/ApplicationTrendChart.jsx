// src/components/analytics/ApplicationTrendChart.jsx
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";

// Register necessary chart.js modules
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const ApplicationTrendChart = ({ trendData }) => {
	const dates = trendData.map((item) => item.date);
	const counts = trendData.map((item) => item.count);

	const data = {
		labels: dates,
		datasets: [
			{
				label: "Applications Over Time",
				data: counts,
				fill: false,
				borderColor: "#3b82f6",
				tension: 0.3,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
		},
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-md w-full max-w-2xl mx-auto">
			<h3 className="text-lg font-semibold text-center mb-2">📈 Application Trend</h3>
			<Line data={data} options={options} />
		</div>
	);
};

export default ApplicationTrendChart;
