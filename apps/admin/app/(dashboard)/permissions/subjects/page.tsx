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
	Tab,
	Tabs,
} from "@heroui/react";
import { useEntityPermission } from "@cocrepo/store";

/**
 * Subject 관리 페이지
 */
export default function SubjectsPage() {
	const subjectPermissions = useEntityPermission("subject");

	// 샘플 데이터 (실제로는 API에서 가져옴)
	const subjects = [
		{
			id: "1",
			name: "entity:user",
			displayName: "사용자",
			group: "entity",
			isSystem: true,
		},
		{
			id: "2",
			name: "entity:role",
			displayName: "역할",
			group: "entity",
			isSystem: true,
		},
		{
			id: "3",
			name: "menu:dashboard",
			displayName: "대시보드",
			group: "menu",
			isSystem: true,
		},
		{
			id: "4",
			name: "menu:users",
			displayName: "사용자 관리",
			group: "menu",
			isSystem: true,
		},
		{
			id: "5",
			name: "feature:export",
			displayName: "내보내기",
			group: "feature",
			isSystem: true,
		},
		{
			id: "6",
			name: "ui:button:delete",
			displayName: "삭제 버튼",
			group: "ui",
			isSystem: false,
		},
	];

	const getGroupColor = (
		group: string,
	): "primary" | "success" | "warning" | "secondary" => {
		switch (group) {
			case "entity":
				return "primary";
			case "menu":
				return "success";
			case "feature":
				return "warning";
			case "ui":
				return "secondary";
			default:
				return "primary";
		}
	};

	const renderSubjectTable = (filteredSubjects: typeof subjects) => (
		<Table aria-label="Subject 목록" removeWrapper>
			<TableHeader>
				<TableColumn>이름</TableColumn>
				<TableColumn>표시명</TableColumn>
				<TableColumn>타입</TableColumn>
				<TableColumn>시스템</TableColumn>
				<TableColumn align="center">작업</TableColumn>
			</TableHeader>
			<TableBody>
				{filteredSubjects.map((subject) => (
					<TableRow key={subject.id}>
						<TableCell>
							<code className="rounded bg-default-100 px-2 py-1 text-sm">
								{subject.name}
							</code>
						</TableCell>
						<TableCell>{subject.displayName}</TableCell>
						<TableCell>
							<Chip size="sm" variant="flat" color={getGroupColor(subject.group)}>
								{subject.group}
							</Chip>
						</TableCell>
						<TableCell>
							{subject.isSystem ? (
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
								{subjectPermissions.canUpdate && (
									<Button size="sm" variant="light">
										수정
									</Button>
								)}
								{subjectPermissions.canDelete && !subject.isSystem && (
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
	);

	return (
		<div className="space-y-6">
			{/* 페이지 헤더 */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl text-foreground">Subject 관리</h1>
					<p className="text-default-500">
						CASL Subject 정의를 관리합니다. (대상/리소스)
					</p>
				</div>
				<Can action="create" subject="entity:subject">
					<Button color="primary">새 Subject 추가</Button>
				</Can>
			</div>

			{/* 권한 없음 알림 */}
			<Cannot action="read" subject="entity:subject">
				<Card className="border-warning bg-warning/10">
					<CardBody>
						<p className="text-warning-600">
							Subject 조회 권한이 없습니다. 관리자에게 문의하세요.
						</p>
					</CardBody>
				</Card>
			</Cannot>

			{/* Subject 테이블 */}
			<Can action="read" subject="entity:subject">
				<Card className="shadow-sm">
					<CardHeader className="border-divider border-b">
						<div className="flex items-center justify-between">
							<h2 className="font-semibold">Subject 목록</h2>
							<Chip size="sm" variant="flat">
								총 {subjects.length}개
							</Chip>
						</div>
					</CardHeader>
					<CardBody className="p-0">
						<Tabs
							aria-label="Subject 타입"
							classNames={{
								tabList: "px-4 pt-4",
								panel: "p-0",
							}}
						>
							<Tab key="all" title="전체">
								{renderSubjectTable(subjects)}
							</Tab>
							<Tab key="entity" title="Entity">
								{renderSubjectTable(
									subjects.filter((s) => s.group === "entity"),
								)}
							</Tab>
							<Tab key="menu" title="Menu">
								{renderSubjectTable(subjects.filter((s) => s.group === "menu"))}
							</Tab>
							<Tab key="feature" title="Feature">
								{renderSubjectTable(
									subjects.filter((s) => s.group === "feature"),
								)}
							</Tab>
							<Tab key="ui" title="UI">
								{renderSubjectTable(subjects.filter((s) => s.group === "ui"))}
							</Tab>
						</Tabs>
					</CardBody>
				</Card>
			</Can>
		</div>
	);
}
