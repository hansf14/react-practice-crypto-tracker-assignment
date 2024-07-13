import React from "react";
import { Props as ApexChartBasicProps } from "react-apexcharts";
import { ExecutionProps } from "styled-components";

///////////////////////////////////////////////////////////////

export const CandlestickChartBaseElementTypeValue = "div";
export type CandlestickChartBaseElementType =
	typeof CandlestickChartBaseElementTypeValue;
export type CandlestickChartBaseElement =
	React.ElementRef<CandlestickChartBaseElementType>;
export type CandlestickChartRefElement = CandlestickChartBaseElement;

export type CandlestickChartFoundationProps =
	React.ComponentPropsWithoutRef<CandlestickChartBaseElementType> &
		ExecutionProps;

export interface CandlestickChartCustomProps {
	chartCustomProps: ApexChartProps;
}

export interface CandlestickChartProps extends CandlestickChartFoundationProps {
	customProps: CandlestickChartCustomProps;
}

export interface CandlestickChartHandle {
	candlestickChartBaseElement: CandlestickChartBaseElement | null;
	candlestickChartInternalComponentBaseElement: ApexChartBaseElement | null;
	candlestickChartPathElement: SVGPathElement | null;
}

///////////////////////////////////////////////////////////////

export const ApexChartBaseElementTypeValue = "div";
export type ApexChartBaseElementType = typeof ApexChartBaseElementTypeValue;
export type ApexChartBaseElement = React.ElementRef<ApexChartBaseElementType>;
export type ApexChartRefElement = ApexChartBaseElement;

export type ApexChartFoundationProps =
	React.ComponentPropsWithoutRef<ApexChartBaseElementType> &
		ExecutionProps &
		ApexChartBasicProps;

export interface ApexChartProps extends ApexChartFoundationProps {}
