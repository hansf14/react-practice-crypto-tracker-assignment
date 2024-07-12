import { useQuery } from "react-query";
import {
	ICoinInfo,
	RouteParamsChart,
	RouteStateChart,
	fetchInfo,
} from "@/apis";
import { useLocation, useParams } from "react-router-dom";
import Section, { SectionTitle } from "@/components/Section";
import Loader from "@/components/Loader";
import ErrorDescription from "@/components/ErrorDescription";
import { dateStringToEpochTime, formatDate } from "@/utils/formatDate";
import useLikeConstructor from "@/hooks/useLikeConstructor";
import { default as LineChartBase } from "@/components/LineChart";
import { LineChartProps } from "@/components/LineChart/types";
import styled from "styled-components";
import { useRef } from "react";

interface CompatibleTicker {
	timestamp: number;
	price: number;
}

const LineChart = styled(LineChartBase)`
	margin-top: 15px;
`;

function getChartCompatibleTickers(data: ICoinInfo | RouteStateChart) {
	data.tickers.sort(
		(ticker1, ticker2) =>
			dateStringToEpochTime(ticker1.timestamp) -
			dateStringToEpochTime(ticker2.timestamp)
	);

	const formattedTimestamps: string[] = [];
	const sampledTickers: CompatibleTicker[] = [];
	for (let i = 0, j = 0; i < data.tickers.length; i++) {
		const epochTime = dateStringToEpochTime(data.tickers[i].timestamp);
		const { formattedTime } = formatDate(epochTime);
		const hms = formattedTime.split(":");
		const formattedHourAndMinute = `${hms[0]}:${hms[1]}`;

		if (j === 0 || formattedTimestamps[j - 1] !== formattedHourAndMinute) {
			formattedTimestamps[j] = formattedHourAndMinute;
			sampledTickers[j] = {
				timestamp: epochTime,
				price: parseFloat(data.tickers[i].converted_last.usd.toFixed(2)),
			};
			j++;
		}
	}

	return sampledTickers;
}

function Chart() {
	const { coinId } = useParams<RouteParamsChart>();
	const { state } = useLocation<RouteStateChart>();

	const tickersRef = useRef<CompatibleTicker[]>([]);

	useLikeConstructor(() => {
		if (state) {
			tickersRef.current = getChartCompatibleTickers(state);
		}
	});

	const { isLoading, data, isError, error } = useQuery(
		["chart", coinId],
		async () => {
			const data = await fetchInfo({
				apiName: "fetch-coin-info",
				apiParams: { coinId },
			});
			tickersRef.current = getChartCompatibleTickers(data);
			return data;
		},
		{
			initialData: state ?? undefined,
		}
	);

	// console.log("state:", state);
	// console.log(data);
	console.log("tickers:", tickersRef.current);

	const lineChartCustomProps:
		| LineChartProps["customProps"]["chartProps"]
		| null = tickersRef.current
		? {
				// options: {
				// 	xaxis: {
				// 		categories: tickers.map((ticker) => ticker.timestamp),
				// 	},
				// },
				// series: [
				// 	{
				// 		name: "Price",
				// 		data: tickers.map((ticker) => {
				// 			const price = ticker.price;
				// 			// console.log(price);
				// 			return price;
				// 		}),
				// 	},
				// ],
				series: [
					{
						name: "Price",
						data: tickersRef.current.map((ticker) => {
							return {
								x: ticker.timestamp,
								y: ticker.price,
							};
						}),
					},
				],
		  }
		: null;

	return (
		<>
			<Section>
				<SectionTitle>Traded Price Information</SectionTitle>
				{isLoading ? (
					<Loader>Loading...</Loader>
				) : isError ? (
					<ErrorDescription customProps={{ error }} />
				) : lineChartCustomProps ? (
					<LineChart customProps={{ chartProps: lineChartCustomProps }} />
				) : (
					"Unknown"
				)}
			</Section>
		</>
	);
}

export default Chart;
