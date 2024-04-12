const BASE_URL = "https://api.coinpaprika.com/v1";

// export async function fetchCoins() {
// 	const response = await fetch("https://api.coinpaprika.com/v1/coins");
// 	const json = await response.json();
// 	return json;
// }

export function fetchCoins() {
	return fetch(`${BASE_URL}/coins`).then((response) => response.json());
}

export function fetchCoinInfo(coinId: string) {
	return fetch(`${BASE_URL}/coins/${coinId}`).then((response) =>
		response.json()
	);
}

export function fetchCoinTickers(coinId: string) {
	return fetch(`${BASE_URL}/tickers/${coinId}`).then((response) =>
		response.json()
	);
}

// export function fetchCoinHistory(coinId: string) {
// 	// https://api.coinpaprika.com/#tag/Coins/paths/~1coins~1%7Bcoin_id%7D~1ohlcv~1historical/get
// 	// 우리가 언제를 기준으로 데이터를 받고 싶은지를 말하는 query parameter가 필요하다.
// 	// ?start=2019-01-01&end=2019-01-20
// 	// - Supported formats
// 	//   ㄴ RFC3999 (ISO-8601) eg. 2018-02-15T05:15:00Z
// 	//   ㄴ Simple date (yyyy-mm-dd) eg. 2018-02-15
// 	//   ㄴ Unix timestamp (in seconds) eg. 1518671700
// 	//
// 	// 이제는 무료 limit는 1일 "미만"이고 그 이상은 유료화되서 하루 전 날짜 ~ 현재 동향 데이터만 가져오기로 함.

// 	const endDate = Math.floor(Date.now() / 1000);
// 	// const startDate = endDate - 60 * 60 * 24 * 7; // 1주일 전
// 	const startDate = endDate - 60 * 60 * 24 + 60; // 하루 전 + 1분

// 	return fetch(
// 		`${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
// 	).then((response) => response.json());
// }

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
