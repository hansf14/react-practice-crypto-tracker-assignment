import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { NavBarProps, NavBarRefElement } from "./types";
import * as Styles from "./styles";
import useThemeContext from "@/hooks/useThemeContext";
import { darkTheme, lightTheme } from "@/themes";
export * from "./types";

const NavBar = React.memo(
	React.forwardRef<NavBarRefElement, NavBarProps>((props, ref) => {
		const [stateIsLeft, setStateIsLeft] = useState<boolean>(true);
		const { theme, setTheme } = useThemeContext();

		const toggleHandler: React.MouseEventHandler<HTMLDivElement> = useCallback(
			(event) => {
				setStateIsLeft((prev) => !prev);
				if (theme === lightTheme) {
					setTheme(darkTheme);
				} else {
					setTheme(lightTheme);
				}
			},

			[theme, setTheme]
		);

		return (
			<Styles.NavBar ref={ref} {...props}>
				<Styles.NavBarContent>
					<Styles.Nav>
						<Styles.HomeButtonContainer>
							<Link
								to={{
									pathname: `/`,
								}}
							>
								Home
							</Link>
						</Styles.HomeButtonContainer>
					</Styles.Nav>
					<Styles.ThemeTogglerContainer>
						<Styles.ThemeToggler onClick={toggleHandler}>
							<Styles.ThemeSwitch customProps={{ isLeft: stateIsLeft }} />
						</Styles.ThemeToggler>
					</Styles.ThemeTogglerContainer>
				</Styles.NavBarContent>
			</Styles.NavBar>
		);
	})
);

NavBar.displayName = "NavBar";

export default NavBar;
