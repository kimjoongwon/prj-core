import {
	buildFolderQueryOrderBy,
	buildFolderQueryWhere,
	buildUserQueryOrderBy,
	buildUserQueryWhere,
} from "../src";

describe("QueryInput mapper", () => {
	it("boolean 필터와 삭제 상태 필터를 보존한다", () => {
		expect(buildFolderQueryWhere({ statusFilter: "deleted" })).toEqual({
			removedAt: { not: null },
		});
	});

	it("*Id와 *Ids 필터를 관계 조건으로 변환한다", () => {
		expect(
			buildUserQueryWhere({
				categorySeq: 101n,
				groupIds: [201n, 202n],
				roles: ["admin", "operator"],
			}),
		).toEqual({
			removedAt: null,
			classification: { categorySeq: 101n },
			associations: {
				some: {
					groupSeq: { in: [201n, 202n] },
					removedAt: null,
				},
			},
			tenants: {
				some: {
					role: { name: { in: ["admin", "operator"] } },
				},
			},
		});
	});

	it("허용된 sort만 Prisma orderBy로 변환하고 기본 정렬을 유지한다", () => {
		expect(
			buildUserQueryOrderBy({
				sort: ["name", "-email", "unsupported"],
			}),
		).toEqual([{ name: "asc" }, { email: "desc" }]);
		expect(buildFolderQueryOrderBy({ sort: [] })).toEqual([{ path: "asc" }]);
	});
});
