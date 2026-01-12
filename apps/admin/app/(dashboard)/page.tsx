"use client";

import { Can } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 대시보드 메인 페이지
 */
export default function DashboardPage() {
	return (
		<div className="space-y-6">
			{/* 페이지 헤더 */}
			<div>
				<h1 className="font-bold text-2xl text-foreground">대시보드</h1>
				<p className="text-default-500">시스템 현황을 한눈에 확인하세요.</p>
			</div>

			{/* 통계 카드들 */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Can action="read" subject="entity:user">
					<Card className="shadow-sm">
						<CardBody className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-default-500 text-sm">총 사용자</p>
									<p className="font-bold text-2xl">1,234</p>
								</div>
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
									<span className="text-2xl">👥</span>
								</div>
							</div>
						</CardBody>
					</Card>
				</Can>

				<Can action="read" subject="entity:role">
					<Card className="shadow-sm">
						<CardBody className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-default-500 text-sm">역할</p>
									<p className="font-bold text-2xl">12</p>
								</div>
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
									<span className="text-2xl">🛡️</span>
								</div>
							</div>
						</CardBody>
					</Card>
				</Can>

				<Can action="read" subject="entity:action">
					<Card className="shadow-sm">
						<CardBody className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-default-500 text-sm">Action</p>
									<p className="font-bold text-2xl">18</p>
								</div>
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
									<span className="text-2xl">⚡</span>
								</div>
							</div>
						</CardBody>
					</Card>
				</Can>

				<Can action="read" subject="entity:subject">
					<Card className="shadow-sm">
						<CardBody className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-default-500 text-sm">Subject</p>
									<p className="font-bold text-2xl">45</p>
								</div>
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
									<span className="text-2xl">📋</span>
								</div>
							</div>
						</CardBody>
					</Card>
				</Can>
			</div>

			{/* 메인 컨텐츠 영역 */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<Card className="shadow-sm">
					<CardHeader className="border-divider border-b">
						<h2 className="font-semibold text-lg">최근 활동</h2>
					</CardHeader>
					<CardBody>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="h-2 w-2 rounded-full bg-success" />
								<div>
									<p className="text-sm">새 사용자가 등록되었습니다.</p>
									<p className="text-default-400 text-xs">5분 전</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="h-2 w-2 rounded-full bg-primary" />
								<div>
									<p className="text-sm">역할 권한이 수정되었습니다.</p>
									<p className="text-default-400 text-xs">1시간 전</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="h-2 w-2 rounded-full bg-warning" />
								<div>
									<p className="text-sm">시스템 설정이 변경되었습니다.</p>
									<p className="text-default-400 text-xs">3시간 전</p>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>

				<Card className="shadow-sm">
					<CardHeader className="border-divider border-b">
						<h2 className="font-semibold text-lg">권한 시스템 현황</h2>
					</CardHeader>
					<CardBody>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-default-600 text-sm">Action 정의</span>
								<span className="font-medium">18개</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-default-600 text-sm">Subject 정의</span>
								<span className="font-medium">45개</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-default-600 text-sm">Ability 규칙</span>
								<span className="font-medium">156개</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-default-600 text-sm">활성 역할</span>
								<span className="font-medium">12개</span>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
