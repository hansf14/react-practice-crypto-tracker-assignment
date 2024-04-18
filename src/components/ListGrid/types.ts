import React from "react";
import { ExecutionProps } from "styled-components";

export const ListGridBaseElementTypeValue = "ul";
export type ListGridBaseElementType = typeof ListGridBaseElementTypeValue;
export type ListGridBaseElement = React.ElementRef<ListGridBaseElementType>;
export type ListGridRefElement = ListGridBaseElement;

export type ListGridFoundationProps =
	React.ComponentPropsWithoutRef<ListGridBaseElementType> & ExecutionProps;

export interface ListGridCustomProps {
	columnCnt: number;
	columnWidths?: string[] | string;
	columnGap?: string;
	rowGap?: string;
}

export interface ListGridProps extends ListGridFoundationProps {
	customProps: ListGridCustomProps;
}
