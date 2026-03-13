"use client";
import {
	type UpdateAbilityDto,
	useGetAbilityById,
	useUpdateAbility,
} from "@cocrepo/api/core/abilities";
import { useGetActions } from "@cocrepo/api/core/actions";
import { useGetSubjects } from "@cocrepo/api/core/subjects";

import { Page, PageTitleBar, Section, VStack } from "@cocrepo/ui";
import {
	addToast,
	Button,
	Input,
	Select,
	SelectItem,
	Spinner,
	Switch,
	Textarea,
} from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AbilityEditPageClientProps {
	abilityId: string;
}

/**
 * 권한 수정 페이지 - 클라이언트 컴포넌트
 */
function AbilityEditPageClient({ abilityId }: AbilityEditPageClientProps) {
	const router = useRouter();

	// 로컬 상태
	const state = useLocalObservable(() => ({
		name: "",
		description: "",
		subjectId: "",
		actionId: "",
		fields: "",
		conditions: "",
		inverted: false,
		reason: "",
		isInitialized: false,
	}));

	// API
	const { data: response, isLoading } = useGetAbilityById(abilityId);
	const ability = response?.data;

	const { data: subjectsResponse } = useGetSubjects();
	const { data: actionsResponse } = useGetActions();

	const subjects = subjectsResponse?.data ?? [];
	const actions = actionsResponse?.data ?? [];

	// 수정 Mutation
	const { mutate: updateAbility, isPending } = useUpdateAbility({
		mutation: {
			onSuccess: () => {
				addToast({
					title: "권한 수정 성공",
					description: "권한이 성공적으로 수정되었습니다.",
					color: "success",
				});
				router.push(`/abilities/${abilityId}` as Route);
			},
			onError: (error) => {
				addToast({
					title: "권한 수정 실패",
					description: error.message || "권한 수정 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	// 초기 데이터 로딩
	useEffect(() => {
		if (ability && !state.isInitialized) {
			state.name = ability.name;
			state.description = ability.description || "";
			state.subjectId = ability.subjectId;
			state.actionId = ability.actionId;
			state.fields = ability.fields.join(", ");
			state.conditions = ability.conditions
				? JSON.stringify(ability.conditions, null, 2)
				: "";
			state.inverted = ability.inverted;
			state.reason = ability.reason || "";
			state.isInitialized = true;
		}
	}, [ability, state]);

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push(`/abilities/${abilityId}` as Route);
	};

	/**
	 * 저장 핸들러
	 */
	const onClickSaveButton = () => {
		// 유효성 검증
		if (!state.description.trim() && !state.subjectId && !state.actionId) {
			addToast({
				title: "입력 오류",
				description: "최소 하나 이상의 필드를 수정해주세요.",
				color: "danger",
			});
			return;
		}

		// fields 파싱 (쉼표 구분)
		const fieldsArray = state.fields
			.split(",")
			.map((f) => f.trim())
			.filter((f) => f.length > 0);

		// conditions 파싱 (JSON)
		let conditionsObject: Record<string, string | number | boolean> | undefined;
		if (state.conditions.trim()) {
			try {
				conditionsObject = JSON.parse(state.conditions);
			} catch (_error) {
				addToast({
					title: "입력 오류",
					description: "Conditions는 유효한 JSON 형식이어야 합니다.",
					color: "danger",
				});
				return;
			}
		}

		const dto: UpdateAbilityDto = {
			description: state.description.trim() || undefined,
			subjectId: state.subjectId || undefined,
			actionId: state.actionId || undefined,
			fields: fieldsArray,
			conditions: conditionsObject,
			inverted: state.inverted,
			reason: state.inverted ? state.reason.trim() || undefined : undefined,
		};

		updateAbility({ id: abilityId, data: dto });
	};

	if (isLoading) {
		return (
			<Page top={<PageTitleBar title="권한 수정" description="로딩 중..." />}>
				<div className="flex items-center justify-center gap-2 p-8">
					<Spinner size="sm" />
					<span className="text-default-500">로딩 중...</span>
				</div>
			</Page>
		);
	}

	if (!ability) {
		return (
			<Page
				top={
					<PageTitleBar
						title="권한 수정"
						description="권한을 찾을 수 없습니다."
					/>
				}
			>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">권한을 찾을 수 없습니다.</p>
					<Button variant="flat" onPress={onClickBackButton}>
						목록으로
					</Button>
				</div>
			</Page>
		);
	}

	return (
		<Page
			top={
				<PageTitleBar
					title="권한 수정"
					description="권한 정보를 수정합니다."
					actions={
						<div className="flex gap-2">
							<Button
								variant="flat"
								startContent={<ArrowLeft className="h-4 w-4" />}
								onPress={onClickBackButton}
							>
								취소
							</Button>
							<Button
								color="primary"
								startContent={<Save className="h-4 w-4" />}
								onPress={onClickSaveButton}
								isLoading={isPending}
							>
								저장
							</Button>
						</div>
					}
				/>
			}
		>
			<VStack gap={4}>
				<Section top={<PageTitleBar level={2} title="기본 정보" />}>
					<div className="grid grid-cols-1 gap-4">
						<Input
							label="권한 이름"
							value={state.name}
							isReadOnly
							description="권한 이름은 수정할 수 없습니다."
						/>
						<Textarea
							label="설명"
							placeholder="권한에 대한 설명을 입력하세요"
							value={state.description}
							onValueChange={(value) => {
								state.description = value;
							}}
							minRows={2}
						/>
					</div>
				</Section>
				<Section top={<PageTitleBar level={2} title="CASL 정보" />}>
					<div className="grid grid-cols-1 gap-4">
						<Select
							label="Subject"
							placeholder="Subject를 선택하세요"
							selectedKeys={state.subjectId ? [state.subjectId] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								state.subjectId = selected || "";
							}}
						>
							{subjects.map((subject) => (
								<SelectItem key={subject.id}>
									{subject.displayName || subject.name}
									{subject.group && ` (${subject.group})`}
								</SelectItem>
							))}
						</Select>
						<Select
							label="Action"
							placeholder="Action을 선택하세요"
							selectedKeys={state.actionId ? [state.actionId] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								state.actionId = selected || "";
							}}
						>
							{actions.map((action) => (
								<SelectItem key={action.id}>
									{action.displayName || action.name}
									{action.group && ` (${action.group})`}
								</SelectItem>
							))}
						</Select>
						<Textarea
							label="Fields"
							placeholder="쉼표로 구분하여 필드를 입력하세요. 예: name, email, phone (빈 값 = 전체 필드)"
							value={state.fields}
							onValueChange={(value) => {
								state.fields = value;
							}}
							minRows={2}
							description="빈 값이면 전체 필드에 대한 권한입니다."
						/>
						<Textarea
							label="Conditions (JSON)"
							placeholder='{"userId": "{{ user.id }}"}'
							value={state.conditions}
							onValueChange={(value) => {
								state.conditions = value;
							}}
							minRows={4}
							description="ABAC 조건을 JSON 형식으로 입력하세요."
						/>
						<div className="flex items-center justify-between rounded-lg border border-divider p-4">
							<div>
								<p className="font-medium">거부 권한 (cannot)</p>
								<p className="text-sm text-default-500">
									활성화 시 권한을 거부합니다.
								</p>
							</div>
							<Switch
								isSelected={state.inverted}
								onValueChange={(value) => {
									state.inverted = value;
								}}
							/>
						</div>
						{state.inverted && (
							<Textarea
								label="거부 사유"
								placeholder="권한을 거부하는 이유를 입력하세요"
								value={state.reason}
								onValueChange={(value) => {
									state.reason = value;
								}}
								minRows={2}
							/>
						)}
					</div>
				</Section>
			</VStack>
		</Page>
	);
}

export default observer(AbilityEditPageClient);
