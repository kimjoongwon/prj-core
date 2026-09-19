"use client";

import { nativeLogout } from "@cocrepo/api/core/auth";
import { useApp } from "@cocrepo/store";
import { Dropdown } from "@heroui/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useT } from "../../../i18n";

/**
 * 현재 account session을 종료하고 로그인 화면으로 이동하는 logout button입니다.
 * OIDC 세션과 native 세션 모두 처리합니다.
 */
export const AccountLogoutButton = () => {
	const t = useT();
	const router = useRouter();
	const account = useApp().account;
	const { authSession } = account;

	const onPress = async () => {
		// OIDC 세션의 HttpOnly 쿠키(access/session)를 서버에서 만료시킨다
		try {
			await fetch("/api/v1/auth/logout", {
				method: "POST",
				credentials: "include",
			});
		} catch {
			// 쿠키 로그아웃 실패와 관계없이 진행한다
		}

		// native 세션(sessionId 보유)도 폐기한다
		if (authSession.sessionId) {
			try {
				await nativeLogout({
					sessionId: authSession.sessionId,
					refreshToken: authSession.refreshToken ?? undefined,
				});
			} catch {
				// 세션 폐기 실패와 관계없이 로컬 account 상태는 종료합니다.
			}
		}

		account.clear();
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
