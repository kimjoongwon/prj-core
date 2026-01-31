"use client";

import { SectionSurface } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

/**
 * Subject 관리 페이지
 */
function SubjectsPage() {
	return (
		<SectionSurface>
			<div className="flex items-center justify-center p-16">
				<p className="text-default-400">준비 중입니다.</p>
			</div>
		</SectionSurface>
	);
}

export default observer(SubjectsPage);
