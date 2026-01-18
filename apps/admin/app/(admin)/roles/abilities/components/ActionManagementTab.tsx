"use client";

import type { Action } from "@cocrepo/ui";
import {
	Button,
	Card,
	CardBody,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";

interface ActionManagementTabProps {
	/** Action 목록 */
	actions: Action[];
}

/**
 * Action 관리 탭 컴포넌트
 *
 * Action 목록을 테이블로 표시하고 CRUD 기능을 제공합니다.
 * 시스템 Action은 수정/삭제가 불가능합니다.
 */
export const ActionManagementTab = observer(
	({ actions }: ActionManagementTabProps) => {
		// 그룹별 색상 매핑
		const getGroupColor = (group?: string) => {
			switch (group) {
				case "crud":
					return "primary";
				case "visibility":
					return "secondary";
				case "workflow":
					return "success";
				case "bulk":
					return "warning";
				default:
					return "default";
			}
		};

		// 그룹별 라벨 매핑
		const getGroupLabel = (group?: string) => {
			switch (group) {
				case "crud":
					return "CRUD";
				case "visibility":
					return "가시성";
				case "workflow":
					return "워크플로우";
				case "bulk":
					return "일괄 작업";
				default:
					return "기타";
			}
		};

		/**
		 * Action 추가 버튼 클릭
		 */
		const handleAddAction = () => {
			// TODO: Action 추가 모달 열기
			console.log("Add action");
		};

		/**
		 * Action 수정 버튼 클릭
		 */
		const handleEditAction = (action: Action) => {
			// TODO: Action 수정 모달 열기
			console.log("Edit action:", action);
		};

		/**
		 * Action 삭제 버튼 클릭
		 */
		const handleDeleteAction = (actionId: string) => {
			// TODO: Action 삭제 확인 후 삭제
			console.log("Delete action:", actionId);
		};

		return (
			<Card>
				<CardBody>
					<div className="space-y-4">
						{/* 헤더 */}
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold">Action 목록</h3>
								<p className="text-sm text-default-500">
									권한에서 사용할 Action을 관리합니다. 시스템 Action은
									수정/삭제가 불가능합니다.
								</p>
							</div>
							<Button
								color="primary"
								startContent={<Plus className="h-4 w-4" />}
								onPress={handleAddAction}
							>
								Action 추가
							</Button>
						</div>

						{/* Action 테이블 */}
						<Table aria-label="Action 목록">
							<TableHeader>
								<TableColumn>이름</TableColumn>
								<TableColumn>표시명</TableColumn>
								<TableColumn>그룹</TableColumn>
								<TableColumn>설명</TableColumn>
								<TableColumn width={100}>작업</TableColumn>
							</TableHeader>
							<TableBody emptyContent="등록된 Action이 없습니다.">
								{actions.map((action) => (
									<TableRow key={action.id}>
										<TableCell>
											<code className="rounded bg-default-100 px-2 py-0.5 text-sm">
												{action.name}
											</code>
										</TableCell>
										<TableCell>{action.displayName ?? "-"}</TableCell>
										<TableCell>
											<Chip
												size="sm"
												color={getGroupColor(action.group)}
												variant="flat"
											>
												{getGroupLabel(action.group)}
											</Chip>
										</TableCell>
										<TableCell className="text-default-500">
											{/* TODO: description 필드 추가 시 표시 */}-
										</TableCell>
										<TableCell>
											<div className="flex gap-1">
												<Button
													isIconOnly
													size="sm"
													variant="light"
													onPress={() => handleEditAction(action)}
												>
													<Edit2 className="h-4 w-4" />
												</Button>
												<Button
													isIconOnly
													size="sm"
													variant="light"
													color="danger"
													onPress={() => handleDeleteAction(action.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardBody>
			</Card>
		);
	},
);

ActionManagementTab.displayName = "ActionManagementTab";
