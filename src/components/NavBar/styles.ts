import styled, { css } from "styled-components";
import { NavBarBaseElementTypeValue } from "./types";

export const CssVars = {
	themeTogglerWidth: "--theme-toggler-width",
	themeTogglerHeight: "--theme-toggler-height",
	themeTogglerBorderWidth: "--theme-toggler-border-width",
	themeTogglerInnerWidth: "--theme-toggler-inner-width",
	themeTogglerInnerHeight: "--theme-toggler-inner-height",
	themeTogglerSwitchWidth: "--theme-toggler-switch-width",
	themeTogglerSwitchHeight: "--theme-toggler-switch-height",
};

export const NavBar = styled(NavBarBaseElementTypeValue)`
	position: fixed;
	width: 100%;

	${({ theme }) =>
		theme.navBarHeight ? `height: ${theme.navBarHeight}px;` : ""};
	background-color: ${({ theme }) =>
		theme.keyColor04 ? theme.keyColor04 : "transparent"};
	border-bottom: 2px solid
		${({ theme }) => (theme.keyColor09 ? theme.keyColor09 : "transparent")};
	transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;

	${CssVars.themeTogglerWidth}: 40px;
	${CssVars.themeTogglerHeight}: 22px;
	${CssVars.themeTogglerBorderWidth}: 2px;
	${CssVars.themeTogglerInnerWidth}: calc(var(${CssVars.themeTogglerWidth}) - 2 * var(${CssVars.themeTogglerBorderWidth}));
	${CssVars.themeTogglerInnerHeight}: calc(var(${CssVars.themeTogglerHeight}) - 2 * var(${CssVars.themeTogglerBorderWidth}));
	${CssVars.themeTogglerSwitchHeight}: var(${CssVars.themeTogglerInnerHeight});
	${CssVars.themeTogglerSwitchWidth}: var(${CssVars.themeTogglerSwitchHeight});

	display: flex;
	justify-content: center;
`;

export const NavBarContent = styled.div`
	display: flex;
	gap: 15px;

	width: 600px;
	@media (max-width: 650px) {
		max-width: unset;
		width: 100%;
	}
`;

export const Title = styled.div`
	font-size: 25px;
`;

const NavMenuButtonCss = css`
	color: ${({ theme }) => (theme.keyColor03 ? theme.keyColor03 : "#333")};
	font-size: 20px;
	font-weight: bold;

	transition: color 0.4s ease-in-out, filter 0.4s ease-in-out;
	&:hover {
		color: ${({ theme }) => (theme.keyColor06 ? theme.keyColor06 : "#553322")};
		// filter: contrast(200%);
	}
`;

export const Nav = styled.nav`
	flex-grow: 1;
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

export const HomeButtonContainer = styled.div`
	${NavMenuButtonCss}
	height: 100%;

	display: inline-flex;
	align-items: center;
`;

export const ThemeTogglerContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const ThemeToggler = styled.div`
	position: relative;
	cursor: pointer;

	width: var(${CssVars.themeTogglerWidth});
	height: var(${CssVars.themeTogglerHeight});
	border: var(${CssVars.themeTogglerBorderWidth}) solid #fff;
	border-radius: calc(var(${CssVars.themeTogglerHeight}) / 2);
	background-color: #8cbae8;
`;

export const ThemeSwitch = styled.div.withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<{
	customProps: {
		isLeft: boolean;
	};
}>`
	position: absolute;
	width: var(${CssVars.themeTogglerSwitchWidth});
	height: var(${CssVars.themeTogglerSwitchHeight});
	background-color: #1976d2;
	border-radius: 50%;

	transform: translate(
		${({ customProps }) =>
			customProps.isLeft
				? "0"
				: `calc(var(${CssVars.themeTogglerInnerWidth}) - var(${CssVars.themeTogglerSwitchWidth}))`},
		0
	);
	transition: transform 0.2s ease-in-out;
`;
