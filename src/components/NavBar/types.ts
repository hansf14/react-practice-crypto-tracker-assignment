import React from "react";
import { ExecutionProps } from "styled-components";

export const NavBarBaseElementTypeValue = "div";
export type NavBarBaseElementType = typeof NavBarBaseElementTypeValue;
export type NavBarBaseElement = React.ElementRef<NavBarBaseElementType>;
export type NavBarRefElement = NavBarBaseElement;

export type NavBarFoundationProps =
	React.ComponentPropsWithoutRef<NavBarBaseElementType> & ExecutionProps;

export interface NavBarProps extends NavBarFoundationProps {}
