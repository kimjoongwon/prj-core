import { redirect } from "next/navigation";

/**
 * 권한 관리 기본 페이지
 *
 * /roles/abilities 경로 접근 시 첫 번째 탭(roles)으로 리다이렉트합니다.
 */
export default function AbilitiesPage() {
	redirect("/roles/abilities/roles");
}
