/**
 * Prisma 모델과 backend DTO 인스턴스가 공유하는 내부 값 계약입니다.
 *
 * 숫자 ID는 backend 내부에서 `bigint`를 유지하고, REST JSON 직렬화는
 * `BigIntIdField`가 담당합니다. 모델별 integration ULID는 두 번째 제네릭으로
 * 명시하여 일반 REST DTO 계약에서 제외합니다.
 */
export type DomainEntityModel<T, ExcludedKeys extends keyof T = never> = Omit<
	T,
	ExcludedKeys
>;

/**
 * Prisma projection 값을 도메인 내부/Repository 계층에서 그대로 전달합니다.
 * (BigInt와 현재 필드 이름을 그대로 유지하며 별도 키 변환 없음)
 */
export type DomainData<T> = T extends Date
	? T
	: T extends (infer U)[]
		? DomainData<U>[]
		: T extends ReadonlyArray<infer U>
			? ReadonlyArray<DomainData<U>>
			: T extends object
				? { [K in keyof T]: DomainData<T[K]> }
				: T;
