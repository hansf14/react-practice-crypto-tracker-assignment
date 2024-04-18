import React from "react";
import { ExecutionProps } from "styled-components";

export const TabsBaseElementTypeValue = "div";
export type TabsBaseElementType = typeof TabsBaseElementTypeValue;
export type TabsBaseElement = React.ElementRef<TabsBaseElementType>;
export type TabsRefElement = TabsBaseElement;

export type TabsFoundationProps =
	React.ComponentPropsWithoutRef<TabsBaseElementType> & ExecutionProps;

export interface TabsProps extends TabsFoundationProps {}

/////////////////////////////////////////////////////////////

export const TabBaseElementTypeValue = "span";
export type TabBaseElementType = typeof TabBaseElementTypeValue;
export type TabBaseElement = React.ElementRef<TabBaseElementType>;
export type TabRefElement = TabBaseElement;

export type TabFoundationProps =
	React.ComponentPropsWithoutRef<TabBaseElementType> & ExecutionProps;

export interface TabCustomProps {
	isActive?: boolean;
}

export interface TabProps extends TabFoundationProps {
	customProps?: TabCustomProps;
}
