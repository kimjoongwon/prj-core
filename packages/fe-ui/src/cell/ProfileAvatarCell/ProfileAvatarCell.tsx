import type { ReactNode } from "react";
import { Avatar } from "../../design-system/primitives";

export interface ProfileAvatarCellProps {
	/** 이름 */
	name?: string | null;
	/** 부제목 (이메일, ID 등) */
	subtitle?: string | null;
	/** 아바타 이미지 URL */
	src?: string | null;
	/** 아바타 아이콘 (src가 없을 때 표시) */
	icon?: ReactNode;
}

/**
 * 아바타 + 이름 + 부제목을 표시하는 Cell 컴포넌트
 */
export const ProfileAvatarCell = ({
	name,
	subtitle,
	src,
	icon,
}: ProfileAvatarCellProps) => {
	return (
		<div className="flex items-center gap-3">
			<Avatar
				name={name ?? undefined}
				src={src ?? undefined}
				size="sm"
				icon={icon}
				classNames={{
					base: "bg-primary/10",
					icon: "text-primary",
				}}
			/>
			<div>
				<p className="font-medium">{name || "-"}</p>
				{subtitle && <p className="text-xs text-default-400">{subtitle}</p>}
			</div>
		</div>
	);
};
