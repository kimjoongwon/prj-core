"use client";

import type { Action } from "@cocrepo/ui";
import { HStack, PageSurface, SectionSurface } from "@cocrepo/ui";
import {
	Button,
	Chip,
	Code,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
} from "@heroui/react";
import { Edit2, Info, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useActionsPage } from "./hooks";

/**
 * 그룹별 색상 매핑
 */
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

/**
 * 그룹별 라벨 매핑
 */
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
 * 시스템 Action 여부 확인
 * 기본 CRUD Action들은 시스템 Action으로 간주하여 수정/삭제 불가
 */
const isSystemAction = (action: Action): boolean => {
	const systemActionNames = [
		"create",
		"read",
		"update",
		"delete",
		"manage",
		"access",
	];
	return systemActionNames.includes(action.name);
};

/**
 * Action 관리 페이지 클라이언트 컴포넌트
 *
 * 권한에서 사용할 Action을 관리합니다.
 * 시스템 Action은 수정/삭제가 불가능합니다.
 */
function ActionsPageClient() {
	const {
		state,
		onClickAddActionButton,
		onClickEditActionButton,
		onClickDeleteActionButton,
	} = useActionsPage();

	return (
		<PageSurface
			title="Action 관리"
			description="권한에서 사용할 Action을 관리합니다."
			actions={
				<Button
					color="primary"
					startContent={<Plus className="h-4 w-4" />}
					onPress={onClickAddActionButton}
				>
					Action 추가
				</Button>
			}
		>
			<SectionSurface padding="none">
				<Table aria-label="Action 목록">
					<TableHeader>
						<TableColumn>이름</TableColumn>
						<TableColumn>표시명</TableColumn>
						<TableColumn>그룹</TableColumn>
						<TableColumn>시스템</TableColumn>
						<TableColumn width={100}>작업</TableColumn>
					</TableHeader>
					<TableBody
						emptyContent="등록된 Action이 없습니다."
						isLoading={state.isLoading}
					>
						{state.actions.map((action) => {
							const isSystem = isSystemAction(action);

							return (
								<TableRow key={action.id}>
									<TableCell>
										<Code size="sm">{action.name}</Code>
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
									<TableCell>
										{isSystem ? (
											<Tooltip content="시스템 Action은 수정/삭제할 수 없습니다">
												<Chip
													size="sm"
													color="warning"
													variant="flat"
													startContent={<Info className="h-3 w-3" />}
												>
													시스템
												</Chip>
											</Tooltip>
										) : (
											<Chip size="sm" color="default" variant="flat">
												사용자 정의
											</Chip>
										)}
									</TableCell>
									<TableCell>
										<HStack gap={1}>
											<Tooltip
												content={
													isSystem
														? "시스템 Action은 수정할 수 없습니다"
														: "수정"
												}
											>
												<Button
													isIconOnly
													size="sm"
													variant="light"
													isDisabled={isSystem}
													onPress={() => onClickEditActionButton(action)}
												>
													<Edit2 className="h-4 w-4" />
												</Button>
											</Tooltip>
											<Tooltip
												content={
													isSystem
														? "시스템 Action은 삭제할 수 없습니다"
														: "삭제"
												}
											>
												<Button
													isIconOnly
													size="sm"
													variant="light"
													color="danger"
													isDisabled={isSystem}
													onPress={() => onClickDeleteActionButton(action.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</Tooltip>
										</HStack>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(ActionsPageClient);
