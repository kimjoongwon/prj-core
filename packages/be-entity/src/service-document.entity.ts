import {
	BooleanFieldMetadata,
	DateFieldOptionalMetadata,
	EnumFieldMetadata,
	NumberFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import {
	ServiceDocumentFormat,
	ServiceDocumentKind,
	ServiceDocumentPlatform,
	ServiceDocumentStatus,
} from "@cocrepo/enum";
import { ServiceDocumentSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";

/**
 * ServiceDocument 엔티티
 *
 * 모바일과 web 서비스에 노출되는 약관/동의 문서의 버전 단위 객체입니다.
 */
@AbstractEntityFields()
export class ServiceDocument extends ServiceDocumentSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare serviceDocumentId: ServiceDocumentSchema["serviceDocumentId"];

	@EnumFieldMetadata(() => ServiceDocumentKind, { description: "문서 종류" })
	declare kind: ServiceDocumentSchema["kind"];
	@EnumFieldMetadata(() => ServiceDocumentPlatform, {
		description: "노출 플랫폼",
	})
	declare platform: ServiceDocumentSchema["platform"];
	@StringFieldMetadata({ description: "로케일" })
	declare locale: ServiceDocumentSchema["locale"];
	@StringFieldMetadata({ description: "제목" })
	declare title: ServiceDocumentSchema["title"];
	@StringFieldOptionalMetadata({ nullable: true, description: "요약" })
	declare summary: ServiceDocumentSchema["summary"];
	@StringFieldMetadata({ description: "본문" })
	declare content: ServiceDocumentSchema["content"];
	@EnumFieldMetadata(() => ServiceDocumentFormat, { description: "본문 형식" })
	declare format: ServiceDocumentSchema["format"];
	@StringFieldMetadata({ description: "버전" })
	declare version: ServiceDocumentSchema["version"];
	@EnumFieldMetadata(() => ServiceDocumentStatus, { description: "상태" })
	declare status: ServiceDocumentSchema["status"];
	@BooleanFieldMetadata({ description: "필수 동의 여부" })
	declare isRequired: ServiceDocumentSchema["isRequired"];
	@NumberFieldMetadata({ int: true, description: "정렬 순서" })
	declare displayOrder: ServiceDocumentSchema["displayOrder"];
	@DateFieldOptionalMetadata({ nullable: true, description: "효력 시작 시각" })
	declare effectiveAt: ServiceDocumentSchema["effectiveAt"];
	@DateFieldOptionalMetadata({ nullable: true, description: "게시 시각" })
	declare publishedAt: ServiceDocumentSchema["publishedAt"];

	isPublished(): boolean {
		return this.status === "PUBLISHED" && this.removedAt === null;
	}

	isDraft(): boolean {
		return this.status === "DRAFT" && this.removedAt === null;
	}
}
