import { ExecutionProps } from "styled-components";

export type MasonryGridHandle = {
	rootElement: HTMLDivElement | null;
	gridElement: HTMLDivElement | null;
};

export const MasonryGridBaseElementTypeValue = "div";
export type MasonryGridBaseElementType = typeof MasonryGridBaseElementTypeValue;
export type MasonryGridBaseElement =
	React.ElementRef<MasonryGridBaseElementType>;
export type MasonryGridRefElement = MasonryGridBaseElement;

export type MasonryGridFoundationProps =
	React.ComponentPropsWithoutRef<MasonryGridBaseElementType> & ExecutionProps;

export interface MasonryGridCustomProps {
	columnCnt: number;
	columnGap?: string;
	rowGap?: string;
}

export interface MasonryGridProps extends MasonryGridFoundationProps {
	customProps: MasonryGridCustomProps;
}

export interface MasonryGridElementProps extends MasonryGridProps {}
