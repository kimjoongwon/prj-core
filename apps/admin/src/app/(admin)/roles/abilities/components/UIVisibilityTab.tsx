"use client";

import type { Role, Subject } from "@cocrepo/ui";
import {
	Button,
	Card,
	CardBody,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Radio,
	RadioGroup,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { Check, ChevronDown, Eye, EyeOff, X } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";

/**
 * UI 가시성 상태
 */
type VisibilityStatus = "visible" | "hidden" | "limited";

/**
 * UI Subject (ui: 패턴만 필터링)
 */
interface UISubject extends Subject {
	/** 시스템 Subject 여부 */
	isSystem?: boolean;
}

/**
 * 테이블 컬럼 정의
 */
interface TableColumnDef {
	key: string;
	label: string;
	role?: Role;
}

interface UIVisibilityTabProps {
	/** UI Subject 목록 (ui: 패턴) */
	subjects: UISubject[];
	/** Role 목록 */
	roles: Role[];
	/** 가시성 변경 핸들러 */
	onChangeVisibility?: (
		subjectId: string,
		roleId: string,
		status: VisibilityStatus,
	) => void;
	/** 저장 핸들러 */
	onSave?: () => void;
	/** 초기화 핸들러 */
	onReset?: () => void;
}

/**
 * 앱 타입 옵션
 */
const APP_OPTIONS = [
	{ key: "mobile", label: "모바일" },
	{ key: "web-admin", label: "웹 (Admin)" },
	{ key: "web-user", label: "웹 (User)" },
] as const;

type AppType = (typeof APP_OPTIONS)[number]["key"];

/**
 * UI 요소 가시성 탭 컴포넌트
 *
 * Role별 UI 요소(ui:xxx Subject) 가시성을 매트릭스 형태로 관리합니다.
 */
export const UIVisibilityTab = observer(
	({
		subjects,
		roles,
		onChangeVisibility,
		onSave,
		onReset,
	}: UIVisibilityTabProps) => {
		const state = useLocalObservable(() => ({
			/** 선택된 앱 타입 */
			selectedApp: "mobile" as AppType,
			/** UI 요소별 가시성 (로컬 상태) */
			visibilityMap: new Map<string, Map<string, VisibilityStatus>>(),
			/** 수정 여부 */
			isDirty: false,
		}));

		/**
		 * UI Subject만 필터링 (ui: 패턴)
		 */
		const uiSubjects = subjects.filter((s) => s.group === "ui");

		/**
		 * 앱 타입에 따른 UI Subject 필터링
		 */
		const filteredSubjects = uiSubjects.filter((s) => {
			if (state.selectedApp === "mobile") {
				return (
					s.name.includes("mobile") ||
					s.name.includes("bottom-tab") ||
					s.name.includes("floating")
				);
			}
			if (state.selectedApp === "web-admin") {
				return (
					s.name.includes("sidebar") ||
					s.name.includes("admin") ||
					s.name.includes("banner")
				);
			}
			if (state.selectedApp === "web-user") {
				return (
					s.name.includes("user") ||
					s.name.includes("banner") ||
					!s.name.includes("admin")
				);
			}
			return true;
		});

		/**
		 * 테이블 컬럼 정의 생성
		 */
		const columns: TableColumnDef[] = [
			{ key: "ui-element", label: "UI 요소" },
			...roles.map((role) => ({
				key: role.id,
				label: role.displayName ?? role.name,
				role,
			})),
		];

		/**
		 * 가시성 상태 가져오기
		 */
		const getVisibility = (
			subjectId: string,
			roleId: string,
		): VisibilityStatus => {
			const subjectMap = state.visibilityMap.get(subjectId);
			if (subjectMap) {
				return subjectMap.get(roleId) ?? "visible";
			}
			// 기본값: SUPER_ADMIN은 항상 visible, 나머지는 visible
			return "visible";
		};

		/**
		 * 가시성 상태 변경
		 */
		const setVisibility = (
			subjectId: string,
			roleId: string,
			status: VisibilityStatus,
		) => {
			let subjectMap = state.visibilityMap.get(subjectId);
			if (!subjectMap) {
				subjectMap = new Map<string, VisibilityStatus>();
				state.visibilityMap.set(subjectId, subjectMap);
			}
			subjectMap.set(roleId, status);
			state.isDirty = true;
			onChangeVisibility?.(subjectId, roleId, status);
		};

		/**
		 * 가시성 상태 아이콘/색상
		 */
		const getVisibilityDisplay = (status: VisibilityStatus) => {
			switch (status) {
				case "visible":
					return {
						icon: <Check className="h-4 w-4" />,
						color: "success" as const,
						label: "표시",
					};
				case "hidden":
					return {
						icon: <X className="h-4 w-4" />,
						color: "danger" as const,
						label: "숨김",
					};
				case "limited":
					return {
						icon: <Eye className="h-4 w-4" />,
						color: "warning" as const,
						label: "제한적",
					};
			}
		};

		/**
		 * 앱 선택 변경 핸들러
		 */
		const handleAppChange = (keys: Set<string> | "all") => {
			if (keys === "all") return;
			const selected = Array.from(keys)[0] as AppType;
			if (selected) {
				state.selectedApp = selected;
			}
		};

		/**
		 * 선택된 앱 라벨 가져오기
		 */
		const getSelectedAppLabel = () => {
			const found = APP_OPTIONS.find((opt) => opt.key === state.selectedApp);
			return found?.label ?? "모바일";
		};

		/**
		 * 저장 핸들러
		 */
		const handleSave = () => {
			onSave?.();
			state.isDirty = false;
		};

		/**
		 * 초기화 핸들러
		 */
		const handleReset = () => {
			state.visibilityMap.clear();
			state.isDirty = false;
			onReset?.();
		};

		/**
		 * 셀 렌더링
		 */
		const renderCell = (subject: UISubject, columnKey: string) => {
			if (columnKey === "ui-element") {
				return (
					<div className="flex flex-col gap-1">
						<span className="font-medium">
							{subject.displayName ?? subject.name}
						</span>
						<code className="text-xs text-default-400">{subject.name}</code>
					</div>
				);
			}

			// Role 컬럼
			const column = columns.find((col) => col.key === columnKey);
			const role = column?.role;
			if (!role) return null;

			const visibility = getVisibility(subject.id, role.id);
			const display = getVisibilityDisplay(visibility);
			const isSuperAdmin = role.name === "SUPER_ADMIN";

			if (isSuperAdmin) {
				return (
					<Chip
						size="sm"
						color="success"
						variant="flat"
						startContent={<Check className="h-3 w-3" />}
					>
						표시
					</Chip>
				);
			}

			return (
				<Popover placement="bottom">
					<PopoverTrigger>
						<Button
							size="sm"
							variant="flat"
							color={display.color}
							className="min-w-[70px]"
						>
							{display.icon}
							<span className="ml-1">{display.label}</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<div className="p-3">
							<p className="mb-2 text-sm font-medium">
								{subject.displayName} - {role.displayName}
							</p>
							<RadioGroup
								value={visibility}
								onValueChange={(value) =>
									setVisibility(subject.id, role.id, value as VisibilityStatus)
								}
							>
								<Radio value="visible">
									<div className="flex items-center gap-2">
										<Eye className="h-4 w-4 text-success" />
										<span>표시 (access 권한 부여)</span>
									</div>
								</Radio>
								<Radio value="hidden">
									<div className="flex items-center gap-2">
										<EyeOff className="h-4 w-4 text-danger" />
										<span>숨김 (access 권한 없음)</span>
									</div>
								</Radio>
							</RadioGroup>
						</div>
					</PopoverContent>
				</Popover>
			);
		};

		return (
			<Card>
				<CardBody>
					<div className="space-y-4">
						{/* 헤더 */}
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold">UI 요소 가시성</h3>
								<p className="text-sm text-default-500">
									Role별 UI 요소(ui:xxx)의 가시성을 설정합니다.
								</p>
							</div>
							<div className="flex items-center gap-2">
								{/* 앱 선택 */}
								<Dropdown>
									<DropdownTrigger>
										<Button
											variant="flat"
											endContent={<ChevronDown className="h-4 w-4" />}
										>
											{getSelectedAppLabel()}
										</Button>
									</DropdownTrigger>
									<DropdownMenu
										aria-label="앱 선택"
										selectionMode="single"
										selectedKeys={new Set([state.selectedApp])}
										onSelectionChange={(keys) =>
											handleAppChange(keys as Set<string>)
										}
									>
										{APP_OPTIONS.map((opt) => (
											<DropdownItem key={opt.key}>{opt.label}</DropdownItem>
										))}
									</DropdownMenu>
								</Dropdown>

								{/* 저장/초기화 버튼 */}
								<Button
									variant="flat"
									onPress={handleReset}
									isDisabled={!state.isDirty}
								>
									초기화
								</Button>
								<Button
									color="primary"
									onPress={handleSave}
									isDisabled={!state.isDirty}
								>
									저장
								</Button>
							</div>
						</div>

						{/* 가시성 매트릭스 테이블 */}
						<div className="overflow-x-auto">
							<Table aria-label="UI 요소 가시성 매트릭스" removeWrapper>
								<TableHeader columns={columns}>
									{(column) => (
										<TableColumn
											key={column.key}
											className={
												column.key === "ui-element"
													? "min-w-[200px]"
													: "min-w-[100px] text-center"
											}
										>
											{column.label}
										</TableColumn>
									)}
								</TableHeader>
								<TableBody
									items={filteredSubjects}
									emptyContent={
										filteredSubjects.length === 0
											? "해당 앱의 UI 요소가 없습니다."
											: "데이터 없음"
									}
								>
									{(subject) => (
										<TableRow key={subject.id}>
											{(columnKey) => (
												<TableCell
													className={
														columnKey === "ui-element" ? "" : "text-center"
													}
												>
													{renderCell(subject, columnKey as string)}
												</TableCell>
											)}
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>

						{/* 범례 */}
						<div className="flex items-center gap-4 text-sm text-default-500">
							<span>범례:</span>
							<div className="flex items-center gap-1">
								<Chip size="sm" color="success" variant="flat">
									<Check className="h-3 w-3" />
								</Chip>
								<span>표시</span>
							</div>
							<div className="flex items-center gap-1">
								<Chip size="sm" color="danger" variant="flat">
									<X className="h-3 w-3" />
								</Chip>
								<span>숨김</span>
							</div>
						</div>

						{/* 안내 메시지 */}
						<p className="text-xs text-default-400">
							SUPER_ADMIN은 모든 UI 요소에 접근 가능하며, 수정할 수 없습니다
							(시스템 고정).
						</p>
					</div>
				</CardBody>
			</Card>
		);
	},
);

UIVisibilityTab.displayName = "UIVisibilityTab";
