export function formatNumber(num: number | string) {
	return (typeof num === "number" ? num : parseFloat(num)).toLocaleString(
		"en",
		{ useGrouping: true }
	);
}
