import { toDomainEntity } from "../src/to-domain-entity";

class ExampleEntity {
	id!: string;
	spaceId!: string;
	space!: { id: string; name: string };
}

describe("toDomainEntity", () => {
	it("관계를 포함한 Prisma 결과가 주어지면 공개 관계 ID를 복원한다", () => {
		// Given
		const persistenceRow = {
			id: "01J00000000000000000000000",
			seq: 10,
			spaceSeq: 20,
			space: {
				id: "01J00000000000000000000001",
				seq: 20,
				name: "본사",
			},
		};

		// When
		const result = toDomainEntity(ExampleEntity, persistenceRow);

		// Then
		expect(result).toEqual({
			id: "01J00000000000000000000000",
			spaceId: "01J00000000000000000000001",
			space: {
				id: "01J00000000000000000000001",
				name: "본사",
			},
		});
	});

	it("내부 순번은 중첩 객체와 배열을 포함해 응답에서 제거한다", () => {
		// Given
		const persistenceRows = [
			{
				id: "01J00000000000000000000000",
				seq: 10,
				children: [{ id: "01J00000000000000000000002", seq: 30 }],
			},
		];

		// When
		const result = toDomainEntity(ExampleEntity, persistenceRows);

		// Then
		expect(result).toEqual([
			{
				id: "01J00000000000000000000000",
				children: [{ id: "01J00000000000000000000002" }],
			},
		]);
		expect(result[0]).not.toHaveProperty("seq");
	});

	it("nullable 관계가 함께 조회되면 공개 관계 ID를 null로 유지한다", () => {
		// Given
		const persistenceRow = {
			id: "01J00000000000000000000000",
			seq: 10,
			spaceSeq: null,
			space: null,
		};

		// When
		const result = toDomainEntity(ExampleEntity, persistenceRow);

		// Then
		expect(result.spaceId).toBeNull();
		expect(result).not.toHaveProperty("spaceSeq");
	});

	it("관계 필드명이 축약된 경우에도 원래 공개 ID 필드명을 복원한다", () => {
		// Given
		const persistenceRow = {
			id: "01J00000000000000000000000",
			seq: 10,
			parentFolderSeq: 30,
			parent: {
				id: "01J00000000000000000000003",
				seq: 30,
			},
		};

		// When
		const result = toDomainEntity(ExampleEntity, persistenceRow);

		// Then
		expect(result).toMatchObject({
			parentFolderId: "01J00000000000000000000003",
		});
	});
});
