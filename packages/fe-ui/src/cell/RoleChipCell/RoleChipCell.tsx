import { Chip } from "../../data-display/Chip/Chip";

interface Role {
	name?: string;
	displayName?: string;
}

interface RoleChipCellProps {
	/** 역할 객체 */
	role?: Role | string | null;
}

function getRoleLabel(role?: Role | string | null) {
	if (typeof role === "string") {
		return role;
	}

	if (!role) {
		return null;
	}

	if (
		typeof role.displayName === "string" &&
		role.displayName.trim().length > 0
	) {
		return role.displayName;
	}

	if (typeof role.name === "string" && role.name.trim().length > 0) {
		return role.name;
	}

	return null;
}

/**
 * 역할 이름에 따른 Chip 색상 결정
 */
const getRoleColor = (
	roleName?: string,
): "primary" | "secondary" | "default" => {
	switch (roleName?.toUpperCase()) {
		case "PLATFORM_ADMIN":
		case "COMPANY_MANAGER":
			return "primary";
		case "PROJECT":
			return "secondary";
		default:
			return "default";
	}
};

/**
 * 역할을 Chip으로 표시하는 Cell 컴포넌트
 */
export const RoleChipCell = ({ role }: RoleChipCellProps) => {
	const roleLabel = getRoleLabel(role);
	if (!roleLabel) {
		return <span className="text-muted">-</span>;
	}

	return (
		<Chip
			size="sm"
			color={getRoleColor(typeof role === "object" ? role?.name : undefined)}
			variant="flat"
		>
			{roleLabel}
		</Chip>
	);
};
