import type { ReactNode } from "react";
import { Typography } from "../../../data-display/Typography";

export interface AssetBrowserHeaderProps {
	title: ReactNode;
	description: ReactNode;
	actions?: ReactNode;
}

/** AssetBrowser의 제목, 설명, 액션 영역을 렌더링합니다. */
export const AssetBrowserHeader = ({
	title,
	description,
	actions,
}: AssetBrowserHeaderProps) => {
	return (
		<div className="border-b border-separator min-w-0 pb-4">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 flex-1">
					<Typography.Heading
						className="text-2xl font-semibold leading-8"
						level={1}
					>
						{title}
					</Typography.Heading>
					<Typography.Paragraph className="mt-1" color="muted" size="sm">
						{description}
					</Typography.Paragraph>
				</div>
				{actions ? <div className="shrink-0">{actions}</div> : null}
			</div>
		</div>
	);
};

AssetBrowserHeader.displayName = "AssetBrowserHeader";
