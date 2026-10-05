import { redirect } from "next/navigation";

/**
 * 얇은 로그인 UI 앱 — 루트 접근 시 메인 콘솔(admin-web)로 보낸다.
 */
export default function RootPage() {
	redirect(process.env.ADMIN_WEB_URL ?? "https://onjitda.com");
}
