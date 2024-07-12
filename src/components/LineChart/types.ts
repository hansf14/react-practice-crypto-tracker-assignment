import React from "react";
import { Props as ApexChartBasicProps } from "react-apexcharts";
import { ExecutionProps } from "styled-components";

///////////////////////////////////////////////////////////////

export const LineChartBaseElementTypeValue = "div";
export type LineChartBaseElementType = typeof LineChartBaseElementTypeValue;
export type LineChartBaseElement = React.ElementRef<LineChartBaseElementType>;
export type LineChartRefElement = LineChartBaseElement;

export type LineChartFoundationProps =
	React.ComponentPropsWithoutRef<LineChartBaseElementType> & ExecutionProps;

export interface LineChartCustomProps {
	chartCustomProps: ApexChartProps;
}

export interface LineChartProps extends LineChartFoundationProps {
	customProps: LineChartCustomProps;
}

export interface LineChartHandle {
	lineChartBaseElement: LineChartBaseElement | null;
	lineChartInternalComponentBaseElement: ApexChartBaseElement | null;
	lineChartPathElement: SVGPathElement | null;
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

export interface ApexChartCustomProps {
	pathLength?: number;
}

export interface ApexChartProps extends ApexChartFoundationProps {
	customProps?: ApexChartCustomProps;
}
