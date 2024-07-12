import { BrowserRouter, Switch, Route } from "react-router-dom";
import Coin from "@/routes/Coin";
import Coins from "@/routes/Coins";
import NavBar from "@/components/NavBar";
import RouteOrRedirect from "@/components/RouteOrRedirect";
import { RouteParamsCoin } from "@/apis";
import { RemoveReadonlyDeep } from "@/utils/typeUtils";
import NotFound from "./NotFound";
import {
	CoinParamsConstraint,
	coinParamsConstraintExamineFn,
} from "@/components/RouteOrRedirect/types";

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
						paramsConstraintCondition: {
							// paramsConstraint: CoinParamsConstraint,
							paramsConstraint: CoinParamsConstraint as RemoveReadonlyDeep<
								typeof CoinParamsConstraint
							>,
							paramsConstraintExamineFn: coinParamsConstraintExamineFn,
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
