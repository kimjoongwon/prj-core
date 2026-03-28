"use client";

import type { AuthAuditLogDto, AuthAuditResult } from "@cocrepo/api/idp/auth";
import type { IdpAccountDto } from "@cocrepo/api/idp/idp-accounts";
import type { OidcClientDto } from "@cocrepo/api/idp/oidc-clients";
import type { OidcSessionDto } from "@cocrepo/api/idp/oidc-sessions";
import {
	ActiveStatusCell,
	ActionButtonCell,
	AuditResultBadge,
	AuthMethodCell,
	DateTimeCell,
	DefaultCell,
	ExpiryCell,
	FailedAttemptsCell,
	GrantTypeCell,
	IdpAccountActionsCell,
	LockStatusCell,
	ModelTypeCell,
	RevokeButtonCell,
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
} from "../internal/masterFactory";
import { COLUMN_FIELDS } from "../internal/fieldPresets";

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

/** OIDC Client 인증 방식을 AuthMethodCell로 표시하는 컬럼입니다. */
export const oidcClientAuthMethodColumn = createPresetColumn<OidcClientDto>(
	"tokenEndpointAuthMethod",
	{
		size: 150,
		cell: ({ getValue }) => <AuthMethodCell method={getValue() as string} />,
	},
);

export const oidcClientGrantTypesColumn = createPresetColumn<OidcClientDto>(
	"grantTypes",
	{
		size: 200,
		cell: ({ getValue }) => <GrantTypeCell types={getValue() as string[]} />,
	},
);

/** OIDC Client 활성 상태를 표시하는 컬럼입니다. */
export const oidcClientIsActiveColumn = createIsActiveColumn<OidcClientDto>({
	size: 80,
	cell: ({ getValue }) => <ActiveStatusCell isActive={getValue() as boolean} />,
});

export const oidcClientCreatedAtColumn = createCreatedAtColumn<OidcClientDto>();

/** OIDC Client 행 액션을 RowActionsCell로 표시하는 컬럼입니다. */
export const oidcClientActionsColumn = createActionsColumn<OidcClientDto>({
	size: 100,
	cell: ({ row }) => (
		<RowActionsCell
			id={row.original.id}
			basePath="/oidc-clients"
			showView
			showEdit={false}
			showDelete={false}
		/>
	),
});

export const oidcClientTableColumns = buildColumns<OidcClientDto>(
	oidcClientIdColumn,
	oidcClientNameColumn,
	oidcClientAuthMethodColumn,
	oidcClientGrantTypesColumn,
	oidcClientIsActiveColumn,
	oidcClientCreatedAtColumn,
	oidcClientActionsColumn,
);

export function buildIdpAccountTableColumns({
	onClickOpenUnlockModal,
}: {
	onClickOpenUnlockModal: (account: IdpAccountDto) => void;
}) {
	/** IDP Account 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumns<IdpAccountDto>(
		createNameColumn<IdpAccountDto>(),
		createEmailColumn<IdpAccountDto>(),
		createIsActiveColumn<IdpAccountDto>({
			size: 80,
			cell: ({ getValue }) => (
				<ActiveStatusCell isActive={getValue() as boolean} />
			),
		}),
		createPresetColumn<IdpAccountDto>("isPermanentlyLocked", {
			size: 100,
			align: "center",
			cell: ({ row }) => (
				<LockStatusCell
					isPermanentlyLocked={row.original.isPermanentlyLocked}
					lockedUntil={row.original.lockedUntil}
				/>
			),
		}),
		createPresetColumn<IdpAccountDto>("failedLoginAttempts", {
			size: 80,
			align: "center",
			cell: ({ getValue }) => (
				<FailedAttemptsCell count={getValue() as number} />
			),
		}),
		createPresetColumn<IdpAccountDto>("lastLoginAt", {
			size: 170,
			cell: ({ getValue }) => (
				<DateTimeCell value={getValue() as string | null} />
			),
		}),
		createActionsColumn<IdpAccountDto>({
			size: 180,
			cell: ({ row }) => {
				const account = row.original;
				const isLocked =
					account.isPermanentlyLocked || Boolean(account.lockedUntil);

				return (
					<IdpAccountActionsCell
						accountId={account.id}
						isLocked={isLocked}
						onUnlock={() => onClickOpenUnlockModal(account)}
					/>
				);
			},
		}),
	);
}

export const authAuditLogCreatedAtColumn =
	createCreatedAtColumn<AuthAuditLogDto>({
		fieldKey: "occurredAt",
		accessorKey: COLUMN_FIELDS.createdAt,
		size: 170,
		isRequired: true,
	});

export const authAuditLogEmailColumn = createEmailColumn<AuthAuditLogDto>();

/** 인증 감사 로그 결과를 AuditResultBadge로 보여주는 컬럼입니다. */
export const authAuditLogResultColumn = createPresetColumn<AuthAuditLogDto>(
	"result",
	{
		size: 100,
		align: "center",
		cell: ({ getValue }) => (
			<AuditResultBadge result={getValue() as AuthAuditResult} />
		),
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

export function buildOidcSessionTableColumns({
	onClickGrantId,
	onClickRevokeSession,
}: {
	onClickGrantId: (grantId: string) => void;
	onClickRevokeSession: (key: string) => void;
}) {
	/** OIDC Session 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<OidcSessionDto>(
		[
			createPresetColumn<OidcSessionDto>("key", {
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
			createPresetColumn<OidcSessionDto>("modelType", {
				size: 140,
				cell: ({ getValue }) => <ModelTypeCell type={getValue() as string} />,
			}),
			createPresetColumn<OidcSessionDto>("accountId", {
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
			createPresetColumn<OidcSessionDto>("grantId", {
				size: 140,
				/** grantId는 클릭 액션이 있으므로 버튼 형태의 셀로 표시합니다. */
				cell: ({ getValue }) => {
					const grantId = getValue() as string | null;
					if (!grantId) {
						return <DefaultCell value={null} />;
					}

					return (
						<ActionButtonCell
							variant="light"
							className="font-mono text-sm"
							title={`${grantId}\n클릭하면 이 Grant의 모든 세션/토큰을 일괄 폐기합니다.`}
							onPress={() => onClickGrantId(grantId)}
						>
							{grantId.slice(0, 8)}...
						</ActionButtonCell>
					);
				},
			}),
			createPresetColumn<OidcSessionDto>("expiresAt", {
				size: 180,
				cell: ({ getValue }) => (
					<ExpiryCell expiresAt={getValue() as string | null} />
				),
			}),
		],
		[
			createActionsColumn<OidcSessionDto>({
				size: 100,
				cell: ({ row }) => (
					<RevokeButtonCell
						onRevoke={() => onClickRevokeSession(row.original.key)}
					/>
				),
			}),
		],
	);
}
