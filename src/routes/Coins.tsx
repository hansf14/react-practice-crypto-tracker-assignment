import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Helmet } from "react-helmet-async";
import { fetchInfo, POPULAR_COIN_IDS } from "@/apis";
import Header from "@/components/Header";
import Container from "@/components/Container";
import MainTitle from "@/components/MainTitle";
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
		theme.listBoxBackgroundColor ? theme.listBoxBackgroundColor : "#fff"};
	${({ theme }) =>
		theme.listBoxBorderStyle ? `border: ${theme.listBoxBorderStyle};` : ""}
	border-radius: 6px;

	color: ${({ theme }) =>
		theme.listBoxTextColor ? theme.listBoxTextColor : "#000"};
	font-weight: bold;
	transition: color 0.1s ease-in-out, background-color 0.3s ease-in-out;

	:where(a) {
		display: flex;
		align-items: center;
		padding: 20px;
		transition: color 0.2s ease-in-out;
	}

	&:hover {
		:where(a) {
			color: ${({ theme }) =>
				theme.listBoxHoverTextColor ? theme.listBoxHoverTextColor : "#000"};
		}
	}
`;

const Img = styled.img`
	width: 35px;
	height: 35px;
	margin-right: 10px;
`;

function Coins() {
	const { isLoading, data, isError, error } = useQuery(
		["fetch-coins-list"],
		() => fetchInfo({ apiName: "fetch-coins-info", apiParams: null }),
		{
			// select: (data) => data.slice(0, 30),
			select: (data) => {
				return data?.filter((coin) =>
					// POPULAR_COIN_SYMBOLS.includes(coin.symbol.toUpperCase())
					([...POPULAR_COIN_IDS] as string[]).includes(coin.id)
				);
			},
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
				<MainTitle>Popular Coins List</MainTitle>
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
										coinName: coin.name,
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
