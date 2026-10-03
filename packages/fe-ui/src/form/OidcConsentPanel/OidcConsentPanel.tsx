"use client";

import {
	DEFAULT_SCOPE_ICON,
	SCOPE_ICONS,
	SCOPE_LABELS,
} from "@cocrepo/constant";
import type { OidcClientLoginUi } from "@cocrepo/type";
import { ShieldCheck } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Typography } from "../../data-display/Typography";
import { Alert } from "../../feedback/Alert/Alert";
import { useT } from "../../i18n";
import { Button } from "../../input";
import { Auth } from "../../layout/Auth";
import { HStack } from "../../rhythm";

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
		loginUi?: OidcClientLoginUi | null;
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
		const t = useT();
		const brandLabel = client?.loginUi?.brandLabel?.trim() || client?.name;

		return (
			<Auth.Panel>
				<Auth.PanelHeader
					icon={<ShieldCheck className="h-6 w-6 text-success" />}
					title={brandLabel || "애플리케이션"}
					subtitle="요청한 서비스 이용에 필요한 접근 권한을 확인해 주세요"
					logoUri={client?.logoUri}
					logoAlt={client?.name}
				/>

				{/* 에러 메시지 */}
				{state.errorMessage && (
					<Alert status="danger" description={state.errorMessage} />
				)}

				{/* 요청된 권한 목록 */}
				<div className="mb-6 rounded-xl border border-border bg-surface-secondary p-4">
					{/* 권한 목록의 시맨틱 헤딩은 h3 요소를 유지하고 텍스트는 Typography로 표현한다. */}
					<h3 className="mb-3">
						<Typography type="body-sm" weight="medium">
							{t("요청된 권한")}
						</Typography>
					</h3>
					{/* raw space-y 예외: 시맨틱 ul/li 목록 구조를 유지해야 해서 VStack(div)으로 대체하지 않음 */}
					<ul className="space-y-3">
						{missingScopes.map((scope) => (
							<li key={scope} className="flex min-w-0 items-center">
								<div className="w-8 h-8 rounded-lg bg-accent/20 flex shrink-0 items-center justify-center mr-3">
									<svg
										className="w-4 h-4 text-accent"
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
								<Typography
									className="min-w-0 break-words"
									type="body-sm"
									weight="medium"
								>
									{SCOPE_LABELS[scope] ? t(SCOPE_LABELS[scope]) : scope}
								</Typography>
							</li>
						))}
					</ul>
				</div>

				{/* 액션 버튼 */}
				<HStack gap="section" className="flex-col sm:flex-row">
					<Button
						type="button"
						data-action="confirm-consent"
						variant="tertiary"
						className="flex-1 font-semibold"
						size="lg"
						isLoading={state.isSubmitting}
					>
						허용
					</Button>
					<Button
						type="button"
						data-action="abort-interaction"
						variant="tertiary"
						className="flex-1 font-semibold"
						size="lg"
					>
						거부
					</Button>
				</HStack>

				{/* 개인정보 안내 */}
				<Typography
					className="mt-6"
					align="center"
					type="body-xs"
					color="muted"
				>
					{t("허용하면 서비스 이용에 필요한 정보가")}{" "}
					{client?.name || t("애플리케이션")}
					{t("과(와) 공유됩니다.")}
				</Typography>
			</Auth.Panel>
		);
	},
);

OidcConsentPanel.displayName = "OidcConsentPanel";
