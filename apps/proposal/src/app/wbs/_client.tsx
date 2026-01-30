"use client";

import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Spinner,
	Tab,
	Tabs,
	useDisclosure,
} from "@heroui/react";
import {
	Calendar,
	FileText,
	FolderOpen,
	List,
	Plus,
	RefreshCw,
	Sparkles,
	Trash2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { PlanFolder, WbsData, WbsTask } from "../../types/wbs";

/**
 * GanttChart에서 변환된 ID를 원래 형식으로 복원 (하이픈을 점으로)
 * 예: "1-2" → "1.2"
 */
function restoreTaskId(sanitizedId: string): string {
	return sanitizedId.replace(/-/g, ".");
}

// SSR 비활성화하여 간트 차트 로드
const GanttChart = dynamic(
	() =>
		import("../../components/GanttChart").then((mod) => mod.GanttChartInner),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-[500px] items-center justify-center">
				<Spinner size="lg" label="간트 차트 로딩 중..." />
			</div>
		),
	},
);

type ViewMode = "Day" | "Week" | "Month";

interface WbsSummary {
	id: string;
	name: string;
	description: string;
	startDate: string;
	taskCount: number;
	sourceType: "plan" | "manual";
	sourcePath?: string;
	updatedAt: string;
}

/**
 * 진행 상태에 따른 색상 반환
 */
function getStatusColor(progress: number): "success" | "warning" | "default" {
	if (progress === 100) return "success";
	if (progress > 0) return "warning";
	return "default";
}

/**
 * 진행 상태 레이블 반환
 */
function getStatusLabel(progress: number): string {
	if (progress === 100) return "완료";
	if (progress > 0) return "진행중";
	return "예정";
}

/**
 * 태스크를 계층 구조로 그룹화
 */
function groupTasksByParent(
	tasks: WbsTask[],
): Map<string | undefined, WbsTask[]> {
	const groups = new Map<string | undefined, WbsTask[]>();

	for (const task of tasks) {
		const parentId = task.parentId;
		if (!groups.has(parentId)) {
			groups.set(parentId, []);
		}
		groups.get(parentId)!.push(task);
	}

	return groups;
}

/**
 * 통계 계산
 */
function calculateStats(tasks: WbsTask[]) {
	const leafTasks = tasks.filter((t) => !t.isGroup);
	const completed = leafTasks.filter((t) => t.progress === 100).length;
	const inProgress = leafTasks.filter(
		(t) => t.progress > 0 && t.progress < 100,
	).length;
	const pending = leafTasks.filter((t) => t.progress === 0).length;
	const groups = tasks.filter((t) => t.isGroup).length;

	return { total: leafTasks.length, completed, inProgress, pending, groups };
}

/**
 * WBS 페이지 클라이언트 컴포넌트
 */
export function WBSClient() {
	// WBS 목록 상태
	const [wbsList, setWbsList] = useState<WbsSummary[]>([]);
	const [selectedWbsId, setSelectedWbsId] = useState<string | null>(null);
	const [wbsData, setWbsData] = useState<WbsData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<ViewMode>("Week");
	const [activeTab, setActiveTab] = useState<"gantt" | "list">("gantt");

	// 생성 모달 상태
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [planFolders, setPlanFolders] = useState<PlanFolder[]>([]);
	const [selectedPlanId, setSelectedPlanId] = useState<string>("");
	const [startDate, setStartDate] = useState(
		new Date().toISOString().split("T")[0],
	);
	const [isGenerating, setIsGenerating] = useState(false);

	// WBS 목록 로드
	const loadWbsList = async () => {
		try {
			const response = await fetch("/api/wbs/list");
			if (!response.ok) throw new Error("WBS 목록 로드 실패");
			const data = await response.json();
			setWbsList(data);

			// 기본 선택: 첫 번째 WBS
			if (data.length > 0 && !selectedWbsId) {
				setSelectedWbsId(data[0].id);
			}
		} catch (err) {
			console.error("WBS 목록 로드 실패:", err);
		}
	};

	// 특정 WBS 데이터 로드
	const loadWbsData = async (id: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/wbs/${id}`);
			if (!response.ok) throw new Error("WBS 데이터 로드 실패");
			const data = await response.json();
			setWbsData(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "알 수 없는 오류");
			setWbsData(null);
		} finally {
			setIsLoading(false);
		}
	};

	// 기획 폴더 목록 로드
	const loadPlanFolders = async () => {
		try {
			const response = await fetch("/api/wbs/plans");
			if (!response.ok) throw new Error("기획 폴더 목록 로드 실패");
			const data = await response.json();
			setPlanFolders(data);
		} catch (err) {
			console.error("기획 폴더 목록 로드 실패:", err);
		}
	};

	// WBS 생성
	const handleGenerateWbs = async () => {
		if (!selectedPlanId) return;

		setIsGenerating(true);
		try {
			const response = await fetch("/api/wbs/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					planId: selectedPlanId,
					options: { startDate },
					saveToFile: true,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "WBS 생성 실패");
			}

			const result = await response.json();

			// 목록 새로고침 및 새로 생성된 WBS 선택
			await loadWbsList();
			setSelectedWbsId(result.wbs.id);
			onClose();
		} catch (err) {
			alert(err instanceof Error ? err.message : "WBS 생성에 실패했습니다");
		} finally {
			setIsGenerating(false);
		}
	};

	// WBS 삭제
	const handleDeleteWbs = async (id: string) => {
		if (!confirm("이 WBS를 삭제하시겠습니까?")) return;

		try {
			const response = await fetch(`/api/wbs/${id}`, { method: "DELETE" });
			if (!response.ok) throw new Error("WBS 삭제 실패");

			await loadWbsList();
			if (selectedWbsId === id) {
				setSelectedWbsId(wbsList.length > 1 ? wbsList[0].id : null);
			}
		} catch (_err) {
			alert("WBS 삭제에 실패했습니다");
		}
	};

	// 초기 로드
	useEffect(() => {
		loadWbsList();
	}, []);

	// 선택된 WBS 변경 시 데이터 로드
	useEffect(() => {
		if (selectedWbsId) {
			loadWbsData(selectedWbsId);
		} else {
			setWbsData(null);
			setIsLoading(false);
		}
	}, [selectedWbsId]);

	// 모달 열릴 때 기획 폴더 로드
	useEffect(() => {
		if (isOpen) {
			loadPlanFolders();
		}
	}, [isOpen]);

	// 태스크 날짜 변경 핸들러
	const handleDateChange = async (
		task: { id: string },
		start: Date,
		end: Date,
	) => {
		if (!selectedWbsId) return;

		try {
			const originalId = restoreTaskId(task.id);
			await fetch(`/api/wbs/${selectedWbsId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					taskId: originalId,
					updates: {
						start: start.toISOString().split("T")[0],
						end: end.toISOString().split("T")[0],
					},
				}),
			});
			loadWbsData(selectedWbsId);
		} catch (err) {
			console.error("날짜 변경 실패:", err);
		}
	};

	// 태스크 진행률 변경 핸들러
	const handleProgressChange = async (
		task: { id: string },
		progress: number,
	) => {
		if (!selectedWbsId) return;

		try {
			const originalId = restoreTaskId(task.id);
			await fetch(`/api/wbs/${selectedWbsId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					taskId: originalId,
					updates: { progress: Math.round(progress) },
				}),
			});
			loadWbsData(selectedWbsId);
		} catch (err) {
			console.error("진행률 변경 실패:", err);
		}
	};

	return (
		<div className="py-8">
			{/* 헤더 */}
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-default-800">
						<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							WBS
						</span>{" "}
						관리
					</h2>
					<p className="mt-1 text-sm text-default-500">
						Work Breakdown Structure - 기획 문서 기반 자동 생성
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						color="primary"
						startContent={<Plus className="size-4" />}
						onPress={onOpen}
					>
						기획에서 생성
					</Button>
					<Button
						variant="flat"
						startContent={<RefreshCw className="size-4" />}
						onPress={loadWbsList}
					>
						새로고침
					</Button>
				</div>
			</div>

			{/* WBS 목록 카드 */}
			<div className="mb-6">
				<Card className="bg-content1 shadow-sm">
					<CardHeader className="pb-2">
						<div className="flex items-center gap-2">
							<FolderOpen className="size-5 text-primary" />
							<span className="font-semibold">WBS 목록</span>
							<Chip size="sm" variant="flat">
								{wbsList.length}개
							</Chip>
						</div>
					</CardHeader>
					<Divider />
					<CardBody className="pt-3">
						{wbsList.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-8 text-default-500">
								<FileText className="mb-2 size-12 opacity-50" />
								<p>생성된 WBS가 없습니다</p>
								<p className="text-sm">
									&quot;기획에서 생성&quot; 버튼을 눌러 WBS를 생성하세요
								</p>
							</div>
						) : (
							<div className="flex flex-wrap gap-2">
								{wbsList.map((wbs) => (
									<div key={wbs.id} className="flex items-center gap-1">
										<Button
											size="sm"
											variant={selectedWbsId === wbs.id ? "solid" : "flat"}
											color={selectedWbsId === wbs.id ? "primary" : "default"}
											onPress={() => setSelectedWbsId(wbs.id)}
											className="flex items-center gap-2"
										>
											{wbs.sourceType === "plan" ? (
												<Sparkles className="size-3" />
											) : (
												<FileText className="size-3" />
											)}
											{wbs.name}
											<Chip size="sm" variant="flat" className="ml-1">
												{wbs.taskCount}
											</Chip>
										</Button>
										<Button
											size="sm"
											variant="light"
											color="danger"
											isIconOnly
											onPress={() => handleDeleteWbs(wbs.id)}
										>
											<Trash2 className="size-3" />
										</Button>
									</div>
								))}
							</div>
						)}
					</CardBody>
				</Card>
			</div>

			{/* 선택된 WBS 표시 */}
			{isLoading ? (
				<div className="flex h-64 items-center justify-center">
					<Spinner size="lg" label="WBS 데이터 로딩 중..." />
				</div>
			) : error ? (
				<div className="flex h-64 flex-col items-center justify-center gap-4">
					<p className="text-danger">오류: {error}</p>
					<Button
						color="primary"
						onPress={() => selectedWbsId && loadWbsData(selectedWbsId)}
					>
						다시 시도
					</Button>
				</div>
			) : !wbsData ? (
				<div className="flex h-64 flex-col items-center justify-center gap-4 text-default-500">
					<Calendar className="size-16 opacity-50" />
					<p>WBS를 선택하거나 새로 생성하세요</p>
				</div>
			) : (
				<>
					{/* WBS 정보 헤더 */}
					<div className="mb-4">
						<h3 className="text-xl font-bold">{wbsData.name}</h3>
						<p className="text-sm text-default-500">
							시작일: {wbsData.startDate}
							{wbsData.metadata.sourcePath && (
								<span className="ml-4">
									소스: {wbsData.metadata.sourcePath}
								</span>
							)}
						</p>
					</div>

					{/* 통계 카드 */}
					<div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
						<Card className="bg-content1 shadow-sm">
							<CardBody className="py-4 text-center">
								<p className="text-2xl font-bold text-primary">
									{calculateStats(wbsData.tasks).groups}
								</p>
								<p className="text-xs text-default-500">주요 단계</p>
							</CardBody>
						</Card>
						<Card className="bg-content1 shadow-sm">
							<CardBody className="py-4 text-center">
								<p className="text-2xl font-bold text-success">
									{calculateStats(wbsData.tasks).completed}
								</p>
								<p className="text-xs text-default-500">완료</p>
							</CardBody>
						</Card>
						<Card className="bg-content1 shadow-sm">
							<CardBody className="py-4 text-center">
								<p className="text-2xl font-bold text-warning">
									{calculateStats(wbsData.tasks).inProgress}
								</p>
								<p className="text-xs text-default-500">진행중</p>
							</CardBody>
						</Card>
						<Card className="bg-content1 shadow-sm">
							<CardBody className="py-4 text-center">
								<p className="text-2xl font-bold text-default-400">
									{calculateStats(wbsData.tasks).pending}
								</p>
								<p className="text-xs text-default-500">예정</p>
							</CardBody>
						</Card>
					</div>

					{/* 탭 + 뷰 모드 선택 */}
					<div className="mb-4 flex items-center justify-between">
						<Tabs
							aria-label="WBS 뷰"
							selectedKey={activeTab}
							onSelectionChange={(key) => setActiveTab(key as "gantt" | "list")}
							color="primary"
							variant="underlined"
						>
							<Tab
								key="gantt"
								title={
									<div className="flex items-center gap-2">
										<Calendar className="size-4" />
										<span>간트 차트</span>
									</div>
								}
							/>
							<Tab
								key="list"
								title={
									<div className="flex items-center gap-2">
										<List className="size-4" />
										<span>작업 목록</span>
									</div>
								}
							/>
						</Tabs>

						{activeTab === "gantt" && (
							<div className="flex gap-2">
								{(["Day", "Week", "Month"] as const).map((mode) => (
									<Button
										key={mode}
										size="sm"
										variant={viewMode === mode ? "solid" : "flat"}
										color={viewMode === mode ? "primary" : "default"}
										onPress={() => setViewMode(mode)}
									>
										{mode === "Day" ? "일" : mode === "Week" ? "주" : "월"}
									</Button>
								))}
							</div>
						)}
					</div>

					{/* 콘텐츠 */}
					{activeTab === "gantt" ? (
						<Card className="bg-content1 shadow-sm">
							<CardBody className="p-4">
								<GanttChart
									tasks={wbsData.tasks}
									viewMode={viewMode}
									height={500}
									onDateChange={handleDateChange}
									onProgressChange={handleProgressChange}
								/>
							</CardBody>
						</Card>
					) : (
						<div className="space-y-4">
							{wbsData.tasks
								.filter((t) => t.isGroup)
								.map((group) => {
									const taskGroups = groupTasksByParent(wbsData.tasks);
									const children = taskGroups.get(group.id) || [];

									return (
										<Card key={group.id} className="bg-content1 shadow-sm">
											<CardHeader className="pb-2">
												<div className="flex w-full items-center justify-between">
													<h3 className="text-lg font-semibold">
														{group.id}. {group.name}
													</h3>
													<Chip
														size="sm"
														color={getStatusColor(group.progress)}
														variant="flat"
													>
														{group.progress}%
													</Chip>
												</div>
											</CardHeader>
											<Divider />
											<CardBody className="pt-3">
												<div className="space-y-2">
													{children.map((task) => (
														<div
															key={task.id}
															className="flex items-center justify-between rounded-lg bg-content2 p-3"
														>
															<div className="flex items-center gap-3">
																<span className="font-mono text-sm text-default-500">
																	{task.id}
																</span>
																<span>{task.name}</span>
															</div>
															<div className="flex items-center gap-3">
																<span className="text-xs text-default-500">
																	{task.start} ~ {task.end}
																</span>
																<Chip
																	size="sm"
																	color={getStatusColor(task.progress)}
																	variant="flat"
																>
																	{getStatusLabel(task.progress)}
																</Chip>
															</div>
														</div>
													))}
												</div>
											</CardBody>
										</Card>
									);
								})}
						</div>
					)}
				</>
			)}

			{/* WBS 생성 모달 */}
			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalContent>
					<ModalHeader className="flex items-center gap-2">
						<Sparkles className="size-5 text-primary" />
						기획 문서에서 WBS 생성
					</ModalHeader>
					<ModalBody>
						<p className="mb-4 text-sm text-default-500">
							기획 문서(README.md)를 분석하여 5단계 개발 플로우 기반의 WBS를
							자동으로 생성합니다.
						</p>

						<Select
							label="기획 문서 선택"
							placeholder="WBS를 생성할 기획을 선택하세요"
							selectedKeys={selectedPlanId ? [selectedPlanId] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								setSelectedPlanId(selected || "");
							}}
							classNames={{
								trigger: "h-auto py-2",
							}}
						>
							{planFolders.map((folder) => (
								<SelectItem key={folder.id} textValue={folder.name}>
									<div className="flex flex-col">
										<span className="font-medium">{folder.name}</span>
										<span className="text-xs text-default-500">
											{folder.path} ({folder.documentCount}개 문서)
										</span>
									</div>
								</SelectItem>
							))}
						</Select>

						<Input
							type="date"
							label="프로젝트 시작일"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>

						<div className="rounded-lg bg-content2 p-3">
							<p className="text-sm font-medium">생성될 WBS 구조</p>
							<ul className="mt-2 space-y-1 text-xs text-default-500">
								<li>Stage 1: 데이터 설계 (3일)</li>
								<li>Stage 2: 스키마 구현 (2일)</li>
								<li>Stage 3: 백엔드 로직 (5일)</li>
								<li>Stage 4: 컴포넌트 구현 (5일)</li>
								<li>Stage 5: 페이지 통합 (3일)</li>
								<li>테스트 및 QA (3일)</li>
							</ul>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={onClose}>
							취소
						</Button>
						<Button
							color="primary"
							onPress={handleGenerateWbs}
							isLoading={isGenerating}
							isDisabled={!selectedPlanId}
							startContent={!isGenerating && <Sparkles className="size-4" />}
						>
							WBS 생성
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
