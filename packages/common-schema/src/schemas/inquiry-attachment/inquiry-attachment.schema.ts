import { AttachmentFileType } from "@cocrepo/enum";
import {
	BigIntIdValidation,
	BooleanValidation,
	EnumValidation,
	NumberValidation,
	StringValidation,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** InquiryAttachment의 DB 필드 타입과 공통 검증입니다. */
export class InquiryAttachmentSchema
	extends PickSchemaType(AbstractSchema, ["id", "createdAt"] as const)
{
	inquiryAttachmentId!: string;

	declare id: bigint;

	declare createdAt: Date;

	@BigIntIdValidation({ description: "소속 메시지 ID" })
	messageId!: bigint;

	@StringValidation({ description: "원본 파일명" })
	fileName!: string;

	@NumberValidation({ description: "파일 크기" })
	fileSize!: bigint;

	@StringValidation({ description: "MIME 타입" })
	mimeType!: string;

	@EnumValidation(() => AttachmentFileType, { description: "파일 유형" })
	fileType!: AttachmentFileType;

	@StringValidation({ description: "파일 URL" })
	url!: string;

	@StringValidation({ nullable: true, description: "썸네일 URL" })
	thumbnailUrl!: string | null;

	@NumberValidation({ nullable: true, description: "이미지 너비" })
	width!: number | null;

	@NumberValidation({ nullable: true, description: "이미지 높이" })
	height!: number | null;

	@NumberValidation({ nullable: true, description: "재생 시간 (초)" })
	duration!: number | null;

	@BooleanValidation({ description: "삭제 여부" })
	isDeleted!: boolean;
}
