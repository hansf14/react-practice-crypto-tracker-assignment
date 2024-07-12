import { POPULAR_COIN_IDS, RouteParamsCoin, RouteParamsType } from "@/apis";
import { RedirectProps, RouteProps } from "react-router-dom";

export const CoinParamsConstraint = {
	coinId: POPULAR_COIN_IDS,
} as const;

export const coinParamsConstraintExamineFn: ParamsConstraintExamineFnType<
	RouteParamsCoin
> = ({ paramsConstraint, params }) => {
	return paramsConstraint.coinId.includes(params.coinId);
};

export type RouteOrRedirectFoundationProps = RouteProps;

// export type ConstraintParamsType = {
// 	[K in string]: string[];
// };

export type ParamsConstraintType<P extends RouteParamsType = {}> = {
	[K in keyof P]: string[];
};

// export type ConstraintParamsExamineFnType = ({
// 	constraintParams,
// }: {
// 	constraintParams: ConstraintParamsType;
// 	params: RouteParamsType;
// }) => boolean;

export type ParamsConstraintExamineFnType<P extends RouteParamsType = {}> = ({
	paramsConstraint,
}: {
	paramsConstraint: ParamsConstraintType<P>;
	params: P;
}) => boolean;

export interface RouteOrRedirectCustomProps<P extends RouteParamsType = {}> {
	redirectTo?: RedirectProps["to"];
	redirectWhenNotMatch?: boolean;
	paramsConstraintCondition?: {
		paramsConstraint: ParamsConstraintType<P>;
		paramsConstraintExamineFn: ParamsConstraintExamineFnType<P>;
	};
}

export interface RouteOrRedirectProps<P extends RouteParamsType = {}>
	extends RouteOrRedirectFoundationProps {
	customProps?: RouteOrRedirectCustomProps<P>;
}
