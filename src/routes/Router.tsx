import { BrowserRouter, Switch, Route } from "react-router-dom";
import Coin from "@/routes/Coin";
import Coins from "@/routes/Coins";
import NavBar from "@/components/NavBar";
import RouteOrRedirect from "@/components/RouteOrRedirect";
import {
	ConstraintParamsCoin,
	RouteParamsCoin,
	constraintParamsExamineFnCoin,
} from "@/apis";
import { RemoveReadonlyDeep } from "@/utils/typeUtils";
import NotFound from "./NotFound";

function Router() {
	return (
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<NavBar />
			<Switch>
				<Route exact path="/">
					<Coins />
				</Route>
				<Route exact path="/error-404">
					<NotFound />
				</Route>
				<RouteOrRedirect<RouteParamsCoin>
					path="/:coinId"
					customProps={{
						redirectWhenNotMatch: true,
						paramsConstraint: {
							constraintParams: ConstraintParamsCoin as RemoveReadonlyDeep<
								typeof ConstraintParamsCoin
							>,
							constraintParamsExamineFn: constraintParamsExamineFnCoin,
						},
					}}
				>
					<Coin />
				</RouteOrRedirect>
			</Switch>
		</BrowserRouter>
	);
}
export default Router;
