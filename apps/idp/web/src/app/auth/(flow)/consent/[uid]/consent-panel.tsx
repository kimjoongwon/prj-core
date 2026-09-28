"use client";

import {
	useAbortInteraction,
	useConfirmConsent,
} from "@cocrepo/api/idp/interaction";
import type { OidcClientLoginUi } from "@cocrepo/type";
import { OidcConsentPanel } from "@cocrepo/ui";
import { makeAutoObservable, runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { MouseEvent } from "react";

export interface ConsentInteractionClientInfo {
	clientId: string;
	name: string;
	logoUri?: string;
	loginUi?: OidcClientLoginUi | null;
}

export interface ConsentInteractionPanelProps {
	uid: string;
	client: ConsentInteractionClientInfo | null;
	missingScopes: string[];
}

class ConsentInteractionPanelState {
	errorMessage: string | null = null;
	isSubmitting = false;

	constructor() {
		makeAutoObservable(this);
	}

	async confirmConsent(request: () => Promise<string>) {
		this.errorMessage = null;
		this.isSubmitting = true;

		try {
			return await request();
		} catch {
			runInAction(() => {
				this.errorMessage = "서버와 통신할 수 없습니다.";
			});
			return null;
		} finally {
			runInAction(() => {
				this.isSubmitting = false;
			});
		}
	}

	async abortInteraction(request: () => Promise<string | null>) {
		try {
			return await request();
		} catch {
			return null;
		}
	}
}

/**
 * 동의 interaction 패널 — 서버 컴포넌트가 계산한 누락 scope 목록을 받아
 * 허용/거부를 같은 origin API로 제출한다.
 */
export const ConsentInteractionPanel = observer(
	(props: ConsentInteractionPanelProps) => {
		const consentPanel = useLocalObservable(
			() => new ConsentInteractionPanelState(),
		);
		const consentMutation = useConfirmConsent();
		const abortMutation = useAbortInteraction();

		const onClickConsentAction = async (event: MouseEvent<HTMLDivElement>) => {
			if (!(event.target instanceof Element)) {
				return;
			}

			const actionElement = event.target.closest<HTMLElement>("[data-action]");
			const action = actionElement?.dataset.action;
			if (action !== "confirm-consent" && action !== "abort-interaction") {
				return;
			}

			if (action === "confirm-consent") {
				const redirectTo = await consentPanel.confirmConsent(async () => {
					const result = await consentMutation.mutateAsync({ uid: props.uid });
					return result.redirectTo;
				});

				if (redirectTo) {
					window.location.href = redirectTo;
				}
				return;
			}

			const redirectTo = await consentPanel.abortInteraction(async () => {
				const result = await abortMutation.mutateAsync({ uid: props.uid });
				return result.redirectTo ?? null;
			});

			if (redirectTo) {
				window.location.href = redirectTo;
			}
		};

		return (
			<div onClickCapture={onClickConsentAction}>
				<OidcConsentPanel
					state={consentPanel}
					client={props.client}
					missingScopes={props.missingScopes}
				/>
			</div>
		);
	},
);

ConsentInteractionPanel.displayName = "ConsentInteractionPanel";
