import "reflect-metadata";
import { ClassField, StringField } from "@cocrepo/decorator/field";
import { DECORATORS } from "@nestjs/swagger";
import { generateSchema } from "@nestjs/swagger";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it, vi } from "vitest";
import { EntityResponseType } from "./entity-response-type";
import { prepareEntityResponseType } from "./prepare-entity-response-type";

class AssignmentEntity {
	@StringField()
	name!: string;
	password!: string;
}
class AssignmentResponse extends EntityResponseType(AssignmentEntity, {
	pick: ["name"],
}) {}
class RoleEntity {
	@StringField()
	name!: string;
	password!: string;
	roleId!: string;
	@ClassField(() => AssignmentEntity, {
		each: true,
		isArray: true,
		required: false,
		nullable: true,
		description: "역할 할당",
	})
	assignments?: AssignmentEntity[] | null;
	@ClassField(() => AssignmentEntity)
	owner!: AssignmentEntity;
}
class RoleResponse extends EntityResponseType(RoleEntity, {
	pick: ["name", "assignments", "owner"],
	relations: {
		assignments: () => AssignmentResponse,
		owner: () => AssignmentResponse,
	},
	extraFields: ["displayLabel"],
}) {
	declare assignments?: AssignmentResponse[] | null;
	declare owner: AssignmentResponse;
	@StringField()
	displayLabel!: string;
}

describe("EntityResponseType", () => {
	it("concrete 클래스 준비 후 기본 변환 옵션으로 루트·중첩 공개 필드만 남긴다", () => {
		prepareEntityResponseType(RoleResponse);
		const response = plainToInstance(RoleResponse, {
			name: "ADMIN",
			password: "secret",
			roleId: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
			unknown: true,
			displayLabel: "관리자",
			assignments: [{ name: "read", password: "nested", unknown: true }],
			owner: { name: "owner", password: "nested" },
		});
		expect(response.assignments?.[0]).toBeInstanceOf(AssignmentResponse);
		expect(Object.keys(response).sort()).toEqual([
			"assignments",
			"displayLabel",
			"name",
			"owner",
		]);
		expect(instanceToPlain(response)).toEqual({
			name: "ADMIN",
			displayLabel: "관리자",
			assignments: [{ name: "read" }],
			owner: { name: "owner" },
		});
	});

	it("관계 대상만 바꾸고 Swagger의 필수·nullable·배열·설명과 생략된 옵션을 보존한다", () => {
		for (const relationKey of ["assignments", "owner"]) {
			const originalSwagger = Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				RoleEntity.prototype,
				relationKey,
			);
			const responseSwagger = Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				RoleResponse.prototype,
				relationKey,
			);
			expect(responseSwagger).toEqual({
				...originalSwagger,
				type: expect.any(Function),
			});
			expect(responseSwagger.type()).toBe(AssignmentResponse);
		}
		const ownerSwagger = Reflect.getMetadata(
			DECORATORS.API_MODEL_PROPERTIES,
			RoleResponse.prototype,
			"owner",
		);
		expect(ownerSwagger).not.toHaveProperty("required");
		expect(ownerSwagger).not.toHaveProperty("nullable");
		const schemas = {};
		Object.assign(schemas, generateSchema(RoleResponse, schemas).schemas);
		expect(schemas).toHaveProperty(
			"RoleResponse.properties.assignments.items.$ref",
			"#/components/schemas/AssignmentResponse",
		);
	});

	it("필수 관계와 nullable 배열의 중첩 검증을 유지한다", () => {
		prepareEntityResponseType(RoleResponse);
		const validResponse = plainToInstance(RoleResponse, {
			name: "ADMIN",
			displayLabel: "관리자",
			assignments: null,
			owner: { name: "owner" },
		});
		expect(validateSync(validResponse)).toHaveLength(0);
		const invalidResponse = plainToInstance(RoleResponse, {
			name: "ADMIN",
			displayLabel: "관리자",
			assignments: [{ name: null }],
		});
		expect(
			validateSync(invalidResponse).map((error) => error.property),
		).toEqual(expect.arrayContaining(["assignments", "owner"]));
	});

	it("상호 참조 DTO의 callback은 선언 시 실행하지 않고 변환 시 재귀 그래프를 준비한다", () => {
		class ParentEntity {
			@StringField() name!: string;
			@ClassField(() => ChildEntity, { required: false }) child?: object;
		}
		class ChildEntity {
			@StringField() name!: string;
			@ClassField(() => ParentEntity, { required: false }) parent?: object;
		}
		const resolveChild = vi.fn(() => ChildResponse);
		class ParentResponse extends EntityResponseType(ParentEntity, {
			pick: ["name", "child"],
			relations: { child: resolveChild },
		}) {
			declare child?: ChildResponse;
		}
		class ChildResponse extends EntityResponseType(ChildEntity, {
			pick: ["name", "parent"],
			relations: { parent: () => ParentResponse },
		}) {
			declare parent?: ParentResponse;
		}
		expect(resolveChild).not.toHaveBeenCalled();
		prepareEntityResponseType(ParentResponse);
		const parentResponse = plainToInstance(ParentResponse, {
			name: "parent",
			child: { name: "child", unknown: true },
		});
		expect(parentResponse.child).toBeInstanceOf(ChildResponse);
		expect(parentResponse.child).not.toHaveProperty("unknown");
	});

	it("TS5.9에서 parent와 children이 자기 DTO를 반환해도 base를 순환 추론하지 않는다", () => {
		class TreeEntity {
			@StringField() name!: string;
			@ClassField(() => TreeEntity, { required: false }) parent?: TreeEntity;
			@ClassField(() => TreeEntity, { required: false, each: true })
			children?: TreeEntity[];
			listNames(): string[] {
				return [this.name];
			}
		}
		class TreeResponse extends EntityResponseType(TreeEntity, {
			pick: ["name", "parent", "children"],
			relations: {
				parent: () => TreeResponse,
				children: () => TreeResponse,
			},
		}) {
			declare parent?: TreeResponse;
			declare children?: TreeResponse[];
		}
		prepareEntityResponseType(TreeResponse);
		const treeResponse = plainToInstance(TreeResponse, {
			name: "root",
			children: [{ name: "child", unknown: true }],
		});
		expect(treeResponse.children?.[0]).toBeInstanceOf(TreeResponse);
		expect(treeResponse.children?.[0]).not.toHaveProperty("unknown");
		expect(treeResponse).not.toHaveProperty("listNames");
	});

	it("관계 키 제약을 유지하고 callback 및 반환 constructor를 검증한다", () => {
		expect(() =>
			EntityResponseType(RoleEntity, {
				pick: ["owner"],
				relations: { owner: 123 },
			}),
		).toThrow("Response relation must be a callback: owner");
		class InvalidRelationResponse extends EntityResponseType(RoleEntity, {
			pick: ["owner"],
			relations: { owner: () => 123 },
		}) {}
		expect(() => prepareEntityResponseType(InvalidRelationResponse)).toThrow(
			"Response relation callback must return a class: owner",
		);

		// 존재하지 않는 관계 키는 callback 반환 타입과 무관하게 컴파일 오류여야 합니다.
		expect(() =>
			EntityResponseType(RoleEntity, {
				pick: ["owner"],
				relations: {
					// @ts-expect-error Entity에 없는 관계 이름입니다.
					missingRelation: () => AssignmentResponse,
				},
			}),
		).toThrow(
			"Entity relation metadata is missing: RoleEntity.missingRelation",
		);
	});
});
