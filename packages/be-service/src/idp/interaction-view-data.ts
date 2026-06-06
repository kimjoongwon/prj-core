import type { Interaction, OidcClientInfo } from "../oidc/types";

export interface InteractionViewData {
	uid: string;
	client?: OidcClientInfo;
	prompt?: Interaction["prompt"];
	params?: Interaction["params"];
	session?: Interaction["session"];
	error?: string | null;
}
