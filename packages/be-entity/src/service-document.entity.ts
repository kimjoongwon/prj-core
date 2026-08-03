import type {
	ServiceDocumentFormat,
	ServiceDocumentKind,
	ServiceDocumentPlatform,
	ServiceDocumentStatus,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";

/**
 * ServiceDocument 엔티티
 *
 * 모바일과 web 서비스에 노출되는 약관/동의 문서의 버전 단위 객체입니다.
 */
export class ServiceDocument extends AbstractEntity {
	/** 공개 식별자 ULID */
	serviceDocumentId!: string;

	kind!: ServiceDocumentKind;
	platform!: ServiceDocumentPlatform;
	locale!: string;
	title!: string;
	summary!: string | null;
	content!: string;
	format!: ServiceDocumentFormat;
	version!: string;
	status!: ServiceDocumentStatus;
	isRequired!: boolean;
	displayOrder!: number;
	effectiveAt!: Date | null;
	publishedAt!: Date | null;

	isPublished(): boolean {
		return this.status === "PUBLISHED" && this.removedAt === null;
	}

	isDraft(): boolean {
		return this.status === "DRAFT" && this.removedAt === null;
	}
}
