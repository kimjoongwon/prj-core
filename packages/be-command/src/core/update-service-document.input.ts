import type { ServiceDocumentFormat } from "@cocrepo/prisma";

export interface UpdateServiceDocumentCommandInput {
	title?: string;
	summary?: string;
	content?: string;
	format?: ServiceDocumentFormat;
	isRequired?: boolean;
	displayOrder?: number;
	effectiveAt?: Date;
}
