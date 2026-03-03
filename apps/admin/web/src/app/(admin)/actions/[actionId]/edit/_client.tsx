"use client";

import {
	type UpdateActionDto,
	useGetActionById,
	useUpdateAction,
} from "@cocrepo/api";
import { Page, PageHeader, Section, VStack } from "@cocrepo/ui";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ActionEditPageClientProps {
	actionId: string;
}

/**
 * Action 수정 폼 상태
 */
interface ActionEditFormState {
	displayName: string;
	description: string;
	group: string;
	order: number;
	errors: {
		config: string;
	};
	isInitialized: boolean;
}

/**
 * group 옵션
 */
const groupOptions = [
	{ value: "crud", label: "CRUD" },
	{ value: "visibility", label: "Visibility" },
	{ value: "workflow", label: "Workflow" },
	{ value: "bulk", label: "Bulk" },
];

/**
 * Action 수정 페이지 - 클라이언트 컴포넌트
 */
function ActionEditPageClient({ actionId }: ActionEditPageClientProps) {
	const router = useRouter();

	// API 조회 (ActionResponseDto 반환 - config 포함)
	const { data: response, isLoading } = useGetActionById(actionId);
	const action = response?.data;

	// 수정 Mutation
	const { mutate: updateAction, isPending } = useUpdateAction({
		mutation: {
			onSuccess: () => {
				router.push(`/actions/${actionId}` as Route);
			},
		},
	});

	// 폼 상태 (config는 UpdateActionDto에 없으므로 제거)
	const state = useLocalObservable<ActionEditFormState>(() => ({
		displayName: "",
		description: "",
		group: "",
		order: 0,
		errors: {
			config: "",
		},
		isInitialized: false,
	}));

	// 초기 데이터 설정
	useEffect(() => {
		if (action && !state.isInitialized) {
			state.displayName = action.displayName || "";
			state.description = action.description || "";
			state.group = action.group || "";
			state.order = action.order;
			state.isInitialized = true;
		}
	}, [action, state]);

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push(`/actions/${actionId}` as Route);
	};

	/**
	 * 목록으로 이동 핸들러
	 */
	const onClickListButton = () => {
		router.push("/actions" as Route);
	};

	/**
	 * 폼 제출 핸들러
	 */
	const onClickSubmitButton = () => {
		const data: UpdateActionDto = {
			displayName: state.displayName || undefined,
			description: state.description || undefined,
			group: state.group || undefined,
			order: state.order,
		};

		updateAction({ id: actionId, data });
	};

	if (isLoading) {
		return (
			<Page
				mode="content"
				top={<PageHeader title="Action 수정" description="로딩 중..." />}
			>
				<Section mode="content">
					<div className="flex items-center justify-center p-8">
						<span className="text-default-500">로딩 중...</span>
					</div>
				</Section>
			</Page>
		);
	}

	if (!action) {
		const pageHeader = (
			<PageHeader
				title="Action 수정"
				description="Action을 찾을 수 없습니다."
			/>
		);

		return (
			<Page mode="content" top={pageHeader}>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">Action을 찾을 수 없습니다.</p>
					<Button variant="flat" onPress={onClickListButton}>
						목록으로
					</Button>
				</div>
			</Page>
		);
	}

	if (action.isSystem) {
		const pageHeader = (
			<PageHeader
				title="Action 수정"
				description="시스템 Action은 수정할 수 없습니다."
			/>
		);

		return (
			<Page mode="content" top={pageHeader}>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">
						시스템 Action은 수정할 수 없습니다.
					</p>
					<Button variant="flat" onPress={onClickBackButton}>
						상세로 돌아가기
					</Button>
				</div>
			</Page>
		);
	}

	const pageHeader = (
		<PageHeader
			title="Action 수정"
			description={`${action.displayName || action.name} Action을 수정합니다.`}
			actions={
				<Button
					variant="light"
					startContent={<ArrowLeft className="h-4 w-4" />}
					onPress={onClickBackButton}
				>
					상세로 돌아가기
				</Button>
			}
		/>
	);

	return (
		<Page mode="content" top={pageHeader}>
			<VStack gap={4}>
				<Section mode="content">
					<div className="space-y-6 p-6">
						<Input
							label="행위 식별자"
							value={action.name}
							isReadOnly
							isDisabled
							description="행위 식별자는 수정할 수 없습니다."
						/>
						<Input
							label="표시명"
							placeholder="이메일 마스킹 읽기"
							value={state.displayName}
							onValueChange={value => {
								state.displayName = value;
							}}
							maxLength={100}
							description="사용자에게 보여질 Action 이름입니다."
						/>
						<Textarea
							label="설명"
							placeholder="Action에 대한 설명을 입력하세요."
							value={state.description}
							onValueChange={value => {
								state.description = value;
							}}
							maxLength={200}
							minRows={3}
						/>
						<Select
							label="분류"
							placeholder="분류를 선택하세요"
							selectedKeys={state.group ? [state.group] : []}
							onSelectionChange={keys => {
								const selectedKey = Array.from(keys)[0];
								state.group = selectedKey ? String(selectedKey) : "";
							}}
						>
							{groupOptions.map(option => (
								<SelectItem key={option.value}>{option.label}</SelectItem>
							))}
						</Select>
						<Input
							label="정렬 순서"
							type="number"
							value={String(state.order)}
							onValueChange={value => {
								state.order = Number(value) || 0;
							}}
							description="낮은 숫자일수록 먼저 표시됩니다."
						/>
						<div className="flex justify-end gap-2 pt-4">
							<Button variant="flat" onPress={onClickBackButton}>
								취소
							</Button>
							<Button
								color="primary"
								startContent={<Save className="h-4 w-4" />}
								onPress={onClickSubmitButton}
								isLoading={isPending}
							>
								저장
							</Button>
						</div>
					</div>
				</Section>
			</VStack>
		</Page>
	);
}

export default observer(ActionEditPageClient);
