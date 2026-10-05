import type {
	ServiceDocumentKind,
	ServiceDocumentPlatform,
	ServiceDocumentStatus,
} from "@cocrepo/prisma";

export interface GetServiceDocumentsQueryInput {
	search?: string;
	kind?: ServiceDocumentKind;
	platform?: ServiceDocumentPlatform;
	status?: ServiceDocumentStatus;
	locale?: string;
	isRequired?: boolean;
	sort?: string[];
	skip?: number;
	take?: number;
}
