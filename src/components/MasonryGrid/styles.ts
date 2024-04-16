import styled from "styled-components";
import { MasonryGridElementProps } from "./types";

export const MasonryGridRootElement = styled.div``;

export const MasonryGridElement = styled.div.withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<MasonryGridElementProps>`
	display: flex;
	flex-flow: column wrap;

	column-gap: ${({ customProps }) => customProps.columnGap ?? "0"};
	row-gap: ${({ customProps }) => customProps.rowGap ?? "0"};

	color: ${({ theme }) => (theme.keyColor08 ? theme.keyColor08 : "#000")};

	${({ customProps }) => `& > * {
		width: calc(calc(100% - calc(${customProps.columnCnt - 1} * ${
		customProps.columnGap ?? "0px"
	})) / ${customProps.columnCnt});
	}`}// & > :first-child {
	// 	grid-column: 1;
	// }
	// & > :nth-child(2) {
	// 	grid-column: 2;
	// }
`;

// export type MasonryGridItemFoundationProps = Omit<
// 	React.ComponentPropsWithoutRef<"div"> & ExecutionProps,
// 	"key"
// > & { key: React.Key };

// export interface MasonryGridItemProps extends MasonryGridItemFoundationProps {}

export const MasonryGridItem = styled.div`
	font-size: 13px;
	font-weight: bold;

	span:first-child {
		margin-right: 3px;
		font-weight: 400;
		text-transform: uppercase;
	}
`;

export const MasonryGridColumnSeparator = styled.div`
	flex-grow: 1;
`;
