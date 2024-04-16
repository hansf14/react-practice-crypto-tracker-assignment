import { BrowserRouter, Switch, Route } from "react-router-dom";
import Coin from "@/routes/Coin";
import Coins from "@/routes/Coins";
import NotFound from "@/routes/NotFound";
import NavBar from "@/components/NavBar";

function Router() {
	return (
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<NavBar />
			<Switch>
				<Route exact path="/:coinId">
					<Coin />
				</Route>
				<Route exact path="/">
					<Coins />
				</Route>
				<Route path="*">
					<NotFound />
				</Route>
			</Switch>
		</BrowserRouter>
	);
}
export default Router;
