"use client";

import { observer } from "mobx-react-lite";

/**
 * 대시보드 페이지
 *
 * 관리자 앱의 기본 랜딩 페이지입니다.
 */
function DashboardPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">대시보드</h1>
				<p className="text-default-500">
					관리자 대시보드에 오신 것을 환영합니다.
				</p>
			</div>

			{/* 추후 대시보드 위젯 추가 예정 */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-xl bg-content1 p-6 shadow-sm">
					<h3 className="text-sm font-medium text-default-500">오늘 예약</h3>
					<p className="mt-2 text-3xl font-bold">-</p>
				</div>
				<div className="rounded-xl bg-content1 p-6 shadow-sm">
					<h3 className="text-sm font-medium text-default-500">전체 회원</h3>
					<p className="mt-2 text-3xl font-bold">-</p>
				</div>
				<div className="rounded-xl bg-content1 p-6 shadow-sm">
					<h3 className="text-sm font-medium text-default-500">신규 문의</h3>
					<p className="mt-2 text-3xl font-bold">-</p>
				</div>
				<div className="rounded-xl bg-content1 p-6 shadow-sm">
					<h3 className="text-sm font-medium text-default-500">이번 달 매출</h3>
					<p className="mt-2 text-3xl font-bold">-</p>
				</div>
			</div>
		</div>
	);
}

export default observer(DashboardPage);
