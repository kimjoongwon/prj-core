import type { JsonValue } from "@cocrepo/type";
import type { OidcClient as OidcClientEntity } from "@cocrepo/prisma";

import { AbstractEntity } from "./abstract.entity";

export class OidcClient extends AbstractEntity implements OidcClientEntity {
	clientId!: string;
	clientSecret!: string | null;
	name!: string;
	redirectUris!: string[];
	loginUrl!: string | null;
	defaultReturnTo!: string | null;
	grantTypes!: string[];
	responseTypes!: string[];
	tokenEndpointAuthMethod!: string;
	scope!: string;
	isActive!: boolean;
	skipConsent!: boolean;
	loginUi!: JsonValue | null;
	logoUri!: string | null;
	policyUri!: string | null;
	tosUri!: string | null;

	isPublicClient(): boolean {
		return this.tokenEndpointAuthMethod === "none";
	}

	isConfidentialClient(): boolean {
		return this.tokenEndpointAuthMethod !== "none";
	}
}
