import {
	BigIntIdField,
	BooleanField,
	DateField,
	DateFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { TemplateVariable } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";

/**
 * 템플릿 변수 응답 DTO
 *
 * TemplateVariable은 removedAt이 없으므로 AbstractDto를 상속하지 않고
 * id, createdAt, updatedAt을 직접 선언합니다.
 */
export class TemplateVariableDto
	implements DomainEntityModel<TemplateVariable, "templateVariableId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly templateVariableId?: never;

	@BigIntIdField({ description: "ID" })
	id!: bigint;

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

	@BigIntIdField({ description: "템플릿 ID" })
	templateId!: bigint;
}
