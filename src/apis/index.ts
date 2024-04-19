import { ConstraintParamsExamineFnType } from "@/components/RouteOrRedirect/types.";

export const BASE_URL = "https://api.coingecko.com/api/v3/coins" as const;
export const LOCAL_BASE_URL = process.env.PUBLIC_URL;

export const POPULAR_COIN_SYMBOLS = [
	"BTC", // Bitcoin
	"ETH", // Ethereum
	"BNB", // Binance Coin
	"ADA", // Cardano
	"SOL", // Solana
	"DOT", // Polkadot
	"DOGE", // Dogecoin
	"USDT", // Tether
	"XRP", // XRP
	"LUNA", // Terra
	"AVAX", // Avalanche
	"UNI", // Uniswap
	"LTC", // Litecoin
	"LINK", // Chainlink
	"MATIC", // Polygon
	"FIL", // Filecoin
	"BCH", // Bitcoin Cash
	"TRX", // TRON
	"ETC", // Ethereum Classic
	"ALGO", // Algorand
	"ATOM", // Cosmos
	"XTZ", // Tezos
	"FTT", // FTX Token
	"EOS", // EOS
	"AAVE", // Aave
	"VET", // VeChain
	"NEO", // Neo
	"THETA", // Theta
	"MKR", // Maker
	"XLM", // Stellar
] as const;

export const POPULAR_COIN_IDS = [
	"bitcoin", // Bitcoin
	"ethereum", // Ethereum
	"binancecoin", // Binance Coin
	"cardano", // Cardano
	"solana", // Solana
	"polkadot", // Polkadot
	"dogecoin", // Dogecoin
	"tether", // Tether
	"ripple", // XRP
	"terra-luna", // Terra
	"avalanche-2", // Avalanche
	"uniswap", // Uniswap
	"litecoin", // Litecoin
	"chainlink", // Chainlink
	"polygon-matic", // Polygon
	"filecoin", // Filecoin
	"bitcoin-cash", // Bitcoin Cash
	"tron", // TRON
	"ethereum-classic", // Ethereum Classic
	"algorand", // Algorand
	"cosmos", // Cosmos
	"tezos", // Tezos
	"ftx-token", // FTX Token
	"eos", // EOS
	"aave", // Aave
	"vechain", // VeChain
	"neo", // Neo
	"theta-token", // Theta
	"maker", // Maker
] as const;
export interface ICoinMinimalInfo {
	id: string;
	name: string;
	symbol: string;
}

export interface ICoinInfo {
	id: string;
	symbol: string;
	name: string;
	web_slug: string;
	asset_platform_id: string;
	//// platforms: object;
	//// detail_platforms: object;
	// block_time_in_minutes: number;
	//// hashing_algorithm: object;
	categories: string[];
	preview_listing: boolean;
	//// public_notice: object;
	//// additional_notices: object;
	description: {
		en: string;
	};
	links: {
		announcement_url: string[];
		bitcointalk_thread_identifier: number | null;
		blockchain_site: string[];
		chat_url: string[];
		facebook_username: string | null;
		homepage: string[];
		official_forum_url: string[];
		repos_url: {
			github: string[];
			bitbucket: string[];
		};
		subreddit_url: string | null;
		telegram_channel_identifier: string | null;
		twitter_screen_name: string | null;
		whitepaper: string | null;
	};
	image: {
		large: string;
		small: string;
		thumb: string;
	};
	//// country_origin: string;
	//// genesis_date: object;
	contract_address: string;
	sentiment_votes_up_percentage: number;
	sentiment_votes_down_percentage: number;
	watchlist_portfolio_users: number;
	market_cap_rank: number;
	market_data: IMarketData;
	community_data: {
		facebook_likes: number | null;
		// reddit_accounts_active_48h: number;
		// reddit_average_comments_48h: number;
		// reddit_average_posts_48h: number;
		reddit_subscribers: number | null;
		telegram_channel_user_count: number | null;
		twitter_followers: number | null;
	};
	developer_data: {
		closed_issues: number;
		code_additions_deletions_4_weeks: {
			additions: number;
			deletions: number;
		};
		commit_count_4_weeks: number;
		forks: number;
		last_4_weeks_commit_activity_series: number[];
		pull_request_contributors: number;
		pull_requests_merged: number;
		stars: number;
		// subscribers: number;
		total_issues: number;
	};
	//// status_updates: object;
	last_updated: string;
	tickers: {
		base: string;
		bid_ask_spread_percentage: number;
		coin_id: string;
		converted_last: {
			btc: number;
			eth: number;
			usd: number;
		};
		converted_volume: {
			btc: number;
			eth: number;
			usd: number;
		};
		is_anomaly: boolean;
		is_stale: boolean;
		last: number;
		last_fetch_at: string;
		last_traded_at: string;
		market: {
			name: string;
			identifier: string;
			has_trading_incentive: boolean;
		};
		target: string;
		target_coin_id: string;
		timestamp: string;
		token_info_url: string | null;
		trade_url: string;
		trust_score: string;
		volume: number;
	}[];
}

export interface IMarketData {
	current_price: ICurrency;
	total_value_locked: ICurrencyMinimal;
	mcap_to_tvl_ratio: number;
	fdv_to_tvl_ratio: number;
	roi: {
		currency: string;
		percentage: number;
		times: number;
	};
	ath: ICurrency;
	ath_change_percentage: ICurrencyChangePercentage;
	ath_date: ICurrencyDate;
	atl: ICurrency;
	atl_change_percentage: ICurrencyChangePercentage;
	atl_date: ICurrencyDate;
	market_cap: ICurrency;
	market_cap_rank: number;
	fully_diluted_valuation: ICurrency;
	market_cap_fdv_ratio: number;
	total_volume: ICurrency;
	high_24h: ICurrency;
	low_24h: ICurrency;
	price_change_24h: number;
	price_change_percentage_24h: number;
	price_change_percentage_7d: number;
	price_change_percentage_14d: number;
	price_change_percentage_30d: number;
	price_change_percentage_60d: number;
	price_change_percentage_200d: number;
	price_change_percentage_1y: number;
	market_cap_change_24h: number;
	market_cap_change_percentage_24h: number;
	price_change_24h_in_currency: ICurrency;
	price_change_percentage_1h_in_currency: ICurrencyChangePercentage;
	price_change_percentage_24h_in_currency: ICurrencyChangePercentage;
	price_change_percentage_7d_in_currency: ICurrencyChangePercentage;
	price_change_percentage_14d_in_currency: ICurrencyChangePercentage;
	price_change_percentage_30d_in_currency: ICurrencyChangePercentage;
	price_change_percentage_60d_in_currency: ICurrencyChangePercentage;
	price_change_percentage_200d_in_currency: ICurrencyChangePercentage;
	price_change_percentage_1y_in_currency: ICurrencyChangePercentage;
	market_cap_change_24h_in_currency: ICurrency;
	market_cap_change_percentage_24h_in_currency: ICurrencyChangePercentage;
	total_supply: number;
	max_supply: number;
	circulating_supply: number;
	last_updated: string;
}

export interface ICurrencyMinimal {
	btc: number;
	usd: number;
}

export interface ICurrency {
	aed: number;
	ars: number;
	aud: number;
	bch: number;
	bdt: number;
	bhd: number;
	bmd: number;
	bnb: number;
	brl: number;
	btc: number;
	cad: number;
	chf: number;
	clp: number;
	cny: number;
	czk: number;
	dkk: number;
	dot: number;
	eos: number;
	eth: number;
	eur: number;
	gbp: number;
	gel: number;
	hkd: number;
	huf: number;
	idr: number;
	ils: number;
	inr: number;
	jpy: number;
	krw: number;
	kwd: number;
	lkr: number;
	ltc: number;
	mmk: number;
	mxn: number;
	myr: number;
	ngn: number;
	nok: number;
	nzd: number;
	php: number;
	pkr: number;
	pln: number;
	rub: number;
	sar: number;
	sek: number;
	sgd: number;
	thb: number;
	try: number;
	twd: number;
	uah: number;
	usd: number;
	vef: number;
	vnd: number;
	xag: number;
	xau: number;
	xdr: number;
	xlm: number;
	xrp: number;
	yfi: number;
	zar: number;
	bits: number;
	link: number;
	sats: number;
}

export interface ICurrencyChangePercentage extends ICurrency {}

export type ICurrencyDate = {
	[K in keyof ICurrency]: string;
};

////////////////////////////////////////////////////////////

// export type RouteParamsType<
// 	P extends { [K in keyof P]?: string | undefined } = {}
// > = match<P>["params"];

// export type RouteParamsType<P> = P extends match<infer Params> ? Params : never;

// export type RouteParamsType = {
// 	[K in string]: string;
// };

export type RouteParamsType = {
	[K: string]: string;
};

// export interface RouteParamsType {
// 	[K: string]: string;
// }

// export type RouteParamsType = Record<string, string>;

////////////////////////////////////////////////////////////

// export interface RouteParamsCoin {
// 	coinId: string;
// }

export type RouteParamsCoin = {
	coinId: string;
};

export interface RouteStateCoin {
	coinName: string;
}

////////////////////////////////////////////////////////////

export interface RouteParamsPrice extends RouteParamsCoin {}

export interface RouteStatePrice extends ICoinInfo {}

////////////////////////////////////////////////////////////

export interface RouteParamsChart extends RouteParamsCoin {}

export interface RouteParamsChart extends ICoinInfo {}

export const ConstraintParamsCoin = {
	coinId: POPULAR_COIN_IDS,
} as const;

export const constraintParamsExamineFnCoin: ConstraintParamsExamineFnType<
	RouteParamsCoin
> = ({ constraintParams, params }) => {
	return constraintParams.coinId.includes(params.coinId);
};

export async function fetchCoinsInfo() {
	const options = {
		method: "GET",
		headers: { accept: "application/json" },
	};
	try {
		const response = await fetch(`${BASE_URL}/list`, options);
		if (!response.ok && response.status !== 304) {
			throw new Error(response.status.toString());
		}
		const json: ICoinMinimalInfo[] = await response.json();
		return json;
	} catch (error) {
		console.group("[fetchCoinsInfo]");
		if (error instanceof Error) {
			console.log(`Error ${error.message}`);
		} else {
			console.log(`Error: ${error as string}`);
		}
		console.log("Using a fallback method due to a fetch error...");
		console.groupEnd();

		return await fetchCoinsInfoDev(); // fallback
	}
}

export async function fetchCoinsInfoDev() {
	const options = {
		method: "GET",
		headers: { accept: "application/json" },
	};
	try {
		const response = await fetch(
			`${LOCAL_BASE_URL}/api/coins-list.json`,
			options
		);
		if (!response.ok && response.status !== 304) {
			throw new Error(response.status.toString());
		}
		const json: ICoinMinimalInfo[] = await response.json();
		return json;
	} catch (error) {
		console.group("[fetchCoinsInfoDev]");
		if (error instanceof Error) {
			console.log(`Error ${error.message}`);
			console.groupEnd();
			throw error;
		} else {
			console.log(`Error: ${error as string}`);
			console.groupEnd();
			throw new Error(error as string);
		}
	}
}

export async function fetchCoinInfo({ coinId }: { coinId: string }) {
	const options = {
		method: "GET",
		headers: { accept: "application/json" },
	};
	try {
		const response = await fetch(`${BASE_URL}/${coinId}`, options);
		if (!response.ok && response.status !== 304) {
			throw new Error(response.status.toString());
		}
		const json: ICoinInfo = await response.json();
		return json;
	} catch (error) {
		console.group("[fetchCoinInfo]");
		if (error instanceof Error) {
			console.log(`Error ${error.message}`);
		} else {
			console.log(`Error: ${error as string}`);
		}
		console.log("Using a fallback method due to a fetch error...");
		console.groupEnd();

		return await fetchCoinInfoDev({ coinId }); // fallback
	}
}

export async function fetchCoinInfoDev({ coinId }: { coinId: string }) {
	const options = {
		method: "GET",
		headers: { accept: "application/json" },
	};
	try {
		const response = await fetch(
			`${LOCAL_BASE_URL}/api/coin/${coinId}.json`,
			options
		);
		if (!response.ok && response.status !== 304) {
			throw new Error(response.status.toString());
		}
		const json: ICoinInfo = await response.json();
		return json;
	} catch (error) {
		console.group("[fetchCoinInfoDev]");
		if (error instanceof Error) {
			console.log(`Error ${error.message}`);
			console.groupEnd();
			throw error;
		} else {
			console.log(`Error: ${error as string}`);
			console.groupEnd();
			throw new Error(error as string);
		}
	}
}
