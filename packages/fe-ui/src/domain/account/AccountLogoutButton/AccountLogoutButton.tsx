"use client";

import { useApp } from "@cocrepo/store";
import { Dropdown } from "@heroui/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useT } from "../../../i18n";

/**
 * 현재 account session을 종료하고 로그인 화면으로 이동하는 logout button입니다.
 *
 * 서버 응답의 endSessionUrl(OIDC RP-Initiated Logout)로 최상위 내비게이션하면
 * OP가 자기 세션(_session 쿠키)을 정리한 뒤 로그인 화면으로 되돌립니다.
 * ID Token이 있는 세션은 확인 없이, 없는 세션(레거시)은 OP 확인 화면(한 번
 * 클릭)을 거칩니다. URL이 없으면(클라이언트 조회 실패 등) 앱 로그인 화면으로
 * 이동합니다.
 */
export const AccountLogoutButton = () => {
	const t = useT();
	const router = useRouter();
	const account = useApp().account;

	const onPress = async () => {
		// OIDC 세션의 HttpOnly 쿠키(access/session)를 서버에서 만료시킨다
		let endSessionUrl: string | null = null;
		try {
			const logoutResponse = await fetch("/api/v1/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			const logoutBody = (await logoutResponse.json()) as {
				data?: { endSessionUrl?: string | null };
			};
			endSessionUrl = logoutBody?.data?.endSessionUrl ?? null;
		} catch {
			// 쿠키 로그아웃 실패와 관계없이 진행한다
		}

		account.clear();

		if (endSessionUrl) {
			window.location.href = endSessionUrl;
			return;
		}

		router.replace("/auth/login");
	};

	return (
		<Dropdown.Item id="logout" className="text-danger" onPress={onPress}>
			<span className="flex items-center gap-2">
				<LogOut className="h-4 w-4 text-danger" size={16} />
				{t("로그아웃")}
			</span>
		</Dropdown.Item>
	);
};

AccountLogoutButton.displayName = "AccountLogoutButton";
