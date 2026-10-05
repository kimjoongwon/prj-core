import {
	BigIntIdFieldOptional,
	ClassField,
	EnumFieldMetadata,
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
	@Exclude({ toPlainOnly: true })
	declare spaceId: SpaceSchema["spaceId"];

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
