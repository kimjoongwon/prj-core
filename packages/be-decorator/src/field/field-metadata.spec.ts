import "reflect-metadata";
import { StringValidation } from "@cocrepo/schema";
import { PickType } from "@nestjs/swagger";
import { DECORATORS } from "@nestjs/swagger/dist/constants";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { getMetadataStorage, validateSync } from "class-validator";
import { describe, expect, it } from "vitest";
import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	BooleanFieldMetadata,
	BooleanFieldOptionalMetadata,
	ClassFieldMetadata,
	DateFieldMetadata,
	DateFieldOptionalMetadata,
	EmailFieldMetadata,
	EmailFieldOptionalMetadata,
	EnumFieldMetadata,
	EnumFieldOptionalMetadata,
	NumberFieldMetadata,
	NumberFieldOptionalMetadata,
	PhoneFieldMetadata,
	PhoneFieldOptionalMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
	TmpKeyFieldMetadata,
	TmpKeyFieldOptionalMetadata,
	ULIDFieldMetadata,
	ULIDFieldOptionalMetadata,
	URLFieldMetadata,
	URLFieldOptionalMetadata,
	UUIDFieldMetadata,
	UUIDFieldOptionalMetadata,
} from "./index";
import {
	PasswordFieldMetadata,
	PasswordFieldOptionalMetadata,
} from "./specialized/password.field";

const statusEnum = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" } as const;
const metadataDecorators: PropertyDecorator[] = [
	BigIntIdFieldMetadata(),
	BigIntIdFieldOptionalMetadata(),
	BooleanFieldMetadata(),
	BooleanFieldOptionalMetadata(),
	ClassFieldMetadata(() => Object),
	DateFieldMetadata(),
	DateFieldOptionalMetadata(),
	EmailFieldMetadata(),
	EmailFieldOptionalMetadata(),
	EnumFieldMetadata(() => statusEnum),
	EnumFieldOptionalMetadata(() => statusEnum),
	NumberFieldMetadata(),
	NumberFieldOptionalMetadata(),
	PhoneFieldMetadata(),
	PhoneFieldOptionalMetadata(),
	StringFieldMetadata(),
	StringFieldOptionalMetadata(),
	TmpKeyFieldMetadata(),
	TmpKeyFieldOptionalMetadata(),
	ULIDFieldMetadata(),
	ULIDFieldOptionalMetadata(),
	URLFieldMetadata(),
	URLFieldOptionalMetadata(),
	UUIDFieldMetadata(),
	UUIDFieldOptionalMetadata(),
	PasswordFieldMetadata(),
	PasswordFieldOptionalMetadata(),
];

describe("Schema 상속 Entity용 FieldMetadata", () => {
	it("모든 metadata 전용 데코레이터는 validator 규칙을 등록하지 않는다", () => {
		class MetadataEntity {}
		for (const [index, decorator] of metadataDecorators.entries()) {
			decorator(MetadataEntity.prototype, `field${index}`);
		}
		expect(
			getMetadataStorage().getTargetValidationMetadatas(
				MetadataEntity,
				"",
				false,
				false,
			),
		).toEqual([]);
	});

	it("상속 검증은 한 번 유지하고 Nest PickType에 검증과 Swagger를 전달한다", () => {
		class RoleSchema {
			name!: string;
		}
		StringValidation({ maxLength: 5 })(RoleSchema.prototype, "name");
		class RoleEntity extends RoleSchema {}
		StringFieldMetadata({
			maxLength: 5,
			description: "역할 이름",
			toUpperCase: true,
		})(RoleEntity.prototype, "name");
		class RoleInput extends PickType(RoleEntity, ["name"] as const) {}

		const roleInput = plainToInstance(RoleInput, { name: "admin" });
		expect(roleInput.name).toBe("ADMIN");
		expect(validateSync(roleInput)).toEqual([]);
		expect(
			validateSync(plainToInstance(RoleInput, { name: "toolong" }))[0]
				.constraints,
		).toHaveProperty("maxLength");
		expect(
			getMetadataStorage().getTargetValidationMetadatas(
				RoleEntity,
				"",
				false,
				false,
			),
		).toHaveLength(
			getMetadataStorage().getTargetValidationMetadatas(
				RoleSchema,
				"",
				false,
				false,
			).length,
		);
		expect(
			Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				RoleInput.prototype,
				"name",
			),
		).toMatchObject({ type: String, maxLength: 5, description: "역할 이름" });
	});

	it("optional metadata는 inherited required 검증을 약화하지 않는다", () => {
		class RequiredSchema {
			name!: string;
		}
		StringValidation()(RequiredSchema.prototype, "name");
		class DocumentedEntity extends RequiredSchema {}
		StringFieldOptionalMetadata()(DocumentedEntity.prototype, "name");
		expect(validateSync(new DocumentedEntity())).not.toEqual([]);
		expect(
			Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				DocumentedEntity.prototype,
				"name",
			),
		).toMatchObject({ required: false });
	});

	it("검증 없이도 bigint·Date 변환과 Swagger nullable·범위를 보존한다", () => {
		class MetadataEntity {
			id!: bigint;
			createdAt!: Date;
			count!: number | null;
		}
		BigIntIdFieldMetadata()(MetadataEntity.prototype, "id");
		DateFieldMetadata()(MetadataEntity.prototype, "createdAt");
		NumberFieldOptionalMetadata({ nullable: true, min: 0, max: 10 })(
			MetadataEntity.prototype,
			"count",
		);
		const entity = plainToInstance(MetadataEntity, {
			id: "42",
			createdAt: "2026-09-01T00:00:00.000Z",
			count: null,
		});
		expect(entity.id).toBe(42n);
		expect(entity.createdAt).toBeInstanceOf(Date);
		expect(entity.count).toBeNull();
		expect(instanceToPlain(entity).id).toBe("42");
		expect(
			Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				MetadataEntity.prototype,
				"count",
			),
		).toMatchObject({
			minimum: 0,
			maximum: 10,
			nullable: true,
			required: false,
		});
	});
});
