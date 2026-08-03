import type { JsonValue } from "@cocrepo/type";
import { AbstractEntity } from "./abstract.entity";

export class OidcClient extends AbstractEntity {
	/** 공개 식별자 ULID */
	oidcClientId!: string;

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
	isFirstParty!: boolean;
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
