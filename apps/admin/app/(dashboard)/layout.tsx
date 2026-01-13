"use client";

import { AdminLayout } from "@cocrepo/ui";
import { useStore } from "@cocrepo/store";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { menuGroups } from "../config/menu";

interface DashboardLayoutProps {
	children: ReactNode;
}

/**
 * Dashboard Layout
 * 인증된 사용자를 위한 관리자 레이아웃
 */
function DashboardLayoutComponent({ children }: DashboardLayoutProps) {
	const router = useRouter();
	const pathname = usePathname();
	const store = useStore();
	const { authStore } = store;
	const abilityStore = store.abilityStore!;

	// 로그인 상태 확인
	useEffect(() => {
		if (!authStore?.isAuthenticated) {
			router.push("/auth/login");
		}
	}, [authStore?.isAuthenticated, router]);

	// 권한이 로드되지 않은 경우 임시로 기본 권한 설정
	// 실제로는 로그인 후 서버에서 받아온 권한을 설정해야 함
	useEffect(() => {
		if (!abilityStore.isLoaded) {
			// 개발용 기본 권한 설정 (모든 메뉴 접근 가능)
			abilityStore.updateRules([
				{ action: "view", subject: "menu:dashboard" },
				{ action: "view", subject: "menu:users" },
				{ action: "view", subject: "menu:users/list" },
				{ action: "view", subject: "menu:users/roles" },
				{ action: "view", subject: "menu:permissions" },
				{ action: "view", subject: "menu:permissions/actions" },
				{ action: "view", subject: "menu:permissions/subjects" },
				{ action: "view", subject: "menu:permissions/abilities" },
				{ action: "view", subject: "menu:settings" },
				{ action: "view", subject: "menu:settings/system" },
				{ action: "manage", subject: "entity:user" },
				{ action: "manage", subject: "entity:role" },
				{ action: "manage", subject: "entity:action" },
				{ action: "manage", subject: "entity:subject" },
				{ action: "manage", subject: "entity:ability" },
			]);
		}
	}, [abilityStore]);

	const handleMenuClick = (path: string) => {
		router.push(path as never);
	};

	const handleLogout = async () => {
		await authStore?.logout();
		abilityStore.clearRules();
	};

	// 임시 사용자 정보 (실제로는 로그인 후 설정)
	const userInfo = {
		name: "관리자",
		email: "admin@example.com",
		role: "시스템 관리자",
	};

	// 로고 컴포넌트
	const logo = (
		<div className="flex items-center gap-2">
			<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
				<span className="font-bold text-primary-foreground text-sm">A</span>
			</div>
			<span className="font-semibold text-foreground">Admin</span>
		</div>
	);

	return (
		<AdminLayout
			menuGroups={menuGroups}
			activePath={pathname}
			onMenuClick={handleMenuClick}
			userInfo={userInfo}
			logo={logo}
			onLogout={handleLogout}
		>
			{children}
		</AdminLayout>
	);
}

export default observer(DashboardLayoutComponent);
