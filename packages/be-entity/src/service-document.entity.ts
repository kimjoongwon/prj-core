import {
	BooleanField,
	DateFieldOptional,
	EnumField,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";

import {
	ServiceDocumentFormat,
	ServiceDocumentKind,
	ServiceDocumentPlatform,
	ServiceDocumentStatus,
} from "@cocrepo/prisma";

import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";

/**
 * ServiceDocument 엔티티
 *
 * 모바일과 web 서비스에 노출되는 약관/동의 문서의 버전 단위 객체입니다.
 */
export class ServiceDocument extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	serviceDocumentId!: string;

	@EnumField(() => ServiceDocumentKind, { description: "문서 종류" })
	kind!: ServiceDocumentKind;
	@EnumField(() => ServiceDocumentPlatform, { description: "노출 플랫폼" })
	platform!: ServiceDocumentPlatform;
	@StringField({ description: "로케일" })
	locale!: string;
	@StringField({ description: "제목" })
	title!: string;
	@StringFieldOptional({ nullable: true, description: "요약" })
	summary!: string | null;
	@StringField({ description: "본문" })
	content!: string;
	@EnumField(() => ServiceDocumentFormat, { description: "본문 형식" })
	format!: ServiceDocumentFormat;
	@StringField({ description: "버전" })
	version!: string;
	@EnumField(() => ServiceDocumentStatus, { description: "상태" })
	status!: ServiceDocumentStatus;
	@BooleanField({ description: "필수 동의 여부" })
	isRequired!: boolean;
	@NumberField({ int: true, description: "정렬 순서" })
	displayOrder!: number;
	@DateFieldOptional({ nullable: true, description: "효력 시작 시각" })
	effectiveAt!: Date | null;
	@DateFieldOptional({ nullable: true, description: "게시 시각" })
	publishedAt!: Date | null;

	isPublished(): boolean {
		return this.status === "PUBLISHED" && this.removedAt === null;
	}

	isDraft(): boolean {
		return this.status === "DRAFT" && this.removedAt === null;
	}
}
