export type OidcClientLoginUiVariant = "default" | "compact" | "branded";

export interface OidcClientLoginUi extends Record<string, unknown> {
	variant?: OidcClientLoginUiVariant;
	headline?: string;
	description?: string;
	brandLabel?: string;
	brandColor?: string;
	showIntroPanel?: boolean;
	mobileFullScreen?: boolean;
}
