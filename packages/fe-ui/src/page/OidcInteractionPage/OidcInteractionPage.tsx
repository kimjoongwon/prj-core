"use client";

import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { FormEvent, MouseEvent } from "react";
import { Button } from "../../control";
import { AlertBanner } from "../../display";
import {
	OidcConsentPanel,
	type OidcConsentPanelState,
	OidcLoginForm,
	type OidcLoginFormState,
} from "../../form";
import { AuthCard, AuthCardHeader } from "../../widget";

export interface IdpInteractionClientInfo {
	clientId: string;
	name: string;
	logoUri?: string;
}

export interface OidcInteractionPageState {
	mode: "loading" | "error" | "login" | "consent";
	client?: IdpInteractionClientInfo | null;
	isDev?: boolean;
	errorMessage?: string;
	isExpiredInteraction?: boolean;
	missingScopes: string[];
	oidcConsentPanel: OidcConsentPanelState;
	oidcLoginForm: OidcLoginFormState;
}

export interface OidcInteractionPageProps {
	state: OidcInteractionPageState;
	onSubmitLoginForm: () => void | Promise<void>;
	onAbortInteraction: () => void | Promise<void>;
	forgotPasswordHref?: string;
	onConfirmConsent: () => void | Promise<void>;
	onClickRecoveryButton?: () => void;
}

export const OidcInteractionPage = observer(
	(props: OidcInteractionPageProps) => {
		const onSubmitOidcInteractionPage = (event: FormEvent<HTMLDivElement>) => {
			event.preventDefault();
			void props.onSubmitLoginForm();
		};

		const onClickOidcInteractionAction = (
			event: MouseEvent<HTMLDivElement>,
		) => {
			if (!(event.target instanceof Element)) {
				return;
			}

			const actionElement = event.target.closest<HTMLElement>("[data-action]");
			const action = actionElement?.dataset.action;

			if (!action) {
				return;
			}

			if (action === "abort-interaction") {
				void props.onAbortInteraction();
			}

			if (action === "confirm-consent") {
				void props.onConfirmConsent();
			}
		};

		if (props.state.mode === "loading") {
			return (
				<AuthCard>
					<div className="flex flex-col items-center gap-4 py-10 text-center">
						<Spinner size="lg" />
						<div className="space-y-1">
							<p className="font-medium text-foreground">
								인증 정보를 확인하고 있습니다
							</p>
							<p className="text-sm text-default-500">잠시만 기다려 주세요.</p>
						</div>
					</div>
				</AuthCard>
			);
		}

		if (props.state.mode === "error") {
			return (
				<AuthCard variant="danger">
					<AuthCardHeader
						iconPath="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
						iconGradient="from-danger to-danger-400"
						title="인증을 이어갈 수 없습니다"
						titleClassName="text-danger"
						subtitle="세션이 만료되었거나 요청이 올바르지 않습니다."
					/>

					<AlertBanner type="danger" message={props.state.errorMessage || ""} />

					<div className="flex gap-3">
						<Button
							className="flex-1 font-semibold"
							color="primary"
							onPress={props.onClickRecoveryButton}
						>
							{props.state.isExpiredInteraction ? "다시 로그인" : "돌아가기"}
						</Button>
					</div>
				</AuthCard>
			);
		}

		if (props.state.mode === "consent") {
			return (
				<div onClickCapture={onClickOidcInteractionAction}>
					<OidcConsentPanel
						state={props.state.oidcConsentPanel}
						client={props.state.client ?? null}
						missingScopes={props.state.missingScopes}
					/>
				</div>
			);
		}

		return (
			<div
				onSubmit={onSubmitOidcInteractionPage}
				onClickCapture={onClickOidcInteractionAction}
			>
				<OidcLoginForm
					state={props.state.oidcLoginForm}
					client={props.state.client ?? null}
					isDev={props.state.isDev}
					forgotPasswordHref={props.forgotPasswordHref}
				/>
			</div>
		);
	},
);

OidcInteractionPage.displayName = "OidcInteractionPage";
