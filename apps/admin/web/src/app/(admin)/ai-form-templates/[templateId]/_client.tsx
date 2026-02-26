"use client";

import { DateCell, StatusChipCell } from "@cocrepo/ui";
import { PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import {
	Button,
	Card,
	CardBody,
	Chip,
	Divider,
	Spinner,
} from "@heroui/react";
import { ArrowLeft, Edit, Sparkles, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AIFormTemplateDetailPageClientProps {
	templateId: string;
}

/**
 * 템플릿 상세 상태
 */
interface TemplateDetailState {
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
	fields: Array<{
		id: string;
		fieldName: string;
		fieldLabel: string;
		prompt: string;
		isRequired: boolean;
		order: number;
		defaultValue: string | null;
		validationRegex: string | null;
		validationMessage: string | null;
		maxLength: number | null;
	}>;
	createdAt: string;
	updatedAt: string;
	isInitialized: boolean;
	isLoading: boolean;
}

// 상태 색상 매핑
const getStatusColor = (status: string) => {
	switch (status) {
		case "ACTIVE":
			return "success";
		case "DRAFT":
			return "warning";
		case "INACTIVE":
			return "default";
		case "ARCHIVED":
			return "secondary";
		default:
			return "default";
	}
};

// 상태 라벨 매핑
const getStatusLabel = (status: string) => {
	switch (status) {
		case "ACTIVE":
			return "활성화";
		case "DRAFT":
			return "초안";
		case "INACTIVE":
			return "비활성화";
		case "ARCHIVED":
			return "보관됨";
		default:
			return "알 수 없음";
	}
};

/**
 * AI 폼 템플릿 상세 페이지 - 클라이언트 컴포넌트
 */
function AIFormTemplateDetailPageClient({ templateId }: AIFormTemplateDetailPageClientProps) {
	const router = useRouter();

	// 상세 상태
	const state = useLocalObservable<TemplateDetailState>(() => ({
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
		temperature: null,
		fields: [],
		createdAt: "",
		updatedAt: "",
		isInitialized: false,
		isLoading: true,
	}));

	// TODO: API 구현 후 데이터 조회
	// const { data: response, isLoading } = useGetAIFormTemplateById(templateId);
	// const template = response?.data;

	// 임시: 샘플 데이터 로드 (API 구현 전)
	useEffect(() => {
		if (!state.isInitialized) {
			// 샘플 데이터
			const sampleData = {
				name: "회원 정보 자동 생성 템플릿",
				description: "회원 가입 시 기본 정보를 AI가 자동으로 생성하는 템플릿입니다.",
				targetDomain: "Member",
				targetEntity: "Member",
				aiProvider: "OPENAI" as const,
				model: "gpt-4",
				systemPrompt: "당신은 회원 정보를 생성하는 AI 어시스턴트입니다. 사용자의 이름과 관심사를 바탕으로 자연스러운 자기소개와 닉네임을 생성하세요.",
				status: "ACTIVE" as const,
				priority: 1,
				allowUserPrompt: true,
				maxTokens: 2000,
				temperature: 0.7,
				fields: [
					{
						id: "field_1",
						fieldName: "bio",
						fieldLabel: "자기소개",
						prompt: "사용자의 이름과 관심사를 바탕으로 자연스러운 자기소개를 작성하세요.",
						isRequired: false,
						order: 0,
						defaultValue: null,
						validationRegex: null,
						validationMessage: null,
						maxLength: 500,
					},
					{
						id: "field_2",
						fieldName: "nickname",
						fieldLabel: "닉네임",
						prompt: "사용자의 이름을 바탕으로 친근한 닉네임을 생성하세요.",
						isRequired: true,
						order: 1,
						defaultValue: null,
						validationRegex: "^[a-zA-Z0-9가-힣]+$",
						validationMessage: "한글, 영문, 숫자만 사용 가능합니다.",
						maxLength: 20,
					},
				],
				createdAt: "2026-02-26T10:00:00Z",
				updatedAt: "2026-02-26T12:30:00Z",
			};

			// 샘플 데이터 적용
			Object.assign(state, sampleData);
			state.isInitialized = true;
			state.isLoading = false;
		}
	}, [state, templateId]);

	/**
	 * 목록으로 이동
	 */
	const onClickBackButton = () => {
		router.push("/ai-form-templates" as Route);
	};

	/**
	 * 수정 페이지로 이동
	 */
	const onClickEditButton = () => {
		router.push(`/ai-form-templates/${templateId}/edit` as Route);
	};

	/**
	 * 삭제 처리
	 */
	const onClickDeleteButton = () => {
		// TODO: 삭제 확인 모달 및 API 호출
		console.log("삭제:", templateId);
	};

	// 로딩 상태
	if (state.isLoading) {
		return (
			<PageSurface title="AI 폼 템플릿 상세" description="로딩 중...">
				<div className="flex items-center justify-center p-8">
					<Spinner size="lg" label="데이터 로딩 중..." />
				</div>
			</PageSurface>
		);
	}

	return (
		<PageSurface
			title={state.name}
			description={state.description || "AI 폼 템플릿 상세 정보"}
			actions={
				<div className="flex gap-2">
					<Button
						variant="light"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={onClickBackButton}
					>
						목록으로
					</Button>
					<Button
						color="primary"
						startContent={<Edit className="h-4 w-4" />}
						onPress={onClickEditButton}
					>
						수정
					</Button>
				</div>
			}
		>
			<VStack gap={4}>
				{/* 기본 정보 */}
				<SectionSurface title="기본 정보">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
						<div>
							<p className="text-xs text-default-400">대상 도메인</p>
							<p className="text-sm font-medium">{state.targetDomain}</p>
						</div>
						<div>
							<p className="text-xs text-default-400">대상 Entity</p>
							<p className="text-sm font-medium">{state.targetEntity}</p>
						</div>
						<div>
							<p className="text-xs text-default-400">AI 제공자</p>
							<p className="text-sm font-medium">
								{state.aiProvider === "OPENAI" ? "OpenAI" : "Anthropic"}
							</p>
						</div>
						<div>
							<p className="text-xs text-default-400">모델</p>
							<p className="text-sm font-medium">{state.model || "-"}</p>
						</div>
						<div>
							<p className="text-xs text-default-400">상태</p>
							<Chip size="sm" color={getStatusColor(state.status)} variant="flat">
								{getStatusLabel(state.status)}
							</Chip>
						</div>
						<div>
							<p className="text-xs text-default-400">우선순위</p>
							<p className="text-sm font-medium">{state.priority}</p>
						</div>
						<div>
							<p className="text-xs text-default-400">사용자 프롬프트</p>
							<p className="text-sm font-medium">
								{state.allowUserPrompt ? "허용" : "불가"}
							</p>
						</div>
						<div>
							<p className="text-xs text-default-400">필드 수</p>
							<p className="text-sm font-medium">{state.fields.length}개</p>
						</div>
					</div>
				</SectionSurface>

				{/* AI 설정 */}
				<SectionSurface title="AI 설정">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
						<div>
							<p className="text-xs text-default-400">최대 토큰 수</p>
							<p className="text-sm font-medium">
								{state.maxTokens ? `${state.maxTokens.toLocaleString()}` : "기본값"}
							</p>
						</div>
						<div>
							<p className="text-xs text-default-400">Temperature</p>
							<p className="text-sm font-medium">
								{state.temperature !== null ? state.temperature : "기본값"}
							</p>
						</div>
						<div>
							<p className="text-xs text-default-400">생성 일시</p>
							<DateCell value={state.createdAt} />
						</div>
						<div>
							<p className="text-xs text-default-400">수정 일시</p>
							<DateCell value={state.updatedAt} />
						</div>
					</div>
				</SectionSurface>

				{/* 시스템 프롬프트 */}
				{state.systemPrompt && (
					<SectionSurface title="시스템 프롬프트">
						<div className="p-4">
							<div className="bg-default-100 dark:bg-default-50/10 rounded-lg p-4">
								<p className="text-sm whitespace-pre-wrap">{state.systemPrompt}</p>
							</div>
						</div>
					</SectionSurface>
				)}

				{/* 폼 필드 */}
				<SectionSurface
					title="폼 필드"
					subtitle={`AI가 채울 필드 (${state.fields.length}개)`}
				>
					<div className="p-4 space-y-4">
						{state.fields.length === 0 ? (
							<div className="text-center py-8 text-default-400">
								<p>등록된 필드가 없습니다.</p>
							</div>
						) : (
							state.fields
								.sort((a, b) => a.order - b.order)
								.map((field, index) => (
									<Card key={field.id} shadow="sm">
										<CardBody className="p-4">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<span className="text-xs text-default-400">
															#{index + 1}
														</span>
														<span className="font-medium">{field.fieldLabel}</span>
														<span className="text-xs text-default-400">
															({field.fieldName})
														</span>
														{field.isRequired && (
															<Chip size="sm" color="warning" variant="flat">
																필수
															</Chip>
														)}
													</div>
													<p className="text-sm text-default-600 mb-2">
														{field.prompt}
													</p>
													{(field.validationRegex ||
														field.maxLength ||
														field.defaultValue) && (
														<div className="flex flex-wrap gap-2 text-xs text-default-400">
															{field.validationRegex && (
																<span>정규식: {field.validationRegex}</span>
															)}
															{field.maxLength && (
																<span>최대 길이: {field.maxLength}</span>
															)}
															{field.defaultValue && (
																<span>기본값: {field.defaultValue}</span>
															)}
														</div>
													)}
												</div>
												<Sparkles className="h-5 w-5 text-primary" />
											</div>
										</CardBody>
									</Card>
								))
						)}
					</div>
				</SectionSurface>

				{/* 하단 액션 */}
				<div className="flex justify-between pt-4">
					<Button
						variant="flat"
						color="danger"
						startContent={<Trash2 className="h-4 w-4" />}
						onPress={onClickDeleteButton}
					>
						삭제
					</Button>
					<Button
						color="primary"
						startContent={<Edit className="h-4 w-4" />}
						onPress={onClickEditButton}
					>
						수정
					</Button>
				</div>
			</VStack>
		</PageSurface>
	);
}

export default observer(AIFormTemplateDetailPageClient);
