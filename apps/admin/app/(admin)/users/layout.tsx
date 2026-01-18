"use client";

import { Tab, Tabs } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";

/**
 * 탭 설정
 */
const tabs = [
	{ id: "all", label: "전체", href: "/users" },
	{ id: "active", label: "활성", href: "/users/active" },
	{ id: "dormant", label: "휴면", href: "/users/dormant" },
	{ id: "pending-withdrawal", label: "탈퇴대기", href: "/users/pending-withdrawal" },
] as const;

/**
 * 회원 관리 레이아웃
 *
 * 회원 목록 탭 페이지들의 공통 레이아웃입니다.
 * - 페이지 헤더
 * - 탭 네비게이션
 */
function UsersLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();

	// 현재 경로에서 활성 탭 결정
	const getActiveTab = () => {
		if (pathname === "/users") return "all";
		const segment = pathname.split("/")[2];
		return tabs.find((t) => t.href.includes(segment))?.id ?? "all";
	};

	const handleTabChange = (key: React.Key) => {
		const tab = tabs.find((t) => t.id === key);
		if (tab) {
			router.push(tab.href as Route);
		}
	};

	// 상세/수정/등록 페이지는 탭 없이 children만 렌더링
	if (pathname.includes("/users/new") || pathname.match(/\/users\/[^/]+$/)) {
		return <>{children}</>;
	}

	return (
		<div className="space-y-6">
			{/* 페이지 헤더 */}
			<div>
				<h1 className="text-2xl font-bold">회원 목록</h1>
				<p className="text-default-500">시스템에 등록된 회원을 관리합니다.</p>
			</div>

			{/* 탭 네비게이션 */}
			<Tabs
				selectedKey={getActiveTab()}
				onSelectionChange={handleTabChange}
				variant="underlined"
				classNames={{
					tabList: "gap-6",
				}}
			>
				{tabs.map((tab) => (
					<Tab key={tab.id} title={tab.label} />
				))}
			</Tabs>

			{/* 페이지 콘텐츠 */}
			{children}
		</div>
	);
}

export default observer(UsersLayout);
