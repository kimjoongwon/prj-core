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
 * Action 관리 페이지
 */
export default function ActionsPage() {
	const actionPermissions = useEntityPermission("action");

	// 샘플 데이터 (실제로는 API에서 가져옴)
	const actions = [
		{
			id: "1",
			name: "create",
			displayName: "생성",
			group: "crud",
			isSystem: true,
		},
		{
			id: "2",
			name: "read",
			displayName: "조회",
			group: "crud",
			isSystem: true,
		},
		{
			id: "3",
			name: "update",
			displayName: "수정",
			group: "crud",
			isSystem: true,
		},
		{
			id: "4",
			name: "delete",
			displayName: "삭제",
			group: "crud",
			isSystem: true,
		},
		{
			id: "5",
			name: "view",
			displayName: "보기",
			group: "visibility",
			isSystem: true,
		},
		{
			id: "6",
			name: "view_masked",
			displayName: "마스킹 보기",
			group: "visibility",
			isSystem: true,
		},
	];

	return (
		<div className="space-y-6">
			{/* 페이지 헤더 */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl text-foreground">Action 관리</h1>
					<p className="text-default-500">
						CASL Action 정의를 관리합니다. (행위/동작)
					</p>
				</div>
				<Can action="create" subject="entity:action">
					<Button color="primary">새 Action 추가</Button>
				</Can>
			</div>

			{/* 권한 없음 알림 */}
			<Cannot action="read" subject="entity:action">
				<Card className="border-warning bg-warning/10">
					<CardBody>
						<p className="text-warning-600">
							Action 조회 권한이 없습니다. 관리자에게 문의하세요.
						</p>
					</CardBody>
				</Card>
			</Cannot>

			{/* Action 테이블 */}
			<Can action="read" subject="entity:action">
				<Card className="shadow-sm">
					<CardHeader className="border-divider border-b">
						<div className="flex items-center justify-between">
							<h2 className="font-semibold">Action 목록</h2>
							<Chip size="sm" variant="flat">
								총 {actions.length}개
							</Chip>
						</div>
					</CardHeader>
					<CardBody className="p-0">
						<Table aria-label="Action 목록" removeWrapper>
							<TableHeader>
								<TableColumn>이름</TableColumn>
								<TableColumn>표시명</TableColumn>
								<TableColumn>그룹</TableColumn>
								<TableColumn>시스템</TableColumn>
								<TableColumn align="center">작업</TableColumn>
							</TableHeader>
							<TableBody>
								{actions.map((action) => (
									<TableRow key={action.id}>
										<TableCell>
											<code className="rounded bg-default-100 px-2 py-1 text-sm">
												{action.name}
											</code>
										</TableCell>
										<TableCell>{action.displayName}</TableCell>
										<TableCell>
											<Chip size="sm" variant="flat" color="primary">
												{action.group}
											</Chip>
										</TableCell>
										<TableCell>
											{action.isSystem ? (
												<Chip size="sm" color="success" variant="dot">
													시스템
												</Chip>
											) : (
												<Chip size="sm" color="default" variant="dot">
													사용자
												</Chip>
											)}
										</TableCell>
										<TableCell>
											<div className="flex justify-center gap-2">
												{actionPermissions.canUpdate && (
													<Button size="sm" variant="light">
														수정
													</Button>
												)}
												{actionPermissions.canDelete && !action.isSystem && (
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
