import { v4 as uuidv4 } from "uuid";

export const generateUniqueRandomId = (): string => {
	return uuidv4();
};

export const generateUniqueRandomIds = function* (
	cnt: number
): Generator<string, void, undefined> {
	if (cnt < 0) {
		// console.log("Warning: generateUniqueRandomIds - cnt value is invalid");
	}

	for (let i = 0; i < cnt; i++) {
		yield uuidv4();
	}
};
