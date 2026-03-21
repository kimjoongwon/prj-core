"use client";
import {
	type CreateActionDto,
	useCreateAction,
} from "@cocrepo/api/core/actions";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSectionCard,
	VStack,
} from "@cocrepo/ui";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

/**
 * Action 등록 폼 상태
 */
interface ActionFormState {
	name: string;
	displayName: string;
	description: string;
	group: string;
	order: number;
	errors: {
		name: string;
	};
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
 * Action 등록 페이지 - 클라이언트 컴포넌트
 */
function ActionNewPageClient() {
	const router = useRouter();

	// API Mutation
	const { mutate: createAction, isPending } = useCreateAction({
		mutation: {
			onSuccess: (response) => {
				const actionId = response.data?.id;
				if (actionId) {
					router.push(`/actions/${actionId}` as Route);
				} else {
					router.push("/actions" as Route);
				}
			},
		},
	});

	// 폼 상태 (config는 CreateActionDto에 없으므로 제거)
	const state = useLocalObservable<ActionFormState>(() => ({
		name: "",
		displayName: "",
		description: "",
		group: "",
		order: 0,
		errors: {
			name: "",
		},
	}));

	/**
	 * 폼 유효성 검사
	 */
	const validate = (): boolean => {
		let isValid = true;

		// 이름 검사 (필수, 패턴: ^[a-z][a-z0-9:_]*$)
		if (!state.name.trim()) {
			state.errors.name = "행위 식별자를 입력해주세요.";
			isValid = false;
		} else if (!/^[a-z][a-z0-9:_]*$/.test(state.name)) {
			state.errors.name =
				"소문자로 시작하고, 소문자/숫자/콜론/밑줄만 사용 가능합니다. (예: read:masked:email)";
			isValid = false;
		} else {
			state.errors.name = "";
		}

		return isValid;
	};

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push("/actions" as Route);
	};

	/**
	 * 폼 제출 핸들러
	 */
	const onClickSubmitButton = () => {
		if (!validate()) {
			return;
		}

		const data: CreateActionDto = {
			name: state.name,
			displayName: state.displayName || undefined,
			description: state.description || undefined,
			group: state.group || undefined,
			order: state.order,
			isSystem: false,
		};

		createAction({ data });
	};

	return (
		<FormPage
			top={
				<PageTitleBar
					title="Action 등록"
					description="새로운 Action을 등록합니다."
					actions={
						<Button
							variant="light"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={onClickBackButton}
						>
							목록으로
						</Button>
					}
				/>
			}
		>
			<FormPageSurface>
				<VStack gap={4}>
					<div className="rounded-xl bg-primary-50 p-4 dark:bg-primary-900/20">
						<p className="text-sm text-primary-700 dark:text-primary-400">
							<strong>참고:</strong> 행위 식별자는 소문자로 시작하고,
							소문자/숫자/콜론/밑줄만 사용할 수 있습니다. (예:
							read:masked:email)
						</p>
					</div>
					<FormSectionCard>
						<div className="space-y-6">
							<Input
								label="행위 식별자"
								placeholder="read:masked:email"
								value={state.name}
								onValueChange={(value) => {
									state.name = value.toLowerCase();
								}}
								isInvalid={!!state.errors.name}
								errorMessage={state.errors.name}
								isRequired
								description="소문자로 시작하고, 소문자/숫자/콜론/밑줄만 사용 가능합니다."
							/>
							<Input
								label="표시명"
								placeholder="이메일 마스킹 읽기"
								value={state.displayName}
								onValueChange={(value) => {
									state.displayName = value;
								}}
								maxLength={100}
								description="사용자에게 보여질 Action 이름입니다."
							/>
							<Textarea
								label="설명"
								placeholder="Action에 대한 설명을 입력하세요."
								value={state.description}
								onValueChange={(value) => {
									state.description = value;
								}}
								maxLength={200}
								minRows={3}
							/>
							<Select
								label="분류"
								placeholder="분류를 선택하세요"
								selectedKeys={state.group ? [state.group] : []}
								onSelectionChange={(keys) => {
									const selectedKey = Array.from(keys)[0];
									state.group = selectedKey ? String(selectedKey) : "";
								}}
							>
								{groupOptions.map((option) => (
									<SelectItem key={option.value}>{option.label}</SelectItem>
								))}
							</Select>
							<Input
								label="정렬 순서"
								type="number"
								value={String(state.order)}
								onValueChange={(value) => {
									state.order = Number(value) || 0;
								}}
								description="낮은 숫자일수록 먼저 표시됩니다."
							/>
							<div className="flex justify-end pt-4">
								<Button
									color="primary"
									startContent={<Save className="h-4 w-4" />}
									onPress={onClickSubmitButton}
									isLoading={isPending}
								>
									Action 등록
								</Button>
							</div>
						</div>
					</FormSectionCard>
				</VStack>
			</FormPageSurface>
		</FormPage>
	);
}

const ActionNewPage = observer(function ActionNewPage() {
	return <ActionNewPageClient />;
});

export default ActionNewPage;
