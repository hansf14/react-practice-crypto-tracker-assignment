import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import { fetchInfo, RouteParamsPrice, RouteStatePrice } from "@/apis";
import ListGrid, { ListGridItem } from "@/components/ListGrid";
import Section, { SectionTitle } from "@/components/Section";
import { dateStringToEpochTime, formatDate } from "@/utils/formatDate";
import { formatNumber } from "@/utils/formatNumber";
import { GlobalVar } from "@/settings/globalVar";
import Loader from "@/components/Loader";
import ErrorDescription from "@/components/ErrorDescription";

function Price() {
	const { coinId } = useParams<RouteParamsPrice>();
	const { state } = useLocation<RouteStatePrice>();

	const { isLoading, data, isError, error } = useQuery(
		["fetch-coin-info", coinId],
		() => fetchInfo({ apiName: "fetch-coin-info", apiParams: { coinId } }),
		{
			initialData: state ?? undefined,
		}
	);
	// console.log(data);

	////////////////////////////////////////////////////////
	// Price Information

	const formattedCurrentPriceUsd =
		typeof data?.market_data.current_price.usd === "number"
			? `$${formatNumber(
					parseFloat(data.market_data.current_price.usd.toFixed(2))
			  )}`
			: "Unknown";

	const formattedAth =
		typeof data?.market_data.ath.usd === "number"
			? `$${formatNumber(parseFloat(data.market_data.ath.usd.toFixed(2)))}`
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
			? `$${formatNumber(parseFloat(data.market_data.atl.usd.toFixed(2)))}`
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
			? `$${formatNumber(parseFloat(data.market_data.high_24h.usd.toFixed(2)))}`
			: "Unknown";

	const formattedLow24hPrice =
		typeof data?.market_data.low_24h.usd === "number"
			? `$${formatNumber(parseFloat(data.market_data.low_24h.usd.toFixed(2)))}`
			: "Unknown";

	////////////////////////////////////////////////////////
	// Price Change Information

	const formattedPriceChange24h =
		typeof data?.market_data.price_change_24h === "number"
			? `$${formatNumber(
					parseFloat(data.market_data.price_change_24h.toFixed(2))
			  )}`
			: "Unknown";

	const formattedAthChangePercentage =
		typeof data?.market_data.ath_change_percentage.usd === "number"
			? `${formatNumber(
					parseFloat(data.market_data.ath_change_percentage.usd.toFixed(2))
			  )}%`
			: "Unknown";

	const formattedAtlChangePercentage =
		typeof data?.market_data.atl_change_percentage.usd === "number"
			? `${formatNumber(
					parseFloat(data.market_data.atl_change_percentage.usd.toFixed(2))
			  )}%`
			: "Unknown";

	const formattedPriceChange1hPercentage =
		typeof data?.market_data.price_change_percentage_1h_in_currency.usd ===
		"number"
			? `${formatNumber(
					parseFloat(
						data.market_data.price_change_percentage_1h_in_currency.usd.toFixed(
							2
						)
					)
			  )}%`
			: "Unknown";

	const formattedPriceChange24hPercentage =
		typeof data?.market_data.price_change_percentage_24h_in_currency.usd ===
		"number"
			? `${formatNumber(
					parseFloat(
						data.market_data.price_change_percentage_24h_in_currency.usd.toFixed(
							2
						)
					)
			  )}%`
			: "Unknown";

	const formattedPriceChange7dPercentage =
		typeof data?.market_data.price_change_percentage_7d_in_currency.usd ===
		"number"
			? `${formatNumber(
					parseFloat(
						data.market_data.price_change_percentage_7d_in_currency.usd.toFixed(
							2
						)
					)
			  )}%`
			: "Unknown";

	const formattedPriceChange14dPercentage =
		typeof data?.market_data.price_change_percentage_14d_in_currency.usd ===
		"number"
			? `${formatNumber(
					parseFloat(
						data.market_data.price_change_percentage_14d_in_currency.usd.toFixed(
							2
						)
					)
			  )}%`
			: "Unknown";

	const formattedPriceChange30dPercentage =
		typeof data?.market_data.price_change_percentage_30d_in_currency.usd ===
		"number"
			? `${formatNumber(
					parseFloat(
						data.market_data.price_change_percentage_30d_in_currency.usd.toFixed(
							2
						)
					)
			  )}%`
			: "Unknown";

	const formattedPriceChange60dPercentage =
		typeof data?.market_data.price_change_percentage_60d_in_currency.usd ===
		"number"
			? `${formatNumber(
					parseFloat(
						data.market_data.price_change_percentage_60d_in_currency.usd.toFixed(
							2
						)
					)
			  )}%`
			: "Unknown";

	const formattedPriceChange200dPercentage =
		typeof data?.market_data.price_change_percentage_200d_in_currency.usd ===
		"number"
			? `${formatNumber(
					parseFloat(
						data.market_data.price_change_percentage_200d_in_currency.usd.toFixed(
							2
						)
					)
			  )}%`
			: "Unknown";

	const formattedPriceChange1yPercentage =
		typeof data?.market_data.price_change_percentage_1y_in_currency.usd ===
		"number"
			? `${formatNumber(
					parseFloat(
						data.market_data.price_change_percentage_1y_in_currency.usd.toFixed(
							2
						)
					)
			  )}%`
			: "Unknown";

	const formattedMarketCapChange =
		typeof data?.market_data.market_cap_change_24h === "number"
			? `$${formatNumber(
					parseFloat(data.market_data.market_cap_change_24h.toFixed(2))
			  )}`
			: "Unknown";

	const formattedMarketCapChangePercentage =
		typeof data?.market_data.market_cap_change_percentage_24h === "number"
			? `${formatNumber(
					parseFloat(
						data.market_data.market_cap_change_percentage_24h.toFixed(2)
					)
			  )}%`
			: "Unknown";

	const columnGap = GlobalVar.defaultColumnGap;
	const rowGap = GlobalVar.defaultRowGap;

	return (
		<>
			<Section>
				<SectionTitle>Price Information</SectionTitle>
				{isLoading ? (
					<Loader>Loading...</Loader>
				) : isError ? (
					<ErrorDescription customProps={{ error }} />
				) : (
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
				)}
			</Section>

			<Section>
				<SectionTitle>Price Change Information</SectionTitle>
				{isLoading ? (
					<Loader>Loading...</Loader>
				) : isError ? (
					<ErrorDescription customProps={{ error }} />
				) : (
					<ListGrid
						customProps={{
							columnCnt: 2,
							columnGap,
							rowGap,
						}}
					>
						<ListGridItem data-grid-item-span-2 data-grid-item-align-left>
							<span>Price Change (24h): </span>
							<span>{formattedPriceChange24h}</span>
						</ListGridItem>

						<ListGridItem data-grid-item-align-left>
							<span>ATH ~ Current Change: </span>
							<span>{formattedAthChangePercentage}</span>
						</ListGridItem>

						<ListGridItem data-grid-item-align-right>
							<span>ATL ~ Current Change: </span>
							<span>{formattedAtlChangePercentage}</span>
						</ListGridItem>

						<ListGridItem data-grid-item-align-left>
							<span>Price Change (1h): </span>
							<span>{formattedPriceChange1hPercentage}</span>
						</ListGridItem>

						<ListGridItem data-grid-item-align-right>
							<span>Price Change (24h): </span>
							<span>{formattedPriceChange24hPercentage}</span>
						</ListGridItem>

						<ListGridItem data-grid-item-align-left>
							<span>Price Change (7d): </span>
							<span>{formattedPriceChange7dPercentage}</span>
						</ListGridItem>

						<ListGridItem data-grid-item-align-right>
							<span>Price Change (14d): </span>
							<span>{formattedPriceChange14dPercentage}</span>
						</ListGridItem>

						<ListGridItem data-grid-item-align-left>
							<span>Price Change (30d): </span>
							<span>{formattedPriceChange30dPercentage}</span>
						</ListGridItem>

						<ListGridItem data-grid-item-align-right>
							<span>Price Change (60d): </span>
							<span>{formattedPriceChange60dPercentage}</span>
						</ListGridItem>

						<ListGridItem data-grid-item-align-left>
							<span>Price Change (200d): </span>
							<span>{formattedPriceChange200dPercentage}</span>
						</ListGridItem>

						<ListGridItem data-grid-item-align-right>
							<span>Price Change (1y): </span>
							<span>{formattedPriceChange1yPercentage}</span>
						</ListGridItem>

						<ListGridItem data-grid-item-align-left>
							<span>Market Capitalization Change (24h): </span>
							<span>{formattedMarketCapChange}</span>
						</ListGridItem>

						<ListGridItem data-grid-item-align-right>
							<span>Market Capitalization Change (24h): </span>
							<span>{formattedMarketCapChangePercentage}</span>
						</ListGridItem>
					</ListGrid>
				)}
			</Section>
		</>
	);
}

export default Price;
