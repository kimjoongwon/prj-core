export interface AiFormPatch {
	path: string;
	value: unknown;
}

export interface AiFormOptionItem {
	value: string | number | boolean | null;
	label: string;
}

export interface AiFormUiPaths {
	readOnlyPaths: string[];
	hiddenPaths: string[];
	disabledPaths: string[];
}

export interface AiFormFieldAiMeta {
	fillable: boolean;
	defaultChecked?: boolean;
	reason?: string;
}

export interface AiFormFieldMeta {
	label?: string;
	ai?: AiFormFieldAiMeta;
}

export interface AiFormSchema {
	key: string;
	label: string;
	paths: string[];
	description?: string;
}

export interface AiFormFillRequest<
	TForm extends Record<string, unknown> = Record<string, unknown>,
> {
	schemaKey: string;
	selectedPaths: string[];
	currentObject: TForm;
	userPrompt?: string;
}

export interface AiFormFillResponse {
	patches: AiFormPatch[];
}

export interface CreateUpdateFormBootstrap<
	TForm extends Record<string, unknown> = Record<string, unknown>,
> {
	mode: "CREATE" | "UPDATE";
	defaultObject: TForm;
	options: Record<string, AiFormOptionItem[]>;
	ui: AiFormUiPaths;
	fieldMeta: Record<string, AiFormFieldMeta>;
	aiSchemas: AiFormSchema[];
}
