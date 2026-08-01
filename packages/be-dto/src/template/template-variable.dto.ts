import {
	BooleanField,
	DateField,
	DateFieldOptional,
	StringField,
	StringFieldOptional,
	ULIDField,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { TemplateVariable } from "@cocrepo/prisma";

/**
 * 템플릿 변수 응답 DTO
 *
 * TemplateVariable은 removedAt이 없으므로 AbstractDto를 상속하지 않고
 * id, createdAt, updatedAt을 직접 선언합니다.
 */
export class TemplateVariableDto
	implements DomainEntityModel<TemplateVariable>
{
	@ULIDField({ description: "ID" })
	id!: string;

	@DateField({ description: "생성일" })
	createdAt!: Date;

	@DateFieldOptional({ nullable: true, description: "수정일" })
	updatedAt!: Date | null;

	@StringField({ description: "변수명" })
	name!: string;

	@StringFieldOptional({ nullable: true, description: "변수 설명" })
	description!: string | null;

	@StringFieldOptional({ nullable: true, description: "기본값" })
	defaultValue!: string | null;

	@BooleanField({ description: "필수 여부" })
	isRequired!: boolean;

	@ULIDField({ description: "템플릿 ID" })
	templateId!: string;
}
