// import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
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

const CoinsList = styled.ul``;

const Coin = styled.li`
	background-color: white;
	color: ${(props) => props.theme.bgColor};
	margin-bottom: 10px;
	border-radius: 15px;

	a {
		display: flex;
		align-items: center;
		padding: 20px;
		transition: color 0.2s ease-in-out;
	}

	&:hover {
		a {
			color: ${(props) => props.theme.accentColor};
		}
	}
`;

const Title = styled.h1`
	font-size: 48;
	color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
	text-align: center;
	display: block;
`;

const Img = styled.img`
	width: 35px;
	height: 35px;
	margin-right: 10px;
`;

interface ICoin {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	is_new: boolean;
	is_active: boolean;
	type: string;
}

function Coins() {
	// const [coins, setCoins] = useState<CoinInterface[]>([]);
	// const [loading, setLoading] = useState(true);

	// useEffect(() => {
	// 	(async () => {
	// 		const response = await fetch("https://api.coinpaprika.com/v1/coins");
	// 		const json = await response.json();
	// 		// console.log(json);

	// 		setCoins(json.slice(0, 100));
	// 		setLoading(false);
	// 		console.log(coins);
	// 	})();
	// }, []);

	const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins, {
		select: (data) => data.slice(0, 30),
	});

	return (
		<Container>
			<Helmet>
				<title>코인</title>
				<link rel="icon" type="image/png" href="/favicon.png" sizes="16x16" />
			</Helmet>
			<Header>
				<Title>코인</Title>
			</Header>
			{isLoading ? (
				<Loader>Loading...</Loader>
			) : (
				<CoinsList>
					{data?.map((coin) => (
						<Coin key={coin.id}>
							<Link
								to={{
									pathname: `/${coin.id}`,
									state: {
										name: coin.name,
									},
								}}
							>
								<Img
									src={`https://static.coinpaprika.com/coin/${coin.id}/logo.png`}
								/>
								{coin.name} &rarr;
							</Link>
						</Coin>
					))}
				</CoinsList>
			)}
		</Container>
	);
}
export default Coins;
