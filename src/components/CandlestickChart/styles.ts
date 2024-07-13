import styled from "styled-components";
import { default as ApexChartBase } from "react-apexcharts";
import { ApexChartProps } from "./types";

export const CandlestickChart = styled.div`
	background-color: ${({ theme }) =>
		theme.candlestickChartBackgroundColor
			? theme.candlestickChartBackgroundColor
			: "transparent"};
	padding: 30px 20px 10px 10px;
`;

export const ApexChart = styled(ApexChartBase).withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<ApexChartProps>`
	foreignObject {
		overflow: visible;
	}

	.apexcharts-menu {
		min-width: initial;
		top: calc(100% + 5px);
		right: 3px;

		white-space: nowrap;
		word-spacing: 4px;
		text-align: justify;
	}

	.apexcharts-menu-icon {
		transform: scale(1);
	}
`;
