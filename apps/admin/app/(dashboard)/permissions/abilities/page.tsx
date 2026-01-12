"use client";

import { Can, Cannot } from "@cocrepo/ui";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { useEntityPermission } from "@cocrepo/store";

/**
 * Ability 관리 페이지
 */
export default function AbilitiesPage() {
	const abilityPermissions = useEntityPermission("ability");

	// 샘플 데이터 (실제로는 API에서 가져옴)
	const abilities = [
		{
			id: "1",
			action: "manage",
			subject: "all",
			role: "시스템 관리자",
			inverted: false,
			isActive: true,
		},
		{
			id: "2",
			action: "read",
			subject: "entity:user",
			role: "일반 관리자",
			inverted: false,
			isActive: true,
		},
		{
			id: "3",
			action: "update",
			subject: "entity:user",
			role: "일반 관리자",
			inverted: false,
			isActive: true,
		},
		{
			id: "4",
			action: "delete",
			subject: "entity:admin",
			role: "일반 관리자",
			inverted: true,
			isActive: true,
		},
		{
			id: "5",
			action: "view",
			subject: "menu:dashboard",
			role: "뷰어",
			inverted: false,
			isActive: true,
		},
		{
			id: "6",
			action: "view",
			subject: "menu:settings",
			role: "뷰어",
			inverted: true,
			isActive: true,
		},
	];

	return (
		<div className="space-y-6">
			{/* 페이지 헤더 */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl text-foreground">Ability 관리</h1>
					<p className="text-default-500">
						CASL Ability 규칙을 관리합니다. (권한 규칙)
					</p>
				</div>
				<Can action="create" subject="entity:ability">
					<Button color="primary">새 Ability 추가</Button>
				</Can>
			</div>

			{/* 권한 없음 알림 */}
			<Cannot action="read" subject="entity:ability">
				<Card className="border-warning bg-warning/10">
					<CardBody>
						<p className="text-warning-600">
							Ability 조회 권한이 없습니다. 관리자에게 문의하세요.
						</p>
					</CardBody>
				</Card>
			</Cannot>

			{/* 설명 카드 */}
			<Can action="read" subject="entity:ability">
				<Card className="border-primary/20 bg-primary/5">
					<CardBody>
						<div className="space-y-2">
							<h3 className="font-medium text-primary">Ability 규칙 이해하기</h3>
							<ul className="list-inside list-disc space-y-1 text-default-600 text-sm">
								<li>
									<strong>허용(can)</strong>: 특정 Action을 특정 Subject에 대해
									수행할 수 있음
								</li>
								<li>
									<strong>거부(cannot)</strong>: 특정 Action을 특정 Subject에
									대해 수행할 수 없음 (inverted)
								</li>
								<li>
									거부 규칙이 허용 규칙보다 우선순위가 높습니다.
								</li>
							</ul>
						</div>
					</CardBody>
				</Card>
			</Can>

			{/* Ability 테이블 */}
			<Can action="read" subject="entity:ability">
				<Card className="shadow-sm">
					<CardHeader className="border-divider border-b">
						<div className="flex items-center justify-between">
							<h2 className="font-semibold">Ability 목록</h2>
							<Chip size="sm" variant="flat">
								총 {abilities.length}개
							</Chip>
						</div>
					</CardHeader>
					<CardBody className="p-0">
						<Table aria-label="Ability 목록" removeWrapper>
							<TableHeader>
								<TableColumn>역할</TableColumn>
								<TableColumn>Action</TableColumn>
								<TableColumn>Subject</TableColumn>
								<TableColumn>타입</TableColumn>
								<TableColumn>상태</TableColumn>
								<TableColumn align="center">작업</TableColumn>
							</TableHeader>
							<TableBody>
								{abilities.map((ability) => (
									<TableRow key={ability.id}>
										<TableCell>
											<Chip size="sm" variant="flat">
												{ability.role}
											</Chip>
										</TableCell>
										<TableCell>
											<code className="rounded bg-default-100 px-2 py-1 text-sm">
												{ability.action}
											</code>
										</TableCell>
										<TableCell>
											<code className="rounded bg-default-100 px-2 py-1 text-sm">
												{ability.subject}
											</code>
										</TableCell>
										<TableCell>
											{ability.inverted ? (
												<Chip size="sm" color="danger" variant="flat">
													거부 (cannot)
												</Chip>
											) : (
												<Chip size="sm" color="success" variant="flat">
													허용 (can)
												</Chip>
											)}
										</TableCell>
										<TableCell>
											{ability.isActive ? (
												<Chip size="sm" color="success" variant="dot">
													활성
												</Chip>
											) : (
												<Chip size="sm" color="default" variant="dot">
													비활성
												</Chip>
											)}
										</TableCell>
										<TableCell>
											<div className="flex justify-center gap-2">
												{abilityPermissions.canUpdate && (
													<Button size="sm" variant="light">
														수정
													</Button>
												)}
												{abilityPermissions.canDelete && (
													<Button size="sm" variant="light" color="danger">
														삭제
													</Button>
												)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardBody>
				</Card>
			</Can>
		</div>
	);
}
