"use client";
import {
	useAbortInteraction,
	useConfirmConsent,
} from "@cocrepo/api/idp/interaction";

import { observer } from "mobx-react-lite";
import { OidcConsentPanel } from "../../../form/OidcConsentPanel/OidcConsentPanel";

export interface IdpConsentProps {
	/** OIDC 인터랙션 UID */
	uid: string;
	/** 클라이언트 정보 */
	client?: {
		clientId: string;
		name: string;
		logoUri?: string;
	} | null;
	/** 요청된 스코프 목록 */
	missingScopes: string[];
}

/**
 * IDP 동의 Feature
 *
 * OidcConsentPanel Widget에 실제 API 호출 로직을 연결합니다.
 */
export const IdpConsent = observer(
	({ uid, client, missingScopes }: IdpConsentProps) => {
		const consentMutation = useConfirmConsent();
		const abortMutation = useAbortInteraction();

		const handleConfirm = async (): Promise<string | null> => {
			try {
				const result = await consentMutation.mutateAsync({ uid });
				window.location.href = result.redirectTo;
				return null;
			} catch {
				return "서버와 통신할 수 없습니다.";
			}
		};

		const handleAbort = async () => {
			try {
				const result = await abortMutation.mutateAsync({ uid });
				if (result.redirectTo) {
					window.location.href = result.redirectTo;
				}
			} catch {
				// 에러 무시
			}
		};

		return (
			<OidcConsentPanel
				onConfirm={handleConfirm}
				onAbort={handleAbort}
				client={client}
				missingScopes={missingScopes}
			/>
		);
	},
);

IdpConsent.displayName = "IdpConsent";
