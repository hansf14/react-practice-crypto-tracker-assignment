import React from "react";
import { ExecutionProps } from "styled-components";

////////////////////////////////////////////////////////////////////

export const DecoratedInlineItemBaseElementTypeValue = "div";
export type DecoratedInlineItemBaseElementType =
	typeof DecoratedInlineItemBaseElementTypeValue;
export type DecoratedInlineItemBaseElement =
	React.ElementRef<DecoratedInlineItemBaseElementType>;
export type DecoratedInlineItemRefElement = DecoratedInlineItemBaseElement;

export type DecoratedInlineItemFoundationProps =
	React.ComponentPropsWithoutRef<DecoratedInlineItemBaseElementType> &
		ExecutionProps;

export interface DecoratedInlineItemCustomProps {
	decoratorWidth?: string;
	decoratorHeight?: string;
	decoratorMarginRight?: string;
	decoratorClipPath?: string;
	shouldFloatDecorator?: boolean;
}

export interface DecoratedInlineItemProps
	extends DecoratedInlineItemFoundationProps {
	customProps?: DecoratedInlineItemCustomProps;
}

////////////////////////////////////////////////////////////////////

export interface DecoratedInlineItemDecoratorProps
	extends DecoratedInlineItemProps {}

////////////////////////////////////////////////////////////////////

export interface DecoratedInlineItemInternalComponentProps
	extends DecoratedInlineItemProps {}

////////////////////////////////////////////////////////////////////

export const DecoratedInlineItemDecoratorPropsDefault = {
	decoratorWidth: "1cap",
	decoratorHeight: "1cap",
	decoratorMarginRight: "5px",
	decoratorClipPath: "polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)",
	shouldFloatDecorator: false,
} as const satisfies DecoratedInlineItemCustomProps;
