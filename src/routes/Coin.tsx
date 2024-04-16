import {
	useLocation,
	useParams,
	useRouteMatch,
	Switch,
	Route,
	Link,
} from "react-router-dom";
import styled, { css } from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinInfoDev } from "@/api";
import { Helmet } from "react-helmet-async";
import { default as ContainerBase } from "@/components/Container";
import { default as HeaderBase } from "@/components/Header";
import Title from "@/components/Title";
import Loader from "@/components/Loader";
import ErrorDescription from "@/components/ErrorDescription";
import { dateStringToEpochTime, formatDate } from "@/utils/formatDate";
import useUniqueRandomIds from "@/hooks/useUniqueRandomIds";
import useBeforeRender from "@/hooks/useBeforeRender";
import MasonryGrid from "@/components/MasonryGrid";
import { MasonryGridItem } from "@/components/MasonryGrid/styles";

const Header = styled(HeaderBase)`
	gap: 10px;
`;

const Container = styled(ContainerBase)`
	word-break: break-word;

	& a {
		transition: color 0.2s ease-in-out;
		&:hover {
			color: ${({ theme }) => (theme.keyColor07 ? theme.keyColor07 : "#333")};
		}
	}
`;

const LogoContainer = styled.div`
	height: 40px;
	display: flex;
`;

const Logo = styled.img`
	height: 100%;
`;

const LastUpdatedContainer = styled.div`
	font-size: 13px;
	margin-bottom: 5px;

	color: ${({ theme }) => (theme.keyColor08 ? theme.keyColor08 : "#000")};
`;

const LastUpdatedTitle = styled.span``;

const LastUpdatedDetail = styled.span``;

const OverviewContainer = styled.div`
	display: flex;
	flex-direction: column;

	background-color: ${({ theme }) =>
		theme.keyColor04 ? theme.keyColor04 : "#fcfaf5"};
	padding: 10px 20px;
	${({ theme }) =>
		theme.borderStyle01 ? `border: ${theme.borderStyle01};` : ""}

	&:not(:nth-of-type(2)) {
		border-top: none;
	}
`;

const titleCommonCss = css`
	margin: 7px 0 15px;
	font-size: 20px;
	font-weight: bold;
`;

const OverviewTitle = styled.h2`
	${titleCommonCss}
	color: ${({ theme }) => (theme.keyColor03 ? theme.keyColor03 : "#000")};
`;

const OverviewDetail = styled.ul.withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<{
	customProps: {
		columnCnt: number;
		columnWidths?: string[] | string;
		columnGap?: string;
		rowGap?: string;
	};
}>`
	display: grid;
	grid-template-columns: ${({ customProps }) =>
		customProps.columnWidths
			? `${
					typeof customProps.columnWidths === "string"
						? customProps.columnWidths
						: customProps.columnWidths.join(" ")
			  };`
			: `repeat(${customProps.columnCnt}, 1fr);`}

	// column-gap: 20px;
	// row-gap: 10px;
	${({ customProps }) =>
		customProps.columnGap ? `column-gap: ${customProps.columnGap};` : ""}
	${({ customProps }) =>
		customProps.rowGap ? `row-gap: ${customProps.rowGap};` : ""}

	color: ${({ theme }) => (theme.keyColor08 ? theme.keyColor08 : "#000")};

	& > :nth-child(${({ customProps }) => customProps.columnCnt}n + 1) {
		text-align: start;
	}
	&
		> :not(
			:nth-child(${({ customProps }) => customProps.columnCnt}n + 1)
		):not(:nth-child(${({ customProps }) => customProps.columnCnt}n)) {
		text-align: center;
	}
	& > :nth-child(${({ customProps }) => customProps.columnCnt}n) {
		text-align: end;
	}
`;

const OverviewDetailItem = styled.li`
	font-size: 13px;
	font-weight: bold;

	span:first-child {
		margin-right: 3px;
		font-weight: 400;
		text-transform: uppercase;
	}
`;

const NestedList = styled.ul`
	margin-top: 5px;
	margin-left: 10px;

	${OverviewDetailItem}:has(&) {
		display: flex;
		flex-direction: column;
	}
`;

const NestedListItem = styled.li``;

const DescriptionContainer = styled(OverviewContainer)`
	background-color: ${({ theme }) =>
		theme.keyColor05 ? theme.keyColor05 : "#fcfaf5"};
`;

const DescriptionTitle = styled.h2`
	${titleCommonCss}
`;

const Description = styled.p`
	margin: 0 10px 10px;
`;

const Tabs = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	margin: 25px 0px;
	gap: 10px;
`;

const Tab = styled.span.withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<{ customProps?: { isActive?: boolean } }>`
	text-align: center;
	text-transform: uppercase;
	font-size: 13px;
	font-weight: 400;
	background-color: rgba(0, 0, 0, 0.5);
	padding: 7px 0px;
	color: ${({ customProps, theme }) =>
		typeof customProps?.isActive === "boolean"
			? customProps?.isActive
				? theme.keyColor03
				: theme.keyColor01
			: "#000"};

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

function Coin() {
	const { coinId } = useParams<RouteParams>();
	const { state } = useLocation<RouteState>();
	// console.log(state.name);

	const { isLoading, data, isError, error } = useQuery<
		Awaited<ReturnType<typeof fetchCoinInfo>>
	>(
		["info", coinId],
		() =>
			// fetchCoinInfo(coinId)
			fetchCoinInfoDev({ coinId }),
		{
			staleTime: 3600 * 1000,
			cacheTime: 3600 * 1000,
		}
	);
	console.log(data);

	const priceMatch = useRouteMatch("/:coinId/price");
	// console.log(priceMatch);
	const chartMatch = useRouteMatch("/:coinId/chart");
	// console.log(chartMatch);

	let date: string | null = null;
	let time: string | null = null;
	if (data) {
		const epochTime = dateStringToEpochTime(data.last_updated);
		const { formattedDate, formattedTime } = formatDate(epochTime);
		date = formattedDate;
		time = formattedTime;
	}

	const bitcoinForumLink = data?.links.bitcointalk_thread_identifier
		? `https://bitcointalk.org/index.php?topic=${data.links.bitcointalk_thread_identifier}`
		: null;

	const githubRepoLinks = data?.links.repos_url.github ?? null;
	const {
		ids: githubRepoLinkKeys,
		keepOrExpandIds: keepOrExpandGithubRepoLinkKeys,
	} = useUniqueRandomIds(githubRepoLinks?.length ?? 0);

	useBeforeRender(() => {
		keepOrExpandGithubRepoLinkKeys(githubRepoLinks?.length ?? 0);
	}, [githubRepoLinks?.length]);

	const bitbucketRepoLinks = data?.links.repos_url.bitbucket ?? null;
	const {
		ids: bitbucketRepoLinkKeys,
		keepOrExpandIds: keepOrExpandBitbucketRepoLinkKeys,
	} = useUniqueRandomIds(bitbucketRepoLinks?.length ?? 0);

	useBeforeRender(() => {
		keepOrExpandBitbucketRepoLinkKeys(bitbucketRepoLinks?.length ?? 0);
	}, [bitbucketRepoLinks?.length]);

	const blockchainSites = data?.links.blockchain_site ?? null;
	const {
		ids: blockchainSiteKeys,
		keepOrExpandIds: keepOrExpandBlockchainSiteKeys,
	} = useUniqueRandomIds(blockchainSites?.length ?? 0);

	useBeforeRender(() => {
		keepOrExpandBlockchainSiteKeys(blockchainSites?.length ?? 0);
	}, [blockchainSites?.length]);

	const overviewDetailColumnGap = "20px";
	const overviewDetailRowGap = "10px";

	return (
		<Container>
			<Helmet>
				<title>
					{state?.name ? state.name : isLoading ? "Loading..." : data?.name}
				</title>
				<link
					rel="icon"
					type="image/png"
					href={
						data
							? `https://cryptofonts.com/img/icons/${
									data.symbol === "lunc" ? "luna" : data.symbol
							  }.svg`
							: `${process.env.PUBLIC_URL}/favicon.png`
					}
					sizes="16x16"
				/>
			</Helmet>
			<Header>
				<Title>
					{state?.name ? state.name : isLoading ? "Loading..." : data?.name}
				</Title>
				<LogoContainer>
					<Logo
						src={
							data &&
							`https://cryptofonts.com/img/icons/${
								data.symbol === "lunc" ? "luna" : data.symbol
							}.svg`
						}
					/>
				</LogoContainer>
			</Header>
			{isLoading ? (
				<Loader>Loading...</Loader>
			) : isError ? (
				<ErrorDescription customProps={{ error }} />
			) : (
				<>
					<LastUpdatedContainer>
						<LastUpdatedTitle>Last Update: </LastUpdatedTitle>
						<LastUpdatedDetail>
							{date && time ? `${date} ${time}` : "Unknown"}
						</LastUpdatedDetail>
					</LastUpdatedContainer>
					<OverviewContainer>
						<OverviewTitle>Overview</OverviewTitle>
						<OverviewDetail
							customProps={{
								columnCnt: 3,
								columnGap: overviewDetailColumnGap,
								rowGap: overviewDetailRowGap,
							}}
						>
							<OverviewDetailItem>
								<span>Rank: </span>
								<span>{data?.market_cap_rank ?? "Unknown"}</span>
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Symbol: </span>
								<span>{data?.symbol ?? "Unknown"}</span>
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Price: </span>
								<span>
									${data?.market_data.current_price.usd.toFixed(3) ?? "Unknown"}
								</span>
							</OverviewDetailItem>
						</OverviewDetail>
					</OverviewContainer>

					<OverviewContainer>
						<OverviewTitle>Community</OverviewTitle>
						<OverviewDetail
							customProps={{
								columnCnt: 2,
								columnGap: overviewDetailColumnGap,
								rowGap: overviewDetailRowGap,
							}}
						>
							<OverviewDetailItem>
								<span>Twitter Followers: </span>
								<span>
									{data?.community_data.twitter_followers ?? "Unknown"}
								</span>
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Telegram Channel User Count: </span>
								<span>
									{data?.community_data.telegram_channel_user_count ??
										"Unknown"}
								</span>
							</OverviewDetailItem>
						</OverviewDetail>
					</OverviewContainer>

					<OverviewContainer>
						<OverviewTitle>Code</OverviewTitle>
						<OverviewDetail
							customProps={{
								columnCnt: 2,
								columnGap: overviewDetailColumnGap,
								rowGap: overviewDetailRowGap,
							}}
						>
							<OverviewDetailItem>
								<span>Github Repositories: </span>
								{githubRepoLinks && githubRepoLinks.length !== 0 ? (
									<NestedList>
										{githubRepoLinks.map((link, idx) => (
											<NestedListItem key={githubRepoLinkKeys[idx]}>
												<a href={link}>{link}</a>
											</NestedListItem>
										))}
									</NestedList>
								) : (
									<span>Unknown</span>
								)}
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Github Stars: </span>
								<span>{data?.developer_data.stars ?? "Unknown"}</span>
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Github Subscribers: </span>
								<span>{data?.developer_data.subscribers ?? "Unknown"}</span>
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Github Forks: </span>
								<span>{data?.developer_data.forks ?? "Unknown"}</span>
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Github Issues: </span>
								<span>{data?.developer_data.total_issues ?? "Unknown"}</span>
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Bitbucket Repositories: </span>
								{bitbucketRepoLinks && bitbucketRepoLinks.length !== 0 ? (
									<NestedList>
										{bitbucketRepoLinks.map((link, idx) => (
											<NestedListItem key={bitbucketRepoLinkKeys[idx]}>
												<a href={link}>{link}</a>
											</NestedListItem>
										))}
									</NestedList>
								) : (
									<span>Unknown</span>
								)}
							</OverviewDetailItem>
						</OverviewDetail>
					</OverviewContainer>

					{data?.description.en && (
						<DescriptionContainer>
							<DescriptionTitle>Description</DescriptionTitle>
							<Description>{data.description.en}</Description>
						</DescriptionContainer>
					)}

					<OverviewContainer>
						<OverviewTitle>Links</OverviewTitle>
						<MasonryGrid customProps={{ columnCnt: 2, rowGap: "20px" }}>
							<MasonryGridItem>
								{bitcoinForumLink ? (
									<>
										<span>Bitcoin Forum </span>
										<NestedList>
											<a href={bitcoinForumLink}>{bitcoinForumLink}</a>
										</NestedList>
									</>
								) : (
									<>
										<span>Bitcoin Forum: </span>
										<span>Unknown</span>
									</>
								)}
							</MasonryGridItem>
							{/* Blockchain Sites */}
							<MasonryGridItem>
								{blockchainSites && blockchainSites.length !== 0 ? (
									<>
										<span>Blockchain Sites </span>
										<NestedList>
											{blockchainSites.map((link, idx) => (
												<NestedListItem key={blockchainSiteKeys[idx]}>
													<a href={link}>{link}</a>
												</NestedListItem>
											))}
										</NestedList>
									</>
								) : (
									<>
										<span>Blockchain Sites: </span>
										<span>Unknown</span>
									</>
								)}
							</MasonryGridItem>
							{/* Facebook */}
							{/* Chat */}
							{/* Homepage */}
							{/*  */}
							<MasonryGridItem>
								<span>Github Subscribers: </span>
								<span>{data?.developer_data.subscribers ?? "Unknown"}</span>
							</MasonryGridItem>
						</MasonryGrid>
					</OverviewContainer>

					<OverviewContainer>
						<OverviewDetail
							customProps={{
								columnCnt: 2,
								columnGap: overviewDetailColumnGap,
								rowGap: overviewDetailRowGap,
							}}
						>
							<OverviewDetailItem>
								<span>Total Supply:</span>
								{/* <span>{tickersData?.total_supply}</span> */}
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Max Supply:</span>
								{/* <span>{tickersData?.max_supply}</span> */}
							</OverviewDetailItem>
						</OverviewDetail>
					</OverviewContainer>

					<Tabs>
						<Tab customProps={{ isActive: chartMatch !== null }}>
							<Link to={`/${coinId}/chart`}>Chart</Link>
						</Tab>
						<Tab customProps={{ isActive: priceMatch !== null }}>
							<Link to={`/${coinId}/price`}>Price</Link>
						</Tab>
					</Tabs>

					{/* <Switch>
						<Route path={`/:coinId/price`}>
							<Price />
						</Route>
						<Route path={`/:coinId/chart`}>
							<Chart coinId={coinId} />
						</Route>
					</Switch> */}
				</>
			)}
		</Container>
	);
}

export default Coin;
