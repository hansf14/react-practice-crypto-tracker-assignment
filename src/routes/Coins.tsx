// import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { POPULAR_COIN_IDS, fetchCoinsInfo, fetchCoinsInfoDev } from "../api";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
	padding-top: 55px;
	max-width: 600px;
	margin: 0 auto;
`;

const Header = styled.header`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const CoinsList = styled.ul`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 10px;
	padding: 10px 0;

	@media (max-width: 600px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: 360px) {
		grid-template-columns: 1fr;
	}
`;

const Coin = styled.li`
	background-color: ${({ theme }) => theme.keyColor05};
	border: 1px solid rgba(0, 0, 0, 0.4);
	border-radius: 6px;
	color: ${({ theme }) => (theme ? theme.keyColor02 : "#000")};
	transition: color 0.1s ease-in-out, background-color 0.3s ease-in-out;

	a {
		display: flex;
		align-items: center;
		padding: 20px;
		transition: color 0.2s ease-in-out;
	}

	&:hover {
		a {
			color: ${({ theme }) => (theme ? theme.keyColor07 : "#333")};
		}
	}
`;

const Title = styled.h1`
	margin: 100px 0 60px;
	color: ${({ theme }) => (theme ? theme.keyColor03 : "#ffe600")};
	transition: color 0.3s ease-in-out;
	font-size: 40px;
	font-weight: bold;
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

interface CoinMinimalInfo {
	id: string;
	name: string;
	symbol: string;
}

function Coins() {
	const { isLoading, data } = useQuery<CoinMinimalInfo[]>(
		["coins-list"],
		// fetchCoinsInfo,
		fetchCoinsInfoDev,
		{
			// select: (data) => data.slice(0, 30),
			select: (data) =>
				data.filter((coin) =>
					// POPULAR_COIN_SYMBOLS.includes(coin.symbol.toUpperCase())
					POPULAR_COIN_IDS.includes(coin.id)
				),
			staleTime: 3600 * 1000,
			cacheTime: 3600 * 1000,
		}
	);
	console.log(data);

	return (
		<Container>
			<Helmet>
				<title>Popular Coins List</title>
				<link
					rel="icon"
					type="image/png"
					href={`${process.env.PUBLIC_URL}/favicon.png`}
					sizes="16x16"
				/>
			</Helmet>
			<Header>
				<Title>Popular Coins List</Title>
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
									src={`https://cryptofonts.com/img/icons/${
										coin.symbol === "lunc" ? "luna" : coin.symbol
									}.svg`}
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
