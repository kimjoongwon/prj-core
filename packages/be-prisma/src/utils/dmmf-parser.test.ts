import { describe, expect, it } from "vitest";
import { getDmmfParser } from "./dmmf-parser";

describe("DmmfParser field contract manifest", () => {
	it("DMMF field의 타입과 nullable/list/relation/enum/dbName 계약을 보존한다", async () => {
		const parser = await getDmmfParser();
		const userFields = parser.parseFieldContractManifestByModel("User");

		expect(userFields).toContainEqual({
			modelName: "User",
			fieldName: "userId",
			type: "String",
			isRequired: true,
			isList: false,
			isRelation: false,
			isEnum: false,
			dbName: "user_id",
		});
		expect(userFields).toContainEqual({
			modelName: "User",
			fieldName: "updatedAt",
			type: "DateTime",
			isRequired: false,
			isList: false,
			isRelation: false,
			isEnum: false,
			dbName: "updated_at",
		});
		// currentTenant 관계는 UserStatus 1:1 모델로 이동했습니다.
		expect(userFields).toEqual(
			expect.not.arrayContaining([
				expect.objectContaining({ fieldName: "currentTenant" }),
			]),
		);
		const userStatusFields = parser.parseFieldContractManifestByModel("UserStatus");
		expect(userStatusFields).toContainEqual({
			modelName: "UserStatus",
			fieldName: "userId",
			type: "BigInt",
			isRequired: true,
			isList: false,
			isRelation: false,
			isEnum: false,
			dbName: "user_id",
		});
		expect(userStatusFields).toContainEqual({
			modelName: "UserStatus",
			fieldName: "currentTenant",
			type: "Tenant",
			isRequired: false,
			isList: false,
			isRelation: true,
			isEnum: false,
			dbName: null,
		});
		expect(userFields).toContainEqual({
			modelName: "User",
			fieldName: "profiles",
			type: "Profile",
			isRequired: true,
			isList: true,
			isRelation: true,
			isEnum: false,
			dbName: null,
		});
	});

	it("enum field를 enum type으로 식별하고 존재하지 않는 model은 빈 목록을 반환한다", async () => {
		const parser = await getDmmfParser();
		const actionLogFields = parser.parseFieldContractManifestByModel("AIAgentLog");

		expect(actionLogFields).toContainEqual({
			modelName: "AIAgentLog",
			fieldName: "action",
			type: "AIAgentAction",
			isRequired: true,
			isList: false,
			isRelation: false,
			isEnum: true,
			dbName: null,
		});
		expect(parser.parseFieldContractManifestByModel("MissingModel")).toEqual([]);
	});

	it("기존 field parser는 관계 필드를 계속 제외한다", async () => {
		const parser = await getDmmfParser();

		expect(parser.parseFieldsByModel("User").some((field) => field.name === "profiles")).toBe(
			false,
		);
	});
});
