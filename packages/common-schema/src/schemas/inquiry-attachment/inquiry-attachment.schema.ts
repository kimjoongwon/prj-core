import { AttachmentFileType } from "@cocrepo/enum";
import type { InquiryAttachment as PrismaInquiryAttachment } from "@cocrepo/prisma";
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
	implements PrismaInquiryAttachment
{
	inquiryAttachmentId!: PrismaInquiryAttachment["inquiryAttachmentId"];

	declare id: PrismaInquiryAttachment["id"];

	declare createdAt: PrismaInquiryAttachment["createdAt"];

	@BigIntIdValidation({ description: "소속 메시지 ID" })
	messageId!: PrismaInquiryAttachment["messageId"];

	@StringValidation({ description: "원본 파일명" })
	fileName!: PrismaInquiryAttachment["fileName"];

	@NumberValidation({ description: "파일 크기" })
	fileSize!: PrismaInquiryAttachment["fileSize"];

	@StringValidation({ description: "MIME 타입" })
	mimeType!: PrismaInquiryAttachment["mimeType"];

	@EnumValidation(() => AttachmentFileType, { description: "파일 유형" })
	fileType!: PrismaInquiryAttachment["fileType"];

	@StringValidation({ description: "파일 URL" })
	url!: PrismaInquiryAttachment["url"];

	@StringValidation({ nullable: true, description: "썸네일 URL" })
	thumbnailUrl!: PrismaInquiryAttachment["thumbnailUrl"];

	@NumberValidation({ nullable: true, description: "이미지 너비" })
	width!: PrismaInquiryAttachment["width"];

	@NumberValidation({ nullable: true, description: "이미지 높이" })
	height!: PrismaInquiryAttachment["height"];

	@NumberValidation({ nullable: true, description: "재생 시간 (초)" })
	duration!: PrismaInquiryAttachment["duration"];

	@BooleanValidation({ description: "삭제 여부" })
	isDeleted!: PrismaInquiryAttachment["isDeleted"];
}
