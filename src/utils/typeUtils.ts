// export const RemoveArrReadonly = <T extends any>(
// 	arr: T[] | readonly T[]
// ): T[] => arr as T[];

export type RemoveReadonlyShallow<Immutable> = {
	-readonly [key in keyof Immutable]: Immutable[key];
};

export type RemoveReadonlyDeep<Immutable> = {
	-readonly [key in keyof Immutable]: RemoveReadonlyDeep<Immutable[key]>;
};
