import {
	BooleanField,
	EnumField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import { type Template, TemplateType } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";

import { AbstractDto } from "../abstract.dto";

/**
 * 메시지 템플릿 응답 DTO
 */
export class TemplateDto
	extends AbstractDto
	implements DomainEntityModel<Template, "templateId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly templateId?: never;

	@StringField({ description: "고유 코드" })
	code!: string;

	@StringField({ description: "템플릿 이름" })
	name!: string;

	@EnumField(() => TemplateType, { description: "템플릿 유형" })
	type!: TemplateType;

	@StringFieldOptional({ nullable: true, description: "제목" })
	subject!: string | null;

	@StringField({ description: "본문" })
	content!: string;

	@StringFieldOptional({ nullable: true, description: "설명" })
	description!: string | null;

	@BooleanField({ description: "활성 상태" })
	isActive!: boolean;
}
