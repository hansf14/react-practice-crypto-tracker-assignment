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
import MainTitle from "@/components/MainTitle";
import Loader from "@/components/Loader";
import ErrorDescription from "@/components/ErrorDescription";
import { dateStringToEpochTime, formatDate } from "@/utils/formatDate";
import useUniqueRandomIds from "@/hooks/useUniqueRandomIds";
import useBeforeRender from "@/hooks/useBeforeRender";
import {
	default as MasonryGridComponent,
	MasonryGridCustomAttributes,
	MasonryGridItem as MasonryGridItemComponent,
} from "@/components/MasonryGrid";
import { formatNumber } from "@/utils/formatNumber";
import DecoratedInlineItem from "@/components/DecoratedInlineItem";
import Logo, { LogoImg } from "@/components/Logo";
import ListGrid, {
	ListGridItem as ListGridItemComponent,
} from "@/components/ListGrid";
import { ItemCss, ItemFlexCss } from "@/components/ItemCss";
import Tabs, { Tab } from "@/components/Tabs";

////////////////////////////////////////////////////////////
// * tickers
// Tickers
// [1] Price Information:
// - converted_last: The last traded price of the cryptocurrency.
// - bid_ask_spread_percentage: The percentage difference between the highest bid price and the lowest ask price.
// - last_traded_at: The timestamp indicating when the cryptocurrency was last traded.
// - timestamp: The timestamp indicating when the ticker data was last updated.

// [2] Volume Information:
// - converted_volume: The trading volume of the cryptocurrency
// - timestamp: The timestamp indicating when the ticker data was last updated.

////////////////////////////////////////////////////////////
// * marketdata
// Market Data

// [1] Market Capitalization
// - market_cap: The market capitalization of the coin.
// - market_cap_rank: The rank of the coin based on market capitalization.
// - fully_diluted_valuation: The fully diluted valuation of the coin, which considers the total supply of coins.

// [2] Volume and Supply Information:
// - total_volume: The total trading volume of the coin.
// - total_supply: The total supply of the coin.
// - max_supply: The maximum supply of the coin.
// - circulating_supply: The circulating supply of the coin.

// [3] Price Information:
// - current_price: The current price of the coin.
// - ath: The all-time high (ATH) price of the coin.
// - ath_date: The date when the all-time high price was reached.
// - atl: The all-time low (ATL) price of the coin.
// - atl_date: The date when the all-time low price was reached.
// - high_24h: The highest price of the coin in the last 24 hours.
// - low_24h: The lowest price of the coin in the last 24 hours.

// [4] Price Change and Percentage Change:
// - ath_change_percentage: The percentage change from the all-time high price
// - atl_change_percentage: The percentage change from the all-time low price.

// - price_change: The price change.
//   ...
// - price_change_percentage: The percentage price change.
//   ...

// - market_cap_change: The market capitalization change.
//   ...
// - market_cap_change_percentage: The market capitalization percentage change.
//   ...

////////////////////////////////////////////////////////////

const Header = styled(HeaderBase)`
	gap: 10px;
`;

////////////////////////////////////////////////////////////

const Container = styled(ContainerBase)`
	word-break: break-word;

	& a {
		transition: color 0.2s ease-in-out;
		&:hover {
			color: ${({ theme }) =>
				theme.linkHoverTextColor ? theme.linkHoverTextColor : "#333"};
		}
	}
`;

////////////////////////////////////////////////////////////

const LastUpdatedContainer = styled.div`
	margin-bottom: 5px;

	font-size: 13px;
	font-weight: bold;

	color: ${({ theme }) =>
		theme.lastUpdatedContainerTextColor
			? theme.lastUpdatedContainerTextColor
			: "#000"};
`;

const LastUpdatedTitle = styled.span``;

const LastUpdatedDetail = styled.span``;

////////////////////////////////////////////////////////////

const NestedList = styled.ul`
	margin-left: 5px;
`;

const NestedListItem = styled.li`
	line-height: 1.2;
`;

////////////////////////////////////////////////////////////

const SectionTitle = styled.h2`
	margin-bottom: 15px;
	font-size: 20px;
	font-weight: bold;
`;

const Section = styled.section`
	display: flex;
	flex-direction: column;

	padding: 20px;
	${({ theme }) =>
		theme.sectionBorderStyle ? `border: ${theme.sectionBorderStyle};` : ""}

	&:not(:first-of-type) {
		border-top: none;
	}

	&:nth-of-type(2n + 1) {
		background-color: ${({ theme }) =>
			theme.sectionBackgroundColor01 ? theme.sectionBackgroundColor01 : "#fff"};
	}

	&:nth-of-type(2n) {
		background-color: ${({ theme }) =>
			theme.sectionBackgroundColor02 ? theme.sectionBackgroundColor02 : "#fff"};
	}

	&:nth-of-type(2n + 1) ${SectionTitle} {
		color: ${({ theme }) =>
			theme.sectionTitleTextColor01 ? theme.sectionTitleTextColor01 : "#000"};
	}
`;

////////////////////////////////////////////////////////////

export const ListGridItem = styled(ListGridItemComponent)`
	${ItemCss}

	&:has(${NestedList}) {
		${ItemFlexCss}
	}
`;

////////////////////////////////////////////////////////////

const MasonryGridItem = styled(MasonryGridItemComponent)`
	${ItemCss}

	&:has(${NestedList}) {
		${ItemFlexCss}
	}
`;

const MasonryGrid = styled(MasonryGridComponent)`
	${({ customProps }) => {
		return css`
			[${MasonryGridCustomAttributes.dataMasonryGridColumnNumber}="1"]
				${MasonryGridItem} {
				align-items: flex-start;

				${NestedList} {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
				}
			}

			[${MasonryGridCustomAttributes.dataMasonryGridColumnNumber}="1"]
				${MasonryGridItem} {
				text-align: left;

				${NestedList} {
					display: flex;
					flex-direction: column;
					align-items: flex-start;

					${NestedListItem} {
						text-align: left;
					}
				}
			}

			:not(
					:is(
							[${MasonryGridCustomAttributes.dataMasonryGridColumnNumber}="1"],
							[${MasonryGridCustomAttributes.dataMasonryGridColumnNumber}="${customProps.columnCnt}"]
						)
				)
				${MasonryGridItem} {
				align-items: center;

				${NestedList} {
					display: flex;
					flex-direction: column;
					align-items: center;

					margin-left: 0;

					${NestedListItem} {
						text-align: center;
					}
				}
			}

			:not(
					:is(
							[${MasonryGridCustomAttributes.dataMasonryGridColumnNumber}="1"],
							[${MasonryGridCustomAttributes.dataMasonryGridColumnNumber}="${customProps.columnCnt}"]
						)
				)
				${MasonryGridItem} {
				text-align: center;

				${NestedList} {
					display: flex;
					flex-direction: column;
					align-items: center;

					margin-left: 0;
				}
			}

			[${MasonryGridCustomAttributes.dataMasonryGridColumnNumber}="${customProps.columnCnt}"]
				${MasonryGridItem} {
				align-items: flex-end;

				${NestedList} {
					display: flex;
					flex-direction: column;
					align-items: flex-end;

					margin-left: 0;

					${NestedListItem} {
						text-align: right;
					}
				}
			}

			[${MasonryGridCustomAttributes.dataMasonryGridColumnNumber}="${customProps.columnCnt}"]
				${MasonryGridItem} {
				text-align: right;

				${NestedList} {
					display: flex;
					flex-direction: column;
					align-items: flex-end;

					margin-left: 0;
				}
			}
		`;
	}}
`;

////////////////////////////////////////////////////////////

const Description = styled.p`
	margin: 0 10px;

	font-size: 14px;
`;

////////////////////////////////////////////////////////////

interface RouteParams {
	coinId: string;
}

interface RouteState {
	coinName: string;
}

////////////////////////////////////////////////////////////

function Coin() {
	const { coinId } = useParams<RouteParams>();
	const { state } = useLocation<RouteState>();
	// console.log(state.coinName);

	const { isLoading, data, isError, error } = useQuery<
		Awaited<ReturnType<typeof fetchCoinInfo>>
	>(
		["info", coinId],
		() =>
			// fetchCoinInfo({ coinId }),
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

	const faviconSrcUrl = data?.symbol
		? `https://cryptofonts.com/img/icons/${
				data.symbol === "lunc" ? "luna" : data.symbol
		  }.svg`
		: `${process.env.PUBLIC_URL}/favicon.png`;
	const logoSrcUrl = data?.symbol
		? `https://cryptofonts.com/img/icons/${
				data.symbol === "lunc" ? "luna" : data.symbol
		  }.svg`
		: null;

	let formattedLastUpdatedDate: string | null = null;
	let formattedLastUpdatedTime: string | null = null;
	if (data?.last_updated) {
		const epochTime = dateStringToEpochTime(data.last_updated);
		const { formattedDate, formattedTime } = formatDate(epochTime);
		formattedLastUpdatedDate = formattedDate;
		formattedLastUpdatedTime = formattedTime;
	}
	const formattedLastUpdatedDateTime =
		formattedLastUpdatedDate && formattedLastUpdatedTime
			? `${formattedLastUpdatedDate} ${formattedLastUpdatedTime}`
			: "Unknown";

	const symbol = data?.symbol ?? "Unknown";

	const formattedWatchListPortfolioUserCnt =
		typeof data?.watchlist_portfolio_users === "number"
			? formatNumber(data.watchlist_portfolio_users)
			: "Unknown";

	const formattedSentimentVotesUpPercentage =
		typeof data?.sentiment_votes_up_percentage === "number"
			? `${formatNumber(data.sentiment_votes_up_percentage)}%`
			: "Unknown";

	const formattedSentimentVotesDownPercentage =
		typeof data?.sentiment_votes_down_percentage === "number"
			? `${formatNumber(data.sentiment_votes_up_percentage)}%`
			: "Unknown";

	const formattedTwitterFollowerCnt =
		typeof data?.community_data.twitter_followers === "number"
			? formatNumber(data.community_data.twitter_followers)
			: "Unknown";

	const formattedTelegramUserCnt =
		typeof data?.community_data.telegram_channel_user_count === "number"
			? formatNumber(data.community_data.telegram_channel_user_count)
			: "Unknown";

	const formattedFacebookLikeCnt =
		typeof data?.community_data.facebook_likes === "number"
			? formatNumber(data.community_data.facebook_likes)
			: "Unknown";

	const formattedGithubStarCnt =
		typeof data?.developer_data.stars === "number"
			? formatNumber(data.developer_data.stars)
			: "Unknown";

	const formattedGithubForkCnt =
		typeof data?.developer_data.forks === "number"
			? formatNumber(data.developer_data.forks)
			: "Unknown";

	const formattedGithubIssueCnt =
		typeof data?.developer_data.total_issues === "number"
			? formatNumber(data.developer_data.total_issues)
			: "Unknown";

	const descriptionEn = data?.description.en ?? null;

	const websiteLinks =
		!data?.links.homepage ||
		data.links.homepage.length === 0 ||
		data.links.homepage.every((link) => link === "")
			? null
			: data.links.homepage.filter((link) => link.trim() !== "");

	const { ids: websiteLinkKeys, keepOrExpandIds: keepOrExpandWebsiteLinkKeys } =
		useUniqueRandomIds(websiteLinks?.length ?? 0);

	useBeforeRender(() => {
		keepOrExpandWebsiteLinkKeys(websiteLinks?.length ?? 0);
	}, [websiteLinks?.length]);

	const bitcoinForumLink =
		typeof data?.links.bitcointalk_thread_identifier === "number"
			? `https://bitcointalk.org/index.php?topic=${data.links.bitcointalk_thread_identifier}`
			: null;

	const facebookLink =
		typeof data?.links.facebook_username === "string" &&
		data.links.facebook_username !== ""
			? `https://www.facebook.com/${data.links.facebook_username}`
			: null;

	const twitterLink =
		typeof data?.links.twitter_screen_name === "string" &&
		data.links.twitter_screen_name !== ""
			? `https://twitter.com/${data.links.twitter_screen_name}`
			: null;

	const redditUrl =
		typeof data?.links.subreddit_url === "string" &&
		data.links.subreddit_url !== ""
			? data.links.subreddit_url
			: null;

	const telegramLink =
		typeof data?.links.telegram_channel_identifier === "string" &&
		data.links.telegram_channel_identifier !== ""
			? `https://t.me/${data.links.telegram_channel_identifier}`
			: null;

	const chatLinks =
		!data?.links.chat_url ||
		data.links.chat_url.length === 0 ||
		data.links.chat_url.every((link) => link === "")
			? null
			: data.links.chat_url.filter((link) => link.trim() !== "");

	const { ids: chatLinkKeys, keepOrExpandIds: keepOrExpandChatLinkKeys } =
		useUniqueRandomIds(chatLinks?.length ?? 0);

	useBeforeRender(() => {
		keepOrExpandChatLinkKeys(chatLinks?.length ?? 0);
	}, [chatLinks?.length]);

	const whitepaperLink =
		typeof data?.links.whitepaper === "string" && data.links.whitepaper !== ""
			? data.links.whitepaper
			: null;

	const githubRepoLinks =
		!data?.links.repos_url.github ||
		data.links.repos_url.github.length === 0 ||
		data.links.repos_url.github.every((link) => link === "")
			? null
			: data.links.repos_url.github.filter((link) => link.trim() !== "");

	const {
		ids: githubRepoLinkKeys,
		keepOrExpandIds: keepOrExpandGithubRepoLinkKeys,
	} = useUniqueRandomIds(githubRepoLinks?.length ?? 0);

	useBeforeRender(() => {
		keepOrExpandGithubRepoLinkKeys(githubRepoLinks?.length ?? 0);
	}, [githubRepoLinks?.length]);

	const bitbucketRepoLinks =
		!data?.links.repos_url.bitbucket ||
		data.links.repos_url.bitbucket.length === 0 ||
		data.links.repos_url.bitbucket.every((link) => link === "")
			? null
			: data.links.repos_url.bitbucket.filter((link) => link.trim() !== "");

	const {
		ids: bitbucketRepoLinkKeys,
		keepOrExpandIds: keepOrExpandBitbucketRepoLinkKeys,
	} = useUniqueRandomIds(bitbucketRepoLinks?.length ?? 0);

	useBeforeRender(() => {
		keepOrExpandBitbucketRepoLinkKeys(bitbucketRepoLinks?.length ?? 0);
	}, [bitbucketRepoLinks?.length]);

	const blockchainSites =
		!data?.links.blockchain_site ||
		data.links.blockchain_site.length === 0 ||
		data.links.blockchain_site.every((link) => link === "")
			? null
			: data.links.blockchain_site.filter((link) => link.trim() !== "");

	const {
		ids: blockchainSiteKeys,
		keepOrExpandIds: keepOrExpandBlockchainSiteKeys,
	} = useUniqueRandomIds(blockchainSites?.length ?? 0);

	useBeforeRender(() => {
		keepOrExpandBlockchainSiteKeys(blockchainSites?.length ?? 0);
	}, [blockchainSites?.length]);

	const officialForumLinks =
		!data?.links.official_forum_url ||
		data.links.official_forum_url.length === 0 ||
		data.links.official_forum_url.every((link) => link === "")
			? null
			: data.links.official_forum_url.filter((link) => link.trim() !== "");

	const {
		ids: officialForumLinksKeys,
		keepOrExpandIds: keepOrExpandofficialForumLinksKeys,
	} = useUniqueRandomIds(officialForumLinks?.length ?? 0);

	useBeforeRender(() => {
		keepOrExpandofficialForumLinksKeys(officialForumLinks?.length ?? 0);
	}, [officialForumLinks?.length]);

	////////////////////////////////////////////////////////
	// [1] Market Capitalization

	const formattedMarketCap =
		typeof data?.market_data.market_cap.usd === "number"
			? `$${formatNumber(data.market_data.market_cap.usd)}`
			: "Unknown";

	const formattedMarketCapRank =
		typeof data?.market_cap_rank === "number"
			? `#${formatNumber(data.market_cap_rank)}`
			: "Unknown";

	const formattedFullyDilutedValuation =
		typeof data?.market_data.fully_diluted_valuation.usd === "number"
			? `$${formatNumber(
					parseFloat(data.market_data.fully_diluted_valuation.usd.toFixed(3))
			  )}`
			: "Unknown";

	////////////////////////////////////////////////////////
	// [2] Volume and Supply Information

	const formattedTotalVolume =
		typeof data?.market_data.total_volume.usd === "number"
			? `$${formatNumber(data.market_data.total_volume.usd)}`
			: "Unknown";

	const formattedTotalSupply =
		typeof data?.market_data.total_supply === "number"
			? `$${formatNumber(data.market_data.total_supply)}`
			: "Unknown";

	const formattedMaxSupply =
		typeof data?.market_data.max_supply === "number"
			? `$${formatNumber(data.market_data.max_supply)}`
			: "Unknown";

	const formattedCirculatingSupply =
		typeof data?.market_data.circulating_supply === "number"
			? `$${formatNumber(
					parseFloat(data.market_data.circulating_supply.toFixed(3))
			  )}`
			: "Unknown";

	////////////////////////////////////////////////////////
	// Price Information

	const formattedCurrentPriceUsd =
		typeof data?.market_data.current_price.usd === "number"
			? `$${formatNumber(
					parseFloat(data.market_data.current_price.usd.toFixed(3))
			  )}`
			: "Unknown";

	const formattedAth =
		typeof data?.market_data.ath.usd === "number"
			? `$${formatNumber(parseFloat(data.market_data.ath.usd.toFixed(3)))}`
			: "Unknown";

	let formattedAthDate: string | null = null;
	let formattedAthTime: string | null = null;
	if (data?.market_data.ath_date.usd) {
		const epochTime = dateStringToEpochTime(data.market_data.ath_date.usd);
		const { formattedDate, formattedTime } = formatDate(epochTime);
		formattedAthDate = formattedDate;
		formattedAthTime = formattedTime;
	}
	const formattedAthDateTime =
		formattedAthDate && formattedAthTime
			? `${formattedAthDate} ${formattedAthTime}`
			: "Unknown";

	const formattedAtl =
		typeof data?.market_data.atl.usd === "number"
			? `$${formatNumber(parseFloat(data.market_data.atl.usd.toFixed(3)))}`
			: "Unknown";

	let formattedAtlDate: string | null = null;
	let formattedAtlTime: string | null = null;
	if (data?.market_data.atl_date.usd) {
		const epochTime = dateStringToEpochTime(data.market_data.atl_date.usd);
		const { formattedDate, formattedTime } = formatDate(epochTime);
		formattedAtlDate = formattedDate;
		formattedAtlTime = formattedTime;
	}
	const formattedAtlDateTime =
		formattedAtlDate && formattedAtlTime
			? `${formattedAtlDate} ${formattedAtlTime}`
			: "Unknown";

	const formattedHigh24hPrice =
		typeof data?.market_data.high_24h.usd === "number"
			? `$${formatNumber(parseFloat(data.market_data.high_24h.usd.toFixed(3)))}`
			: "Unknown";

	const formattedLow24hPrice =
		typeof data?.market_data.low_24h.usd === "number"
			? `$${formatNumber(parseFloat(data.market_data.low_24h.usd.toFixed(3)))}`
			: "Unknown";

	// [4] Price Change and Percentage Change
	// const formattedAthChangePercentage = ;
	// const formattedAtlChangePercentage = ;

	// price change
	// price change percentage
	// market cap change
	// market cap change percentage

	const columnGap = "20px";
	const rowGap = "7px";

	return (
		<Container>
			<Helmet>
				<title>
					{state?.coinName
						? state.coinName
						: isLoading
						? "Loading..."
						: data?.name ?? "Error"}
				</title>
				<link rel="icon" type="image/png" href={faviconSrcUrl} sizes="16x16" />
			</Helmet>
			<Header>
				<MainTitle>
					{state?.coinName
						? state.coinName
						: isLoading
						? "Loading..."
						: data?.name ?? "Error"}
				</MainTitle>
				{logoSrcUrl && (
					<Logo>
						<LogoImg src={logoSrcUrl} />
					</Logo>
				)}
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
							{formattedLastUpdatedDateTime}
						</LastUpdatedDetail>
					</LastUpdatedContainer>
					<Section>
						<SectionTitle>Overview</SectionTitle>
						<ListGrid
							customProps={{
								columnCnt: 3,
								columnGap: columnGap,
								rowGap: rowGap,
							}}
						>
							<ListGridItem>
								<span>Market Capitalization Rank: </span>
								<span>{formattedMarketCapRank}</span>
							</ListGridItem>

							<ListGridItem>
								<span>Symbol: </span>
								<span>{symbol}</span>
							</ListGridItem>

							<ListGridItem>
								<span>Price: </span>
								<span>{formattedCurrentPriceUsd}</span>
							</ListGridItem>

							<ListGridItem>
								<span>Watchlist Portfolio Users: </span>
								<span>{formattedWatchListPortfolioUserCnt}</span>
							</ListGridItem>

							<ListGridItem>
								<span>Sentiment Votes Up Percentage: </span>
								<span>{formattedSentimentVotesUpPercentage}</span>
							</ListGridItem>

							<ListGridItem>
								<span>Sentiment Votes Down Percentage: </span>
								<span>{formattedSentimentVotesDownPercentage}</span>
							</ListGridItem>
						</ListGrid>
					</Section>

					<Section>
						<SectionTitle>Community</SectionTitle>
						<ListGrid
							customProps={{
								columnCnt: 2,
								columnGap,
								rowGap,
							}}
						>
							<ListGridItem>
								<span>Twitter Followers: </span>
								<span>{formattedTwitterFollowerCnt}</span>
							</ListGridItem>

							<ListGridItem>
								<span>Telegram Channel User Count: </span>
								<span>{formattedTelegramUserCnt}</span>
							</ListGridItem>

							<ListGridItem>
								<span>Facebook Likes: </span>
								<span>{formattedFacebookLikeCnt}</span>
							</ListGridItem>
						</ListGrid>
					</Section>

					<Section>
						<SectionTitle>Code</SectionTitle>
						<MasonryGrid
							customProps={{
								columnCnt: 2,
								columnGap,
								rowGap,
							}}
						>
							{githubRepoLinks ? (
								<MasonryGridItem>
									<span>Github Repositories</span>
									<NestedList>
										{githubRepoLinks.map((link, idx) => (
											<NestedListItem key={githubRepoLinkKeys[idx]}>
												<DecoratedInlineItem>
													<a href={link}>{link}</a>
												</DecoratedInlineItem>
											</NestedListItem>
										))}
									</NestedList>
								</MasonryGridItem>
							) : (
								<MasonryGridItem>
									<span>Github Repositories: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}

							<MasonryGridItem>
								<span>Github Stars: </span>
								<span>{formattedGithubStarCnt}</span>
							</MasonryGridItem>
							<MasonryGridItem>
								<span>Github Forks: </span>
								<span>{formattedGithubForkCnt}</span>
							</MasonryGridItem>
							<MasonryGridItem>
								<span>Github Issues: </span>
								<span>{formattedGithubIssueCnt}</span>
							</MasonryGridItem>

							{bitbucketRepoLinks ? (
								<MasonryGridItem>
									<span>Bitbucket Repositories</span>
									<NestedList>
										{bitbucketRepoLinks.map((link, idx) => (
											<NestedListItem key={bitbucketRepoLinkKeys[idx]}>
												<DecoratedInlineItem>
													<a href={link}>{link}</a>
												</DecoratedInlineItem>
											</NestedListItem>
										))}
									</NestedList>
								</MasonryGridItem>
							) : (
								<MasonryGridItem>
									<span>Bitbucket Repositories: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}
						</MasonryGrid>
					</Section>

					{descriptionEn && (
						<Section>
							<SectionTitle>Description</SectionTitle>
							<Description>{descriptionEn}</Description>
						</Section>
					)}

					<Section>
						<SectionTitle>Links</SectionTitle>
						<MasonryGrid
							customProps={{
								// sequential: true,
								columnCnt: 2,
								columnGap,
								rowGap,
							}}
						>
							{websiteLinks ? (
								<MasonryGridItem>
									<span>Websites </span>
									<NestedList>
										{websiteLinks.map((link, idx) => (
											<NestedListItem key={websiteLinkKeys[idx]}>
												<DecoratedInlineItem>
													<a href={link}>{link}</a>
												</DecoratedInlineItem>
											</NestedListItem>
										))}
									</NestedList>
								</MasonryGridItem>
							) : (
								<MasonryGridItem>
									<span>Websites: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}

							{officialForumLinks ? (
								<MasonryGridItem>
									<span>Official Forums </span>
									<NestedList>
										{officialForumLinks.map((link, idx) => (
											<NestedListItem key={officialForumLinksKeys[idx]}>
												<DecoratedInlineItem>
													<a href={link}>{link}</a>
												</DecoratedInlineItem>
											</NestedListItem>
										))}
									</NestedList>
								</MasonryGridItem>
							) : (
								<MasonryGridItem>
									<span>Official Forums: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}

							{bitcoinForumLink ? (
								<MasonryGridItem>
									<span>Bitcoin Forum </span>
									<NestedList>
										<NestedListItem>
											<DecoratedInlineItem>
												<a href={bitcoinForumLink}>{bitcoinForumLink}</a>
											</DecoratedInlineItem>
										</NestedListItem>
									</NestedList>
								</MasonryGridItem>
							) : (
								<MasonryGridItem>
									<span>Bitcoin Forum: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}

							{facebookLink ? (
								<MasonryGridItem>
									<span>Facebook </span>
									<NestedList>
										<NestedListItem>
											<DecoratedInlineItem>
												<a href={facebookLink}>{facebookLink}</a>
											</DecoratedInlineItem>
										</NestedListItem>
									</NestedList>
								</MasonryGridItem>
							) : (
								<MasonryGridItem>
									<span>Facebook: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}

							{twitterLink ? (
								<MasonryGridItem>
									<span>Twitter </span>
									<NestedList>
										<NestedListItem>
											<DecoratedInlineItem>
												<a href={twitterLink}>{twitterLink}</a>
											</DecoratedInlineItem>
										</NestedListItem>
									</NestedList>
								</MasonryGridItem>
							) : (
								<MasonryGridItem>
									<span>Twitter: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}

							{redditUrl ? (
								<MasonryGridItem>
									<span>Reddit </span>
									<NestedList>
										<NestedListItem>
											<DecoratedInlineItem>
												<a href={redditUrl}>{redditUrl}</a>
											</DecoratedInlineItem>
										</NestedListItem>
									</NestedList>
								</MasonryGridItem>
							) : (
								<MasonryGridItem>
									<span>Reddit: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}

							{telegramLink ? (
								<MasonryGridItem>
									<span>Telegram </span>
									<NestedList>
										<NestedListItem>
											<DecoratedInlineItem>
												<a href={telegramLink}>{telegramLink}</a>
											</DecoratedInlineItem>
										</NestedListItem>
									</NestedList>
								</MasonryGridItem>
							) : (
								<MasonryGridItem>
									<span>Telegram: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}

							{chatLinks ? (
								<MasonryGridItem>
									<span>Chat Links </span>
									<NestedList>
										{chatLinks.map((link, idx) => (
											<NestedListItem key={chatLinkKeys[idx]}>
												<DecoratedInlineItem>
													<a href={link}>{link}</a>
												</DecoratedInlineItem>
											</NestedListItem>
										))}
									</NestedList>
								</MasonryGridItem>
							) : (
								<MasonryGridItem>
									<span>Chat Links: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}

							{whitepaperLink ? (
								<MasonryGridItem>
									<span>Whitepaper </span>
									<NestedList>
										<NestedListItem>
											<DecoratedInlineItem>
												<a href={whitepaperLink}>{whitepaperLink}</a>
											</DecoratedInlineItem>
										</NestedListItem>
									</NestedList>
								</MasonryGridItem>
							) : (
								<MasonryGridItem>
									<span>Whitepaper: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}

							{blockchainSites ? (
								<MasonryGridItem>
									<span>Blockchain Sites </span>
									<NestedList>
										{blockchainSites.map((link, idx) => (
											<NestedListItem key={blockchainSiteKeys[idx]}>
												<DecoratedInlineItem>
													<a href={link}>{link}</a>
												</DecoratedInlineItem>
											</NestedListItem>
										))}
									</NestedList>
								</MasonryGridItem>
							) : (
								<MasonryGridItem>
									<span>Blockchain Sites: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}
						</MasonryGrid>
					</Section>

					<Section>
						<SectionTitle>Market Capitalization</SectionTitle>
						<ListGrid
							customProps={{
								columnCnt: 3,
								columnGap: columnGap,
								rowGap: rowGap,
							}}
						>
							<ListGridItem>
								<span>Market Capitalization: </span>
								<span>{formattedMarketCap}</span>
							</ListGridItem>

							<ListGridItem>
								<span>Market Capitalization Rank: </span>
								<span>{formattedMarketCapRank}</span>
							</ListGridItem>

							<ListGridItem>
								<span>Fully Diluted Valuation: </span>
								<span>{formattedFullyDilutedValuation}</span>
							</ListGridItem>
						</ListGrid>
					</Section>

					<Section>
						<SectionTitle>Volume and Supply Information</SectionTitle>
						<ListGrid
							customProps={{
								columnCnt: 2,
								columnGap: columnGap,
								rowGap: rowGap,
							}}
						>
							<ListGridItem>
								<span>Total Trading Volume: </span>
								<span>{formattedTotalVolume}</span>
							</ListGridItem>

							<ListGridItem>
								<span>Total Supply: </span>
								<span>{formattedTotalSupply}</span>
							</ListGridItem>

							<ListGridItem>
								<span>Maximum Supply: </span>
								<span>{formattedMaxSupply}</span>
							</ListGridItem>

							<ListGridItem>
								<span>Circulating Supply: </span>
								<span>{formattedCirculatingSupply}</span>
							</ListGridItem>
						</ListGrid>
					</Section>

					<Section>
						<SectionTitle>Price Information</SectionTitle>
						<ListGrid
							customProps={{
								columnCnt: 2,
								columnGap: columnGap,
								rowGap: rowGap,
							}}
						>
							<ListGridItem data-grid-item-span-2 data-grid-item-align-left>
								<span>Current Price: </span>
								<span>{formattedCurrentPriceUsd}</span>
							</ListGridItem>

							<ListGridItem data-grid-item-align-left>
								<span>ATH Price: </span>
								<span>{formattedAth}</span>
							</ListGridItem>

							<ListGridItem data-grid-item-align-right>
								<span>ATH Date: </span>
								<span>{formattedAthDateTime}</span>
							</ListGridItem>

							<ListGridItem data-grid-item-align-left>
								<span>ATL Price: </span>
								<span>{formattedAtl}</span>
							</ListGridItem>

							<ListGridItem data-grid-item-align-right>
								<span>ATL Date: </span>
								<span>{formattedAtlDateTime}</span>
							</ListGridItem>

							<ListGridItem data-grid-item-align-left>
								<span>The Highest Price (24h): </span>
								<span>{formattedHigh24hPrice}</span>
							</ListGridItem>

							<ListGridItem data-grid-item-align-right>
								<span>The Lowest Price (24h): </span>
								<span>{formattedLow24hPrice}</span>
							</ListGridItem>
						</ListGrid>
					</Section>

					<Tabs>
						<Tab customProps={{ isActive: priceMatch !== null }}>
							<Link
								to={{
									pathname: `/${coinId}/price`,
									state: {
										data,
									},
								}}
							>
								Price
							</Link>
						</Tab>
						<Tab customProps={{ isActive: chartMatch !== null }}>
							<Link
								to={{
									pathname: `/${coinId}/chart`,
									state: {
										data,
									},
								}}
							>
								Chart
							</Link>
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
