import {
	buildIdpAccountQueryOrderBy,
	buildIdpAccountQueryWhere,
} from "../src";

describe("IdpAccount query mapper", () => {
	beforeEach(() => {
		jest.useFakeTimers().setSystemTime(new Date("2026-06-22T00:00:00.000Z"));
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("검색 문자열과 boolean 필터를 where로 변환한다", () => {
		expect(
			buildIdpAccountQueryWhere(
				{
					search: "kim",
					isActive: false,
				},
				{ removedAt: null },
			),
		).toEqual({
			removedAt: null,
			isActive: false,
			AND: [
				{
					OR: [
						{ name: { contains: "kim", mode: "insensitive" } },
						{ email: { contains: "kim", mode: "insensitive" } },
					],
				},
			],
		});
	});

	it("잠금 필터와 검색 필터를 서로 덮어쓰지 않는다", () => {
		expect(
			buildIdpAccountQueryWhere({
				search: "lee",
				isLocked: true,
			}),
		).toEqual({
			AND: [
				{
					OR: [
						{ name: { contains: "lee", mode: "insensitive" } },
						{ email: { contains: "lee", mode: "insensitive" } },
					],
				},
				{
					OR: [
						{ isPermanentlyLocked: true },
						{ lockedUntil: { gt: new Date("2026-06-22T00:00:00.000Z") } },
					],
				},
			],
		});
	});

	it("sort wire shape를 Prisma orderBy로 변환하고 기본 정렬을 유지한다", () => {
		expect(
			buildIdpAccountQueryOrderBy({
				sort: ["name", "-email", "unsupported"],
			}),
		).toEqual([{ name: "asc" }, { email: "desc" }]);

		expect(buildIdpAccountQueryOrderBy({ sort: [] })).toEqual([
			{ createdAt: "desc" },
		]);
	});
});
