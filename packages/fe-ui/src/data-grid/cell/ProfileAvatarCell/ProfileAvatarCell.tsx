import { Avatar } from "@heroui/react";
import type { ReactNode } from "react";

export interface ProfileAvatarCellProps {
	/** 이름 */
	name?: string | bigint | null;
	/** 부제목 (이메일, ID 등) */
	subtitle?: string | bigint | null;
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
	const displayName = name == null ? "" : String(name);
	const displaySubtitle = subtitle == null ? "" : String(subtitle);

	return (
		<div className="flex items-center gap-3">
			<Avatar size="sm" className="bg-accent/10 text-accent">
				{src ? <Avatar.Image src={src} alt={displayName} /> : null}
				<Avatar.Fallback>{icon ?? displayName.slice(0, 1)}</Avatar.Fallback>
			</Avatar>
			<div>
				<p className="font-medium">{displayName || "-"}</p>
				{displaySubtitle && (
					<p className="text-xs text-muted">{displaySubtitle}</p>
				)}
			</div>
		</div>
	);
};
