import type { InquiryFormFieldMeta } from "./inquiry-form-field-meta";
import type { InquiryFormOptionItem } from "./inquiry-form-option-item";
import type { InquiryFormSchema } from "./inquiry-form-schema";
import type { InquiryFormUiPaths } from "./inquiry-form-ui-paths";

export interface InquiryCreateUpdateFormBootstrap {
	mode: "CREATE" | "UPDATE";
	defaultObject: Record<string, unknown>;
	options: Record<string, InquiryFormOptionItem[]>;
	ui: InquiryFormUiPaths;
	fieldMeta: Record<string, InquiryFormFieldMeta>;
	aiSchemas: InquiryFormSchema[];
}
