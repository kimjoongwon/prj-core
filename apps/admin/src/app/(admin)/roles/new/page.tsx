import { redirect } from "next/navigation";

/**
 * 역할 추가 페이지 (직접 접근)
 *
 * 직접 /roles/new로 접근 시 목록 페이지로 리디렉션합니다.
 * 역할 추가는 모달을 통해서만 가능합니다.
 */
export default function RoleNewPage() {
	redirect("/roles");
}
