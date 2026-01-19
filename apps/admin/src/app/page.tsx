import { redirect } from "next/navigation";

/**
 * 루트 페이지
 *
 * 대시보드로 리다이렉트합니다.
 */
export default function HomePage() {
	redirect("/dashboard");
}
