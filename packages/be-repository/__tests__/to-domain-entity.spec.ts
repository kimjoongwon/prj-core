import { toDomainEntity } from "../src/to-domain-entity";

class ExampleEntity {
	id!: bigint;
	name?: string;
	spaceId!: bigint | null;
	space!: { id: bigint; name: string };
	children?: Array<{ id: bigint; name: string }>;
}

describe("toDomainEntity", () => {
	it("관계를 포함한 Prisma 결과를 그대로 도메인 객체로 변환한다", () => {
		// Given
		const persistenceRow = {
			id: 10n,
			name: "본사 공지",
			spaceId: 20n,
			space: {
				id: 20n,
				name: "본사",
			},
		};

		// When
		const result = toDomainEntity(ExampleEntity, persistenceRow);

		// Then
		expect(result).toEqual({
			id: 10n,
			name: "본사 공지",
			spaceId: 20n,
			space: {
				id: 20n,
				name: "본사",
			},
		});
	});

	it("배열과 중첩 객체도 원본 값을 유지한다", () => {
		// Given
		const persistenceRows = [
			{
				id: 10n,
				children: [{ id: 30n, name: "child" }],
			},
		];

		// When
		const result = toDomainEntity(ExampleEntity, persistenceRows);

		// Then
		expect(result).toEqual([
			{
				id: 10n,
				children: [{ id: 30n, name: "child" }],
			},
		]);
	});

	it("nullable 관계와 관계 ID를 그대로 유지한다", () => {
		// Given
		const persistenceRow = {
			id: 10n,
			spaceId: null,
			space: null,
		};

		// When
		const result = toDomainEntity(ExampleEntity, persistenceRow);

		// Then
		expect(result.spaceId).toBeNull();
		expect(result.space).toBeNull();
	});
});
