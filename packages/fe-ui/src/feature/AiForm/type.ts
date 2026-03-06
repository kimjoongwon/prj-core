import type {
	AiFormFieldMeta,
	AiFormFillRequest,
	AiFormFillResponse,
	AiFormOptionItem,
	AiFormPatch,
	AiFormSchema,
	AiFormUiPaths,
} from "@cocrepo/type";

export type {
	AiFormFieldMeta,
	AiFormFillRequest,
	AiFormFillResponse,
	AiFormOptionItem,
	AiFormPatch,
	AiFormSchema,
	AiFormUiPaths,
};

export interface AiFormProps<
	TForm extends Record<string, unknown> = Record<string, unknown>,
> {
	formState: TForm;
	fieldMeta: Record<string, AiFormFieldMeta>;
	aiSchemas: AiFormSchema[];
	ui: AiFormUiPaths;
	options: Record<string, AiFormOptionItem[]>;
	onFill: (input: AiFormFillRequest<TForm>) => Promise<AiFormFillResponse>;
	applyPatch: (patches: AiFormPatch[]) => void;
	onRevalidate?: () => void;
	disabled?: boolean;
}
