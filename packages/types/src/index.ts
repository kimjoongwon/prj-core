// ============================================
// Entity 관련 타입
// ============================================

/**
 * 인스턴스화 가능한 클래스를 나타내는 제네릭 생성자 타입
 * @template T - 생성자가 생성하는 인스턴스의 타입
 * @template Arguments - 생성자 인자 타입 배열 (기본값: any[])
 */
export type Constructor<T = any, Arguments extends unknown[] = any[]> = new (
	...arguments_: Arguments
) => T;

/**
 * 모든 엔티티가 가지는 공통 필드 인터페이스
 */
export interface BaseEntityFields {
	id: string;
	seq: number;
	createdAt: Date;
	updatedAt: Date | null;
	removedAt: Date | null;
}

// ============================================
// Core type utilities
// ============================================
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
export type PathTuple<T> = readonly [
	Paths<T, 4>,
	Paths<T, 4>,
	...Paths<T, 4>[],
];

// ValueSplitter function type - splits a single value into multiple path values
// UI Component Value → Multiple State Path Values
export type ValueSplitter<TValue, TPaths extends readonly string[]> = (
	value: TValue,
	paths: TPaths,
) => Record<string, any>;

// ValueAggregator function type - aggregates multiple path values into a single value
// Multiple State Path Values → UI Component Value
export type ValueAggregator<TValue, TPaths extends readonly string[]> = (
	values: Record<string, any>,
	paths: TPaths,
) => TValue;
