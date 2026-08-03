/**
 * Prisma 입력에서 자동 생성되는 내부 bigint PK와 공개 ULID identity를 제거합니다.
 */
export type AutoIdentityCreateInput<
	Input,
	IdentityField extends keyof Input & string,
> = Omit<Input, "id" | IdentityField>;

/**
 * Prisma 수정 입력에서 변경하면 안 되는 내부 bigint PK와 공개 ULID identity를 제거합니다.
 */
export type AutoIdentityUpdateInput<
	Input,
	IdentityField extends keyof Input & string,
> = Omit<Input, "id" | IdentityField>;
