import styled from "styled-components";
import {
	TabBaseElementTypeValue,
	TabProps,
	TabsBaseElementTypeValue,
} from "./types";

export const Tabs = styled(TabsBaseElementTypeValue)`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	margin: 25px 0px;
	gap: 10px;
`;

export const Tab = styled(TabBaseElementTypeValue).withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<TabProps>`
	display: flex;
	flex-direction: column;
	justify-content: stretch;
	align-items: stretch;

	cursor: pointer;

	background-color: ${({ customProps, theme }) =>
		typeof customProps?.isActive === "boolean"
			? customProps?.isActive
				? theme.tabActiveBackgroundColor
				: theme.tabBackgroundColor
			: "#000"};

	text-align: center;
	text-transform: uppercase;
	font-size: 14px;
	font-weight: bold;

	:is(a, button) {
		padding: 10px;

		&:hover {
			color: ${({ theme }) =>
				theme.tabHoverTextColor ? theme.tabHoverTextColor : "#000"};
		}
	}
`;

export default Tabs;
