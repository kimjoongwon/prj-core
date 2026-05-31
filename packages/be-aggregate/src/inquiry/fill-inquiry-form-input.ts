export interface FillInquiryFormInput {
	mode: "CREATE" | "UPDATE";
	schemaKey: string;
	selectedPaths: string[];
	currentObject: Record<string, unknown>;
	userPrompt?: string;
}
