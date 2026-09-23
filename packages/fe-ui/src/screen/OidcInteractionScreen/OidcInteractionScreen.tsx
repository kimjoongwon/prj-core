"use client";

import type { OidcClientLoginUi } from "@cocrepo/type";
import { Spinner } from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { FormEvent, MouseEvent } from "react";
import { useEffect, useState } from "react";
import { Alert } from "../../feedback";
import {
	OidcConsentPanel,
	type OidcConsentPanelState,
	OidcLoginForm,
	type OidcLoginFormState,
} from "../../form";
import { useT } from "../../i18n";
import { Button } from "../../input";
import { Auth } from "../../layout/Auth";

export interface IdpInteractionClientInfo {
	clientId: string;
	name: string;
	logoUri?: string;
	loginUi?: OidcClientLoginUi | null;
}

export interface OidcInteractionScreenState {
	mode: "loading" | "error" | "login" | "consent";
	client?: IdpInteractionClientInfo | null;
	isDev?: boolean;
	errorMessage?: string;
	isExpiredInteraction?: boolean;
	missingScopes: string[];
	oidcConsentPanel: OidcConsentPanelState;
	oidcLoginForm: OidcLoginFormState;
}

export interface OidcInteractionScreenProps {
	state: OidcInteractionScreenState;
	onSubmitLoginForm: () => void | Promise<void>;
	onAbortInteraction: () => void | Promise<void>;
	forgotPasswordHref?: string;
	signUpHref?: string;
	onConfirmConsent: () => void | Promise<void>;
	onClickRecoveryButton?: () => void;
}

export const OidcInteractionScreen = observer(
	(props: OidcInteractionScreenProps) => {
		const t = useT();
		const [showLoadingRecovery, setShowLoadingRecovery] = useState(false);
		// 짧은 로딩(로컬 데이터 페치는 수십 ms)에도 스피너가 페인트되면 화면이
		// 깜빡이는 것처럼 보인다 — 유예 시간 동안은 아무것도 그리지 않다가,
		// 그래도 로딩이면 그때 준비 화면을 노출한다.
		const [isLoadingPanelVisible, setIsLoadingPanelVisible] = useState(false);
		const shouldFocusAuthPanel = Boolean(
			props.state.client?.loginUi?.mobileFullScreen ||
				props.state.client?.loginUi?.showIntroPanel === false,
		);

		useEffect(() => {
			if (props.state.mode !== "loading") {
				setIsLoadingPanelVisible(false);
			}
		}, [props.state.mode]);

		useEffect(() => {
			if (props.state.mode !== "loading") {
				return;
			}

			const graceTimeoutId = window.setTimeout(
				() => setIsLoadingPanelVisible(true),
				350,
			);

			return () => {
				window.clearTimeout(graceTimeoutId);
			};
		}, [props.state.mode]);

		useEffect(() => {
			if (props.state.mode !== "loading") {
				setShowLoadingRecovery(false);
				return;
			}

			const timeoutId = window.setTimeout(() => {
				setShowLoadingRecovery(true);
			}, 4000);

			return () => {
				window.clearTimeout(timeoutId);
			};
		}, [props.state.mode]);

		const onClickLoadingRecoveryButton = () => {
			props.onClickRecoveryButton?.();
		};

		const focusedAuthLayoutStyle = shouldFocusAuthPanel ? (
			<style>
				{`
					.idp-auth-intro-panel { display: none; }
					.idp-auth-layout-grid {
						grid-template-columns: minmax(0, 440px);
						justify-content: center;
					}
				`}
			</style>
		) : null;
		const onSubmitOidcInteractionScreen = (
			event: FormEvent<HTMLDivElement>,
		) => {
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
			if (!isLoadingPanelVisible) {
				return null;
			}

			return (
				<Auth.Panel>
					<div className="flex flex-col items-center gap-5 py-10 text-center">
						<Spinner size="lg" />
						<div className="space-y-1">
							<p className="font-medium text-foreground">
								{t("로그인 화면을 준비하고 있어요")}
							</p>
							<p className="text-sm text-muted">
								{t("잠시 후 안전한 인증 화면으로 이동합니다.")}
							</p>
						</div>
						{showLoadingRecovery && props.onClickRecoveryButton ? (
							<Button
								className="min-h-11 w-full font-semibold sm:w-auto sm:min-w-40"
								variant="tertiary"
								onPress={onClickLoadingRecoveryButton}
							>
								{t("다시 시도")}
							</Button>
						) : null}
					</div>
				</Auth.Panel>
			);
		}

		if (props.state.mode === "error") {
			return (
				<Auth.Panel variant="danger">
					<Auth.PanelHeader
						icon={<AlertTriangle className="h-6 w-6 text-danger" />}
						title="인증을 이어갈 수 없습니다"
						titleClassName="text-danger"
						subtitle="세션이 만료되었거나 요청이 올바르지 않습니다."
					/>

					<Alert status="danger" description={props.state.errorMessage || ""} />

					<div className="flex gap-3">
						<Button
							className="flex-1 font-semibold"
							variant="primary"
							onPress={props.onClickRecoveryButton}
						>
							{props.state.isExpiredInteraction
								? t("다시 로그인")
								: t("돌아가기")}
						</Button>
					</div>
				</Auth.Panel>
			);
		}

		if (props.state.mode === "consent") {
			return (
				<>
					{focusedAuthLayoutStyle}
					<div onClickCapture={onClickOidcInteractionAction}>
						<OidcConsentPanel
							state={props.state.oidcConsentPanel}
							client={props.state.client ?? null}
							missingScopes={props.state.missingScopes}
						/>
					</div>
				</>
			);
		}

		return (
			<>
				{focusedAuthLayoutStyle}
				<div
					onSubmit={onSubmitOidcInteractionScreen}
					onClickCapture={onClickOidcInteractionAction}
				>
					<OidcLoginForm
						state={props.state.oidcLoginForm}
						client={props.state.client ?? null}
						isDev={props.state.isDev}
						forgotPasswordHref={props.forgotPasswordHref}
						signUpHref={props.signUpHref}
					/>
				</div>
			</>
		);
	},
);

OidcInteractionScreen.displayName = "OidcInteractionScreen";
