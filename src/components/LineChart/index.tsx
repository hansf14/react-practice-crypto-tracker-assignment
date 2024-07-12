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
	LineChartBaseElement,
	LineChartHandle,
	LineChartProps,
} from "./types";
import { formatDate } from "@/utils/formatDate";

const LineChart = React.memo(
	React.forwardRef<LineChartHandle, LineChartProps>(
		({ customProps, ...otherProps }, ref) => {
			const lineChartBaseElementRef = useRef<LineChartBaseElement | null>(null);
			const lineChartInternalComponentBaseElementRef =
				useRef<ApexChartBaseElement | null>(null);
			const pathRef = useRef<SVGPathElement | null>(null);
			const [statePathLength, setStatePathLength] = useState<number>(
				customProps.chartProps.customProps?.pathLength ?? 0
			);

			useImperativeHandle(ref, () => {
				return {
					lineChartBaseElement: lineChartBaseElementRef.current,
					lineChartInternalComponentBaseElement:
						lineChartInternalComponentBaseElementRef.current,
					lineChartPathElement: pathRef.current,
				};
			});

			useLayoutEffect(() => {
				if (lineChartBaseElementRef.current) {
					pathRef.current = lineChartBaseElementRef.current.querySelector(
						".apexcharts-series path"
					);
					const pathLength =
						pathRef.current?.getTotalLength() ?? statePathLength;
					setStatePathLength(pathLength);
				}
			}, [statePathLength]);

			const theme = useTheme();

			const chartFontFamily = theme.lineChartFontFamily
				? theme.lineChartFontFamily
				: `sans-serif`;

			const chartGradientColorFrom = theme.lineChartGradientColorFrom
				? theme.lineChartGradientColorFrom
				: "#0be881";
			const chartGradientColorTo = theme.lineChartGradientColorTo
				? theme.lineChartGradientColorTo
				: "#0fbcf9";

			const chartGridBorderColor = theme.lineChartGridBorderColor
				? theme.lineChartGridBorderColor
				: "#fafafa";

			const chartBackgroundColor = theme.lineChartBackgroundColor
				? theme.lineChartBackgroundColor
				: "#111";

			const chartXAxisTitleColor = theme.lineChartXAxisTitleColor
				? theme.lineChartXAxisTitleColor
				: "#fafafa";
			const chartXAxisTickColor = theme.lineChartXAxisTickColor
				? theme.lineChartXAxisTickColor
				: "#fafafa";
			const chartXAxisBorderColor = theme.lineChartXAxisBorderColor
				? theme.lineChartXAxisBorderColor
				: "#fafafa";
			const chartXAxisLabelColor = theme.lineChartXAxisLabelColor
				? theme.lineChartXAxisLabelColor
				: "#fafafa";

			const chartYAxisTitleColor = theme.lineChartYAxisTitleColor
				? theme.lineChartYAxisTitleColor
				: "#fafafa";
			const chartYAxisTickColor = theme.lineChartYAxisTickColor
				? theme.lineChartYAxisTickColor
				: "#fafafa";
			const chartYAxisBorderColor = theme.lineChartYAxisBorderColor
				? theme.lineChartYAxisBorderColor
				: "#fafafa";
			const chartYAxisLabelColor = theme.lineChartYAxisLabelColor
				? theme.lineChartYAxisLabelColor
				: "#fafafa";

			const customChartProps = customProps.chartProps;
			const defaultChartProps: LineChartProps["customProps"]["chartProps"] = {
				type: "line",
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
						animations: {
							enabled: false,
						},
					},
					grid: {
						show: true,
						borderColor: chartGridBorderColor,
						xaxis: {
							lines: {
								show: false,
							},
						},
					},
					stroke: {
						curve: "smooth",
						width: 5,
					},
					yaxis: {
						// show: false,
						title: {
							text: "Traded Price",
							offsetX: -5,
							style: {
								color: chartYAxisTitleColor,
								fontFamily: chartFontFamily,
								fontSize: "14px",
								fontWeight: "medium",
							},
						},
						axisBorder: { show: true, color: chartYAxisBorderColor },
						axisTicks: {
							show: true,
							offsetY: 1,
							color: chartYAxisTickColor,
						},
						labels: {
							// show: false,
							formatter: (value) => `$ ${value.toFixed(2)}`,
							style: { colors: chartYAxisLabelColor },
						},
						forceNiceScale: true,
						crosshairs: {
							show: false,
						},
					},
					xaxis: {
						title: {
							text: "Time",
							offsetY: -3,
							style: {
								color: chartXAxisTitleColor,
								fontFamily: chartFontFamily,
								fontSize: "14px",
								fontWeight: "medium",
							},
						},
						offsetX: 1,
						axisBorder: {
							// show: true,
							show: false,
							color: chartXAxisBorderColor,
						},
						axisTicks: {
							show: true,
							offsetX: 1,
							color: chartXAxisTickColor,
						},
						type: "category",
						labels: {
							// show: false,
							offsetX: 0,
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
						crosshairs: {
							show: false,
						},
					},
					fill: {
						type: "gradient",
						gradient: {
							gradientToColors: [chartGradientColorFrom],
							stops: [0, 100],
						},
					},
					colors: [chartGradientColorTo],
					tooltip: {
						y: {
							formatter: (value) => `$ ${value.toFixed(2)}`,
						},
					},
					markers: {
						size: 3,
					},
				},
			};

			const chartProps = merge<
				LineChartProps["customProps"]["chartProps"],
				LineChartProps["customProps"]["chartProps"]
			>(defaultChartProps, customChartProps);

			chartProps.customProps = {
				pathLength: statePathLength,
			};

			// console.log(chartProps);

			return (
				<Styles.LineChart ref={lineChartBaseElementRef} {...otherProps}>
					<Styles.ApexChart
						ref={lineChartInternalComponentBaseElementRef}
						{...chartProps}
					/>
				</Styles.LineChart>
			);
		}
	)
);

LineChart.displayName = "LineChart";

export default LineChart;
