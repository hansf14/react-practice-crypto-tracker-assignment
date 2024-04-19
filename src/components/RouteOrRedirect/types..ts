import { RouteParamsType } from "@/apis";
import { RedirectProps, RouteProps } from "react-router-dom";

export type RouteOrRedirectFoundationProps = RouteProps;

// export type ConstraintParamsType = {
// 	[K in string]: string[];
// };

export type ConstraintParamsType<P extends RouteParamsType = {}> = {
	[K in keyof P]: string[];
};

// export type ConstraintParamsExamineFnType = ({
// 	constraintParams,
// }: {
// 	constraintParams: ConstraintParamsType;
// 	params: RouteParamsType;
// }) => boolean;

export type ConstraintParamsExamineFnType<P extends RouteParamsType = {}> = ({
	constraintParams,
}: {
	constraintParams: ConstraintParamsType<P>;
	params: P;
}) => boolean;

export interface RouteOrRedirectCustomProps<P extends RouteParamsType = {}> {
	redirectTo?: RedirectProps["to"];
	redirectWhenNotMatch?: boolean;
	paramsConstraint?: {
		constraintParams: ConstraintParamsType<P>;
		constraintParamsExamineFn: ConstraintParamsExamineFnType<P>;
	};
}

export interface RouteOrRedirectProps<P extends RouteParamsType = {}>
	extends RouteOrRedirectFoundationProps {
	customProps?: RouteOrRedirectCustomProps<P>;
}
