import type { ReactNode } from "react";
import { Avatar } from "@heroui/react";

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
				size="sm"
				className="bg-accent/10 text-accent"
			>
				{src ? <Avatar.Image src={src} alt={name ?? ""} /> : null}
				<Avatar.Fallback>{icon ?? name?.slice(0, 1)}</Avatar.Fallback>
			</Avatar>
			<div>
				<p className="font-medium">{name || "-"}</p>
				{subtitle && <p className="text-xs text-muted">{subtitle}</p>}
			</div>
		</div>
	);
};
