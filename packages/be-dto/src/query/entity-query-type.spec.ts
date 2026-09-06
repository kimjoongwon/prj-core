import "reflect-metadata";
import type { Type } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AssetQueryDto } from "../asset/asset-query.dto";
import { QueryTimelineDto } from "./query-timeline.dto";
import { QueryUsersDto } from "../users/query-users.dto";
import { QuerySpaceDto } from "./query-space.dto";
import { DECORATORS } from "@nestjs/swagger/dist/constants";
import { StringField, BooleanField } from "@cocrepo/decorator/field";
import { EntityQueryType } from "./entity-query-type";
import { QueryDto } from "./query.dto";
import { AlbumQueryDto } from "../album/album-query.dto";
import { FolderQueryDto } from "../folder/folder-query.dto";
import { QueryInquiryDto } from "../inquiries/query-inquiry.dto";
import { QueryTenantAccessRequestDto } from "../tenant-access-requests/query-tenant-access-request.dto";
import { QueryIdpAccountDto } from "./query-idp-account.dto";
import { QueryOidcSessionDto } from "./query-oidc-session.dto";

class QueryFixtureEntity {
	@StringField()
	name!: string;

	@BooleanField({ default: true })
	isActive = true;

	@StringField({ nullable: true })
	label!: string | null;

	domainMethod() {
		return true;
	}
}

describe("EntityQueryType", () => {
	it("QueryDto methods are preserved while Entity behavior and defaults are excluded", () => {
		const QueryFixture = EntityQueryType(QueryFixtureEntity, [
			"name",
			"isActive",
		] as const);
		const query = new QueryFixture();

		expect(query).toBeInstanceOf(QueryDto);
		expect(query.toPageMetaDto).toBeTypeOf("function");
		expect("domainMethod" in query).toBe(false);
		expect(query.isActive).toBeUndefined();
	});

	it("reuses field validation and transforms API primitives", async () => {
		const validQuery = plainToInstance(
			EntityQueryType(QueryFixtureEntity, ["name", "isActive"] as const),
			{ name: "valid", isActive: "false" },
		);
		const invalidQuery = plainToInstance(
			EntityQueryType(QueryFixtureEntity, ["name", "isActive"] as const),
			{ name: 12, isActive: "not-a-boolean" },
		);

		expect(validQuery.isActive).toBe(false);
		expect(await validate(validQuery)).toHaveLength(0);
		expect((await validate(invalidQuery)).length).toBeGreaterThan(0);
	});

	it("preserves migrated domain Query wire contracts", async () => {
		const validAssetQuery = plainToInstance(AssetQueryDto, {
			folderId: "123",
			kind: "IMAGE",
			status: "READY",
		});
		const invalidAssetQuery = plainToInstance(AssetQueryDto, {
			folderId: "0",
			kind: "invalid",
		});
		const partialEmailQuery = plainToInstance(QueryUsersDto, {
			email: "partial",
		});
		const nullTimelineQuery = plainToInstance(QueryTimelineDto, {
			timelineId: "null",
		});

		expect(validAssetQuery.folderId).toBe(123n);
		expect(await validate(validAssetQuery)).toHaveLength(0);
		expect((await validate(invalidAssetQuery)).length).toBeGreaterThan(0);
		expect(partialEmailQuery.email).toBe("partial");
		expect(await validate(partialEmailQuery)).toHaveLength(0);
		expect(nullTimelineQuery.timelineId).toBeNull();
	});

	it("does not expose Entity defaults in Query Swagger metadata", () => {
		const metadata = Reflect.getMetadata(
			DECORATORS.API_MODEL_PROPERTIES,
			QuerySpaceDto.prototype,
			"contentLanguageCode",
		) as { default?: unknown };

		expect(metadata?.default).toBeUndefined();
	});

	it("필터 생략은 허용하고 null은 선택된 Entity 필드의 정책을 따른다", async () => {
		const QueryFixture = EntityQueryType(QueryFixtureEntity, [
			"name",
			"isActive",
			"label",
		] as const);

		expect(await validate(plainToInstance(QueryFixture, {}))).toHaveLength(0);
		expect(
			await validate(plainToInstance(QueryFixture, { label: null })),
		).toHaveLength(0);
		const nullQuery = plainToInstance(QueryFixture, {
			name: null,
			isActive: null,
		});
		expect(
			(await validate(nullQuery)).map((error) => error.property).sort(),
		).toEqual(["isActive", "name"]);
	});

	it("페이지 값은 변환·검증하며 Entity 기본값은 인스턴스와 Swagger에 들어오지 않는다", async () => {
		const QueryFixture = EntityQueryType(QueryFixtureEntity, [
			"isActive",
		] as const);
		const pagedQuery = plainToInstance(QueryFixture, {
			skip: "20",
			take: "10",
		});

		expect(await validate(pagedQuery)).toHaveLength(0);
		expect(pagedQuery).toBeInstanceOf(QueryDto);
		expect(pagedQuery.toPageMetaDto(45)).toMatchObject({
			skip: 20,
			take: 10,
			totalCount: 45,
			pageCount: 5,
			hasPreviousPage: true,
			hasNextPage: true,
		});
		expect(pagedQuery.isActive).toBeUndefined();
		expect(
			Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				QueryFixture.prototype,
				"isActive",
			),
		).toMatchObject({ required: false });
		expect(
			Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				QueryFixture.prototype,
				"isActive",
			),
		).not.toHaveProperty("default");
		expect(
			(await validate(plainToInstance(QueryFixture, { skip: -1, take: 201 })))
				.map((error) => error.property)
				.sort(),
		).toEqual(["skip", "take"]);
	});

	it.each<{
		queryType: Type<QueryDto>;
		filterKey: string;
		wireFilter: unknown;
		parsedFilter: unknown;
		invalidFilter: unknown;
	}>([
		{
			queryType: QueryInquiryDto,
			filterKey: "category",
			wireFilter: "GENERAL",
			parsedFilter: "GENERAL",
			invalidFilter: "UNKNOWN",
		},
		{
			queryType: QueryInquiryDto,
			filterKey: "channel",
			wireFilter: "WEB",
			parsedFilter: "WEB",
			invalidFilter: "UNKNOWN",
		},
		{
			queryType: QueryInquiryDto,
			filterKey: "priority",
			wireFilter: "NORMAL",
			parsedFilter: "NORMAL",
			invalidFilter: "UNKNOWN",
		},
		{
			queryType: AlbumQueryDto,
			filterKey: "spaceId",
			wireFilter: "123",
			parsedFilter: 123n,
			invalidFilter: "0",
		},
		{
			queryType: QueryIdpAccountDto,
			filterKey: "isActive",
			wireFilter: "false",
			parsedFilter: false,
			invalidFilter: "UNKNOWN",
		},
		{
			queryType: QueryTenantAccessRequestDto,
			filterKey: "status",
			wireFilter: "PENDING",
			parsedFilter: "PENDING",
			invalidFilter: "UNKNOWN",
		},
		{
			queryType: QueryTenantAccessRequestDto,
			filterKey: "spaceId",
			wireFilter: "123",
			parsedFilter: 123n,
			invalidFilter: "0",
		},
		{
			queryType: QueryTenantAccessRequestDto,
			filterKey: "requesterId",
			wireFilter: "456",
			parsedFilter: 456n,
			invalidFilter: "-1",
		},
		{
			queryType: QueryOidcSessionDto,
			filterKey: "modelType",
			wireFilter: "Session",
			parsedFilter: "Session",
			invalidFilter: "",
		},
		{
			queryType: QuerySpaceDto,
			filterKey: "contentLanguageCode",
			wireFilter: "ko_KR",
			parsedFilter: "ko_KR",
			invalidFilter: "UNKNOWN",
		},
	])("$queryType.name.$filterKey 필터의 생략·null·변환 계약을 보존한다", async ({
		queryType,
		filterKey,
		wireFilter,
		parsedFilter,
		invalidFilter,
	}) => {
		const omittedQuery = plainToInstance(queryType, {});
		const validQuery = plainToInstance(queryType, { [filterKey]: wireFilter });
		const nullQuery = plainToInstance(queryType, { [filterKey]: null });
		const invalidQuery = plainToInstance(queryType, {
			[filterKey]: invalidFilter,
		});

		expect(omittedQuery).toBeInstanceOf(QueryDto);
		expect(omittedQuery).not.toHaveProperty(filterKey);
		expect(await validate(omittedQuery)).toHaveLength(0);
		expect(validQuery).toMatchObject({ [filterKey]: parsedFilter });
		expect(await validate(validQuery)).toHaveLength(0);
		expect(
			(await validate(nullQuery)).map((error) => error.property),
		).toContain(filterKey);
		expect(
			(await validate(invalidQuery)).map((error) => error.property),
		).toContain(filterKey);
	});

	it("Entity와 의미가 다른 ID null 및 검색 계약은 Query 선언을 유지한다", async () => {
		const inquiryQuery = plainToInstance(QueryInquiryDto, {
			assigneeId: null,
			customerId: null,
		});
		const folderQuery = plainToInstance(FolderQueryDto, {
			parentFolderId: null,
		});
		const timelineQuery = plainToInstance(QueryTimelineDto, {
			timelineId: "null",
			search: "null",
		});

		expect(
			(await validate(inquiryQuery)).map((error) => error.property).sort(),
		).toEqual(["assigneeId", "customerId"]);
		expect(
			(await validate(folderQuery)).map((error) => error.property),
		).toContain("parentFolderId");
		expect(timelineQuery).toMatchObject({ timelineId: null, search: null });
		expect(await validate(timelineQuery)).toHaveLength(0);
	});
});
