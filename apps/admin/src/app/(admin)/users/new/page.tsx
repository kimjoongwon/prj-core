"use client";

import { UserForm } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

/**
 * 회원 등록 페이지
 */
function UserNewPage() {
	return (
		<div className="space-y-6">
			{/* 페이지 헤더 */}
			<div>
				<h1 className="text-2xl font-bold">회원 등록</h1>
				<p className="text-default-500">새로운 회원을 등록합니다.</p>
			</div>

			{/* 등록 폼 */}
			<UserForm mode="create" />
		</div>
	);
}

export default observer(UserNewPage);
