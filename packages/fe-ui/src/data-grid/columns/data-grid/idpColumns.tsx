"use client";

import type { AuthAuditLogDto, AuthAuditResult } from "@cocrepo/api/idp/auth";
import type { EmailVerificationDto } from "@cocrepo/api/idp/email-verifications";
import type { IdpAccountDto } from "@cocrepo/api/idp/idp-accounts";
import type { OidcClientDto } from "@cocrepo/api/idp/oidc-clients";
import type { OidcSessionDto } from "@cocrepo/api/idp/oidc-sessions";
import { AlertDialog } from "@heroui/react";
import { Ban, Send } from "lucide-react";
import type { ReactNode } from "react";
import { Chip } from "../../../data-display/Chip/Chip";
import { Button } from "../../../input/Button/Button";
import { Link as HeroLink } from "../../../input/Link/Link";
import {
	ActionButtonCell,
	ChipCell,
	DateTimeCell,
	DefaultCell,
	ExpiryCell,
	RowActionsCell,
} from "../../cell";
import {
	buildColumns,
	buildColumnsWithDefaultCreatedAt,
	createActionsColumn,
	createCreatedAtColumn,
	createEmailColumn,
	createIsActiveColumn,
	createNameColumn,
	createPresetColumn,
	defineColumn,
} from "./dataGridFactory";
import { COLUMN_FIELDS } from "./fieldPresets";

const EMAIL_VERIFICATION_STATUS_CONFIG = {
	PENDING: { label: "대기", color: "warning" },
	VERIFIED: { label: "인증 완료", color: "success" },
	EXPIRED: { label: "만료", color: "danger" },
} as const;

const EMAIL_SEND_STATUS_CONFIG = {
	SUCCESS: { label: "성공", color: "success" },
	FAILURE: { label: "실패", color: "danger" },
} as const;

const AUTH_METHOD_CONFIG = {
	client_secret_basic: { label: "Basic", color: "primary" },
	client_secret_post: { label: "Post", color: "secondary" },
	none: { label: "None (Public)", color: "warning" },
} as const;

const GRANT_TYPE_LABEL: Record<string, string> = {
	authorization_code: "Auth Code",
	client_credentials: "Client Cred",
	refresh_token: "Refresh",
};

const AUDIT_RESULT_CONFIG = {
	SUCCESS: { label: "성공", color: "success" },
	FAILURE: { label: "실패", color: "danger" },
	LOCKED: { label: "잠금", color: "warning" },
} as const;

const MODEL_TYPE_CONFIG = {
	AccessToken: { label: "Access Token", color: "primary" },
	RefreshToken: { label: "Refresh Token", color: "secondary" },
	AuthorizationCode: { label: "Auth Code", color: "warning" },
	Session: { label: "Session", color: "success" },
	Grant: { label: "Grant", color: "default" },
	ClientCredentials: { label: "Client Cred", color: "primary" },
	DeviceCode: { label: "Device Code", color: "warning" },
	Interaction: { label: "Interaction", color: "success" },
} as const;

function AlertDialogActionCell({
	title,
	description,
	confirmLabel,
	triggerLabel,
	status = "danger",
	triggerColor = "danger",
	triggerVariant = "flat",
	startContent,
	isDisabled,
	className,
	tooltip,
	onConfirm,
}: {
	title: string;
	description: string;
	confirmLabel: string;
	triggerLabel: ReactNode;
	status?: "accent" | "success" | "warning" | "danger";
	triggerColor?: "default" | "primary" | "success" | "warning" | "danger";
	triggerVariant?: "flat" | "light" | "bordered" | "solid";
	startContent?: ReactNode;
	isDisabled?: boolean;
	className?: string;
	tooltip?: string;
	onConfirm: () => void | Promise<void>;
}) {
	if (isDisabled) {
		return (
			<ActionButtonCell
				variant={triggerColor === "danger" ? "danger-soft" : triggerVariant === "solid" ? "primary" : triggerVariant === "bordered" ? "outline" : "ghost"}
				isDisabled
				className={className}
				aria-label={tooltip}
			>
				{startContent}
				{triggerLabel}
			</ActionButtonCell>
		);
	}

	return (
		<AlertDialog>
			<AlertDialog.Trigger>
				<ActionButtonCell
					variant={triggerColor === "danger" ? "danger-soft" : triggerVariant === "solid" ? "primary" : triggerVariant === "bordered" ? "outline" : "ghost"}
					isDisabled={isDisabled}
					className={className}
					aria-label={tooltip}
				>
					{startContent}
					{triggerLabel}
				</ActionButtonCell>
			</AlertDialog.Trigger>
			<AlertDialog.Backdrop>
				<AlertDialog.Container size="sm">
					<AlertDialog.Dialog>
						<AlertDialog.Header>
							<AlertDialog.Icon status={status} />
							<AlertDialog.Heading>{title}</AlertDialog.Heading>
						</AlertDialog.Header>
						<AlertDialog.Body>{description}</AlertDialog.Body>
						<AlertDialog.Footer>
							<Button variant="ghost">
								취소
							</Button>
							<Button variant={triggerColor === "danger" ? "danger" : "primary"} onPress={onConfirm}>
								{confirmLabel}
							</Button>
						</AlertDialog.Footer>
					</AlertDialog.Dialog>
				</AlertDialog.Container>
			</AlertDialog.Backdrop>
		</AlertDialog>
	);
}

function getAuthMethodConfig(method: string) {
	return (
		AUTH_METHOD_CONFIG[method as keyof typeof AUTH_METHOD_CONFIG] ?? {
			label: method,
			color: "default" as const,
		}
	);
}

function getAuditResultConfig(result: string) {
	return (
		AUDIT_RESULT_CONFIG[result as keyof typeof AUDIT_RESULT_CONFIG] ?? {
			label: result,
			color: "danger" as const,
		}
	);
}

function getModelTypeConfig(modelType: string) {
	return (
		MODEL_TYPE_CONFIG[modelType as keyof typeof MODEL_TYPE_CONFIG] ?? {
			label: modelType,
			color: "default" as const,
		}
	);
}

function getLockStatusConfig(account: {
	isPermanentlyLocked: boolean;
	lockedUntil?: string | null;
}) {
	if (account.isPermanentlyLocked) {
		return { label: "영구잠금", color: "danger" as const };
	}

	if (account.lockedUntil) {
		return { label: "일시잠금", color: "warning" as const };
	}

	return { label: "정상", color: "success" as const };
}

/** OIDC Client 목록에서 사용하는 clientId 컬럼입니다. */
export const oidcClientIdColumn = createPresetColumn<OidcClientDto>(
	"clientId",
	{
		size: 200,
		isRequired: true,
		cell: ({ getValue }) => <DefaultCell value={getValue() as string} mono />,
	},
);

export const oidcClientNameColumn = createPresetColumn<OidcClientDto>("name", {
	size: 200,
});

/** OIDC Client 인증 방식을 Chip으로 표시하는 컬럼입니다. */
export const oidcClientAuthMethodColumn = createPresetColumn<OidcClientDto>(
	"tokenEndpointAuthMethod",
	{
		size: 150,
		cell: ({ getValue }) => {
			const config = getAuthMethodConfig(getValue() as string);
			return <ChipCell label={config.label} color={config.color} />;
		},
	},
);

export const oidcClientGrantTypesColumn = createPresetColumn<OidcClientDto>(
	"grantTypes",
	{
		size: 200,
		cell: ({ getValue }) => {
			const types = getValue() as string[];

			if (!types?.length) {
				return <DefaultCell value={null} />;
			}

			return (
				<div className="flex flex-wrap gap-1">
					{types.map((type) => (
						<Chip key={type} size="sm" variant="flat">
							{GRANT_TYPE_LABEL[type] ?? type}
						</Chip>
					))}
				</div>
			);
		},
	},
);

/** OIDC Client 활성 상태를 표시하는 컬럼입니다. */
export const oidcClientIsActiveColumn = createIsActiveColumn<OidcClientDto>({
	size: 80,
	cell: ({ getValue }) => {
		const isActive = Boolean(getValue());
		return (
			<ChipCell
				label={isActive ? "활성" : "비활성"}
				color={isActive ? "success" : "default"}
			/>
		);
	},
});

export const oidcClientCreatedAtColumn = createCreatedAtColumn<OidcClientDto>();

/** OIDC Client 행 액션을 RowActionsCell로 표시하는 컬럼입니다. */
export const oidcClientActionsColumn = createActionsColumn<OidcClientDto>({
	size: 100,
	cell: ({ row }) => (
		<RowActionsCell
			id={row.original.id}
			basePath="/settings/auth/oidc-clients"
			showView
			showEdit={false}
			showDelete={false}
		/>
	),
});

/** OIDC Client 목록 페이지용 컬럼 조합을 생성합니다. */
export function buildOidcClientTableColumns<
	TRow extends {
		id: string;
		clientId: string;
		name: string;
		tokenEndpointAuthMethod: string;
		grantTypes: string[];
		isFirstParty: boolean;
		skipConsent: boolean;
		isActive: boolean;
		createdAt: string | Date | null;
	},
>() {
	return buildColumns<TRow>(
		createPresetColumn<TRow>("clientId", {
			size: 200,
			isRequired: true,
			cell: ({ getValue }) => <DefaultCell value={getValue() as string} mono />,
		}),
		createPresetColumn<TRow>("name", {
			size: 200,
		}),
		createPresetColumn<TRow>("tokenEndpointAuthMethod", {
			size: 150,
			cell: ({ getValue }) => {
				const config = getAuthMethodConfig(getValue() as string);
				return <ChipCell label={config.label} color={config.color} />;
			},
		}),
		createPresetColumn<TRow>("grantTypes", {
			size: 200,
			cell: ({ getValue }) => {
				const types = getValue() as string[];

				if (!types?.length) {
					return <DefaultCell value={null} />;
				}

				return (
					<div className="flex flex-wrap gap-1">
						{types.map((type) => (
							<Chip key={type} size="sm" variant="flat">
								{GRANT_TYPE_LABEL[type] ?? type}
							</Chip>
						))}
					</div>
				);
			},
		}),
		createPresetColumn<TRow>("isFirstParty", {
			size: 130,
			cell: ({ getValue }) => {
				const isFirstParty = Boolean(getValue());
				return (
					<ChipCell
						label={isFirstParty ? "First-party" : "Third-party"}
						color={isFirstParty ? "primary" : "default"}
					/>
				);
			},
		}),
		createPresetColumn<TRow>("skipConsent", {
			size: 120,
			cell: ({ getValue }) => {
				const skipConsent = Boolean(getValue());
				return (
					<ChipCell
						label={skipConsent ? "동의 생략" : "동의 표시"}
						color={skipConsent ? "success" : "default"}
					/>
				);
			},
		}),
		createIsActiveColumn<TRow>({
			size: 80,
			cell: ({ getValue }) => {
				const isActive = Boolean(getValue());
				return (
					<ChipCell
						label={isActive ? "활성" : "비활성"}
						color={isActive ? "success" : "default"}
					/>
				);
			},
		}),
		createCreatedAtColumn<TRow>(),
		createActionsColumn<TRow>({
			size: 100,
			cell: ({ row }) => (
				<RowActionsCell
					id={row.original.id}
					basePath="/settings/auth/oidc-clients"
					showView
					showEdit={false}
					showDelete={false}
				/>
			),
		}),
	);
}

export const oidcClientTableColumns =
	buildOidcClientTableColumns<OidcClientDto>();

export function buildIdpAccountTableColumns<
	TRow extends {
		id: string;
		name: string;
		email: string;
		isActive: boolean;
		isPermanentlyLocked: boolean;
		lockedUntil?: string | null;
		failedLoginAttempts: number;
		lastLoginAt?: string | null;
	},
>({ onClickUnlockAccount }: { onClickUnlockAccount: (account: TRow) => void }) {
	/** IDP Account 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumns<TRow>(
		createNameColumn<TRow>(),
		createEmailColumn<TRow>(),
		createIsActiveColumn<TRow>({
			size: 80,
			cell: ({ getValue }) => {
				const isActive = Boolean(getValue());
				return (
					<ChipCell
						label={isActive ? "활성" : "비활성"}
						color={isActive ? "success" : "default"}
					/>
				);
			},
		}),
		createPresetColumn<TRow>("isPermanentlyLocked", {
			size: 100,
			align: "center",
			cell: ({ row }) => {
				const config = getLockStatusConfig(row.original);
				return <ChipCell label={config.label} color={config.color} />;
			},
		}),
		createPresetColumn<TRow>("failedLoginAttempts", {
			size: 80,
			align: "center",
			cell: ({ getValue }) => {
				const count = getValue() as number;
				return (
					<DefaultCell
						value={count}
						tabular
						weight={count >= 5 ? "semibold" : "normal"}
						className={count >= 5 ? "text-danger" : undefined}
					/>
				);
			},
		}),
		createPresetColumn<TRow>("lastLoginAt", {
			size: 170,
			cell: ({ getValue }) => (
				<DateTimeCell value={getValue() as string | null | undefined} />
			),
		}),
		createActionsColumn<TRow>({
			size: 180,
			cell: ({ row }) => {
				const account = row.original;
				const isLocked =
					account.isPermanentlyLocked || Boolean(account.lockedUntil);

				return (
					<div className="flex items-center justify-center gap-1">
						{isLocked ? (
							<AlertDialogActionCell
								title="계정 잠금 해제"
								description="선택한 계정의 로그인 잠금을 해제합니다."
								confirmLabel="잠금 해제"
								triggerLabel="잠금 해제"
								status="accent"
								triggerColor="primary"
								onConfirm={() => onClickUnlockAccount(account)}
							/>
						) : null}
						<HeroLink href={`/settings/auth/accounts/${account.id}`} className="inline-flex h-8 items-center justify-center px-3 text-sm">
							상세
						</HeroLink>
					</div>
				);
			},
		}),
	);
}

export const idpAccountTableColumns =
	buildIdpAccountTableColumns<IdpAccountDto>({
		onClickUnlockAccount: () => undefined,
	});

export function buildEmailVerificationTableColumns<
	TRow extends {
		id: string;
		email: string;
		name: string;
		status: string;
		lastSendStatus?: string | null;
		sendCount: number;
		expiresAt: string | Date;
		verifiedAt?: string | Date | null;
		canResend: boolean;
		resendAvailableAt?: string | Date | null;
	},
>({
	onClickResendEmailVerification,
}: {
	onClickResendEmailVerification: (verification: TRow) => void;
}) {
	return buildColumns<TRow>(
		createEmailColumn<TRow>({
			size: 240,
			isRequired: true,
		}),
		createNameColumn<TRow>({
			size: 160,
		}),
		createPresetColumn<TRow>("status", {
			size: 120,
			align: "center",
			cell: ({ getValue }) => {
				const status =
					getValue() as keyof typeof EMAIL_VERIFICATION_STATUS_CONFIG;
				const config = EMAIL_VERIFICATION_STATUS_CONFIG[status] ?? {
					label: status,
					color: "default" as const,
				};

				return <ChipCell label={config.label} color={config.color} />;
			},
		}),
		createPresetColumn<TRow>("lastSendStatus", {
			size: 120,
			align: "center",
			cell: ({ getValue }) => {
				const status = getValue() as
					| keyof typeof EMAIL_SEND_STATUS_CONFIG
					| null;
				if (!status) {
					return <DefaultCell value={null} />;
				}
				const config = EMAIL_SEND_STATUS_CONFIG[status] ?? {
					label: status,
					color: "default" as const,
				};

				return <ChipCell label={config.label} color={config.color} />;
			},
		}),
		createPresetColumn<TRow>("sendCount", {
			size: 90,
			align: "center",
			cell: ({ getValue }) => (
				<DefaultCell value={getValue() as number} tabular />
			),
		}),
		createPresetColumn<TRow>("expiresAt", {
			size: 180,
			cell: ({ getValue }) => (
				<ExpiryCell expiresAt={getValue() as string | Date | null} />
			),
		}),
		createPresetColumn<TRow>("verifiedAt", {
			size: 170,
			cell: ({ getValue }) => (
				<DateTimeCell value={getValue() as string | Date | null | undefined} />
			),
		}),
		defineColumn<TRow>({
			field: COLUMN_FIELDS.actions,
			label: "",
			size: 120,
			align: "center",
			cell: ({ row }) => {
				const verification = row.original;

				return (
					<AlertDialogActionCell
						title="인증 메일 재발송"
						description="선택한 이메일 인증 요청의 메일을 다시 발송합니다."
						confirmLabel="재발송"
						triggerLabel="재발송"
						status="accent"
						triggerColor="primary"
						startContent={<Send className="size-4" />}
						isDisabled={!verification.canResend}
						onConfirm={() => onClickResendEmailVerification(verification)}
					/>
				);
			},
		}),
	);
}

export const emailVerificationTableColumns =
	buildEmailVerificationTableColumns<EmailVerificationDto>({
		onClickResendEmailVerification: () => undefined,
	});

export const authAuditLogCreatedAtColumn =
	createCreatedAtColumn<AuthAuditLogDto>({
		fieldKey: "occurredAt",
		accessorKey: COLUMN_FIELDS.createdAt,
		size: 170,
		isRequired: true,
	});

export const authAuditLogEmailColumn = createEmailColumn<AuthAuditLogDto>();

/** 인증 감사 로그 결과를 Chip으로 보여주는 컬럼입니다. */
export const authAuditLogResultColumn = createPresetColumn<AuthAuditLogDto>(
	"result",
	{
		size: 100,
		align: "center",
		cell: ({ getValue }) => {
			const config = getAuditResultConfig(getValue() as AuthAuditResult);
			return <ChipCell label={config.label} color={config.color} />;
		},
	},
);

export const authAuditLogFailureReasonColumn =
	createPresetColumn<AuthAuditLogDto>("failureReason", {
		size: 200,
	});

export const authAuditLogIpAddressColumn = createPresetColumn<AuthAuditLogDto>(
	"ipAddress",
	{
		size: 140,
	},
);

export const authAuditLogUserAgentColumn = createPresetColumn<AuthAuditLogDto>(
	"userAgent",
	{
		size: 250,
	},
);

export const authAuditLogTableColumns = buildColumns<AuthAuditLogDto>(
	authAuditLogCreatedAtColumn,
	authAuditLogEmailColumn,
	authAuditLogResultColumn,
	authAuditLogFailureReasonColumn,
	authAuditLogIpAddressColumn,
	authAuditLogUserAgentColumn,
);

export function buildAuthAuditLogTableColumns<
	TRow extends {
		occurredAt?: string | null;
		email: string;
		result: string;
		failureReason?: string | null;
		ipAddress: string;
		userAgent?: string | null;
	},
>() {
	return buildColumns<TRow>(
		createCreatedAtColumn<TRow>({
			fieldKey: "occurredAt",
			accessorKey: COLUMN_FIELDS.createdAt,
			size: 170,
			isRequired: true,
		}),
		createEmailColumn<TRow>(),
		createPresetColumn<TRow>("result", {
			size: 100,
			align: "center",
			cell: ({ getValue }) => {
				const config = getAuditResultConfig(getValue() as AuthAuditResult);
				return <ChipCell label={config.label} color={config.color} />;
			},
		}),
		createPresetColumn<TRow>("failureReason", {
			size: 200,
		}),
		createPresetColumn<TRow>("ipAddress", {
			size: 140,
		}),
		createPresetColumn<TRow>("userAgent", {
			size: 250,
		}),
	);
}

export function buildOidcSessionTableColumns<
	TRow extends {
		key: string;
		modelType: string;
		accountId?: string;
		grantId?: string;
		expiresAt: string | null;
		createdAt: string;
	},
>({
	onClickGrantId,
	onClickRevokeSession,
}: {
	onClickGrantId: (grantId: string) => void;
	onClickRevokeSession: (key: string) => void;
}) {
	/** OIDC Session 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createPresetColumn<TRow>("key", {
				size: 140,
				isRequired: true,
				/** 긴 세션 키는 앞부분만 노출하고 전체 값은 title로 보존합니다. */
				cell: ({ getValue }) => {
					const key = getValue() as string;
					return (
						<DefaultCell value={`${key.slice(0, 8)}...`} mono title={key} />
					);
				},
			}),
			createPresetColumn<TRow>("modelType", {
				size: 140,
				cell: ({ getValue }) => {
					const config = getModelTypeConfig(getValue() as string);
					return <ChipCell label={config.label} color={config.color} />;
				},
			}),
			createPresetColumn<TRow>("accountId", {
				size: 140,
				/** accountId도 동일한 방식으로 축약 표시합니다. */
				cell: ({ getValue }) => {
					const accountId = getValue() as string | null;

					return (
						<DefaultCell
							value={accountId ? `${accountId.slice(0, 8)}...` : null}
							mono
							title={accountId ?? undefined}
						/>
					);
				},
			}),
			createPresetColumn<TRow>("grantId", {
				size: 140,
				/** grantId는 클릭 액션이 있으므로 버튼 형태의 셀로 표시합니다. */
				cell: ({ getValue }) => {
					const grantId = getValue() as string | null;
					if (!grantId) {
						return <DefaultCell value={null} />;
					}

					return (
						<AlertDialogActionCell
							title="Grant 세션/토큰 폐기"
							description="선택한 Grant의 모든 세션/토큰을 폐기합니다."
							confirmLabel="폐기"
							triggerLabel={`${grantId.slice(0, 8)}...`}
							triggerVariant="light"
							triggerColor="default"
							className="font-mono text-sm"
							tooltip={`${grantId}\n클릭하면 이 Grant의 모든 세션/토큰을 일괄 폐기합니다.`}
							onConfirm={() => onClickGrantId(grantId)}
						/>
					);
				},
			}),
			createPresetColumn<TRow>("expiresAt", {
				size: 180,
				cell: ({ getValue }) => (
					<ExpiryCell expiresAt={getValue() as string | null} />
				),
			}),
		],
		[
			createActionsColumn<TRow>({
				size: 100,
				cell: ({ row }) => (
					<AlertDialogActionCell
						title="세션/토큰 폐기"
						description="선택한 OIDC 세션/토큰을 폐기합니다."
						confirmLabel="폐기"
						triggerLabel="폐기"
						triggerColor="danger"
						startContent={<Ban className="h-3 w-3" />}
						onConfirm={() => onClickRevokeSession(row.original.key)}
					/>
				),
			}),
		],
	);
}

export const oidcSessionTableColumns =
	buildOidcSessionTableColumns<OidcSessionDto>({
		onClickGrantId: () => undefined,
		onClickRevokeSession: () => undefined,
	});
