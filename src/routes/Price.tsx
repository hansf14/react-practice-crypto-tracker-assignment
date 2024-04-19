import { fetchCoinInfo, fetchCoinInfoDev } from "@/apis";
import ListGrid, { ListGridItem } from "@/components/ListGrid";
import Section, { SectionTitle } from "@/components/Section";
import { dateStringToEpochTime, formatDate } from "@/utils/formatDate";
import { formatNumber } from "@/utils/formatNumber";
import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import { RouteParamsCoin, RouteStateCoin } from "@/apis";
import { GlobalVar } from "@/settings/globalVar";

function Price() {
	const { coinId } = useParams<RouteParamsCoin>();
	const { state } = useLocation<RouteStateCoin>();
	console.log(state);
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

	const columnGap = GlobalVar.defaultColumnGap;
	const rowGap = GlobalVar.defaultRowGap;

	return (
		<Section>
			<SectionTitle>Price Information</SectionTitle>
			<ListGrid
				customProps={{
					columnCnt: 2,
					columnGap,
					rowGap,
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
	);
}

export default Price;
