// Core type utilities
export type Join<K, P> = K extends string | number
	? P extends string | number
		? `${K}${"" extends P ? "" : "."}${P}`
		: never
	: never;

export type Prev = [
	never,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	...0[],
];

export type Paths<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
		? {
				[K in keyof T]-?: K extends string | number
					? `${K}` | Join<K, Paths<T[K], Prev[D]>>
					: never;
			}[keyof T]
		: "";

export type Leaves<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
		? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
		: "";

export type Option = {
	text: string;
	value: any;
};

export interface MobxProps<T = any> {
	path: Paths<T, 4>;
	state: T;
}

export interface FormUnitProps<T> {
	state: T;
	path: Leaves<T, 4>;
}

// Multi-path support for useFormField
export type PathTuple<T> = readonly [Paths<T, 4>, Paths<T, 4>, ...Paths<T, 4>[]];

// PathMapper function type
export type PathMapper<TValue, TPaths extends readonly string[]> =
	(value: TValue, paths: TPaths) => Record<string, any>;

// PathCombiner function type
export type PathCombiner<TValue, TPaths extends readonly string[]> =
	(values: Record<string, any>, paths: TPaths) => TValue;
