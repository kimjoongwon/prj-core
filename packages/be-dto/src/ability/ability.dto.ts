import { Ability } from "@cocrepo/entity";
import { ActionDto } from "../action.dto";
import { EntityResponseType } from "../mapped-types";
import { SubjectSummaryDto } from "../subject.dto";

export class AbilityDto extends EntityResponseType(Ability, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"actionId",
		"inverted",
		"reason",
		"subjectId",
		"name",
		"description",
		"action",
		"subject",
		"priority",
	] as const,
	relations: {
		action: () => ActionDto,
		subject: () => SubjectSummaryDto,
	},
	extraFields: ["fields", "conditions"],
}) {
	// 기존 일반 응답은 이 JSON/배열 필드에 요청용 검증·Swagger 정보를 선언하지 않습니다.
	declare fields: Ability["fields"];

	declare conditions: Ability["conditions"];

	declare action?: ActionDto;
	declare subject?: SubjectSummaryDto;
}
