export interface UpdateServiceDocumentCommandInput {
	title?: string;
	summary?: string;
	content?: string;
	format?: any;
	isRequired?: boolean;
	displayOrder?: number;
	effectiveAt?: Date;
}
