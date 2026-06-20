"use client";
import {
	useAbortInteraction,
	useConfirmConsent,
} from "@cocrepo/api/idp/interaction";

import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { MouseEvent } from "react";
import {
	OidcConsentPanel,
	type OidcConsentPanelState,
} from "../../form/OidcConsentPanel/OidcConsentPanel";

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

type ConfirmConsentFn = (payload: {
	uid: string;
}) => Promise<{ redirectTo: string }>;

type AbortInteractionFn = (payload: {
	uid: string;
}) => Promise<{ redirectTo?: string | null }>;

class IdpConsentFeatureState {
	oidcConsentPanel: OidcConsentPanelState = {
		errorMessage: null,
		isSubmitting: false,
	};

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	async confirmConsent(uid: string, confirmConsent: ConfirmConsentFn) {
		this.oidcConsentPanel.errorMessage = null;
		this.oidcConsentPanel.isSubmitting = true;

		try {
			const result = await confirmConsent({ uid });
			return result.redirectTo;
		} catch {
			this.oidcConsentPanel.errorMessage = "서버와 통신할 수 없습니다.";
			return null;
		} finally {
			this.oidcConsentPanel.isSubmitting = false;
		}
	}

	async abortInteraction(uid: string, abortInteraction: AbortInteractionFn) {
		try {
			const result = await abortInteraction({ uid });
			return result.redirectTo ?? null;
		} catch {
			return null;
		}
	}
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
		const state = useLocalObservable(() => new IdpConsentFeatureState());

		const onConfirmConsent = async () => {
			const redirectTo = await state.confirmConsent(
				uid,
				consentMutation.mutateAsync,
			);
			if (redirectTo) {
				window.location.href = redirectTo;
			}
		};

		const onAbortInteraction = async () => {
			const redirectTo = await state.abortInteraction(
				uid,
				abortMutation.mutateAsync,
			);
			if (redirectTo) {
				window.location.href = redirectTo;
			}
		};

		const onClickIdpConsentAction = (event: MouseEvent<HTMLDivElement>) => {
			if (!(event.target instanceof Element)) {
				return;
			}

			const actionElement = event.target.closest<HTMLElement>("[data-action]");
			const action = actionElement?.dataset.action;

			if (action === "confirm-consent") {
				void onConfirmConsent();
			}

			if (action === "abort-interaction") {
				void onAbortInteraction();
			}
		};

		return (
			<div onClickCapture={onClickIdpConsentAction}>
				<OidcConsentPanel
					state={state.oidcConsentPanel}
					client={client}
					missingScopes={missingScopes}
				/>
			</div>
		);
	},
);

IdpConsent.displayName = "IdpConsent";
