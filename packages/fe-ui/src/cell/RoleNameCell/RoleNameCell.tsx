import { Chip } from "../../design-system/primitives";
import { NameCell } from "../NameCell/NameCell";

export interface RoleNameCellProps {
	/** 역할 이름 */
	value?: string | null;
	/** 시스템 역할 여부 */
	isSystem?: boolean;
}

/**
 * 역할 식별자와 시스템 배지를 함께 표시하는 셀
 */
export const RoleNameCell = ({
	value,
	isSystem = false,
}: RoleNameCellProps) => {
	return (
		<div className="flex items-center gap-2">
			<NameCell value={value} variant="identifier" />
			{isSystem ? (
				<Chip size="sm" color="warning" variant="flat">
					시스템
				</Chip>
			) : null}
		</div>
	);
};
