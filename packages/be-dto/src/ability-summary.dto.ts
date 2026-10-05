import { Ability } from "@cocrepo/entity";
import { ActionDto } from "./action.dto";
import { EntityResponseType } from "./mapped-types";
import { SubjectSummaryDto } from "./subject.dto";

/** 목록 조회용 권한 요약입니다. */
export class AbilitySummaryDto extends EntityResponseType(Ability, {
	pick: [
		"id",
		"name",
		"actionId",
		"subjectId",
		"inverted",
		"priority",
		"action",
		"subject",
	] as const,
	relations: { action: () => ActionDto, subject: () => SubjectSummaryDto },
}) {
	declare action?: ActionDto;
	declare subject?: SubjectSummaryDto;
}
