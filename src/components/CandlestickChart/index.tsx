import React, {
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { useTheme } from "styled-components";
import { merge } from "lodash";
import * as Styles from "./styles";
import {
	ApexChartBaseElement,
	ApexChartProps,
	CandlestickChartBaseElement,
	CandlestickChartHandle,
	CandlestickChartProps,
} from "./types";
import { formatDate } from "@/utils/formatDate";

const CandlestickChart = React.memo(
	React.forwardRef<CandlestickChartHandle, CandlestickChartProps>(
		({ customProps, ...otherProps }, ref) => {
			const CandlestickChartBaseElementRef =
				useRef<CandlestickChartBaseElement | null>(null);
			const CandlestickChartInternalComponentBaseElementRef =
				useRef<ApexChartBaseElement | null>(null);
			const [statePathElement, setStatePathElement] =
				useState<SVGPathElement | null>(null);
			const [statePathLength, setStatePathLength] = useState<number>(
				customProps.chartCustomProps.customProps?.pathLength ?? 0
			);

			useImperativeHandle(ref, () => {
				return {
					candlestickChartBaseElement: CandlestickChartBaseElementRef.current,
					candlestickChartInternalComponentBaseElement:
						CandlestickChartInternalComponentBaseElementRef.current,
					candlestickChartPathElement: statePathElement,
				};
			});

			useLayoutEffect(() => {
				if (CandlestickChartBaseElementRef.current) {
					const pathElement: SVGPathElement | null =
						CandlestickChartBaseElementRef.current.querySelector(
							".apexcharts-series path"
						);
					setStatePathElement(pathElement);
				}
			}, []);

			useLayoutEffect(() => {
				if (statePathElement) {
					const pathLength = statePathElement.getTotalLength();
					setStatePathLength(pathLength);
				}
			}, [statePathElement]);

			const theme = useTheme();

			const chartFontFamily = theme.candlestickChartFontFamily
				? theme.candlestickChartFontFamily
				: `sans-serif`;

			// const chartGradientColorFrom = theme.candlestickChartGradientColorFrom
			// 	? theme.candlestickChartGradientColorFrom
			// 	: "#0be881";
			// const chartGradientColorTo = theme.candlestickChartGradientColorTo
			// 	? theme.candlestickChartGradientColorTo
			// 	: "#0fbcf9";

			// const chartGridBorderColor = theme.candlestickChartGridBorderColor
			// 	? theme.candlestickChartGridBorderColor
			// 	: "#fafafa";

			const chartBackgroundColor = theme.candlestickChartBackgroundColor
				? theme.candlestickChartBackgroundColor
				: "#111";

			const chartCandlestickColorUpward =
				theme.candlestickChartCandlestickColorUpward
					? theme.candlestickChartCandlestickColorUpward
					: "#3fb27f";

			const chartCandlestickColorDownward =
				theme.candlestickChartCandlestickColorDownward
					? theme.candlestickChartCandlestickColorDownward
					: "#e84142";

			const chartXAxisTitleColor = theme.candlestickChartXAxisTitleColor
				? theme.candlestickChartXAxisTitleColor
				: "#fafafa";
			const chartXAxisTickColor = theme.candlestickChartXAxisTickColor
				? theme.candlestickChartXAxisTickColor
				: "#fafafa";
			const chartXAxisBorderColor = theme.candlestickChartXAxisBorderColor
				? theme.candlestickChartXAxisBorderColor
				: "#fafafa";
			const chartXAxisLabelColor = theme.candlestickChartXAxisLabelColor
				? theme.candlestickChartXAxisLabelColor
				: "#fafafa";

			const chartYAxisTitleColor = theme.candlestickChartYAxisTitleColor
				? theme.candlestickChartYAxisTitleColor
				: "#fafafa";
			const chartYAxisTickColor = theme.candlestickChartYAxisTickColor
				? theme.candlestickChartYAxisTickColor
				: "#fafafa";
			const chartYAxisBorderColor = theme.candlestickChartYAxisBorderColor
				? theme.candlestickChartYAxisBorderColor
				: "#fafafa";
			const chartYAxisLabelColor = theme.candlestickChartYAxisLabelColor
				? theme.candlestickChartYAxisLabelColor
				: "#fafafa";

			const apexChartCustomProps = customProps.chartCustomProps;
			const apexChartDefaultProps: ApexChartProps = {
				type: "candlestick",
				options: {
					theme: { mode: "dark" },
					chart: {
						// width: 500,
						// height: 300,
						parentHeightOffset: 0,
						toolbar: {
							// show: false,
							tools: {
								pan: false,
								reset: false,
								selection: false,
								zoom: false,
								zoomin: false,
								zoomout: false,
								download: true,
							},
							offsetX: 13,
							offsetY: -22,
						},
						background: chartBackgroundColor,
					},
					plotOptions: {
						candlestick: {
							colors: {
								upward: chartCandlestickColorUpward, // 상승 시 색상
								downward: chartCandlestickColorDownward, // 하락 시 색상
							},
						},
					},
					stroke: {
						width: 2,
					},
					yaxis: {
						title: {
							offsetX: -5,
							style: {
								color: chartYAxisTitleColor,
								fontFamily: chartFontFamily,
								fontSize: "14px",
								fontWeight: "medium",
							},
						},
						axisBorder: {
							show: true,
							color: chartYAxisBorderColor,
						},
						axisTicks: {
							show: true,
							offsetY: 0,
							color: chartYAxisTickColor,
						},
						labels: {
							formatter: (value) => `$ ${value.toFixed(2)}`,
							style: { colors: chartYAxisLabelColor },
						},
						forceNiceScale: true,
					},
					xaxis: {
						type: "datetime",
						// type: "category",
						title: {
							text: "Time",
							offsetY: 5,
							// offsetY: -20,
							style: {
								color: chartXAxisTitleColor,
								fontFamily: chartFontFamily,
								fontSize: "14px",
								fontWeight: "medium",
							},
						},
						axisBorder: {
							show: false,
							color: chartXAxisBorderColor,
						},
						axisTicks: {
							show: true,
							offsetX: 1,
							color: chartXAxisTickColor,
						},
						labels: {
							offsetX: 0,
							trim: false,
							hideOverlappingLabels: true,
							// ㄴ `trim`, `hideOverlappingLabels`: prevent labels from clipping or not showing at all
							formatter: (timestamp) => {
								// console.log(timestamp);
								// const epochTime = dateStringToEpochTime(timestamp);
								const epochTime = parseInt(timestamp);
								const { formattedTime } = formatDate(epochTime);

								// const formattedDateTime = `${formattedDate} ${formattedTime}`;
								// return formattedDateTime;

								const hms = formattedTime.split(":");
								const formattedHourAndMinute = `${hms[0]}:${hms[1]}`;
								return formattedHourAndMinute;
							},
							style: {
								colors: chartXAxisLabelColor,
							},
						},
					},
					// tooltip: {
					// 	// cf> https://stackoverflow.com/questions/62552227/apexcharts-tooltip-how-to-add-extra-data-for-candlestick-chart
					// 	// cf> https://github.com/apexcharts/apexcharts.js/issues/995
					// 	// custom: function ({ seriesIndex, dataPointIndex, w }) {
					// 	// 	const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
					// 	// 	const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
					// 	// 	const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
					// 	// 	const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
					// 	// 	return (
					// 	// 		'<div class="apexcharts-tooltip-candlestick">' +
					// 	// 		'<div>Open: <span class="value">' +
					// 	// 		o +
					// 	// 		"</span></div>" +
					// 	// 		'<div>High: <span class="value">' +
					// 	// 		h +
					// 	// 		"</span></div>" +
					// 	// 		'<div>Low: <span class="value">' +
					// 	// 		l +
					// 	// 		"</span></div>" +
					// 	// 		'<div>Close: <span class="value">' +
					// 	// 		c +
					// 	// 		"</span></div>" +
					// 	// 		"</div>"
					// 	// 	);
					// 	// },
					// 	// y: {
					// 	// 	formatter: (value) => `$ ${value.toFixed(2)}`,
					// 	// },
					// },
				},
			};

			const apexChartProps = merge(apexChartDefaultProps, apexChartCustomProps);

			apexChartProps.customProps = {
				...apexChartProps.customProps,
				pathLength: statePathLength,
			};

			// console.log(chartProps);

			return (
				<Styles.CandlestickChart
					ref={CandlestickChartBaseElementRef}
					{...otherProps}
				>
					<Styles.ApexChart
						ref={CandlestickChartInternalComponentBaseElementRef}
						{...apexChartProps}
					/>
				</Styles.CandlestickChart>
			);
		}
	)
);

CandlestickChart.displayName = "CandlestickChart";

export default CandlestickChart;
