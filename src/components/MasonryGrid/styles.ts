import styled from "styled-components";
import {
	MasonryGridInternalComponentProps,
	MasonryGridCustomAttributes,
	MasonryGridColumnSeparatorProps,
	MasonryGridItemBaseElementTypeValue,
	MasonryGridColumnSeparatorBaseElementTypeValue,
	MasonryGridBaseElementTypeValue,
} from "./types";
import { ItemCss, ItemFlexCss } from "@/components/ItemCss";
import NestedList from "@/components/NestedList";

// MasonryGridCustomAttributes.dataMasonryGridColumnNumber
// [data-masonry-grid-column-number]
//
// * CAUTION *
// This attribute should be used with caution!
// If the intrinsic size of the grid item changes
// depending on in which column it's placed,
// the cyclic dependency occurs in its size with the resize observer
// that MasonryGrid uses internally,
// and may cause infinite resize observer callback calls.
//
// If you MUST use this attribute,
// you should avoid using the properties
// that may cause the change of the intrinsic size of grid item,
// such as margin, padding, width, height, writing-mode, etc.
//
// If you MUST use this kind of properties,
// that may cause the change of intrinsic size of the grid item,
// you have to keep it consistent whichever column it's in.
//
// For example, 
// [data-masonry-grid-column-number="1"] => margin-left: 3px, margin-right: 0
// [data-masonry-grid-column-number="2"] => margin-left: 0, margin-right: 3px

export const MasonryGrid = styled.div``;

export const MasonryGridInternalComponent = styled(
	MasonryGridBaseElementTypeValue
).withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<MasonryGridInternalComponentProps>`
	display: flex;
	flex-flow: column wrap;

	column-gap: ${({ customProps }) => customProps.columnGap};
	row-gap: ${({ customProps }) => customProps.rowGap};

	color: ${({ theme }) => (theme.listTextColor ? theme.listTextColor : "#000")};

	${({ customProps }) => `& > * {
		width: calc(calc(100% - calc(${customProps.columnCnt - 1} * ${
		customProps.columnGap
	})) / ${customProps.columnCnt});
	}`}

	${({ customProps }) => {
		let cssForItemsForEachColumn = "";
		for (let col = 1; col <= customProps.columnCnt; col++) {
			cssForItemsForEachColumn += `& > [${MasonryGridCustomAttributes.dataMasonryGridColumnNumber}="${col}"] {
				order: ${col};
			}`;
		}
		return cssForItemsForEachColumn;
	}}
`;

export const MasonryGridItem = styled(MasonryGridItemBaseElementTypeValue)`
	${ItemCss}

	&:has(${NestedList}) {
		${ItemFlexCss}
	}
`;

export const MasonryGridColumnSeparator = styled(
	MasonryGridColumnSeparatorBaseElementTypeValue
).withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<MasonryGridColumnSeparatorProps>`
	${({ customProps }) => (!customProps.isNeeded ? "display: none;" : "")}

	${ItemCss}

	&:has(${NestedList}) {
		${ItemFlexCss}
	}
`;
