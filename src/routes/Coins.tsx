import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Helmet } from "react-helmet-async";
import { POPULAR_COIN_IDS, fetchCoinsInfo } from "@/api";
import Header from "@/components/Header";
import Container from "@/components/Container";
import Title from "@/components/Title";
import Loader from "@/components/Loader";
import ErrorDescription from "@/components/ErrorDescription";

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
	background-color: ${({ theme }) =>
		theme.keyColor05 ? theme.keyColor05 : "#fcfaf5"};
	${({ theme }) =>
		theme.borderStyle01 ? `border: ${theme.borderStyle01};` : ""}
	border-radius: 6px;
	color: ${({ theme }) => (theme.keyColor02 ? theme.keyColor02 : "#000")};
	transition: color 0.1s ease-in-out, background-color 0.3s ease-in-out;

	a {
		display: flex;
		align-items: center;
		padding: 20px;
		transition: color 0.2s ease-in-out;
	}

	&:hover {
		a {
			color: ${({ theme }) => (theme.keyColor07 ? theme.keyColor07 : "#333")};
		}
	}
`;

const Img = styled.img`
	width: 35px;
	height: 35px;
	margin-right: 10px;
`;

function Coins() {
	const { isLoading, data, isError, error } = useQuery<
		Awaited<ReturnType<typeof fetchCoinsInfo>>
	>(
		["coins-list"],
		fetchCoinsInfo,
		// fetchCoinsInfoDev,
		{
			// select: (data) => data.slice(0, 30),
			select: (data) => {
				return data?.filter((coin) =>
					// POPULAR_COIN_SYMBOLS.includes(coin.symbol.toUpperCase())
					([...POPULAR_COIN_IDS] as string[]).includes(coin.id)
				);
			},
			staleTime: 3600 * 1000,
			cacheTime: 3600 * 1000,
		}
	);
	// console.log("isLoading:", isLoading);
	// console.log("data:", data);
	// console.log("isError:", isError);
	// console.log("error:", error);

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
			) : isError ? (
				<ErrorDescription customProps={{ error }} />
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
