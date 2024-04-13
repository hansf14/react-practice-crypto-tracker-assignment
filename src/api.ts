export const BASE_URL = "https://api.coingecko.com/api/v3/coins";
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
];
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
];

// export async function fetchCoins() {
// 	const response = await fetch("https://api.coinpaprika.com/v1/coins");
// 	const json = await response.json();
// 	return json;
// }

// export function fetchCoinsInfo() {
// 	return fetch(
// 		`${BASE_URL}/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1`,
// 		{
// 			mode: "no-cors",
// 		}
// 	).then((response) => response.json());
// }

export function fetchCoinsInfo() {
	const options = {
		method: "GET",
		headers: { accept: "application/json" },
	};
	return fetch(`${BASE_URL}/list`, options)
		.then((response) => response.json())
		.catch((err) => {
			console.error(err);
			return fetchCoinsInfoDev(); // fallback
		});
}

export function fetchCoinsInfoDev() {
	const options = {
		method: "GET",
		headers: { accept: "application/json" },
	};
	return fetch("./coins-list.json", options)
		.then((response) => response.json())
		.catch((err) => console.error(err));
}

export function fetchCoinInfo(coinId: string) {
	return fetch(`${BASE_URL}/${coinId}?localization=false`).then((response) =>
		response.json()
	);
}

export function fetchCoinTickers(coinId: string) {
	return fetch(`${BASE_URL}/tickers/${coinId}`).then((response) =>
		response.json()
	);
}

export function fetchCoinHistory(coinId: string) {
	// Coinpaprika API 는 더이상 무료가 아닙니다. ㅠㅠ
	// 그래서 니꼬가 자체 API 를 만들었어요.
	// 자체 URL:
	// https://ohlcv-api.nomadcoders.workers.dev
	// 사용을 위해서는. 파라미터로 coinId 를 추가하세요.
	// https://ohlcv-api.nomadcoders.workers.dev?coinId=btc-bitcoin

	return fetch(
		`https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`
	).then((response) => response.json());
}
