import "reflect-metadata";
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

class QueryFixtureEntity {
	@StringField()
	name!: string;

	@BooleanField()
	isActive = true;

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
});
