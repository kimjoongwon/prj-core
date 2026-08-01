type RelationSequenceKey<Relation extends string> = `${Relation}Seq`;

/**
 * Prisma unchecked create input의 내부 관계 순번을 공개 ULID 필드로 치환합니다.
 */
export type PublicIdCreateInput<
	Input,
	RequiredRelation extends string = never,
	OptionalRelation extends string = never,
> = Omit<
	Input,
	"seq" | RelationSequenceKey<RequiredRelation | OptionalRelation>
> & {
	[Relation in RequiredRelation as `${Relation}Id`]: string;
} & {
	[Relation in OptionalRelation as `${Relation}Id`]?: string | null;
};

/**
 * Prisma unchecked update input의 내부 관계 순번을 선택적 공개 ULID 필드로 치환합니다.
 */
export type PublicIdUpdateInput<
	Input,
	RequiredRelation extends string = never,
	OptionalRelation extends string = never,
> = Omit<
	Input,
	"seq" | RelationSequenceKey<RequiredRelation | OptionalRelation>
> & {
	[Relation in RequiredRelation as `${Relation}Id`]?: string;
} & {
	[Relation in OptionalRelation as `${Relation}Id`]?: string | null;
};
