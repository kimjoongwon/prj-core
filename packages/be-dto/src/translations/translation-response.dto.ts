import { Translation } from "@cocrepo/entity";
import { ApiProperty } from "@nestjs/swagger";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class TranslationResponseDto extends EntityResponseType(Translation, {
	pick: [
		"languageCode",
		"key",
		"text",
		"category",
		"isTranslated",
		"createdAt",
		"updatedAt",
	],
	extraFields: ["id"],
}) {
	// 번역 API의 문자열 식별자 계약은 Entity의 bigint 식별자와 구분합니다.
	@ApiProperty({
		description: "번역 ID",
		example: "clxxx12345",
	})
	id!: string;
}
