import { RoleChipCell } from "../RoleChipCell/RoleChipCell";

interface Role {
	name?: string;
	displayName?: string;
}

interface TenantLike {
	role?: Role | null;
}

interface UserRoleCellProps {
	/** 사용자의 테넌트 배열 (API TenantDto 호환) */
	tenants?: TenantLike[] | null;
}

/**
 * UserRoleCell 컴포넌트
 * 사용자의 테넌트 목록에서 첫 번째 역할을 표시합니다.
 *
 * @example
 * ```tsx
 * // DataGrid에서 사용
 * cell: ({ row }) => <UserRoleCell tenants={row.tenants} />
 * ```
 */
export const UserRoleCell = ({ tenants }: UserRoleCellProps) => {
	const firstRole = tenants?.[0]?.role;
	return <RoleChipCell role={firstRole} />;
};
