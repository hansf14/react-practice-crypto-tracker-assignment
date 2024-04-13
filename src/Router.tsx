import { BrowserRouter, Switch, Route } from "react-router-dom";
import Coin from "./routes/Coin";
import Coins from "./routes/Coins";
import NavBar from "./components/NavBar";

function Router() {
	return (
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<NavBar />
			<Switch>
				<Route path="/:coinId">
					<Coin />
				</Route>
				<Route path="/">
					<Coins />
				</Route>
			</Switch>
		</BrowserRouter>
	);
}
export default Router;
