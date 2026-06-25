import { AssetKind, AssetStatus } from "@cocrepo/prisma";
import {
	buildAssetQueryOrderBy,
	buildAssetQueryWhere,
	buildEmailVerificationQueryOrderBy,
	buildEmailVerificationQueryWhere,
	buildFolderQueryOrderBy,
	buildFolderQueryWhere,
	buildInquiryQueryOrderBy,
	buildInquiryQueryWhere,
	buildOidcClientQueryOrderBy,
	buildOidcClientQueryWhere,
	buildTenantAccessRequestQueryWhere,
	buildUserQueryOrderBy,
	buildUserQueryWhere,
} from "../src";

describe("QueryInput mapper", () => {
	it("검색 문자열과 ID 필터를 Prisma where로 변환한다", () => {
		expect(
			buildAssetQueryWhere({
				folderId: "folder-1",
				tenantId: "tenant-1",
				kind: AssetKind.IMAGE,
				status: AssetStatus.READY,
				search: "photo",
			}),
		).toEqual({
			folderId: "folder-1",
			tenantId: "tenant-1",
			kind: AssetKind.IMAGE,
			status: AssetStatus.READY,
			originalName: { contains: "photo", mode: "insensitive" },
			removedAt: null,
		});
	});

	it("boolean 필터와 삭제 상태 필터를 보존한다", () => {
		expect(buildOidcClientQueryWhere({ isActive: false })).toEqual({
			isActive: false,
		});
		expect(buildFolderQueryWhere({ statusFilter: "deleted" })).toEqual({
			removedAt: { not: null },
		});
	});

	it("날짜 범위를 createdAt Prisma 조건으로 변환한다", () => {
		const startDate = new Date("2026-01-01T00:00:00.000Z");
		const endDate = new Date("2026-01-31T23:59:59.000Z");

		expect(
			buildEmailVerificationQueryWhere({
				email: "user@example.com",
				startDate,
				endDate,
			}),
		).toEqual({
			email: { contains: "user@example.com", mode: "insensitive" },
			createdAt: { gte: startDate, lte: endDate },
		});
	});

	it("*Id와 *Ids 필터를 관계 조건으로 변환한다", () => {
		expect(
			buildUserQueryWhere({
				categoryId: "category-1",
				groupIds: ["group-1", "group-2"],
				roles: ["admin", "operator"],
			}),
		).toEqual({
			removedAt: null,
			classification: { categoryId: "category-1" },
			associations: {
				some: {
					groupId: { in: ["group-1", "group-2"] },
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
		expect(buildAssetQueryOrderBy({ sort: ["-sizeBytes"] })).toEqual([
			{ sizeBytes: "desc" },
		]);
	});

	it("문의와 테넌트 접근 신청 검색 조건을 관계 OR 조건으로 변환한다", () => {
		expect(
			buildInquiryQueryWhere({
				search: "kim",
				status: "deleted",
			}),
		).toEqual({
			removedAt: { not: null },
			OR: [
				{ title: { contains: "kim", mode: "insensitive" } },
				{ customer: { name: { contains: "kim", mode: "insensitive" } } },
				{ customer: { email: { contains: "kim", mode: "insensitive" } } },
			],
		});

		expect(
			buildTenantAccessRequestQueryWhere({
				reviewerId: "reviewer-1",
				search: "club",
				spaceId: "space-1",
			}),
		).toEqual({
			spaceId: "space-1",
			OR: [
				{ requester: { name: { contains: "club", mode: "insensitive" } } },
				{ requester: { email: { contains: "club", mode: "insensitive" } } },
				{
					space: {
						company: {
							is: { name: { contains: "club", mode: "insensitive" } },
						},
					},
				},
				{
					space: {
						company: {
							is: { label: { contains: "club", mode: "insensitive" } },
						},
					},
				},
			],
		});
	});

	it("문의 sort 변환은 허용 필드만 사용한다", () => {
		expect(
			buildInquiryQueryOrderBy({
				sort: ["-lastMessageAt", "priority", "customerId"],
			}),
		).toEqual([{ lastMessageAt: "desc" }, { priority: "asc" }]);
	});

	it("OIDC client와 이메일 인증 sort 변환은 허용 필드만 사용한다", () => {
		expect(
			buildOidcClientQueryOrderBy({
				sort: ["clientId", "-name", "unsupported"],
			}),
		).toEqual([{ clientId: "asc" }, { name: "desc" }]);

		expect(
			buildEmailVerificationQueryOrderBy({
				sort: ["email", "-status", "unsupported"],
			}),
		).toEqual([{ email: "asc" }, { status: "desc" }]);
	});
});
