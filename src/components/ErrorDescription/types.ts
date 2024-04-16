import React from "react";
import { ExecutionProps } from "styled-components";

export const ErrorDescriptionBaseElementTypeValue = "div";
export type ErrorDescriptionBaseElementType =
	typeof ErrorDescriptionBaseElementTypeValue;
export type ErrorDescriptionBaseElement =
	React.ElementRef<ErrorDescriptionBaseElementType>;
export type ErrorDescriptionRefElement = ErrorDescriptionBaseElement;

export type ErrorDescriptionFoundationProps =
	React.ComponentPropsWithoutRef<ErrorDescriptionBaseElementType> &
		ExecutionProps;

export interface ErrorDescriptionCustomProps {
	error: unknown;
}

export interface ErrorDescriptionProps extends ErrorDescriptionFoundationProps {
	customProps: ErrorDescriptionCustomProps;
}
