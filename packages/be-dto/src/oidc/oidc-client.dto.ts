import { OidcClient } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types";

export class OidcClientDto extends EntityResponseType(OidcClient, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"clientId",
		"clientSecret",
		"name",
		"redirectUris",
		"loginUrl",
		"defaultReturnTo",
		"grantTypes",
		"responseTypes",
		"tokenEndpointAuthMethod",
		"scope",
		"isActive",
		"isFirstParty",
		"skipConsent",
		"loginUi",
		"logoUri",
		"policyUri",
		"tosUri",
	] as const,
}) {}
