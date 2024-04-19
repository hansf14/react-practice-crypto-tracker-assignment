import { Redirect, Route, useRouteMatch } from "react-router-dom";
import { RouteOrRedirectProps } from "./types.";
import { RouteParamsType } from "@/apis";

const RouteOrRedirect = <P extends RouteParamsType = {}>({
	customProps,
	children,
	path,
	exact,
	...otherProps
}: RouteOrRedirectProps<P>) => {
	const shouldBeExact = exact ?? false;
	const redirectTo = customProps?.redirectTo ?? "/error-404";
	const redirectWhenNotMatch = customProps?.redirectWhenNotMatch ?? false;
	const { constraintParams, constraintParamsExamineFn } =
		customProps?.paramsConstraint ?? {};

	const matchObj = useRouteMatch<P>(!path ? "*" : (path as string | string[]));
	let isMatch = !matchObj
		? false
		: shouldBeExact && !matchObj.isExact
		? false
		: true;
	isMatch =
		matchObj && constraintParams && constraintParamsExamineFn
			? constraintParamsExamineFn({ constraintParams, params: matchObj.params })
			: isMatch;

	console.log("shouldBeExact:", shouldBeExact);
	console.log("redirectWhenNotMatch:", redirectWhenNotMatch);
	console.log("matchObj:", matchObj);
	console.log("isMatch:", isMatch);

	return (
		<>
			{isMatch ? (
				<Route exact path={path} {...otherProps}>
					{children}
				</Route>
			) : (
				redirectWhenNotMatch && <Redirect to={redirectTo} />
			)}
		</>
	);
};

export default RouteOrRedirect;
