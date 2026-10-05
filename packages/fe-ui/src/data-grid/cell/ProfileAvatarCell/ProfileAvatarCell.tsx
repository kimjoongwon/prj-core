import { Avatar } from "@heroui/react";
import type { ReactNode } from "react";
import { Typography } from "../../../data-display/Typography";

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

/** 셀 마크업(text-[13px])과 동일한 크기를 유지하는 폴백 클래스입니다. */
const DATA_CELL_SIZE_FALLBACK_CLASS_NAME = "text-[13px]";

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
				<Typography
					className={DATA_CELL_SIZE_FALLBACK_CLASS_NAME}
					type="body-sm"
					weight="medium"
				>
					{displayName || "-"}
				</Typography>
				{displaySubtitle && (
					<Typography color="muted" type="body-xs">
						{displaySubtitle}
					</Typography>
				)}
			</div>
		</div>
	);
};
