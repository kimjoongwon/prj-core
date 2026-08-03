import {
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Subject } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

/**
 * Subject 응답 DTO
 * CASL Subject 정의 - 권한 대상 (entity:xxx, menu:xxx, feature:xxx, ui:xxx)
 */
export class SubjectDto
	extends AbstractDto
	implements DomainEntityModel<Subject>
{
	@StringField()
	name!: string;

	@StringFieldOptional()
	displayName!: string | null;

	@StringFieldOptional()
	icon!: string | null;

	@StringFieldOptional()
	group!: string | null;

	@NumberField()
	order!: number;
}
