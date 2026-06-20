import { OidcClientAggregate } from "@cocrepo/aggregate";
import { applyRuntimeManagedOidcClientConfig } from "@cocrepo/service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { getOidcClientIdCandidates } from "./get-oidc-client-id-candidates";
import type { ResolvedOidcClient } from "./resolved-oidc-client";

export async function resolveOidcClient(
	oidcClientService: OidcClientAggregate,
	clientId: string,
	options?: {
		requireActive?: boolean;
		requireAuthShell?: boolean;
	},
): Promise<ResolvedOidcClient> {
	const lookupCandidates = getOidcClientIdCandidates(clientId);
	let lastNotFoundError: NotFoundException | undefined;
	let client:
		| Awaited<
				ReturnType<OidcClientAggregate["getAuthShellClientByClientId"]>
		  >
		| Awaited<ReturnType<OidcClientAggregate["getByClientId"]>>
		| undefined;

	for (const lookupClientId of lookupCandidates) {
		try {
			client = options?.requireAuthShell
				? await oidcClientService.getAuthShellClientByClientId({
						clientId: lookupClientId,
						requireActive: options.requireActive,
					})
				: await oidcClientService.getByClientId(lookupClientId);
			break;
		} catch (error) {
			if (error instanceof NotFoundException) {
				lastNotFoundError = error;
				continue;
			}

			throw error;
		}
	}

	if (!client) {
		throw (
			lastNotFoundError ??
			new NotFoundException("OIDC 클라이언트를 찾을 수 없습니다")
		);
	}
	if (options?.requireActive !== false && !client.isActive) {
		throw new BadRequestException("비활성화된 OIDC 클라이언트입니다");
	}
	const redirectUri = client.redirectUris[0];
	if (!redirectUri) {
		throw new BadRequestException("Redirect URI가 설정되지 않았습니다");
	}

	const runtimeClient = applyRuntimeManagedOidcClientConfig({
		clientId: client.clientId,
		clientSecret: client.clientSecret,
		redirectUri,
		loginUrl: client.loginUrl,
		defaultReturnTo: client.defaultReturnTo,
		scope: client.scope,
	});
	const hasAuthShell = Boolean(
		runtimeClient.loginUrl && runtimeClient.defaultReturnTo,
	);

	if (options?.requireAuthShell && !hasAuthShell) {
		throw new BadRequestException(
			"로그인 셸 URL과 기본 복귀 URL이 설정되지 않았습니다",
		);
	}

	return {
		...runtimeClient,
		hasAuthShell,
	};
}
