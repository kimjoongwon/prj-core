"use client";

import { Button } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const OIDC_LOGIN_START_PATH = "/api/v1/auth/oidc/login?clientId=admin-web";

/**
 * 로그인은 IDP(idp.onjitda.com)의 authorization code 흐름으로 수행한다.
 * 이 페이지는 IDP authorize 시작점(백엔드 리다이렉트)으로 보내기만 하고
 * 자격증명 입력은 IDP 로그인 화면(idp-web)에서 이뤄진다.
 */
function AuthLoginPage() {
	const startOidcLogin = () => {
		const returnTo =
			new URLSearchParams(window.location.search).get("returnTo") ??
			"/dashboard";
		window.location.href = `${OIDC_LOGIN_START_PATH}&returnTo=${encodeURIComponent(returnTo)}`;
	};

	// 접속 즉시 IDP로 이동한다. 자동 이동 전 짧은 사이에 수동 버튼도 노출한다.
	useEffect(() => {
		const timer = window.setTimeout(startOidcLogin, 400);
		return () => window.clearTimeout(timer);
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
			<h1 className="text-xl font-semibold">관리자 로그인</h1>
			<p className="text-sm text-default-500">
				로그인은 IDP(onjitda)를 통해 진행됩니다. 잠시 후 이동합니다.
			</p>
			<Button onPress={startOidcLogin}>IDP로 로그인</Button>
		</main>
	);
}

export default observer(AuthLoginPage);
