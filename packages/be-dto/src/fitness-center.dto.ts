import {
	EnumField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { FitnessCenter, Space } from "@cocrepo/entity";
import { LanguageCode } from "@cocrepo/prisma";
import { CompanyDto } from "./company.dto";
import { EntityResponseType } from "./mapped-types";

/** 콘텐츠 언어를 포함하는 공개 Space 요약입니다. */
export class FitnessCenterSpaceDto extends EntityResponseType(Space, {
	pick: ["id"] as const,
	extraFields: ["contentLanguageCode", "name", "label"],
}) {
	// 이 요약의 콘텐츠 언어는 기본값을 선언하지 않는 API 계약입니다.
	@EnumField(() => LanguageCode)
	contentLanguageCode: LanguageCode;

	// 공간의 이름은 Space가 소유하므로 요약에도 Space의 이름을 그대로 노출합니다.
	@StringField()
	name: string;

	@StringFieldOptional({ nullable: true })
	label: string | null;
}

export class FitnessCenterDto extends EntityResponseType(FitnessCenter, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"address",
		"phone",
		"email",
		"companyId",
		"imageFileId",
		"spaceId",
		"company",
		"space",
	] as const,
	relations: {
		company: () => CompanyDto,
		space: () => FitnessCenterSpaceDto,
	},
}) {
	declare company?: CompanyDto | null;
	declare space?: FitnessCenterSpaceDto | null;
}
