import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const JobBarChart = ({ stats }) => {
	const jobTitles = stats.map((item) => item.jobTitle);
	const counts = stats.map((item) => item.count);

	const data = {
		labels: jobTitles,
		datasets: [
			{
				label: "Applications Received",
				data: counts,
				backgroundColor: "#60a5fa", // blue
				borderRadius: 5,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
		},
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-6">
			<h3 className="text-lg font-semibold text-center mb-4">Applications per Job</h3>
			<Bar data={data} options={options} />
		</div>
	);
};

export default JobBarChart;
