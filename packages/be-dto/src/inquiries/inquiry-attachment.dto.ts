import {
	BooleanField,
	NumberField,
	StringField,
	ULIDField,
} from "@cocrepo/decorator";
import { AbstractDto } from "../abstract.dto";

/**
 * 메시지 첨부파일 DTO
 */
export class InquiryAttachmentDto extends AbstractDto {
	@ULIDField({ description: "소속 메시지 ID" })
	messageId!: string;

	@StringField({ description: "원본 파일명" })
	fileName!: string;

	@NumberField({ description: "파일 크기 (bytes)" })
	fileSize!: number;

	@StringField({ description: "MIME 타입" })
	mimeType!: string;

	@StringField({ description: "파일 URL" })
	url!: string;

	@StringField({ nullable: true, description: "썸네일 URL" })
	thumbnailUrl!: string | null;

	@NumberField({ nullable: true, description: "이미지 너비" })
	width!: number | null;

	@NumberField({ nullable: true, description: "이미지 높이" })
	height!: number | null;

	@NumberField({ nullable: true, description: "재생 시간 (초)" })
	duration!: number | null;

	@BooleanField({ description: "삭제 여부" })
	isDeleted!: boolean;
}
