import "reflect-metadata";
import { DECORATORS } from "@nestjs/swagger/dist/constants";
import { plainToInstance } from "class-transformer";
import { IsString, validateSync } from "class-validator";
import { describe, expect, it, vi } from "vitest";
import {
	CLASS_FIELD_OPTIONS_METADATA,
	ClassField,
	type ClassFieldOptionsMetadata,
} from "./class.field";

class RelatedEntity {
	name!: string;
}
IsString()(RelatedEntity.prototype, "name");

describe("ClassField 공개 옵션 메타데이터", () => {
	it("기본 옵션과 기존 필수·null·중첩 검증을 보존한다", () => {
		class OwnerEntity {
			relation!: RelatedEntity;
		}
		ClassField(() => RelatedEntity)(OwnerEntity.prototype, "relation");

		const fieldMetadata = Reflect.getMetadata(
			CLASS_FIELD_OPTIONS_METADATA,
			OwnerEntity.prototype,
			"relation",
		) as ClassFieldOptionsMetadata;

		expect(fieldMetadata.fieldOptions).toEqual({
			required: true,
			nullable: false,
			each: false,
			isArray: false,
			swagger: true,
		});
		expect(fieldMetadata.apiPropertyOptions).toEqual({
			type: expect.any(Function),
		});
		expect(validateSync(plainToInstance(OwnerEntity, {}))).not.toHaveLength(0);
		expect(
			validateSync(plainToInstance(OwnerEntity, { relation: null })),
		).not.toHaveLength(0);
		expect(
			validateSync(plainToInstance(OwnerEntity, { relation: { name: 42 } })),
		).not.toHaveLength(0);
		const ownerEntity = plainToInstance(OwnerEntity, {
			relation: { name: "관리자" },
		});
		expect(ownerEntity.relation).toBeInstanceOf(RelatedEntity);
		expect(validateSync(ownerEntity)).toHaveLength(0);
	});

	it("배열·선택·nullable·Swagger 상세 옵션을 저장하고 기존 동작과 일치한다", () => {
		class OwnerEntity {
			relations?: RelatedEntity[] | null;
		}
		ClassField(() => RelatedEntity, {
			each: true,
			isArray: true,
			required: false,
			nullable: true,
			description: "연결된 역할",
			readOnly: true,
		})(OwnerEntity.prototype, "relations");
		const fieldMetadata = Reflect.getMetadata(
			CLASS_FIELD_OPTIONS_METADATA,
			OwnerEntity.prototype,
			"relations",
		) as ClassFieldOptionsMetadata;
		const swaggerMetadata = Reflect.getMetadata(
			DECORATORS.API_MODEL_PROPERTIES,
			OwnerEntity.prototype,
			"relations",
		);

		expect(fieldMetadata.fieldOptions).toEqual({
			each: true,
			isArray: true,
			required: false,
			nullable: true,
			swagger: true,
			description: "연결된 역할",
			readOnly: true,
		});
		expect(swaggerMetadata).toEqual(fieldMetadata.apiPropertyOptions);
		expect(validateSync(plainToInstance(OwnerEntity, {}))).toHaveLength(0);
		expect(
			validateSync(plainToInstance(OwnerEntity, { relations: null })),
		).toHaveLength(0);
		const ownerEntity = plainToInstance(OwnerEntity, {
			relations: [{ name: "관리자" }],
		});
		expect(ownerEntity.relations?.[0]).toBeInstanceOf(RelatedEntity);
		expect(validateSync(ownerEntity)).toHaveLength(0);
	});

	it("each와 Swagger isArray의 기존 독립 설정을 유지한다", () => {
		class OwnerEntity {
			relations!: RelatedEntity[];
		}
		ClassField(() => RelatedEntity, { each: true })(
			OwnerEntity.prototype,
			"relations",
		);
		const fieldMetadata = Reflect.getMetadata(
			CLASS_FIELD_OPTIONS_METADATA,
			OwnerEntity.prototype,
			"relations",
		) as ClassFieldOptionsMetadata;
		const swaggerMetadata = Reflect.getMetadata(
			DECORATORS.API_MODEL_PROPERTIES,
			OwnerEntity.prototype,
			"relations",
		);

		expect(fieldMetadata.fieldOptions).toMatchObject({
			each: true,
			isArray: false,
		});
		expect(swaggerMetadata.isArray).toBe(false);
		const ownerEntity = plainToInstance(OwnerEntity, {
			relations: { name: "관리자" },
		});
		expect(ownerEntity.relations).toHaveLength(1);
		expect(ownerEntity.relations[0]).toBeInstanceOf(RelatedEntity);
	});

	it("Swagger를 끈 필드도 검증·변환 옵션을 기록한다", () => {
		class OwnerEntity {
			relation!: RelatedEntity;
		}
		ClassField(() => RelatedEntity, { swagger: false })(
			OwnerEntity.prototype,
			"relation",
		);
		const fieldMetadata = Reflect.getMetadata(
			CLASS_FIELD_OPTIONS_METADATA,
			OwnerEntity.prototype,
			"relation",
		) as ClassFieldOptionsMetadata;

		expect(fieldMetadata.fieldOptions.swagger).toBe(false);
		expect(fieldMetadata.apiPropertyOptions).toBeUndefined();
		expect(
			Reflect.hasMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				OwnerEntity.prototype,
				"relation",
			),
		).toBe(false);
		expect(
			plainToInstance(OwnerEntity, { relation: { name: "관리자" } }).relation,
		).toBeInstanceOf(RelatedEntity);
	});

	it("선언과 메타데이터 조회 시 관계 콜백을 실행하지 않는다", () => {
		class OwnerEntity {
			relation!: RelatedEntity;
		}
		const resolveRelatedEntity = vi.fn(() => RelatedEntity);
		ClassField(resolveRelatedEntity)(OwnerEntity.prototype, "relation");
		Reflect.getMetadata(
			CLASS_FIELD_OPTIONS_METADATA,
			OwnerEntity.prototype,
			"relation",
		);
		expect(resolveRelatedEntity).not.toHaveBeenCalled();

		plainToInstance(OwnerEntity, { relation: { name: "관리자" } });
		expect(resolveRelatedEntity).toHaveBeenCalled();
	});

	it("상속받은 관계의 옵션을 읽고 대상 클래스만 교체할 수 있다", () => {
		class OwnerEntity {
			relation!: RelatedEntity;
		}
		ClassField(() => RelatedEntity, {
			description: "연결된 역할",
			required: false,
		})(OwnerEntity.prototype, "relation");
		class DerivedOwnerEntity extends OwnerEntity {}
		class RelatedResponse {
			name!: string;
		}
		class OwnerResponse {
			relation?: RelatedResponse;
		}
		const fieldMetadata = Reflect.getMetadata(
			CLASS_FIELD_OPTIONS_METADATA,
			DerivedOwnerEntity.prototype,
			"relation",
		) as ClassFieldOptionsMetadata;
		ClassField(() => RelatedResponse, fieldMetadata.fieldOptions)(
			OwnerResponse.prototype,
			"relation",
		);

		expect(
			plainToInstance(OwnerResponse, { relation: { name: "관리자" } }).relation,
		).toBeInstanceOf(RelatedResponse);
		expect(
			Reflect.getMetadata(
				CLASS_FIELD_OPTIONS_METADATA,
				OwnerEntity.prototype,
				"relation",
			),
		).toBe(fieldMetadata);
		expect(
			Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				OwnerResponse.prototype,
				"relation",
			),
		).toMatchObject({ description: "연결된 역할", required: false });
	});
});
