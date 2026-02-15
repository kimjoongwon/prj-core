"use client";

import { observer } from "mobx-react-lite";
import { OidcConsentPanel } from "../../../widget/form/OidcConsentPanel/OidcConsentPanel";

export interface IdpConsentProps {
	/** OIDC 인터랙션 UID */
	uid: string;
	/** 클라이언트 정보 */
	client?: {
		clientId: string;
		clientName: string;
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
		const handleConfirm = async (): Promise<string | null> => {
			try {
				const response = await fetch(
					`/api/interaction/${uid}/confirm`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
					},
				);

				const data = await response.json();

				if (!response.ok) {
					return data.error || "동의 처리에 실패했습니다.";
				}

				window.location.href = data.redirectTo;
				return null;
			} catch {
				return "서버와 통신할 수 없습니다.";
			}
		};

		const handleAbort = async () => {
			try {
				const response = await fetch(
					`/api/interaction/${uid}/abort`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
					},
				);

				const data = await response.json();

				if (data.redirectTo) {
					window.location.href = data.redirectTo;
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
