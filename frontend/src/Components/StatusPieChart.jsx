import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart types
ChartJS.register(ArcElement, Tooltip, Legend);

const StatusPieChart = ({ stats }) => {
	const { Pending = 0, Selected = 0, Rejected = 0 } = stats;

	const data = {
		labels: ["Pending", "Selected", "Rejected"],
		datasets: [
			{
				label: "Application Status",
				data: [Pending, Selected, Rejected],
				backgroundColor: ["#facc15", "#4ade80", "#f87171"], // yellow, green, red
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "bottom",
			},
		},
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
			<h3 className="text-lg font-semibold text-center mb-2">Application Status Breakdown</h3>
			<Pie data={data} options={options} />
		</div>
	);
};

export default StatusPieChart;
