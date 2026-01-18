import { Chip } from "@heroui/react";

interface Role {
	name?: string;
	displayName?: string;
}

interface RoleChipCellProps {
	/** 역할 객체 */
	role?: Role | null;
}

/**
 * 역할 이름에 따른 Chip 색상 결정
 */
const getRoleColor = (roleName?: string): "primary" | "secondary" | "default" => {
	switch (roleName?.toUpperCase()) {
		case "SUPER_ADMIN":
		case "ADMIN":
			return "primary";
		case "MANAGER":
			return "secondary";
		default:
			return "default";
	}
};

/**
 * 역할을 Chip으로 표시하는 Cell 컴포넌트
 */
export const RoleChipCell = ({ role }: RoleChipCellProps) => {
	if (!role) {
		return <span className="text-default-400">-</span>;
	}

	return (
		<Chip size="sm" color={getRoleColor(role.name)} variant="flat">
			{role.displayName || role.name}
		</Chip>
	);
};
