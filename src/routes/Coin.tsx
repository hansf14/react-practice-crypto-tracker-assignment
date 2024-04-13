// import { useEffect, useState } from "react";
import {
	useLocation,
	useParams,
	useRouteMatch,
	Switch,
	Route,
	Link,
} from "react-router-dom";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
	padding: 0px 20px;
	max-width: 480px;
	margin: 0 auto;
`;

const Header = styled.header`
	height: 10vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Title = styled.h1`
	font-size: 48px;
	color: ${(props) => props.theme.keyColor03};
`;

const Loader = styled.span`
	text-align: center;
	display: block;
`;

const Overview = styled.div`
	display: flex;
	justify-content: space-between;
	background-color: rgba(0, 0, 0, 0.5);
	padding: 10px 20px;
	border-radius: 10px;
`;
const OverviewItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	span:first-child {
		font-size: 10px;
		font-weight: 400;
		text-transform: uppercase;
		margin-bottom: 5px;
	}
`;
const Description = styled.p`
	margin: 20px 0px;
`;

const Tabs = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	margin: 25px 0px;
	gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
	text-align: center;
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 400;
	background-color: rgba(0, 0, 0, 0.5);
	padding: 7px 0px;
	border-radius: 10px;
	color: ${(props) =>
		props.isActive ? props.theme.keyColor03 : props.theme.keyColor01};
	a {
		display: block;
	}
`;

interface RouteParams {
	coinId: string;
}

interface RouteState {
	name: string;
}

interface InfoData {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	is_new: boolean;
	is_active: boolean;
	type: string;
	logo: string;
	// tags: object;
	// team: object;
	description: string;
	message: string;
	open_source: boolean;
	started_at: string;
	development_status: string;
	hardware_wallet: boolean;
	proof_type: string;
	org_structure: string;
	hash_algorithm: string;
	links: object;
	// links_extended: object;
	// whitepaper: object;
	first_data_at: string;
	last_data_at: string;
}

interface PriceData {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	total_supply: number;
	max_supply: number;
	beta_value: number;
	first_data_at: string;
	last_updated: string;
	quotes: {
		USD: {
			ath_date: string;
			ath_price: number;
			market_cap: number;
			market_cap_change_24h: number;
			percent_change_1h: number;
			percent_change_1y: number;
			percent_change_6h: number;
			percent_change_7d: number;
			percent_change_12h: number;
			percent_change_15m: number;
			percent_change_24h: number;
			percent_change_30d: number;
			percent_change_30m: number;
			percent_from_price_ath: number;
			price: number;
			volume_24h: number;
			volume_24h_change_24h: number;
		};
	};
}

interface PriceData {}

function Coin() {
	const { coinId } = useParams<RouteParams>();
	// const [loading, setLoading] = useState(true);
	// const {
	// 	state: { name },
	// } = useLocation<RouteState>();
	// // console.log(location);
	// console.log(name);

	const { state } = useLocation<RouteState>();
	// // console.log(state.name);

	// const [info, setInfo] = useState<InfoData>();
	// const [priceInfo, setPriceInfo] = useState<PriceData>();

	const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
		["info", coinId],
		() => fetchCoinInfo(coinId)
	);
	const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
		["tickers", coinId],
		() => fetchCoinTickers(coinId),
		{
			refetchInterval: 3600 * 1000,
		}
	);

	const priceMatch = useRouteMatch("/:coinId/price");
	// console.log(priceMatch);
	const chartMatch = useRouteMatch("/:coinId/chart");
	// console.log(chartMatch);

	// useEffect(() => {
	// 	(async () => {
	// 		const infoData = await (
	// 			await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
	// 		).json();
	// 		console.log(infoData);

	// 		const priceData = await (
	// 			await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
	// 		).json();
	// 		console.log(priceData);

	// 		setInfo(infoData);
	// 		setPriceInfo(priceData);
	// 		setLoading(false);
	// 	})();
	// }, []);

	const loading = infoLoading || tickersLoading;

	return (
		<Container>
			<Helmet>
				<title>
					{state?.name ? state.name : loading ? "Loading..." : infoData?.name}
				</title>
				<link
					rel="icon"
					type="image/png"
					href={`https://static.coinpaprika.com/coin/${coinId}/logo.png`}
					sizes="16x16"
				/>
			</Helmet>
			<Header>
				<Title>
					{state?.name ? state.name : loading ? "Loading..." : infoData?.name}
				</Title>
			</Header>
			{loading ? (
				<Loader>Loading...</Loader>
			) : (
				<>
					<Overview>
						<OverviewItem>
							<span>Rank:</span>
							<span>{infoData?.rank}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Symbol:</span>
							<span>{infoData?.symbol}</span>
						</OverviewItem>
						<OverviewItem>
							{/* <span>Open Source:</span> */}
							<span>Price:</span>
							{/* <span>{infoData?.open_source ? "Yes" : "No"}</span> */}
							<span>${tickersData?.quotes.USD.price.toFixed(3)}</span>
						</OverviewItem>
					</Overview>
					<Description>{infoData?.description}</Description>
					<Overview>
						<OverviewItem>
							<span>Total Supply:</span>
							<span>{tickersData?.total_supply}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Max Supply:</span>
							<span>{tickersData?.max_supply}</span>
						</OverviewItem>
					</Overview>

					<Tabs>
						<Tab isActive={chartMatch !== null}>
							<Link to={`/${coinId}/chart`}>Chart</Link>
						</Tab>
						<Tab isActive={priceMatch !== null}>
							<Link to={`/${coinId}/price`}>Price</Link>
						</Tab>
					</Tabs>

					<Switch>
						<Route path={`/:coinId/price`}>
							<Price />
						</Route>
						<Route path={`/:coinId/chart`}>
							<Chart coinId={coinId} />
						</Route>
					</Switch>
				</>
			)}
		</Container>
	);
}
export default Coin;
