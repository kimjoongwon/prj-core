import { ApiPageClient } from "./_client";

export const metadata = {
	title: "API 설계 | 제대로 만드는 사람들",
	description: "REST API 엔드포인트 설계 및 스펙 문서",
};

export default function ApiPage() {
	return <ApiPageClient />;
}
