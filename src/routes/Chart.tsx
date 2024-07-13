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
import { ApexChartProps } from "@/components/LineChart/types";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { default as CandlestickChartBase } from "@/components/CandlestickChart";

interface CompatibleTicker {
	timestamp: number;
	price: number;
}

const LineChart = styled(LineChartBase)`
	margin-top: 15px;
`;

const CandlestickChart = styled(CandlestickChartBase)`
	margin-top: 15px;
`;

const UnknownLineChart = styled.div`
	display: flex;
	justify-content: center;
	padding: 15px;
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
	const { state } = useLocation<RouteStateChart>(); // state가 없으면 undefined
	// console.log("state:", state);

	const tickersRef = useRef<CompatibleTicker[]>([]);
	useLikeConstructor(() => {
		if (state) {
			tickersRef.current = getChartCompatibleTickers(state);
		}
	});
	// console.log("tickers:", tickersRef.current);

	// const {
	// 	isLoading: isLineChartLoading,
	// 	data: lineChartData,
	// 	isError: isLineChartError,
	// 	error: lineChartError,
	// } = useQuery(
	// 	["fetch-coin-info", coinId],
	// 	async () => {
	// 		const data = await fetchInfo({
	// 			apiName: "fetch-coin-info",
	// 			apiParams: { coinId },
	// 		});
	// 		tickersRef.current = getChartCompatibleTickers(data);
	// 		return tickersRef.current;
	// 	},
	// 	{
	// 		initialData:
	// 			tickersRef.current.length === 0 ? undefined : tickersRef.current,
	// 	}
	// );
	// ㄴ 다른 페이지/라우트에서 이미 "fetch-coin-info"를 호출했고 캐시를 통해 데이터를 불러오게 되는 경우 `async () => ... ` 부분이 호출이 되지 않아서 `lineChartData`가 `getChartCompatibleTickers`를 통해 정제된 데이터가 아닌 캐시를 통해 불러오게 된 데이터 값을 가지게 된다. 이 경우 데이터의 타입이 다르게 되어 이 후 코드에서 에러가 생긴다.
	// 해결) 아래 방법
	const {
		isLoading: isCoinInfoLoading,
		data: coinInfoData,
		isError: isCoinInfoError,
		error: coinInfoError,
	} = useQuery(["fetch-coin-info", coinId], () =>
		fetchInfo({ apiName: "fetch-coin-info", apiParams: { coinId } })
	);
	const [stateLineChartData, setStateLineChartData] = useState<
		CompatibleTicker[]
	>([]);
	const isLineChartLoading = isCoinInfoLoading;
	const isLineChartError = isCoinInfoError;
	const lineChartError = coinInfoError;

	useEffect(() => {
		if (!coinInfoData) {
			setStateLineChartData(tickersRef.current);
			return;
		}
		tickersRef.current = getChartCompatibleTickers(coinInfoData);
		setStateLineChartData(tickersRef.current);
	}, [coinInfoData]);
	// console.log("lineChartData:", stateLineChartData);

	const {
		isLoading: isCandlestickChartLoading,
		data: candlestickChartData,
		isError: isCandlestickChartError,
		error: candlestickChartError,
	} = useQuery(["fetch-coin-ohlc-tickers", coinId], () =>
		fetchInfo({
			apiName: "fetch-coin-ohlc-tickers",
			apiParams: { coinId },
		})
	);
	console.log(candlestickChartData);

	const lineChartCustomProps: ApexChartProps | null = stateLineChartData
		? {
				options: {
					yaxis: {
						title: {
							text: "Traded Price",
						},
						min: (min) => {
							// console.log(min);
							// return min < 0 ? 0 : min;
							return min < 1 ? 0 : min;
						},
					},
					xaxis: {
						title: {
							text: "Time",
						},
					},
					// categories: data.map((ticker) => ticker.timestamp),
				},
				series: [
					{
						name: "Price",
						data: stateLineChartData.map((ticker) => {
							const { price, timestamp } = ticker;
							// console.log(price);

							return {
								x: timestamp,
								y: price,
							};
						}),
					},
				],
		  }
		: null;

	const candlestickChartCustomProps: ApexChartProps | null =
		candlestickChartData
			? {
					options: {
						yaxis: {
							title: {
								text: "OHLC",
							},
							min: (min) => {
								// console.log(min);
								// return min < 0 ? 0 : min;
								return min < 1 ? 0 : min;
							},
						},
						xaxis: {
							title: {
								text: "Time",
							},
						},
						// categories: data.map((ticker) => ticker.timestamp),
					},
					series: [
						{
							data: candlestickChartData,
						},
					],
			  }
			: null;

	return (
		<Section>
			<SectionTitle>Price Chart Information</SectionTitle>
			{isLineChartLoading ? (
				<Loader>Loading...</Loader>
			) : isLineChartError ? (
				<ErrorDescription customProps={{ error: lineChartError }} />
			) : lineChartCustomProps ? (
				<LineChart customProps={{ chartCustomProps: lineChartCustomProps }} />
			) : (
				<UnknownLineChart>Unknown</UnknownLineChart>
			)}
			{isCandlestickChartLoading ? (
				<Loader>Loading...</Loader>
			) : isCandlestickChartError ? (
				<ErrorDescription customProps={{ error: candlestickChartError }} />
			) : candlestickChartCustomProps ? (
				<CandlestickChart
					customProps={{ chartCustomProps: candlestickChartCustomProps }}
				/>
			) : (
				<UnknownLineChart>Unknown</UnknownLineChart>
			)}
		</Section>
	);
}

export default Chart;
