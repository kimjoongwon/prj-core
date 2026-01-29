import { DatabasePageClient } from "./_client";

export const metadata = {
	title: "DB 설계 | 제대로 만드는 사람들",
	description: "데이터베이스 스키마 설계 및 ERD",
};

export default function DatabasePage() {
	return <DatabasePageClient />;
}
