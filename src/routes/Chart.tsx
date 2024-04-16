// import { useParams } from "react-router-dom";

import { useQuery } from "react-query";
import { fetchCoinInfo } from "@/api";
import ApexChart from "react-apexcharts";

interface IHistoricalData {
	time_open: string;
	time_close: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	market_cap: number;
}

interface ChartProps {
	coinId: string;
}

function Chart({ coinId }: ChartProps) {
	// const params = useParams();
	// const { isLoading, data } = useQuery<IHistoricalData[] | { error: string }>(
	// 	["ohlcv", coinId],
	// 	() => fetchCoinInfo(coinId),
	// 	// {
	// 	// 	refetchInterval: 10000,
	// 	// }
	// );

	return (
		<div>
			{/* {isLoading ? (
				"Loading chart..."
			) : (data as { error: string }).error ? (
				(data as { error: string }).error
			) : (
				<ApexChart
					type="line"
					options={{
						theme: { mode: "dark" },
						chart: {
							width: 500,
							height: 300,
							toolbar: { show: false },
							background: "transparent",
						},
						grid: { show: false },
						stroke: {
							curve: "smooth",
							width: 5,
						},
						yaxis: { show: false },
						xaxis: {
							labels: { show: false },
							axisBorder: { show: false },
							axisTicks: {
								show: false,
							},
							type: "datetime",
							categories: (data as IHistoricalData[])?.map((price) => {
								// const date = new Date(parseInt(price.time_close) * 1000)
								// 	.toISOString()
								// 	.split("T")[0];
								//
								// return date;
								// 2024-04-13

								const date = new Date(parseInt(price.time_close) * 1000);
								const year = date.getFullYear();
								const monthIndex = date.getMonth();
								const day = date.getDate();

								const months = [
									"Jan",
									"Feb",
									"Mar",
									"Apr",
									"May",
									"Jun",
									"Jul",
									"Aug",
									"Sep",
									"Oct",
									"Nov",
									"Dec",
								];

								const formattedDate = `${year}/${months[monthIndex]}/${
									day < 10 ? "0" + day : day
								}`;

								return formattedDate;
							}),
						},
						fill: {
							type: "gradient",
							gradient: {
								// gradientToColors: ["blue"],
								gradientToColors: ["#0be881"],
								stops: [0, 100],
							},
						},
						// colors: ["red"],
						colors: ["#0fbcf9"],
						tooltip: {
							y: {
								formatter: (value) => `$${value.toFixed(2)}`,
							},
						},
					}}
					series={[
						{
							name: "Price",
							data:
								(data as IHistoricalData[])?.map((price) => price.close) ?? [],
						},
					]}
				/>
			)

			// <ApexChart
			// 	type="line"
			// 	options={{
			// 		theme: { mode: "dark" },
			// 		chart: { width: 500, height: 500 },
			// 	}}
			// 	series={[
			// 		{
			// 			name: "hello",
			// 			data: [1, 2, 3, 4, 5, 6],
			// 		},
			// 		{
			// 			name: "sales",
			// 			data: [15, 18, 15, 78, 56],
			// 		},
			// 	]}
			// />
			} */}
		</div>
	);
}

export default Chart;
