import styled, { css } from "styled-components";
import { NavBarBaseElementTypeValue } from "./types";

export const NavBarCssVars = {
	themeTogglerWidth: "--theme-toggler-width",
	themeTogglerHeight: "--theme-toggler-height",
	themeTogglerBorderWidth: "--theme-toggler-border-width",
	themeTogglerInnerWidth: "--theme-toggler-inner-width",
	themeTogglerInnerHeight: "--theme-toggler-inner-height",
	themeTogglerSwitchWidth: "--theme-toggler-switch-width",
	themeTogglerSwitchHeight: "--theme-toggler-switch-height",
} as const;

export const NavBar = styled(NavBarBaseElementTypeValue)`
	position: fixed;
	width: 100%;

	${({ theme }) =>
		theme.navBarHeight ? `height: ${theme.navBarHeight}px;` : ""};
	background-color: ${({ theme }) =>
		theme.navBarBackgroundColor ? theme.navBarBackgroundColor : "transparent"};
	border-bottom: 2px solid
		${({ theme }) =>
			theme.navBarBorderColor ? theme.navBarBorderColor : "transparent"};
	transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;

	${NavBarCssVars.themeTogglerWidth}: 40px;
	${NavBarCssVars.themeTogglerHeight}: 22px;
	${NavBarCssVars.themeTogglerBorderWidth}: 2px;
	${NavBarCssVars.themeTogglerInnerWidth}: calc(var(${NavBarCssVars.themeTogglerWidth}) - 2 * var(${NavBarCssVars.themeTogglerBorderWidth}));
	${NavBarCssVars.themeTogglerInnerHeight}: calc(var(${NavBarCssVars.themeTogglerHeight}) - 2 * var(${NavBarCssVars.themeTogglerBorderWidth}));
	${NavBarCssVars.themeTogglerSwitchHeight}: var(${NavBarCssVars.themeTogglerInnerHeight});
	${NavBarCssVars.themeTogglerSwitchWidth}: var(${NavBarCssVars.themeTogglerSwitchHeight});

	display: flex;
	justify-content: center;

	z-index: 100;
`;

export const NavBarContent = styled.div`
	display: flex;
	gap: 15px;

	width: 600px;
	
	@media (max-width: 650px) {
		max-width: unset;
		width: 100%;
		padding: 0 15px;
	}
`;

export const Title = styled.div`
	font-size: 25px;
`;

const NavMenuButtonCss = css`
	color: ${({ theme }) =>
		theme.navBarTextColor ? theme.navBarTextColor : "#000"};
	font-size: 20px;
	font-weight: bold;

	transition: color 0.4s ease-in-out, filter 0.4s ease-in-out;
	&:hover {
		color: ${({ theme }) =>
			theme.navBarHoverTextColor ? theme.navBarHoverTextColor : "#000"};
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

	width: var(${NavBarCssVars.themeTogglerWidth});
	height: var(${NavBarCssVars.themeTogglerHeight});
	border: var(${NavBarCssVars.themeTogglerBorderWidth}) solid #fff;
	border-radius: calc(var(${NavBarCssVars.themeTogglerHeight}) / 2);
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
	width: var(${NavBarCssVars.themeTogglerSwitchWidth});
	height: var(${NavBarCssVars.themeTogglerSwitchHeight});
	background-color: #1976d2;
	border-radius: 50%;

	transform: translate(
		${({ customProps }) =>
			customProps.isLeft
				? "0"
				: `calc(var(${NavBarCssVars.themeTogglerInnerWidth}) - var(${NavBarCssVars.themeTogglerSwitchWidth}))`},
		0
	);
	transition: transform 0.2s ease-in-out;
`;
