import { AdminLayoutWrapper } from "../../src/components";

/**
 * Admin 레이아웃
 * /admin/* 경로의 페이지에 AdminLayout을 적용합니다.
 * (단, /admin/auth/*, /admin/select-space 제외)
 */
export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
