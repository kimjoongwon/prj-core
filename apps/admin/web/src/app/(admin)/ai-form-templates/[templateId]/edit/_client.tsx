"use client";

import type { CreateTemplateVariableItemDto, TemplateDto } from "@cocrepo/api";
import { useGetTemplate, useUpdateTemplate } from "@cocrepo/api";
import { PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import {
	Button,
	Checkbox,
	Input,
	NumberInput,
	Select,
	SelectItem,
	Spinner,
	Tab,
	Tabs,
	Textarea,
} from "@heroui/react";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AIFormTemplateEditPageClientProps {
	templateId: string;
}

interface TemplateVariableLike {
	id: string;
	name: string;
	description?: string | null;
	defaultValue?: string | null;
	isRequired?: boolean;
}

type TemplateWithVariables = TemplateDto & {
	variables?: TemplateVariableLike[];
};

/**
 * 폼 필드 상태 인터페이스
 */
interface FormFieldState {
	id: string;
	fieldName: string;
	fieldLabel: string;
	prompt: string;
	isRequired: boolean;
	order: number;
	defaultValue: string;
	validationRegex: string;
	validationMessage: string;
	maxLength: number | null;
}

/**
 * 템플릿 수정 폼 상태
 */
interface TemplateEditFormState {
	name: string;
	description: string;
	targetDomain: string;
	targetEntity: string;
	aiProvider: "OPENAI" | "ANTHROPIC";
	model: string;
	systemPrompt: string;
	status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
	priority: number;
	allowUserPrompt: boolean;
	maxTokens: number | null;
	temperature: number | null;
	fields: FormFieldState[];
	errors: {
		name: string;
		targetDomain: string;
		targetEntity: string;
	};
	isInitialized: boolean;
	isLoading: boolean;
}

// 대상 도메인 옵션
const TARGET_DOMAINS = [
	{ key: "Member", label: "회원 (Member)" },
	{ key: "Inquiry", label: "문의 (Inquiry)" },
	{ key: "Role", label: "역할 (Role)" },
	{ key: "Ability", label: "권한 (Ability)" },
	{ key: "Space", label: "스페이스 (Space)" },
];

// AI 제공자 옵션
const AI_PROVIDERS = [
	{ key: "OPENAI", label: "OpenAI" },
	{ key: "ANTHROPIC", label: "Anthropic" },
];

// 모델 옵션
const OPENAI_MODELS = [
	{ key: "gpt-4", label: "GPT-4" },
	{ key: "gpt-4-turbo", label: "GPT-4 Turbo" },
	{ key: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
];

const ANTHROPIC_MODELS = [
	{ key: "claude-3-opus", label: "Claude 3 Opus" },
	{ key: "claude-3-sonnet", label: "Claude 3 Sonnet" },
	{ key: "claude-3-haiku", label: "Claude 3 Haiku" },
];

// 템플릿 상태 옵션
const TEMPLATE_STATUS = [
	{ key: "DRAFT", label: "초안" },
	{ key: "ACTIVE", label: "활성화" },
	{ key: "INACTIVE", label: "비활성화" },
	{ key: "ARCHIVED", label: "보관됨" },
];

/**
 * 고유 ID 생성
 */
const generateId = () =>
	`field_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

/**
 * AI 폼 템플릿 수정 페이지 - 클라이언트 컴포넌트
 */
function AIFormTemplateEditPageClient({
	templateId,
}: AIFormTemplateEditPageClientProps) {
	const router = useRouter();

	// 폼 상태
	const state = useLocalObservable<TemplateEditFormState>(() => ({
		name: "",
		description: "",
		targetDomain: "",
		targetEntity: "",
		aiProvider: "OPENAI",
		model: "",
		systemPrompt: "",
		status: "DRAFT",
		priority: 0,
		allowUserPrompt: true,
		maxTokens: null,
		temperature: 0.7,
		fields: [],
		errors: {
			name: "",
			targetDomain: "",
			targetEntity: "",
		},
		isInitialized: false,
		isLoading: true,
	}));

	const { data: response, isLoading } = useGetTemplate(templateId);
	const template = response?.data as TemplateWithVariables | undefined;

	useEffect(() => {
		if (!template || state.isInitialized) {
			return;
		}

		state.name = template.name;
		state.description = template.description ?? "";
		state.targetDomain = template.type;
		state.targetEntity = template.subject ?? "";
		state.aiProvider = template.code.startsWith("ANTHROPIC")
			? "ANTHROPIC"
			: "OPENAI";
		state.model = "";
		state.systemPrompt = template.content;
		state.status = template.isActive ? "ACTIVE" : "INACTIVE";
		state.priority = 1;
		state.allowUserPrompt = true;
		state.maxTokens = null;
		state.temperature = 0.7;
		state.fields = (template.variables ?? []).map((variable, index) => ({
			id: variable.id,
			fieldName: variable.name,
			fieldLabel: variable.name,
			prompt: variable.description ?? "",
			isRequired: variable.isRequired ?? false,
			order: index,
			defaultValue: variable.defaultValue ?? "",
			validationRegex: "",
			validationMessage: "",
			maxLength: null,
		}));
		state.isInitialized = true;
		state.isLoading = false;
	}, [template, state]);

	const { mutate: updateTemplate, isPending } = useUpdateTemplate({
		mutation: {
			onSuccess: () => {
				router.push(`/ai-form-templates/${templateId}` as Route);
			},
		},
	});

	/**
	 * 모델 옵션 반환
	 */
	const getModelOptions = () => {
		return state.aiProvider === "OPENAI" ? OPENAI_MODELS : ANTHROPIC_MODELS;
	};

	/**
	 * 폼 유효성 검사
	 */
	const validate = (): boolean => {
		let isValid = true;

		// 템플릿명 검사
		if (!state.name.trim()) {
			state.errors.name = "템플릿명을 입력해주세요.";
			isValid = false;
		} else if (state.name.length > 100) {
			state.errors.name = "100자 이하로 입력해주세요.";
			isValid = false;
		} else {
			state.errors.name = "";
		}

		// 대상 도메인 검사
		if (!state.targetDomain) {
			state.errors.targetDomain = "대상 도메인을 선택해주세요.";
			isValid = false;
		} else {
			state.errors.targetDomain = "";
		}

		// 대상 Entity 검사
		if (!state.targetEntity.trim()) {
			state.errors.targetEntity = "대상 Entity를 입력해주세요.";
			isValid = false;
		} else {
			state.errors.targetEntity = "";
		}

		return isValid;
	};

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push(`/ai-form-templates/${templateId}` as Route);
	};

	/**
	 * 폼 제출 핸들러
	 */
	const onClickSubmitButton = () => {
		if (!validate()) {
			return;
		}

		updateTemplate({
			templateId,
			data: {
				name: state.name,
				description: state.description || undefined,
				subject: state.targetEntity || undefined,
				content: state.systemPrompt || "",
				variables: state.fields.map((field) => ({
					name: field.fieldName || field.fieldLabel,
					description: field.prompt || undefined,
					defaultValue: field.defaultValue || undefined,
					isRequired: field.isRequired,
				})) as unknown as CreateTemplateVariableItemDto,
			},
		});
	};

	/**
	 * 필드 추가
	 */
	const onClickAddField = () => {
		state.fields.push({
			id: generateId(),
			fieldName: "",
			fieldLabel: "",
			prompt: "",
			isRequired: false,
			order: state.fields.length,
			defaultValue: "",
			validationRegex: "",
			validationMessage: "",
			maxLength: null,
		});
	};

	/**
	 * 필드 삭제
	 */
	const onClickRemoveField = (fieldId: string) => {
		const index = state.fields.findIndex((f) => f.id === fieldId);
		if (index > -1) {
			state.fields.splice(index, 1);
			// 순서 재정렬
			state.fields.forEach((field, idx) => {
				field.order = idx;
			});
		}
	};

	// 로딩 상태
	if (state.isLoading || isLoading) {
		return (
			<PageSurface title="AI 폼 템플릿 수정" description="로딩 중...">
				<div className="flex items-center justify-center p-8">
					<Spinner size="lg" label="데이터 로딩 중..." />
				</div>
			</PageSurface>
		);
	}

	return (
		<PageSurface
			title="AI 폼 템플릿 수정"
			description={`${state.name} 템플릿을 수정합니다.`}
			actions={
				<Button
					variant="light"
					startContent={<ArrowLeft className="h-4 w-4" />}
					onPress={onClickBackButton}
				>
					상세로 돌아가기
				</Button>
			}
		>
			<VStack gap={4}>
				{/* 탭 */}
				<Tabs aria-label="템플릿 설정 탭" color="primary" variant="underlined">
					<Tab key="basic" title="기본 설정">
						<SectionSurface>
							<div className="space-y-6 p-6">
								{/* 템플릿명 */}
								<Input
									label="템플릿명"
									placeholder="예: 회원 정보 자동 생성 템플릿"
									value={state.name}
									onValueChange={(value) => {
										state.name = value;
									}}
									isInvalid={!!state.errors.name}
									errorMessage={state.errors.name}
									isRequired
									maxLength={100}
								/>

								{/* 설명 */}
								<Textarea
									label="설명"
									placeholder="템플릿에 대한 설명을 입력하세요."
									value={state.description}
									onValueChange={(value) => {
										state.description = value;
									}}
									maxLength={500}
									minRows={2}
								/>

								{/* 대상 도메인 & Entity */}
								<div className="grid grid-cols-2 gap-4">
									<Select
										label="대상 도메인"
										placeholder="도메인 선택"
										selectedKeys={
											state.targetDomain ? [state.targetDomain] : []
										}
										onSelectionChange={(keys) => {
											state.targetDomain = Array.from(keys)[0] as string;
										}}
										isInvalid={!!state.errors.targetDomain}
										errorMessage={state.errors.targetDomain}
										isRequired
									>
										{TARGET_DOMAINS.map((domain) => (
											<SelectItem key={domain.key}>{domain.label}</SelectItem>
										))}
									</Select>

									<Input
										label="대상 Entity"
										placeholder="예: Member, Inquiry"
										value={state.targetEntity}
										onValueChange={(value) => {
											state.targetEntity = value;
										}}
										isInvalid={!!state.errors.targetEntity}
										errorMessage={state.errors.targetEntity}
										isRequired
										maxLength={50}
									/>
								</div>

								{/* AI 제공자 & 모델 */}
								<div className="grid grid-cols-2 gap-4">
									<Select
										label="AI 제공자"
										placeholder="제공자 선택"
										selectedKeys={[state.aiProvider]}
										onSelectionChange={(keys) => {
											state.aiProvider = Array.from(keys)[0] as
												| "OPENAI"
												| "ANTHROPIC";
											state.model = ""; // 모델 초기화
										}}
										isRequired
									>
										{AI_PROVIDERS.map((provider) => (
											<SelectItem key={provider.key}>
												{provider.label}
											</SelectItem>
										))}
									</Select>

									<Select
										label="모델"
										placeholder="모델 선택"
										selectedKeys={state.model ? [state.model] : []}
										onSelectionChange={(keys) => {
											state.model = Array.from(keys)[0] as string;
										}}
									>
										{getModelOptions().map((model) => (
											<SelectItem key={model.key}>{model.label}</SelectItem>
										))}
									</Select>
								</div>

								{/* 상태 & 우선순위 */}
								<div className="grid grid-cols-2 gap-4">
									<Select
										label="상태"
										placeholder="상태 선택"
										selectedKeys={[state.status]}
										onSelectionChange={(keys) => {
											state.status = Array.from(keys)[0] as
												| "DRAFT"
												| "ACTIVE"
												| "INACTIVE"
												| "ARCHIVED";
										}}
									>
										{TEMPLATE_STATUS.map((status) => (
											<SelectItem key={status.key}>{status.label}</SelectItem>
										))}
									</Select>

									<NumberInput
										label="우선순위"
										placeholder="0"
										value={state.priority}
										onValueChange={(value) => {
											state.priority = value;
										}}
										min={0}
										description="낮을수록 우선 적용"
									/>
								</div>
							</div>
						</SectionSurface>
					</Tab>

					<Tab key="prompt" title="프롬프트 설정">
						<SectionSurface>
							<div className="space-y-6 p-6">
								{/* 시스템 프롬프트 */}
								<Textarea
									label="시스템 프롬프트"
									placeholder="AI에게 전달할 시스템 프롬프트를 입력하세요."
									value={state.systemPrompt}
									onValueChange={(value) => {
										state.systemPrompt = value;
									}}
									minRows={5}
									description="AI의 역할과 동작 방식을 정의합니다."
								/>

								{/* 추가 설정 */}
								<div className="grid grid-cols-3 gap-4">
									<NumberInput
										label="최대 토큰 수"
										placeholder="기본값: 모델별 상이"
										value={state.maxTokens ?? undefined}
										onValueChange={(value) => {
											state.maxTokens = value || null;
										}}
										min={1}
										max={100000}
									/>

									<NumberInput
										label="Temperature"
										placeholder="0.7"
										value={state.temperature ?? undefined}
										onValueChange={(value) => {
											state.temperature = value || null;
										}}
										min={0}
										max={1}
										step={0.1}
										formatOptions={{ maximumFractionDigits: 1 }}
										description="0(결정적) ~ 1(창의적)"
									/>

									<div className="flex items-end pb-2">
										<Checkbox
											isSelected={state.allowUserPrompt}
											onValueChange={(value) => {
												state.allowUserPrompt = value;
											}}
										>
											사용자 프롬프트 허용
										</Checkbox>
									</div>
								</div>
							</div>
						</SectionSurface>
					</Tab>

					<Tab key="fields" title="필드 설정">
						<SectionSurface>
							<div className="space-y-4 p-6">
								{/* 필드 추가 버튼 */}
								<div className="flex justify-between items-center">
									<p className="text-sm text-default-500">
										AI가 채울 폼 필드를 정의합니다. ({state.fields.length}개)
									</p>
									<Button
										variant="flat"
										color="primary"
										size="sm"
										startContent={<Plus className="h-4 w-4" />}
										onPress={onClickAddField}
									>
										필드 추가
									</Button>
								</div>

								{/* 필드 목록 */}
								{state.fields.length === 0 ? (
									<div className="text-center py-8 text-default-400">
										<p>등록된 필드가 없습니다.</p>
										<p className="text-sm mt-1">
											필드 추가 버튼을 클릭하여 필드를 추가하세요.
										</p>
									</div>
								) : (
									<VStack gap={3}>
										{state.fields.map((field, index) => (
											<div
												key={field.id}
												className="border border-divider rounded-xl p-4 space-y-4"
											>
												<div className="flex justify-between items-center">
													<span className="text-sm font-medium text-default-600">
														필드 #{index + 1}
													</span>
													<Button
														variant="light"
														color="danger"
														size="sm"
														isIconOnly
														onPress={() => onClickRemoveField(field.id)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>

												<div className="grid grid-cols-2 gap-4">
													<Input
														label="필드 이름"
														placeholder="예: name, email"
														value={field.fieldName}
														onValueChange={(value) => {
															field.fieldName = value;
														}}
														isRequired
														maxLength={100}
													/>

													<Input
														label="필드 라벨"
														placeholder="예: 이름, 이메일"
														value={field.fieldLabel}
														onValueChange={(value) => {
															field.fieldLabel = value;
														}}
													/>
												</div>

												<Textarea
													label="AI 프롬프트"
													placeholder="이 필드에 대한 AI 프롬프트를 입력하세요."
													value={field.prompt}
													onValueChange={(value) => {
														field.prompt = value;
													}}
													minRows={2}
													isRequired
												/>

												<div className="grid grid-cols-3 gap-4">
													<Input
														label="기본값"
														placeholder="기본값"
														value={field.defaultValue}
														onValueChange={(value) => {
															field.defaultValue = value;
														}}
													/>

													<Input
														label="유효성 검증 정규식"
														placeholder="예: ^[a-zA-Z]+$"
														value={field.validationRegex}
														onValueChange={(value) => {
															field.validationRegex = value;
														}}
													/>

													<NumberInput
														label="최대 길이"
														placeholder="제한 없음"
														value={field.maxLength ?? undefined}
														onValueChange={(value) => {
															field.maxLength = value || null;
														}}
														min={1}
													/>
												</div>

												{field.validationRegex && (
													<Input
														label="유효성 검증 실패 메시지"
														placeholder="예: 올바른 형식이 아닙니다."
														value={field.validationMessage}
														onValueChange={(value) => {
															field.validationMessage = value;
														}}
													/>
												)}

												<Checkbox
													isSelected={field.isRequired}
													onValueChange={(value) => {
														field.isRequired = value;
													}}
												>
													필수 필드
												</Checkbox>
											</div>
										))}
									</VStack>
								)}
							</div>
						</SectionSurface>
					</Tab>
				</Tabs>

				{/* 제출 버튼 */}
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
			</VStack>
		</PageSurface>
	);
}

export default observer(AIFormTemplateEditPageClient);
