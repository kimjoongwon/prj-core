"use client";

import type { Subject } from "@cocrepo/ui";
import {
	Button,
	Card,
	CardBody,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { ChevronDown, Edit2, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

/**
 * Subject 확장 타입 (isSystem 포함)
 */
interface SubjectWithSystem extends Subject {
	/** 시스템 Subject 여부 */
	isSystem?: boolean;
}

interface SubjectManagementTabProps {
	/** Subject 목록 */
	subjects: SubjectWithSystem[];
	/** Subject 추가 핸들러 */
	onAddSubject?: () => void;
	/** Subject 수정 핸들러 */
	onEditSubject?: (subject: SubjectWithSystem) => void;
	/** Subject 삭제 핸들러 */
	onDeleteSubject?: (subjectId: string) => void;
}

/**
 * Subject 그룹 목록
 */
const SUBJECT_GROUPS = [
	{ key: "all", label: "전체" },
	{ key: "entity", label: "엔티티" },
	{ key: "menu", label: "메뉴" },
	{ key: "feature", label: "기능" },
	{ key: "ui", label: "UI 요소" },
] as const;

type SubjectGroupKey = (typeof SUBJECT_GROUPS)[number]["key"];

/**
 * Subject 관리 탭 컴포넌트
 *
 * Subject 목록을 테이블로 표시하고 그룹 필터링 및 CRUD 기능을 제공합니다.
 * 시스템 Subject (entity:xxx)는 수정/삭제가 불가능합니다.
 */
export const SubjectManagementTab = observer(
	({
		subjects,
		onAddSubject,
		onEditSubject,
		onDeleteSubject,
	}: SubjectManagementTabProps) => {
		/** 선택된 그룹 필터 */
		const [selectedGroup, setSelectedGroup] = useState<SubjectGroupKey>("all");

		/**
		 * 그룹별 색상 매핑
		 */
		const getGroupColor = (group?: string) => {
			switch (group) {
				case "entity":
					return "primary";
				case "menu":
					return "secondary";
				case "feature":
					return "success";
				case "ui":
					return "warning";
				default:
					return "default";
			}
		};

		/**
		 * 그룹별 라벨 매핑
		 */
		const getGroupLabel = (group?: string) => {
			const found = SUBJECT_GROUPS.find((g) => g.key === group);
			return found?.label ?? "기타";
		};

		/**
		 * 선택된 그룹의 라벨 가져오기
		 */
		const getSelectedGroupLabel = () => {
			const found = SUBJECT_GROUPS.find((g) => g.key === selectedGroup);
			return found?.label ?? "전체";
		};

		/**
		 * 그룹 필터링된 Subject 목록
		 */
		const filteredSubjects =
			selectedGroup === "all"
				? subjects
				: subjects.filter((s) => s.group === selectedGroup);

		/**
		 * Subject 추가 버튼 클릭
		 */
		const handleAddSubject = () => {
			onAddSubject?.();
		};

		/**
		 * Subject 수정 버튼 클릭
		 */
		const handleEditSubject = (subject: SubjectWithSystem) => {
			onEditSubject?.(subject);
		};

		/**
		 * Subject 삭제 버튼 클릭
		 */
		const handleDeleteSubject = (subjectId: string) => {
			onDeleteSubject?.(subjectId);
		};

		/**
		 * 그룹 선택 핸들러
		 */
		const handleGroupSelect = (keys: Set<string> | "all") => {
			if (keys === "all") {
				setSelectedGroup("all");
				return;
			}
			const selected = Array.from(keys)[0] as SubjectGroupKey;
			if (selected) {
				setSelectedGroup(selected);
			}
		};

		return (
			<Card>
				<CardBody>
					<div className="space-y-4">
						{/* 헤더 */}
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold">Subject 목록</h3>
								<p className="text-sm text-default-500">
									권한에서 사용할 Subject를 관리합니다. 엔티티 기반 Subject는
									Prisma 스키마에서 자동 생성됩니다.
								</p>
							</div>
							<div className="flex items-center gap-2">
								{/* 그룹 필터 */}
								<Dropdown>
									<DropdownTrigger>
										<Button
											variant="flat"
											endContent={<ChevronDown className="h-4 w-4" />}
										>
											{getSelectedGroupLabel()}
										</Button>
									</DropdownTrigger>
									<DropdownMenu
										aria-label="그룹 필터"
										selectionMode="single"
										selectedKeys={new Set([selectedGroup])}
										onSelectionChange={(keys) =>
											handleGroupSelect(keys as Set<string>)
										}
									>
										{SUBJECT_GROUPS.map((group) => (
											<DropdownItem key={group.key}>{group.label}</DropdownItem>
										))}
									</DropdownMenu>
								</Dropdown>

								{/* Subject 추가 버튼 */}
								<Button
									color="primary"
									startContent={<Plus className="h-4 w-4" />}
									onPress={handleAddSubject}
								>
									Subject 추가
								</Button>
							</div>
						</div>

						{/* Subject 테이블 */}
						<Table aria-label="Subject 목록">
							<TableHeader>
								<TableColumn>그룹</TableColumn>
								<TableColumn>이름</TableColumn>
								<TableColumn>표시명</TableColumn>
								<TableColumn>시스템</TableColumn>
								<TableColumn width={100}>작업</TableColumn>
							</TableHeader>
							<TableBody emptyContent="등록된 Subject가 없습니다.">
								{filteredSubjects.map((subject) => (
									<TableRow key={subject.id}>
										<TableCell>
											<Chip
												size="sm"
												color={getGroupColor(subject.group)}
												variant="flat"
											>
												{getGroupLabel(subject.group)}
											</Chip>
										</TableCell>
										<TableCell>
											<code className="rounded bg-default-100 px-2 py-0.5 text-sm">
												{subject.name}
											</code>
										</TableCell>
										<TableCell>{subject.displayName ?? "-"}</TableCell>
										<TableCell>
											{subject.isSystem ? (
												<Chip size="sm" color="default" variant="flat">
													시스템
												</Chip>
											) : (
												"-"
											)}
										</TableCell>
										<TableCell>
											<div className="flex gap-1">
												<Button
													isIconOnly
													size="sm"
													variant="light"
													isDisabled={subject.isSystem}
													onPress={() => handleEditSubject(subject)}
												>
													<Edit2 className="h-4 w-4" />
												</Button>
												<Button
													isIconOnly
													size="sm"
													variant="light"
													color="danger"
													isDisabled={subject.isSystem}
													onPress={() => handleDeleteSubject(subject.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						{/* 안내 메시지 */}
						<p className="text-xs text-default-400">
							💡 <code>entity:xxx</code> Subject는 Prisma 스키마에서 자동
							동기화되어 수정/삭제가 불가능합니다.
						</p>
					</div>
				</CardBody>
			</Card>
		);
	},
);

SubjectManagementTab.displayName = "SubjectManagementTab";
