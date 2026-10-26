"use client";

import type { RoleDto } from "@cocrepo/api/core/roles";
import { ChipCell, LinkCell, NameCell, PhoneCell } from "../../cell";
import {
	buildColumns,
	buildColumnsWithDefaultCreatedAt,
	createActionsColumn,
	createCreatedAtColumn,
	createDescriptionColumn,
	createDisplayNameColumn,
	createEmailColumn,
	createNameColumn,
	createPhoneColumn,
	createPresetColumn,
	createRemovedAtStatusColumn,
	createStatusColumn,
} from "./dataGridFactory";

type RoleLike = {
	name?: string;
	displayName?: string | null;
};

type TenantWithRole = {
	role?: RoleLike | null;
};

function renderRoleName(value?: string | null) {
	return <NameCell value={value} variant="identifier" />;
}

function getRoleLabel(role?: RoleLike | string | null) {
	if (typeof role === "string") {
		return role;
	}

	return role?.displayName || role?.name || null;
}

function getRoleColor(roleName?: string) {
	switch (roleName?.toUpperCase()) {
		case "PLATFORM_ADMIN":
		case "COMPANY_MANAGER":
			return "accent";
		case "PROJECT":
			return "default";
		default:
			return "default";
	}
}

/** 사용자 목록 페이지용 컬럼 조합을 생성합니다. */
export function buildUserListTableColumns<
	TRow extends {
		id: string;
		name: string;
		email?: string | null;
		phone?: string | null;
		removedAt?: Date | null;
		createdAt: Date;
		tenants?: TenantWithRole[] | null;
	},
>() {
	return buildColumns<TRow>(
		createNameColumn<TRow>({
			cell: ({ row }) => (
				<LinkCell href={`/admin/users/${row.original.id}`}>
					{row.original.name}
				</LinkCell>
			),
		}),
		createEmailColumn<TRow>({ size: 240 }),
		createPhoneColumn<TRow>({
			size: 150,
			cell: ({ row }) => (
				<PhoneCell
					value={row.original.phone}
					className="text-sm font-medium tabular-nums text-foreground/80"
				/>
			),
		}),
		createPresetColumn<TRow>("role", {
			size: 120,
			cell: ({ row }) => {
				const firstRole = row.original.tenants?.[0]?.role;
				const roleLabel = getRoleLabel(firstRole);

				return (
					<ChipCell label={roleLabel} color={getRoleColor(firstRole?.name)} />
				);
			},
		}),
		createStatusColumn<TRow>({
			size: 100,
			cell: ({ row }) => (
				<ChipCell
					label={row.original.removedAt ? "탈퇴대기" : "활성"}
					color={row.original.removedAt ? "danger" : "success"}
				/>
			),
		}),
		createCreatedAtColumn<TRow>({
			fieldKey: "signedUpAt",
			accessorKey: "createdAt",
		}),
	);
}

export const adminRoleNameColumn = createNameColumn<RoleDto>({
	fieldKey: "roleKey",
	accessorKey: "name",
	size: 180,
	enableHiding: false,
	nameVariant: "identifier",
	cell: ({ row }) => renderRoleName(row.original.name),
});

export const adminRoleDisplayNameColumn = createDisplayNameColumn<RoleDto>();

export const adminRoleDescriptionColumn = createDescriptionColumn<RoleDto>();

export const adminRoleStatusColumn = createRemovedAtStatusColumn<RoleDto>({
	size: 100,
});

export const adminRoleActionsColumn = createActionsColumn<RoleDto>({
	size: 100,
	cell: ({ row }) => (
		<LinkCell
			className="inline-flex h-8 items-center justify-center px-3 text-sm"
			href={`/admin/roles/${row.original.id}`}
		>
			상세
		</LinkCell>
	),
});

/** 역할 목록 페이지용 컬럼 조합을 생성합니다. */
export function buildAdminRoleTableColumns<
	TRow extends {
		id: string;
		name: string;
		displayName?: string | null;
		description?: string | null;
		createdAt: Date | null;
		removedAt?: Date | null;
	},
>() {
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createNameColumn<TRow>({
				fieldKey: "roleKey",
				accessorKey: "name",
				size: 180,
				enableHiding: false,
				nameVariant: "identifier",
				cell: ({ row }) => renderRoleName(row.original.name),
			}),
			createDisplayNameColumn<TRow>(),
			createDescriptionColumn<TRow>(),
			createRemovedAtStatusColumn<TRow>({ size: 100 }),
		],
		[
			createActionsColumn<TRow>({
				size: 100,
				cell: ({ row }) => (
					<LinkCell
						className="inline-flex h-8 items-center justify-center px-3 text-sm"
						href={`/admin/roles/${row.original.id}`}
					>
						상세
					</LinkCell>
				),
			}),
		],
	);
}

/** 역할 목록 페이지에서 사용하는 전체 컬럼 조합입니다. */
export const adminRoleTableColumns = buildAdminRoleTableColumns<RoleDto>();
