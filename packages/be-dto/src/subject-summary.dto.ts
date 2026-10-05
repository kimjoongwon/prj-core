import { StringFieldOptional } from "@cocrepo/decorator/field";
import { Subject } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";

/** 권한 중첩 응답의 표시 정보는 기존 API의 nullable 미선언 계약을 유지합니다. */
export class SubjectSummaryDto extends EntityResponseType(Subject, {
	pick: ["id", "name"] as const,
	extraFields: ["displayName", "group"],
}) {
	@StringFieldOptional()
	displayName!: string | null;

	@StringFieldOptional()
	group!: string | null;
}
