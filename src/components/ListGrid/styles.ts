import styled, { css } from "styled-components";
import { ListGridBaseElementTypeValue, ListGridProps } from "./types";
import { ItemCss, ItemFlexCss } from "@/components/ItemCss";
import NestedList from "@/components/NestedList";

export const ListGrid = styled(ListGridBaseElementTypeValue).withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<ListGridProps>`
	display: grid;
	grid-template-columns: ${({ customProps }) =>
		customProps.columnWidths
			? `${
					typeof customProps.columnWidths === "string"
						? customProps.columnWidths
						: customProps.columnWidths.join(" ")
			  };`
			: `repeat(${customProps.columnCnt}, 1fr);`}

	${({ customProps }) =>
		customProps.columnGap ? `column-gap: ${customProps.columnGap};` : ""}
	${({ customProps }) =>
		customProps.rowGap ? `row-gap: ${customProps.rowGap};` : ""}

	color: ${({ theme }) => (theme.listTextColor ? theme.listTextColor : "#000")};

	& > :nth-child(${({ customProps }) => customProps.columnCnt}n + 1) {
		text-align: start;
	}
	& > :not(:nth-child(${({ customProps }) =>
		customProps.columnCnt}n + 1)):not(:nth-child(${({ customProps }) =>
	customProps.columnCnt}n)) {
		text-align: center;
	}
	& > :nth-child(${({ customProps }) => customProps.columnCnt}n) {
		text-align: end;
	}

	${({ customProps }) => {
		let gridSpanCss = "";
		for (
			let gridSpanCssIdx = 0;
			gridSpanCssIdx < customProps.columnCnt;
			gridSpanCssIdx++
		) {
			gridSpanCss += `[data-grid-item-span-${gridSpanCssIdx + 1}] {
				grid-column: span ${gridSpanCssIdx + 1};
			}`;
		}
		return css`
			${gridSpanCss}
		`;
	}}

	[data-grid-item-align-left] {
		text-align: left;
	}

	[data-grid-item-align-center] {
		text-align: center;
	}

	[data-grid-item-align-right] {
		text-align: right;
	}
`;

export const ListGridItem = styled.li`
	${ItemCss}

	&:has(${NestedList}) {
		${ItemFlexCss}
	}
`;
