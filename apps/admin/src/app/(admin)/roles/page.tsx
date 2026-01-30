"use client";

import { Button } from "@heroui/react";
import { Plus, Shield } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";

/**
 * 역할 목록 페이지 (TODO: API 구현 후 활성화)
 */
function RolesPage() {
	return (
		<div className="space-y-6">
			{/* 페이지 헤더 */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">역할 목록</h1>
					<p className="text-default-500">시스템에 등록된 역할을 관리합니다.</p>
				</div>
				<Button
					as={Link}
					href="/roles/new"
					color="primary"
					startContent={<Plus className="h-4 w-4" />}
				>
					역할 추가
				</Button>
			</div>

			{/* 플레이스홀더 */}
			<div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-content1 p-16">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
					<Shield className="h-8 w-8 text-primary" />
				</div>
				<h2 className="text-xl font-semibold text-default-500">
					역할 목록 기능은 구현 예정입니다.
				</h2>
				<p className="text-default-400">역할 API 개발 완료 후 활성화됩니다.</p>
			</div>

			{/* 안내 메시지 */}
			<div className="rounded-xl bg-warning-50 p-4">
				<p className="text-sm text-warning-700">
					<strong>참고:</strong> 시스템 역할(SUPER_ADMIN, ADMIN, USER)은
					수정하거나 삭제할 수 없습니다. 권한 설정은 "권한 설정" 메뉴에서 관리할
					수 있습니다.
				</p>
			</div>
		</div>
	);
}

export default observer(RolesPage);
