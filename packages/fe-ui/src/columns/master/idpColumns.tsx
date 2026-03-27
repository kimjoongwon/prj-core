"use client";

import type { AuthAuditLogDto, AuthAuditResult } from "@cocrepo/api/idp/auth";
import type { IdpAccountDto } from "@cocrepo/api/idp/idp-accounts";
import type { OidcClientDto } from "@cocrepo/api/idp/oidc-clients";
import type { OidcSessionDto } from "@cocrepo/api/idp/oidc-sessions";
import { Button, Link as HeroLink } from "@heroui/react";
import {
  ActiveStatusCell,
  AuditResultBadge,
  AuthMethodCell,
  DateTimeCell,
  ExpiryCell,
  GrantTypeCell,
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
  FailedAttemptsCell,
  LockStatusCell,
} from "../internal/masterFactory";
import { COLUMN_FIELDS } from "../internal/fieldPresets";

export const oidcClientIdColumn = createPresetColumn<OidcClientDto>(
  "clientId",
  {
    size: 200,
    isRequired: true,
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">{getValue() as string}</span>
    ),
  },
);

export const oidcClientNameColumn = createPresetColumn<OidcClientDto>(
  "clientName",
  {
    size: 200,
  },
);

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

export const oidcClientIsActiveColumn = createIsActiveColumn<OidcClientDto>({
  size: 80,
  cell: ({ getValue }) => <ActiveStatusCell isActive={getValue() as boolean} />,
});

export const oidcClientCreatedAtColumn = createCreatedAtColumn<OidcClientDto>();

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
          <div className="flex items-center justify-center gap-1">
            {isLocked ? (
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onPress={() => onClickOpenUnlockModal(account)}
              >
                잠금 해제
              </Button>
            ) : null}
            <Button
              as={HeroLink}
              href={`/accounts/${account.id}`}
              size="sm"
              variant="light"
              isIconOnly
              aria-label="상세 보기"
            >
              상세
            </Button>
          </div>
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
  return buildColumnsWithDefaultCreatedAt<OidcSessionDto>(
    [
      createPresetColumn<OidcSessionDto>("key", {
        size: 140,
        isRequired: true,
        cell: ({ getValue }) => {
          const key = getValue() as string;
          return (
            <span className="font-mono text-sm" title={key}>
              {key.slice(0, 8)}...
            </span>
          );
        },
      }),
      createPresetColumn<OidcSessionDto>("modelType", {
        size: 140,
        cell: ({ getValue }) => <ModelTypeCell type={getValue() as string} />,
      }),
      createPresetColumn<OidcSessionDto>("accountId", {
        size: 140,
        cell: ({ getValue }) => {
          const accountId = getValue() as string | null;
          if (!accountId) {
            return <span className="text-default-400">-</span>;
          }

          return (
            <span className="font-mono text-sm" title={accountId}>
              {accountId.slice(0, 8)}...
            </span>
          );
        },
      }),
      createPresetColumn<OidcSessionDto>("grantId", {
        size: 140,
        cell: ({ getValue }) => {
          const grantId = getValue() as string | null;
          if (!grantId) {
            return <span className="text-default-400">-</span>;
          }

          return (
            <Button
              size="sm"
              variant="light"
              className="font-mono text-sm"
              title={`${grantId}\n클릭하면 이 Grant의 모든 세션/토큰을 일괄 폐기합니다.`}
              onPress={() => onClickGrantId(grantId)}
            >
              {grantId.slice(0, 8)}...
            </Button>
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
