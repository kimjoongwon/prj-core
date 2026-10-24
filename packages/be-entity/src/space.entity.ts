import {
	BigIntIdFieldOptional,
	ClassField,
	EnumFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { LanguageCode } from "@cocrepo/enum";
import { SpaceSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { FitnessCenter } from "./fitness-center.entity";
import type { Policy } from "./policy.entity";
import { SpaceAssociation } from "./space-association.entity";
import { SpaceClassification } from "./space-classification.entity";
import { Tenant } from "./tenant.entity";

@AbstractEntityFields()
export class Space extends SpaceSchema {
	/** 공개 식별자 ULID */
	declare id: SpaceSchema["id"];

	@StringFieldMetadata({
		description: "Space의 표시 이름. 공간 선택·목록·검색의 원천입니다.",
	})
	declare name: SpaceSchema["name"];
	@StringFieldOptionalMetadata({
		description: "Space 표시 이름 아래에 함께 보여주는 보조 라벨입니다.",
		nullable: true,
	})
	declare label: SpaceSchema["label"];
	@EnumFieldMetadata(() => LanguageCode, {
		description: "이 Space에서 작성되는 운영 리소스의 콘텐츠 언어",
		default: LanguageCode.ko_KR,
	})
	declare contentLanguageCode: SpaceSchema["contentLanguageCode"];
	@BigIntIdFieldOptional({
		description: "이 Space 접근에 사용할 Tenant ID",
		nullable: true,
	})
	tenantId?: bigint | null;
	@ClassField(() => Tenant, {
		required: false,
		swagger: false,
		isArray: true,
	})
	tenants?: Tenant[];
	@ClassField(() => SpaceClassification, {
		required: false,
	})
	spaceClassification?: SpaceClassification;
	spaceClassifications?: SpaceClassification[];
	@ClassField(() => SpaceAssociation, {
		required: false,
		each: true,
		isArray: true,
	})
	spaceAssociations?: SpaceAssociation[];
	policies?: Policy[];
	@ClassField(() => FitnessCenter, { required: false })
	fitnessCenter?: FitnessCenter | null;
}
