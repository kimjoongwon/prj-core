import { OmitType, PartialType } from "@nestjs/swagger";

import { CreateTemplateDto } from "../create/create-template.dto";

/**
 * 메시지 템플릿 수정 DTO
 *
 * - code, type은 수정 불가
 * - 나머지 필드는 모두 선택적
 */
export class UpdateTemplateDto extends PartialType(
	OmitType(CreateTemplateDto, ["code", "type"]),
) {}
