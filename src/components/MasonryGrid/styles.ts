import styled from "styled-components";
import {
	MasonryGridInternalComponentProps,
	MasonryGridCustomAttributes,
	MasonryGridColumnSeparatorProps,
} from "./types";

export const MasonryGrid = styled.div``;

export const MasonryGridInternalComponent = styled.div.withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<MasonryGridInternalComponentProps>`
	display: flex;
	flex-flow: column wrap;

	column-gap: ${({ customProps }) => customProps.columnGap};
	row-gap: ${({ customProps }) => customProps.rowGap};

	color: ${({ theme }) => (theme.keyColor08 ? theme.keyColor08 : "#000")};

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

export const MasonryGridItem = styled.div``;

export const MasonryGridColumnSeparator = styled.div.withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<MasonryGridColumnSeparatorProps>`
	flex-grow: 1;

	${({ customProps }) =>
		!customProps.isNeeded ? "display: none;" : ""}
`;
