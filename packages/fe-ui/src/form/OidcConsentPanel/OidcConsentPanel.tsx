"use client";

import {
	DEFAULT_SCOPE_ICON,
	SCOPE_ICONS,
	SCOPE_LABELS,
} from "@cocrepo/constant";
import { observer } from "mobx-react-lite";
import { Button } from "../../control";
import { AlertBanner } from "../../display/feedback/AlertBanner/AlertBanner";
import { AuthCard } from "../../widget/AuthCard/AuthCard";
import { AuthCardHeader } from "../../widget/AuthCard/AuthCardHeader";

export interface OidcConsentPanelState {
	errorMessage: string | null;
	isSubmitting: boolean;
}

export interface OidcConsentPanelProps {
	state: OidcConsentPanelState;
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
 * OIDC 동의(Consent) 패널 Widget
 *
 * 클라이언트가 요청하는 권한 목록을 표시하고, 허용/거부를 선택할 수 있습니다.
 */
export const OidcConsentPanel = observer(
	({ state, client, missingScopes }: OidcConsentPanelProps) => {
		return (
			<AuthCard>
				<AuthCardHeader
					iconPath="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					iconGradient="from-success to-secondary"
					title={client?.name || "애플리케이션"}
					subtitle="서비스 연동을 위해 아래 접근 권한을 확인해 주세요"
					logoUri={client?.logoUri}
					logoAlt={client?.name}
				/>

				{/* 에러 메시지 */}
				{state.errorMessage && (
					<AlertBanner type="danger" message={state.errorMessage} />
				)}

				{/* 요청된 권한 목록 */}
				<div className="mb-6 rounded-xl border border-slate-200/70 bg-slate-100/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
					<h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
						요청된 권한
					</h3>
					<ul className="space-y-3">
						{missingScopes.map((scope) => (
							<li key={scope} className="flex items-center">
								<div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-3">
									<svg
										className="w-4 h-4 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d={SCOPE_ICONS[scope] || DEFAULT_SCOPE_ICON}
										/>
									</svg>
								</div>
								<p className="text-foreground font-medium">
									{SCOPE_LABELS[scope] || scope}
								</p>
							</li>
						))}
					</ul>
				</div>

				{/* 액션 버튼 */}
				<div className="flex gap-4">
					<Button
						type="button"
						data-action="confirm-consent"
						color="success"
						className="flex-1 font-semibold"
						size="lg"
						isLoading={state.isSubmitting}
					>
						허용
					</Button>
					<Button
						type="button"
						data-action="abort-interaction"
						variant="flat"
						className="flex-1 font-semibold"
						size="lg"
					>
						거부
					</Button>
				</div>

				{/* 개인정보 안내 */}
				<p className="text-center text-default-400 text-xs mt-6">
					허용하면 예약 조회와 계정 연동에 필요한 정보가{" "}
					{client?.name || "애플리케이션"}과(와) 공유됩니다.
				</p>
			</AuthCard>
		);
	},
);

OidcConsentPanel.displayName = "OidcConsentPanel";
