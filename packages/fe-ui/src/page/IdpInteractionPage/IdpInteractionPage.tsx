"use client";

import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Button } from "../../control";
import { AlertBanner } from "../../display";
import {
	type LoginErrorResponse,
	OidcConsentPanel,
	OidcLoginForm,
} from "../../form";
import { AuthCard, AuthCardHeader } from "../../widget";

export interface IdpInteractionClientInfo {
	clientId: string;
	clientName: string;
	logoUri?: string;
}

type IdpInteractionLoadingProps = {
	mode: "loading";
};

type IdpInteractionErrorProps = {
	mode: "error";
	errorMessage: string;
	isExpiredInteraction: boolean;
	onClickRecoveryButton: () => void;
};

type IdpInteractionLoginProps = {
	mode: "login";
	client?: IdpInteractionClientInfo | null;
	isDev?: boolean;
	onSubmitLogin: (data: {
		email: string;
		password: string;
		remember: boolean;
	}) => Promise<LoginErrorResponse | null>;
	onAbortInteraction: () => void;
};

type IdpInteractionConsentProps = {
	mode: "consent";
	client?: IdpInteractionClientInfo | null;
	missingScopes: string[];
	onConfirmConsent: () => Promise<string | null>;
	onAbortInteraction: () => void;
};

export type IdpInteractionPageProps =
	| IdpInteractionLoadingProps
	| IdpInteractionErrorProps
	| IdpInteractionLoginProps
	| IdpInteractionConsentProps;

export const IdpInteractionPage = observer((props: IdpInteractionPageProps) => {
	if (props.mode === "loading") {
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

	if (props.mode === "error") {
		return (
			<AuthCard variant="danger">
				<AuthCardHeader
					iconPath="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
					iconGradient="from-danger to-danger-400"
					title="인증을 이어갈 수 없습니다"
					titleClassName="text-danger"
					subtitle="세션이 만료되었거나 요청이 올바르지 않습니다."
				/>

				<AlertBanner type="danger" message={props.errorMessage} />

				<div className="flex gap-3">
					<Button
						className="flex-1 font-semibold"
						color="primary"
						onPress={props.onClickRecoveryButton}
					>
						{props.isExpiredInteraction ? "다시 로그인" : "돌아가기"}
					</Button>
				</div>
			</AuthCard>
		);
	}

	if (props.mode === "consent") {
		return (
			<OidcConsentPanel
				onConfirm={props.onConfirmConsent}
				onAbort={props.onAbortInteraction}
				client={props.client ?? null}
				missingScopes={props.missingScopes}
			/>
		);
	}

	return (
		<OidcLoginForm
			onSubmit={props.onSubmitLogin}
			onAbort={props.onAbortInteraction}
			client={props.client ?? null}
			isDev={props.isDev}
		/>
	);
});

IdpInteractionPage.displayName = "IdpInteractionPage";
