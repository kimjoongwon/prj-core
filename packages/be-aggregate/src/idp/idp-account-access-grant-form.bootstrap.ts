import type { IdpAccountAccessGrantFormOptionItem } from "./idp-account-access-grant-form-option.item";

export interface IdpAccountAccessGrantFormBootstrap {
	mode: "CREATE";
	defaultObject: Record<string, unknown>;
	options: Record<string, IdpAccountAccessGrantFormOptionItem[]>;
	ui: {
		readOnlyPaths: string[];
		hiddenPaths: string[];
		disabledPaths: string[];
	};
	fieldMeta: Record<string, { label?: string }>;
	aiSchemas: Array<{
		key: string;
		label: string;
		paths: string[];
	}>;
}
