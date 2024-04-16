export function formatDate(epochTime: number) {
	// const date = new Date(parseInt(price.time_close) * 1000)
	// 	.toISOString()
	// 	.split("T")[0];
	//
	// return date;
	// 2024-04-13

	// console.log(epochTime);

	// Convert epochTime time to local time
	const date = new Date(epochTime);

	// Extract components of the date in local time
	const year = date.getFullYear();
	const month = date.getMonth() + 1; // Month is zero-based, so add 1
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	// const formattedDate = `${year}-${months[month - 1]}-${
	// 	day < 10 ? "0" + day : day
	// }`;
	const formattedDate = `${year}-${months[month - 1]}-${
		day < 10 ? "0" + day : day
	}`;
	const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
		.toString()
		.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

	// console.log(formattedDate);
	// console.log(formattedTime);

	return { formattedDate, formattedTime };
}

export function dateStringToEpochTime(dateString: string) {
	return Date.parse(dateString);
}
