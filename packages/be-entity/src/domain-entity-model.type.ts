/**
 * Prisma 모델에서 데이터베이스 내부 조인용 순번 필드를 제외한 도메인 계약입니다.
 *
 * 공개 식별자는 ULID `id`를 유지하고, `seq`와 관계용 `*Seq`는 Repository 경계 안에서만
 * 사용하도록 제한합니다.
 */
export type DomainEntityModel<T> = Omit<
	T,
	Extract<keyof T, "seq" | `${string}Seq`>
>;

type PublicRelationIds<T> = {
	[Key in keyof T as Key extends `${infer Relation}Seq`
		? Relation extends keyof T
			? `${Relation}Id`
			: never
		: never]: Key extends `${infer Relation}Seq`
		? Relation extends keyof T
			? null extends T[Relation]
				? string | null
				: string
			: never
		: never;
};

/**
 * Prisma projection의 모든 중첩 단계에서 내부 순번 필드를 제거한 공개 데이터 타입입니다.
 */
export type DomainData<T> = T extends Date
	? T
	: T extends readonly (infer Item)[]
		? DomainData<Item>[]
		: T extends object
			? {
					[Key in keyof T as Key extends "seq" | `${string}Seq`
						? never
						: Key]: DomainData<T[Key]>;
				} & PublicRelationIds<T>
			: T;
