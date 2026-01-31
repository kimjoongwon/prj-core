"use client";

import { SectionSurface } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

/**
 * Action 관리 페이지
 */
function ActionsPage() {
	return (
		<SectionSurface>
			<div className="flex items-center justify-center p-16">
				<p className="text-default-400">준비 중입니다.</p>
			</div>
		</SectionSurface>
	);
}

export default observer(ActionsPage);
