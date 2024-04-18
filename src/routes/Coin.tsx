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
import {
	default as MasonryGridComponent,
	MasonryGridCustomAttributes,
	MasonryGridItem as MasonryGridItemComponent,
} from "@/components/MasonryGrid";
import { formatNumber } from "@/utils/formatNumber";
import DecoratedInlineItem from "@/components/DecoratedInlineItem";

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
	padding: 20px;
	${({ theme }) =>
		theme.borderStyle01 ? `border: ${theme.borderStyle01};` : ""}

	&:not(:nth-of-type(2)) {
		border-top: none;
	}
`;

const TitleCommonCss = css`
	margin-bottom: 15px;
	font-size: 20px;
	font-weight: bold;
`;

const NestedList = styled.ul`
	margin-left: 5px;
`;

const NestedListItem = styled.li`
	line-height: 1.2;
`;

const OverviewTitle = styled.h2`
	${TitleCommonCss}
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
	& > :not(:nth-child(${({ customProps }) =>
		customProps.columnCnt}n + 1)):not(:nth-child(${({ customProps }) =>
	customProps.columnCnt}n)) {
		text-align: center;
	}
	& > :nth-child(${({ customProps }) => customProps.columnCnt}n) {
		text-align: end;
	}
`;

const ListItemCss = css`
	font-size: 13px;
	font-weight: bold;
	line-height: 1.2;

	& > span:first-child {
		margin-right: 3px;
		font-weight: 400;
		text-transform: uppercase;
	}
`;

const ListItemFlexCss = css`
	display: flex;
	flex-direction: column;
	gap: 3px;

	& > span:first-child {
		margin-right: 0;
	}
`;

const OverviewDetailItem = styled.li`
	${ListItemCss}

	&:has(${NestedList}) {
		${ListItemFlexCss}
	}
`;

const MasonryGridItem = styled(MasonryGridItemComponent)`
	${ListItemCss}
`;

const MasonryGridItemFlex = styled(MasonryGridItemComponent)`
	${ListItemCss}
	${ListItemFlexCss}
`;

const MasonryGrid = styled(MasonryGridComponent)`
	${({ customProps }) => {
		return css`
			[${MasonryGridCustomAttributes.dataMasonryGridColumnNumber}="1"]
				${MasonryGridItemFlex} {
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
				${MasonryGridItemFlex} {
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
				${MasonryGridItemFlex} {
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

const DescriptionContainer = styled(OverviewContainer)`
	background-color: ${({ theme }) =>
		theme.keyColor05 ? theme.keyColor05 : "#fcfaf5"};
`;

const DescriptionTitle = styled.h2`
	${TitleCommonCss}
`;

const Description = styled.p`
	margin: 0 10px;
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

	const formattedMarketCapRank =
		typeof data?.market_cap_rank === "number"
			? formatNumber(data.market_cap_rank)
			: "Unknown";

	const symbol = data?.symbol ?? "Unknown";

	const formattedCurrentPriceUsd =
		typeof data?.market_data.current_price.usd === "number"
			? `$${formatNumber(
					parseFloat(data.market_data.current_price.usd.toFixed(3))
			  )}`
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

	// data?.links.
	// const
	// https://t.me/

	const columnGap = "20px";
	const rowGap = "7px";

	return (
		<Container>
			<Helmet>
				<title>
					{state?.name
						? state.name
						: isLoading
						? "Loading..."
						: data?.name ?? "Error"}
				</title>
				<link rel="icon" type="image/png" href={faviconSrcUrl} sizes="16x16" />
			</Helmet>
			<Header>
				<Title>
					{state?.name
						? state.name
						: isLoading
						? "Loading..."
						: data?.name ?? "Error"}
				</Title>
				{logoSrcUrl && (
					<LogoContainer>
						<Logo src={logoSrcUrl} />
					</LogoContainer>
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
							{formattedLastUpdatedDate && formattedLastUpdatedTime
								? `${formattedLastUpdatedDate} ${formattedLastUpdatedTime}`
								: "Unknown"}
						</LastUpdatedDetail>
					</LastUpdatedContainer>
					<OverviewContainer>
						<OverviewTitle>Overview</OverviewTitle>
						<OverviewDetail
							customProps={{
								columnCnt: 3,
								columnGap: columnGap,
								rowGap: rowGap,
							}}
						>
							<OverviewDetailItem>
								<span>Market Capacity Rank: </span>
								<span>{formattedMarketCapRank}</span>
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Symbol: </span>
								<span>{symbol}</span>
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Price: </span>
								<span>{formattedCurrentPriceUsd}</span>
							</OverviewDetailItem>
						</OverviewDetail>
					</OverviewContainer>

					<OverviewContainer>
						<OverviewTitle>Community</OverviewTitle>
						<OverviewDetail
							customProps={{
								columnCnt: 2,
								columnGap,
								rowGap,
							}}
						>
							<OverviewDetailItem>
								<span>Twitter Followers: </span>
								<span>{formattedTwitterFollowerCnt}</span>
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Telegram Channel User Count: </span>
								<span>{formattedTelegramUserCnt}</span>
							</OverviewDetailItem>
							<OverviewDetailItem>
								<span>Facebook Likes: </span>
								<span>{formattedFacebookLikeCnt}</span>
							</OverviewDetailItem>
						</OverviewDetail>
					</OverviewContainer>

					<OverviewContainer>
						<OverviewTitle>Code</OverviewTitle>
						<MasonryGrid
							customProps={{
								columnCnt: 2,
								columnGap,
								rowGap,
							}}
						>
							{githubRepoLinks ? (
								<MasonryGridItemFlex>
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
								</MasonryGridItemFlex>
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
								<MasonryGridItemFlex>
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
								</MasonryGridItemFlex>
							) : (
								<MasonryGridItem>
									<span>Bitbucket Repositories: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}
						</MasonryGrid>
					</OverviewContainer>

					{descriptionEn && (
						<DescriptionContainer>
							<DescriptionTitle>Description</DescriptionTitle>
							<Description>{descriptionEn}</Description>
						</DescriptionContainer>
					)}

					<OverviewContainer>
						<OverviewTitle>Links</OverviewTitle>
						<MasonryGrid
							customProps={{
								// sequential: true,
								columnCnt: 2,
								columnGap,
								rowGap,
							}}
						>
							{websiteLinks ? (
								<MasonryGridItemFlex>
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
								</MasonryGridItemFlex>
							) : (
								<MasonryGridItem>
									<span>Websites: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}
							{officialForumLinks ? (
								<MasonryGridItemFlex>
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
								</MasonryGridItemFlex>
							) : (
								<MasonryGridItem>
									<span>Official Forums: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}
							{bitcoinForumLink ? (
								<MasonryGridItemFlex>
									<span>Bitcoin Forum </span>
									<NestedList>
										<NestedListItem>
											<DecoratedInlineItem>
												<a href={bitcoinForumLink}>{bitcoinForumLink}</a>
											</DecoratedInlineItem>
										</NestedListItem>
									</NestedList>
								</MasonryGridItemFlex>
							) : (
								<MasonryGridItem>
									<span>Bitcoin Forum: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}
							{facebookLink ? (
								<MasonryGridItemFlex>
									<span>Facebook </span>
									<NestedList>
										<NestedListItem>
											<DecoratedInlineItem>
												<a href={facebookLink}>{facebookLink}</a>
											</DecoratedInlineItem>
										</NestedListItem>
									</NestedList>
								</MasonryGridItemFlex>
							) : (
								<MasonryGridItem>
									<span>Facebook: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}
							{twitterLink ? (
								<MasonryGridItemFlex>
									<span>Twitter </span>
									<NestedList>
										<NestedListItem>
											<DecoratedInlineItem>
												<a href={twitterLink}>{twitterLink}</a>
											</DecoratedInlineItem>
										</NestedListItem>
									</NestedList>
								</MasonryGridItemFlex>
							) : (
								<MasonryGridItem>
									<span>Twitter: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}
							{redditUrl ? (
								<MasonryGridItemFlex>
									<span>Reddit </span>
									<NestedList>
										<NestedListItem>
											<DecoratedInlineItem>
												<a href={redditUrl}>{redditUrl}</a>
											</DecoratedInlineItem>
										</NestedListItem>
									</NestedList>
								</MasonryGridItemFlex>
							) : (
								<MasonryGridItem>
									<span>Reddit: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}
							{telegramLink ? (
								<MasonryGridItemFlex>
									<span>Telegram </span>
									<NestedList>
										<NestedListItem>
											<DecoratedInlineItem>
												<a href={telegramLink}>{telegramLink}</a>
											</DecoratedInlineItem>
										</NestedListItem>
									</NestedList>
								</MasonryGridItemFlex>
							) : (
								<MasonryGridItem>
									<span>Telegram: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}
							{/* Facebook */}
							{/* twitter */}
							{/* reddit */}
							{/* telegram */}
							{/* Chat */}
							{/* whitepaper */}

							{blockchainSites ? (
								<MasonryGridItemFlex>
									<span>Blockchain Sites </span>
									<NestedList>
										{blockchainSites.map((link, idx) => (
											<NestedListItem key={blockchainSiteKeys[idx]}>
												<DecoratedInlineItem>
													<a href={link}>{link}</a>
												</DecoratedInlineItem>
												{/* <DecoratedInlineItem as="a" href={link}>
													{link}
												</DecoratedInlineItem> */}
											</NestedListItem>
										))}
									</NestedList>
								</MasonryGridItemFlex>
							) : (
								<MasonryGridItem>
									<span>Blockchain Sites: </span>
									<span>Unknown</span>
								</MasonryGridItem>
							)}
							{/* <MasonryGridItem></MasonryGridItem> */}
						</MasonryGrid>
					</OverviewContainer>

					<OverviewContainer>
						<OverviewDetail
							customProps={{
								columnCnt: 2,
								columnGap: columnGap,
								rowGap: rowGap,
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
