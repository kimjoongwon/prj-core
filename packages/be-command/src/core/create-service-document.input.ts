export interface CreateServiceDocumentCommandInput {
	kind: any;
	platform?: any;
	locale?: string;
	title: string;
	summary?: string;
	content: string;
	format?: any;
	version: string;
	isRequired?: boolean;
	displayOrder?: number;
	effectiveAt?: Date;
}
