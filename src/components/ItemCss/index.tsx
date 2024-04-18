import { css } from "styled-components";

export const ItemCss = css`
	font-size: 13px;
	font-weight: bold;
	line-height: 1.2;

	& > span:first-child {
		margin-right: 3px;
		font-weight: 400;
		text-transform: uppercase;
	}
`;

export const ItemFlexCss = css`
	display: flex;
	flex-direction: column;
	gap: 3px;

	& > span:first-child {
		margin-right: 0;
	}
`;
