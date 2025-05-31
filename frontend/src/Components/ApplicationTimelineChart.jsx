import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ApplicationTimelineChart = ({ trendData }) => {
	const labels = trendData.map((item) => item.date);
	const values = trendData.map((item) => item.count);

	const data = {
		labels,
		datasets: [
			{
				label: "Applications",
				data: values,
				borderColor: "#3b82f6",
				backgroundColor: "#93c5fd",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: { position: "top" },
		},
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl mx-auto my-6">
			<h3 className="text-lg font-semibold text-center mb-2">Your Application Timeline</h3>
			<Line data={data} options={options} />
		</div>
	);
};

export default ApplicationTimelineChart;
