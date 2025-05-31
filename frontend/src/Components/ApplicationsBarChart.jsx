// 📁 components/ApplicationsBarChart.jsx
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ApplicationsBarChart = ({ stats }) => {
	const data = {
		labels: stats.map((s) => s.title),
		datasets: [
			{
				label: "Applications",
				data: stats.map((s) => s.count),
				backgroundColor: "#4f46e5",
			},
		],
	};

	const options = {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
				ticks: { stepSize: 1 },
			},
		},
		plugins: {
			legend: {
				display: false,
			},
		},
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-md w-full max-w-2xl mx-auto">
			<h3 className="text-lg font-semibold text-center mb-2">Applications per Job</h3>
			<Bar data={data} options={options} />
		</div>
	);
};

export default ApplicationsBarChart;
