"use client";

import {
	useCreateAbility,
	useGetActions,
	useGetSubjects,
	type CreateAbilityDto,
} from "@cocrepo/api";
import { PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import {
	Button,
	Input,
	Select,
	SelectItem,
	Switch,
	Textarea,
	addToast,
} from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

/**
 * 권한 등록 페이지 - 클라이언트 컴포넌트
 */
function AbilityNewPageClient() {
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
	}));

	// API
	const { data: subjectsResponse } = useGetSubjects();
	const { data: actionsResponse } = useGetActions();

	const subjects = subjectsResponse?.data ?? [];
	const actions = actionsResponse?.data ?? [];

	// 등록 Mutation
	const { mutate: createAbility, isPending } = useCreateAbility({
		mutation: {
			onSuccess: (response) => {
				addToast({
					title: "권한 등록 성공",
					description: "권한이 성공적으로 등록되었습니다.",
					color: "success",
				});
				const abilityId = response?.data?.id;
				if (abilityId) {
					router.push(`/abilities/${abilityId}` as Route);
				}
			},
			onError: (error) => {
				addToast({
					title: "권한 등록 실패",
					description: error.message || "권한 등록 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push("/abilities" as Route);
	};

	/**
	 * 등록 핸들러
	 */
	const onClickCreateButton = () => {
		// 유효성 검증
		if (!state.name.trim()) {
			addToast({
				title: "입력 오류",
				description: "권한 이름을 입력해주세요.",
				color: "danger",
			});
			return;
		}

		if (!state.subjectId) {
			addToast({
				title: "입력 오류",
				description: "Subject를 선택해주세요.",
				color: "danger",
			});
			return;
		}

		if (!state.actionId) {
			addToast({
				title: "입력 오류",
				description: "Action을 선택해주세요.",
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
		let conditionsObject:
			| Record<string, string | number | boolean>
			| undefined;
		if (state.conditions.trim()) {
			try {
				conditionsObject = JSON.parse(state.conditions);
			} catch (error) {
				addToast({
					title: "입력 오류",
					description: "Conditions는 유효한 JSON 형식이어야 합니다.",
					color: "danger",
				});
				return;
			}
		}

		const dto: CreateAbilityDto = {
			name: state.name.trim(),
			description: state.description.trim() || undefined,
			subjectId: state.subjectId,
			actionId: state.actionId,
			fields: fieldsArray,
			conditions: conditionsObject,
			inverted: state.inverted,
			reason: state.inverted ? state.reason.trim() || undefined : undefined,
			isActive: true,
			priority: 0,
		};

		createAbility({ data: dto });
	};

	return (
		<PageSurface
			title="권한 등록"
			description="새로운 CASL 권한을 등록합니다."
			actions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={onClickBackButton}
					>
						목록으로
					</Button>
					<Button
						color="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={onClickCreateButton}
						isLoading={isPending}
					>
						등록
					</Button>
				</div>
			}
		>
			<VStack gap={4}>
				{/* 기본 정보 섹션 */}
				<SectionSurface>
					<h3 className="text-lg font-semibold mb-4">기본 정보</h3>
					<div className="grid grid-cols-1 gap-4">
						<Input
							label="권한 이름"
							placeholder="예: manage_users"
							value={state.name}
							onValueChange={(value) => {
								state.name = value;
							}}
							isRequired
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
				</SectionSurface>

				{/* CASL 정보 섹션 */}
				<SectionSurface>
					<h3 className="text-lg font-semibold mb-4">CASL 정보</h3>
					<div className="grid grid-cols-1 gap-4">
						<Select
							label="Subject"
							placeholder="Subject를 선택하세요"
							selectedKeys={state.subjectId ? [state.subjectId] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								state.subjectId = selected || "";
							}}
							isRequired
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
							isRequired
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

						<div className="flex items-center justify-between p-4 rounded-lg border border-divider">
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
				</SectionSurface>
			</VStack>
		</PageSurface>
	);
}

export default observer(AbilityNewPageClient);
