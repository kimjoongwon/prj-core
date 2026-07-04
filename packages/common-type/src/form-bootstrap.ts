export interface FormOptionItem {
	value: string | number | boolean | null;
	label: string;
}

export interface FormUiPaths {
	readOnlyPaths: string[];
	hiddenPaths: string[];
	disabledPaths: string[];
}

export interface FormFieldMeta {
	label?: string;
}

export interface CreateUpdateFormBootstrap<
	TForm extends Record<string, unknown> = Record<string, unknown>,
> {
	mode: "CREATE" | "UPDATE";
	defaultObject: TForm;
	options: Record<string, FormOptionItem[]>;
	ui: FormUiPaths;
	fieldMeta: Record<string, FormFieldMeta>;
}
