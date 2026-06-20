import type {
	ServiceDocumentFormat,
	ServiceDocumentKind,
	ServiceDocumentPlatform,
} from "@cocrepo/prisma";

export interface CreateServiceDocumentCommandInput {
	kind: ServiceDocumentKind;
	platform?: ServiceDocumentPlatform;
	locale?: string;
	title: string;
	summary?: string;
	content: string;
	format?: ServiceDocumentFormat;
	version: string;
	isRequired?: boolean;
	displayOrder?: number;
	effectiveAt?: Date;
}
